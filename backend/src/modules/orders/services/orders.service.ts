import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { OrdersQueryDto } from '../dto/req/order.query.dto';
import { OrdersRepository } from '../../../repository/services/orders.repository';
import { CreateOrderDto } from '../dto/req/create.order.dto';
import { ResponseOrderDto } from '../dto/res/res.order.dto';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';
import { OrdersMapper } from '../orders.mapper';
import { PaginatedResponse } from '../../../common/type/pagination.type';
import { parseOrder } from '../utils/order-query.util';
import { OrderEntity } from '../../../database/entities/order.entity';
import { UserEntity } from '../../../database/entities/user.entity';
import {
  ManagerPerformanceDto,
  OrdersStatsDto,
} from '../dto/req/order.stats.dto';
import { IOrderRawStats } from '../interfaces/order-raw-stats.interface';
import { UpdateOrderDto } from '../dto/req/update.order.dto';
import { GroupEntity } from '../../../database/entities/group.entity';
import * as ExcelJS from 'exceljs';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  private getFilteredObjects(query: OrdersQueryDto, userId: number) {
    const {
      name,
      surname,
      email,
      phone,
      age,
      startDate,
      endDate,
      course,
      course_format,
      course_type,
      status,
      group,
      onlyMine,
    } = query;

    const queryBuilder = this.ordersRepository.createQueryBuilder('order');
    queryBuilder.leftJoinAndSelect('order.group', 'group');
    queryBuilder.leftJoinAndSelect('order.manager', 'manager');

    if (name)
      queryBuilder.andWhere('LOWER(order.name) LIKE :name', {
        name: `%${name.toLowerCase()}%`,
      });
    if (surname)
      queryBuilder.andWhere('LOWER(order.surname) LIKE :surname', {
        surname: `%${surname.toLowerCase()}%`,
      });
    if (email)
      queryBuilder.andWhere('LOWER(order.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });
    if (phone)
      queryBuilder.andWhere('LOWER(order.phone) LIKE :phone', {
        phone: `%${phone.toLowerCase()}%`,
      });

    if (age) queryBuilder.andWhere('order.age = :age', { age: Number(age) });

    if (startDate) {
      queryBuilder.andWhere('order.created_at >= :startDate', { startDate });
    }

    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      queryBuilder.andWhere('order.created_at <= :endDate', {
        endDate: endOfDay,
      });
    }

    if (course) queryBuilder.andWhere('order.course = :course', { course });
    if (course_format)
      queryBuilder.andWhere('order.course_format = :course_format', {
        course_format,
      });
    if (course_type)
      queryBuilder.andWhere('order.course_type = :course_type', {
        course_type,
      });

    if (status) {
      if (status === 'new') {
        queryBuilder.andWhere(
          '(order.status = :status OR order.status IS NULL)',
          {
            status,
          },
        );
      } else {
        queryBuilder.andWhere('order.status = :status', { status });
      }
    }

    if (group) queryBuilder.andWhere('order.group = :group', { group });

    if (onlyMine === 'true' || onlyMine === (true as any)) {
      queryBuilder.andWhere('manager.id = :userId', { userId });
    }

    return queryBuilder;
  }

  async create(orderdto: CreateOrderDto): Promise<ResponseOrderDto> {
    const order = this.ordersRepository.create({
      ...orderdto,
      status: StatusesEnum.NEW,
    });
    const saveOrder = await this.ordersRepository.save(order);
    return OrdersMapper.toResDto(saveOrder);
  }

  async findAll(
    query: OrdersQueryDto,
    userId: number,
  ): Promise<PaginatedResponse<ResponseOrderDto>> {
    const { page = 1, limit = 25, order } = query;
    const queryBuilder = this.getFilteredObjects(query, userId);

    const { sortBy, sortOrder } = parseOrder(order);
    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);


    if (sortBy !== 'id') {
      queryBuilder.addOrderBy('order.id', 'DESC');
    }

    const numericPage = Number(page);
    const numericLimit = Number(limit);

    queryBuilder.skip((numericPage - 1) * numericLimit);
    queryBuilder.take(numericLimit);

    const [fetchedOrders, total] = await queryBuilder.getManyAndCount();

    const mappedOrders = fetchedOrders.map((order) =>
      OrdersMapper.toResDto(order),
    );

    return {
      data: mappedOrders,
      total: total,
      page: numericPage,
      limit: numericLimit,
    };
  }

  async findOne(id: string): Promise<ResponseOrderDto> {
    const findOrder = await this.ordersRepository.findOne({
      where: { id },
      relations: ['group', 'manager'],
    });
    if (!findOrder) {
      throw new NotFoundException('Order not found');
    }
    return OrdersMapper.toResDto(findOrder);
  }

  async assignManager(orderId: string, managerId: number) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const orderRepository =
          transactionalEntityManager.getRepository(OrderEntity);

        const targetedOrder = await orderRepository.findOne({
          where: { id: orderId },
          lock: { mode: 'pessimistic_write' },
        });
        if (!targetedOrder) {
          throw new NotFoundException('Order not found');
        }

        const userRepository =
          transactionalEntityManager.getRepository(UserEntity);
        const targetedManager = await userRepository.findOneBy({
          id: managerId,
        });
        if (!targetedManager) {
          throw new NotFoundException('Manager was not found');
        }

        targetedOrder.manager = targetedManager;

        if (
          targetedOrder.status === StatusesEnum.NEW ||
          !targetedOrder.status
        ) {
          targetedOrder.status = StatusesEnum.INWORK;
        }
        return orderRepository.save(targetedOrder);
      },
    );
  }

  async takeOrder(orderId: string, managerId: number) {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const orderRepository =
          transactionalEntityManager.getRepository(OrderEntity);

        const targetedOrder = await orderRepository.findOne({
          where: { id: orderId },
          relations: ['manager'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!targetedOrder) {
          throw new NotFoundException('Order not found');
        }

        if (targetedOrder.manager) {
          throw new BadRequestException('Order is already assigned');
        }

        targetedOrder.manager = { id: managerId } as UserEntity;
        targetedOrder.status = StatusesEnum.INWORK;

        return await orderRepository.save(targetedOrder);
      },
    );
  }

  async getStatsByStatus(): Promise<OrdersStatsDto> {
    const rawStats: IOrderRawStats[] = await this.ordersRepository
      .createQueryBuilder('o')
      .select('o.status', 'status')
      .addSelect('COUNT(o.id)', 'count')
      .groupBy('o.status')
      .getRawMany();

    const totalOrdersCount = await this.ordersRepository.count();

    const calculatedStats: OrdersStatsDto = {
      total: totalOrdersCount,
      agree: 0,
      in_work: 0,
      disagree: 0,
      dubbing: 0,
      new: 0,
    };

    for (const row of rawStats) {
      if (row.status === 'new' || row.status === null) {
        calculatedStats.new += Number(row.count) || 0;
      } else if (row.status in calculatedStats) {
        calculatedStats[row.status as keyof OrdersStatsDto] =
          Number(row.count) || 0;
      }
    }

    return calculatedStats;
  }

  async getManagersPerformance(): Promise<ManagerPerformanceDto[]> {
    const rawPerformanceStats: IOrderRawStats[] = await this.ordersRepository
      .createQueryBuilder('o')
      .select('o.manager_id', 'managerId')
      .addSelect('o.status', 'status')
      .addSelect('COUNT(o.id)', 'count')
      .where('o.manager_id IS NOT NULL')
      .groupBy('o.manager_id')
      .addGroupBy('o.status')
      .getRawMany();

    const performanceMap: Record<number, ManagerPerformanceDto> = {};

    for (const row of rawPerformanceStats) {
      const managerId = Number(row.managerId);
      const ordersCount = Number(row.count) || 0;

      if (!performanceMap[managerId]) {
        performanceMap[managerId] = {
          managerId: managerId,
          total: 0,
          new: 0,
          agree: 0,
          in_work: 0,
          disagree: 0,
          dubbing: 0,
        };
      }

      if (row.status === 'new' || row.status === null) {
        performanceMap[managerId].new += ordersCount;
      } else {
        const statusKey = row.status as keyof ManagerPerformanceDto;
        if (
          statusKey in performanceMap[managerId] &&
          statusKey !== 'managerId' &&
          statusKey !== 'total'
        ) {
          performanceMap[managerId][statusKey] += ordersCount;
        }
      }

      performanceMap[managerId].total += ordersCount;
    }

    return Object.values(performanceMap);
  }

  async update(
    id: string,
    currentUser: UserEntity,
    updateData: UpdateOrderDto,
  ): Promise<ResponseOrderDto> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const orderRepository =
          transactionalEntityManager.getRepository(OrderEntity);
        const groupRepository =
          transactionalEntityManager.getRepository(GroupEntity);

        const targetedOrder = await orderRepository.findOne({
          where: { id },
          relations: ['manager', 'group'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!targetedOrder) {
          throw new NotFoundException('Order not found');
        }


        if (targetedOrder.manager) {
          const isOwner =
            Number(targetedOrder.manager.id) === Number(currentUser.id);
          if (!isOwner) {
            throw new ForbiddenException(
              'This application is already assigned to a manager and cannot be edited',
            );
          }
        }


        if (updateData.status === StatusesEnum.NEW) {
          targetedOrder.manager = null as unknown as UserEntity;
        }


        if (updateData.group !== undefined) {
          if (updateData.group === null || (updateData.group as any) === '') {
            targetedOrder.group = null as unknown as GroupEntity;
          } else {
            const existingGroup = await groupRepository.findOneBy({
              id: Number(updateData.group),
            });
            if (!existingGroup) {
              throw new NotFoundException(
                `Group with ID ${updateData.group} was not found`,
              );
            }
            targetedOrder.group = existingGroup;
          }
        }


        const {
          group: _group,
          manager: _manager,
          ...fieldsToUpdate
        } = updateData as any;


        const nullableFields = [
          'course',
          'course_format',
          'course_type',
          'status',
          'name',
          'surname',
          'email',
          'phone',
        ];
        for (const key of nullableFields) {
          if (fieldsToUpdate[key] === '') {
            fieldsToUpdate[key] = null;
          }
        }

        Object.assign(targetedOrder, fieldsToUpdate);

        await orderRepository.save(targetedOrder);

        const updatedOrder = await orderRepository.findOne({
          where: { id },
          relations: ['group', 'manager'],
        });

        return OrdersMapper.toResDto(updatedOrder!);
      },
    );
  }

  async delete(id: string): Promise<void> {
    const deleteResult = await this.ordersRepository.delete(id);

    if (!deleteResult.affected) {
      throw new NotFoundException(`Order #${id} was not found`);
    }
  }

  async exportToExcel(query: OrdersQueryDto, userId: number) {
    const queryBuilder = this.getFilteredObjects(query, userId);

    const { sortBy, sortOrder } = parseOrder(query.order);
    queryBuilder.orderBy(`order.${sortBy}`, sortOrder);
    if (sortBy !== 'id') {
      queryBuilder.addOrderBy('order.id', 'DESC');
    }

    queryBuilder.take(5000);
    const ordersToExport = await queryBuilder.getMany();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Name', key: 'name', width: 15 },
      { header: 'Surname', key: 'surname', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Age', key: 'age', width: 10 },
      { header: 'Course', key: 'course', width: 15 },
      { header: 'Course format', key: 'course_format', width: 15 },
      { header: 'Course type', key: 'course_type', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Group', key: 'group', width: 20 },
      { header: 'Created_at', key: 'createdAt', width: 20 },
      { header: 'Manager', key: 'manager', width: 20 },
    ];

    for (const order of ordersToExport) {
      worksheet.addRow({
        id: order.id,
        name: order.name,
        surname: order.surname,
        email: order.email,
        phone: order.phone,
        age: order.age,
        course: order.course,
        course_format: order.course_format,
        course_type: order.course_type,
        status: order.status,
        group: order.group?.name || 'No group',
        createdAt: order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : '',
        manager: order.manager?.surname || 'Not assigned',
      });
    }

    worksheet.getRow(1).font = { bold: true };

    return await workbook.xlsx.writeBuffer();
  }
}
import { OrderEntity } from '../../database/entities/order.entity';
import { ResponseOrderDto } from './dto/res/res.order.dto';

export class OrdersMapper {
  public static toResDto(order: OrderEntity): ResponseOrderDto {
    return {
      id: order.id,
      name: order.name,
      surname: order.surname,
      email: order.email,
      phone: order.phone,
      age: order.age,
      course: order.course,
      course_format: order.course_format,
      course_type: order.course_type,
      sum: order.sum,
      alreadyPaid: order.alreadyPaid,
      utm: order.utm,
      msg: order.msg,
      status: order.status,
      created_at: order.created_at,
      group: order.group
        ? { id: order.group.id, name: order.group.name }
        : undefined,
      manager: order.manager
        ? {
          id: order.manager.id,
          name: order.manager.name,
          surname: order.manager.surname,
        }
        : undefined,
    } as ResponseOrderDto;
  }
}
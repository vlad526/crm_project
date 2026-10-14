import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { CreateCommentDto } from '../models/create-comment.dto';
import { CommentEntity } from '../../../database/entities/comment.entity';
import { OrderEntity } from '../../../database/entities/order.entity';
import { StatusesEnum } from '../../../database/entities/enums/statuses.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  async addCommentToOrder(
    orderId: string,
    currentUser: UserEntity,
    commentData: CreateCommentDto,
  ): Promise<CommentEntity> {
    return this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const orderRepository =
          transactionalEntityManager.getRepository(OrderEntity);
        const commentRepository =
          transactionalEntityManager.getRepository(CommentEntity);

        const targetOrder = await orderRepository.findOne({
          where: { id: orderId },
          relations: ['manager'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!targetOrder) {
          throw new NotFoundException(`Order with ID ${orderId} was not found`);
        }

        if (targetOrder.manager) {
          const isOwner = Number(targetOrder.manager.id) === Number(currentUser.id);
          if (!isOwner) {
            throw new ForbiddenException(
              'This application is already assigned to another manager. Only the assigned manager can comment on it.',
            );
          }
        } else {
          targetOrder.manager = currentUser;
        }

        if (!targetOrder.status || targetOrder.status === StatusesEnum.NEW) {
          targetOrder.status = StatusesEnum.INWORK;
        }

        const newComment = commentRepository.create({
          text: commentData.text,
          order: targetOrder,
          user: currentUser,
        });

        await orderRepository.save(targetOrder);
        return await commentRepository.save(newComment);
      },
    );
  }

  async getCommentsByOrder(orderId: string): Promise<CommentEntity[]> {
    return this.entityManager.getRepository(CommentEntity).find({
      where: { order: { id: orderId } },
      relations: ['user'],
      order: { created_at: 'ASC' },
    });
  }
}
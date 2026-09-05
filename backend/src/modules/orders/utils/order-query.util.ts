import { OrderSortField } from '../../../database/entities/enums/order-sort-field.enum';
import { BadRequestException } from '@nestjs/common';
import { SortOrder } from '../../../database/entities/enums/sort-order.enum';

const ALLOWED_SORT_FIELDS = Object.values(OrderSortField);

export function parseOrder(order?: string) {
  if (!order) {
    return {
      sortBy: OrderSortField.CREATED_AT,
      sortOrder: SortOrder.DESC,
    };
  }

  const isDesc = order.startsWith('-');
  const field = order.replace('-', '');

  if (!ALLOWED_SORT_FIELDS.includes(field as OrderSortField)) {
    throw new BadRequestException(`Invalid order field: ${field}`);
  }

  return {
    sortBy: field as OrderSortField,
    sortOrder: isDesc ? SortOrder.DESC : SortOrder.ASC,
  };
}

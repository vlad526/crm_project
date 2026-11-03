import type { IOrder } from "../models/interfaces/IOrders/IOrder.ts";
import type { IUpdateOrder } from "../models/interfaces/IOrders/IUpdateOrder.ts";
import type { IGroup } from "../models/interfaces/IGroup/IGroup.ts";

export const mapOrderToUpdate = (order: IOrder): IUpdateOrder => {
    return {
        name: order.name ?? null,
        surname: order.surname ?? null,
        email: order.email ?? null,
        phone: order.phone ?? null,
        age: order.age ?? null,
        course: order.course ?? null,
        course_format: order.course_format ?? null,
        course_type: order.course_type ?? null,
        status: order.status ?? null,
        sum: order.sum ?? null,
        alreadyPaid: order.alreadyPaid ?? null,
        group: (order.group as unknown as IGroup)?.id ?? (order.group as unknown as number) ?? null,
    };
};
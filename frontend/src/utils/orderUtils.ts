import type {IOrder} from "../models/interfaces/IOrders/IOrder.ts";
import type {IUpdateOrder} from "../models/interfaces/IOrders/IUpdateOrder.ts";
import type {IGroup} from "../models/interfaces/IGroup/IGroup.ts";
import type {IUser} from "../models/interfaces/IUser/IUser.ts";



export const mapOrderToUpdate = (order: IOrder): IUpdateOrder => {

    const data: Partial<IOrder> = { ...order };

    delete data.id;
    delete data.created_at;

    return {
        ...(data as unknown as IUpdateOrder ),
        group: (order.group as unknown as IGroup)?.id ?? (order.group as unknown as number),
        manager: (order.manager as unknown as IUser)?.id ?? (order.manager as unknown as number),
    };
};
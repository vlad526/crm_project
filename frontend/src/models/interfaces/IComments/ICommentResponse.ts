import type {IUser} from "../IUser/IUser.ts";
import type {IOrder} from "../IOrders/IOrder.ts";

export interface ICommentResponse {
    id: number,
    text: string,
    user: IUser,
    order: IOrder,
    created_at:string
}
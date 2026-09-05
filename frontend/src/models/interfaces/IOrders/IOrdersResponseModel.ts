import type {IOrder} from "./IOrder.ts";

export interface IOrdersResponseModel {
    "data":IOrder[],
    "page": number,
    "limit": number,
    "total": number,
}


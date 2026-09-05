import type {IUser} from "./IUser.ts";
import type {IOrdersStats} from "../IOrders/orders-stats.interface.ts";

export interface IFetchAllUsersResponse {
    users: IUser[];
    stats: IOrdersStats;
    total: number;
}
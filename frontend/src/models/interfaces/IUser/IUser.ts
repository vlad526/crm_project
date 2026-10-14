import type { UserRoleEnum } from "../../../enums/user-role.enum.ts";

export interface IUser {
    id: number;
    email: string;
    role: UserRoleEnum;
    username: string;
    name: string;
    surname: string;
    avatarUrl: string | null;
    isActive: boolean;
    lastLogin?: string | null;
    last_login?: string | null;
    total_orders?: number;
    stats?: {
        total: number;
        new: number;
        agree: number;
        in_work: number;
        disagree: number;
        dubbing: number;
    };
}
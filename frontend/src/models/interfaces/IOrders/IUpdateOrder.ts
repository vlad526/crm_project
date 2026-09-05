import type {CoursesEnum} from "../../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../../enums/formats.enum.ts";
import type {TypesEnum} from "../../../enums/types.enum.ts";
import type {StatusesEnum} from "../../../enums/statuses.enum.ts";
import type {IGroup} from "../IGroup/IGroup.ts";

export interface IUpdateOrder {
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    course?: CoursesEnum;
    course_format?: FormatsEnum;
    course_type?: TypesEnum;
    status?: StatusesEnum;
    sum?: number;
    alreadyPaid?: number;
    age?: number;
    group?: number | IGroup;
    manager?:number;
}
import type {CoursesEnum} from "../../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../../enums/formats.enum.ts";
import type {TypesEnum} from "../../../enums/types.enum.ts";
import type {StatusesEnum} from "../../../enums/statuses.enum.ts";
import type {IGroup} from "../IGroup/IGroup.ts";

export interface IUpdateOrder {
    name?: string | null;
    surname?: string | null;
    email?: string | null;
    phone?: string | null;
    course?: CoursesEnum | null;
    course_format?: FormatsEnum | null;
    course_type?: TypesEnum | null;
    status?: StatusesEnum | null;
    sum?: number | null;
    alreadyPaid?: number | null;
    age?: number | null;
    group?: number | IGroup | null;
}
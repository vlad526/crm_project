import type {CoursesEnum} from "../../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../../enums/formats.enum.ts";
import type {TypesEnum} from "../../../enums/types.enum.ts";
import type {StatusesEnum} from "../../../enums/statuses.enum.ts";


export interface IOrderFilters {
    page?: string;
    limit?: string;

    order?: string;

    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    age?: string;

    course?: CoursesEnum;
    course_format?: FormatsEnum;
    course_type?: TypesEnum;
    status?: StatusesEnum;
    group?: string;

    onlyMine?: boolean | string;

    startDate?: string;
    endDate?: string;
}
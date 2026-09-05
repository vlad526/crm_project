import type {IUser} from "../IUser/IUser.ts";
import type {IGroup} from "../IGroup/IGroup.ts";
import type {CoursesEnum} from "../../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../../enums/formats.enum.ts";
import type {TypesEnum} from "../../../enums/types.enum.ts";
import type {StatusesEnum} from "../../../enums/statuses.enum.ts";
import type {IComment} from "../IComments/IComment.ts";


export interface IOrder {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  age?: number;
  course?: CoursesEnum;
  course_format?: FormatsEnum;
  course_type?: TypesEnum;
  status?: StatusesEnum;
  sum?: number;
  alreadyPaid: number;
  utm?: string;
  msg?: string;
  created_at?: string;
  manager?: IUser | null;
  group?: IGroup | null;
  comments?: IComment[];
}


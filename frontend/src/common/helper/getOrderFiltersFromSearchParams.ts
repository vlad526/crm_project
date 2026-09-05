import {initialOrderFilters, ORDER_FILTER_KEYS} from "../../components/res_constants/orderFilters.ts";
import type {IOrderFilters} from "../../models/interfaces/IOrders/IOrderFilters.ts";
import type {CoursesEnum} from "../../enums/courses.enum.ts";
import type {FormatsEnum} from "../../enums/formats.enum.ts";
import type {TypesEnum} from "../../enums/types.enum.ts";
import type {StatusesEnum} from "../../enums/statuses.enum.ts";


export const getOrderFiltersFromSearchParams = (
  searchParams: URLSearchParams
): IOrderFilters => ({
    ...initialOrderFilters,
    name: searchParams.get(ORDER_FILTER_KEYS.name) ?? "",
    surname: searchParams.get(ORDER_FILTER_KEYS.surname) ?? "",
    email: searchParams.get(ORDER_FILTER_KEYS.email) ?? "",
    phone: searchParams.get(ORDER_FILTER_KEYS.phone) ?? "",
    age: searchParams.get(ORDER_FILTER_KEYS.age) ?? "",

    course: (searchParams.get(ORDER_FILTER_KEYS.course) ?? "") as CoursesEnum,
    course_format: (searchParams.get(ORDER_FILTER_KEYS.course_format) ?? "") as FormatsEnum,
    course_type: (searchParams.get(ORDER_FILTER_KEYS.course_type) ?? "") as TypesEnum,
    status: (searchParams.get(ORDER_FILTER_KEYS.status) ?? "") as StatusesEnum,

    group: searchParams.get(ORDER_FILTER_KEYS.group) ?? "",
    startDate: searchParams.get(ORDER_FILTER_KEYS.startDate) ?? "",
    endDate: searchParams.get(ORDER_FILTER_KEYS.endDate) ?? "",
    onlyMine: searchParams.get(ORDER_FILTER_KEYS.onlyMine) === "true" ? "true" : "false",
});
import { useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Input from "../ui/input.tsx";
import Select from "../ui/select.tsx";
import { getOrderFiltersFromSearchParams } from "../../common/helper/getOrderFiltersFromSearchParams.ts";
import { initialOrderFilters, ORDER_FILTER_KEYS } from "../res_constants/orderFilters.ts";
import { groupActions } from "../../slices/groupSlice.ts";
import { ordersActions } from "../../slices/ordersSlice.ts";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { ExportButton } from "./ExportButton.tsx";
import type { IOrderFilters } from "../../models/interfaces/IOrders/IOrderFilters.ts";
import type { CoursesEnum } from "../../enums/courses.enum.ts";
import type { StatusesEnum } from "../../enums/statuses.enum.ts";
import type { TypesEnum } from "../../enums/types.enum.ts";
import type { FormatsEnum } from "../../enums/formats.enum.ts";
import refreshIcon from "../../assets/refresh-icon.png";

const OrdersFilters = () => {
    const dispatch = useAppDispatch();
    const { groups } = useAppSelector((state) => state.groupStoreSlice);

    useEffect(() => {
        if (groups.length === 0) {
            dispatch(groupActions.fetchGroups());
        }
    }, [dispatch, groups.length]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [localFilters, setLocalFilters] = useState<IOrderFilters>(() =>
      getOrderFiltersFromSearchParams(searchParams)
    );

    const committedFiltersRef = useRef<IOrderFilters>(
      getOrderFiltersFromSearchParams(searchParams)
    );


    const debounceTimersRef = useRef<
      Partial<Record<keyof IOrderFilters, ReturnType<typeof setTimeout>>>
    >({});

    useEffect(() => {
        const timers = debounceTimersRef.current;
        return () => {
            Object.values(timers).forEach((timer) => {
                if (timer) clearTimeout(timer);
            });
        };
    }, []);


    const applyFilterToUrl = (key: keyof IOrderFilters, rawValue: string) => {
        const cleanValue = rawValue.trim();

        committedFiltersRef.current = {
            ...committedFiltersRef.current,
            [key]: key === "onlyMine" ? (cleanValue === "true" ? "true" : "") : cleanValue,
        };


        const nextParams = new URLSearchParams(window.location.search);

        for (const filterKey of Object.keys(ORDER_FILTER_KEYS) as Array<keyof typeof ORDER_FILTER_KEYS>) {
            const urlKey = ORDER_FILTER_KEYS[filterKey];
            const val = String(committedFiltersRef.current[filterKey] ?? "").trim();

            if (filterKey === "onlyMine") {
                if (val === "true") {
                    nextParams.set(urlKey, "true");
                } else {
                    nextParams.delete(urlKey);
                }
            } else {
                if (val) {
                    nextParams.set(urlKey, val);
                } else {
                    nextParams.delete(urlKey);
                }
            }
        }

        nextParams.set("page", "1");
        setSearchParams(nextParams, { replace: true });
    };


    const handleTextFilterChange = (key: keyof IOrderFilters, value: string) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));

        if (debounceTimersRef.current[key]) {
            clearTimeout(debounceTimersRef.current[key]);
        }

        debounceTimersRef.current[key] = setTimeout(() => {
            delete debounceTimersRef.current[key];
            applyFilterToUrl(key, value);
        }, 500);
    };


    const handleImmediateFilterChange = (key: keyof IOrderFilters, value: string) => {
        if (debounceTimersRef.current[key]) {
            clearTimeout(debounceTimersRef.current[key]);
            delete debounceTimersRef.current[key];
        }
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
        applyFilterToUrl(key, value);
    };

    const handleReset = () => {
        Object.values(debounceTimersRef.current).forEach((timer) => {
            if (timer) clearTimeout(timer);
        });
        debounceTimersRef.current = {};

        const resetState = { ...initialOrderFilters } as IOrderFilters;
        committedFiltersRef.current = resetState;
        setLocalFilters(resetState);

        const cleanParams = new URLSearchParams();
        cleanParams.set("page", "1");
        cleanParams.set("limit", "25");

        setSearchParams(cleanParams, { replace: true });
    };

    const handleRefresh = () => {
        dispatch(
          ordersActions.loadOrders(
            Object.fromEntries(new URLSearchParams(window.location.search).entries())
          )
        );
    };

    return (
      <form className="flex flex-2 gap-4 m-2" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-6 gap-2">
              <Input
                placeholder="Name"
                value={localFilters.name}
                onChange={(e) => handleTextFilterChange("name", e.target.value)}
              />

              <Input
                placeholder="Surname"
                value={localFilters.surname}
                onChange={(e) => handleTextFilterChange("surname", e.target.value)}
              />

              <Input
                placeholder="Email"
                value={localFilters.email}
                onChange={(e) => handleTextFilterChange("email", e.target.value)}
              />

              <Input
                placeholder="Phone"
                value={localFilters.phone}
                onChange={(e) => handleTextFilterChange("phone", e.target.value)}
              />

              <Input
                type="number"
                min="0"
                placeholder="Age"
                value={localFilters.age}
                onChange={(e) => handleTextFilterChange("age", e.target.value)}
              />

              <Select
                value={localFilters.course}
                onChange={(e) =>
                  handleImmediateFilterChange("course", e.target.value as CoursesEnum)
                }
              >
                  <option value="">all courses</option>
                  <option value="FS">FS</option>
                  <option value="QACX">QACX</option>
                  <option value="JCX">JCX</option>
                  <option value="JSCX">JSCX</option>
                  <option value="FE">FE</option>
                  <option value="PCX">PCX</option>
              </Select>

              <Select
                value={localFilters.course_format}
                onChange={(e) =>
                  handleImmediateFilterChange("course_format", e.target.value as FormatsEnum)
                }
              >
                  <option value="">all formats</option>
                  <option value="static">static</option>
                  <option value="online">online</option>
              </Select>

              <Select
                value={localFilters.course_type}
                onChange={(e) =>
                  handleImmediateFilterChange("course_type", e.target.value as TypesEnum)
                }
              >
                  <option value="">all types</option>
                  <option value="pro">pro</option>
                  <option value="minimal">minimal</option>
                  <option value="premium">premium</option>
                  <option value="incubator">incubator</option>
                  <option value="vip">vip</option>
              </Select>

              <Select
                value={localFilters.status}
                onChange={(e) =>
                  handleImmediateFilterChange("status", e.target.value as StatusesEnum)
                }
              >
                  <option value="">all statuses</option>
                  <option value="in_work">in_work</option>
                  <option value="new">new</option>
                  <option value="agree">agree</option>
                  <option value="disagree">disagree</option>
                  <option value="dubbing">dubbing</option>
              </Select>

              <Select
                value={localFilters.group}
                onChange={(e) => handleImmediateFilterChange("group", e.target.value)}
              >
                  <option value="">all groups</option>
                  {groups?.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                        {group.name}
                    </option>
                  ))}
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={localFilters.startDate}
                onChange={(e) => handleImmediateFilterChange("startDate", e.target.value)}
              />

              <Input
                type="date"
                placeholder="End date"
                value={localFilters.endDate}
                onChange={(e) => handleImmediateFilterChange("endDate", e.target.value)}
              />
          </div>

          <div className="flex justify-center align-middle items-center px-2 py-2 gap-2 m-auto">
              <label htmlFor="checkbox" className="flex items-center gap-1 cursor-pointer">
                  <input
                    id="checkbox"
                    type="checkbox"
                    checked={localFilters.onlyMine === "true"}
                    onChange={(e) =>
                      handleImmediateFilterChange("onlyMine", e.target.checked ? "true" : "")
                    }
                  />
                  My
              </label>

              <button
                type="button"
                onClick={handleReset}
                title="Reset filters"
                aria-label="Reset filters"
                className="bg-[#2e7d32] hover:bg-[#43a047] transition-colors text-white font-bold text-xs uppercase px-3 h-10 rounded-[5px] cursor-pointer"
              >
                  Reset
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                title="Refresh orders"
                aria-label="Refresh orders"
                style={{ backgroundImage: `url(${refreshIcon})` }}
                className="bg-[#2e7d32] hover:bg-[#43a047] transition-colors bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px] cursor-pointer"
              />

              <ExportButton filters={localFilters} />
          </div>
      </form>
    );
};
export default OrdersFilters;
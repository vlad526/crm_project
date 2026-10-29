import {useSearchParams} from "react-router-dom";
import {useDebounce} from "../hooks/useDebounce.ts";
import {useEffect, useState} from "react";
import Input from "../ui/input.tsx";
import Select from "../ui/select.tsx";
import {getOrderFiltersFromSearchParams} from "../../common/helper/getOrderFiltersFromSearchParams.ts";
import {initialOrderFilters, ORDER_FILTER_KEYS} from "../res_constants/orderFilters.ts";
import {groupActions} from "../../slices/groupSlice.ts";
import { useAppDispatch, useAppSelector} from "../store/store.ts";
import {ExportButton} from "./ExportButton.tsx";
import type {IOrderFilters} from "../../models/interfaces/IOrders/IOrderFilters.ts";
import type {CoursesEnum} from "../../enums/courses.enum.ts";
import type {StatusesEnum} from "../../enums/statuses.enum.ts";
import type {TypesEnum} from "../../enums/types.enum.ts";
import type {FormatsEnum} from "../../enums/formats.enum.ts";
import refreshIcon from '../../assets/refresh-icon.png'


const OrdersFilters = () => {
    const dispatch = useAppDispatch();

    const { groups } = useAppSelector((state) => state.groupStoreSlice);

    useEffect(() => {
        if (groups.length === 0) {
            dispatch(groupActions.fetchGroups());
        }
    }, [dispatch, groups.length]);

    const [searchParams, setSearchParams] = useSearchParams();

    const [localFilters, setLocalFilters] = useState(() =>
      getOrderFiltersFromSearchParams(new URLSearchParams(window.location.search))
    );

    const debouncedFilters = useDebounce(localFilters, 600);

    useEffect(() => {
        const currentParams = new URLSearchParams(window.location.search);
        const nextParams = new URLSearchParams(currentParams.toString());
        let hasChanged = false;

        for (const key in debouncedFilters) {
            const urlKey = ORDER_FILTER_KEYS[key as keyof typeof ORDER_FILTER_KEYS] || key;
            let newValue = String(debouncedFilters[key as keyof typeof debouncedFilters] || "");

            if (key === "onlyMine" && (newValue === "" || newValue === "undefined")) {
                newValue = "false";
            }

            const oldValue = currentParams.get(urlKey) || "";

            if (newValue !== oldValue) {
                hasChanged = true;
                if (newValue) nextParams.set(urlKey, newValue);
                else nextParams.delete(urlKey);
            }
        }

        if (hasChanged) {
            nextParams.set("page", "1");

            if (nextParams.toString() !== searchParams.toString()) {
                setSearchParams(nextParams, { replace: true });
            }
        }
    }, [debouncedFilters, searchParams, setSearchParams]);

    const handleReset = () => {
        setLocalFilters(initialOrderFilters as IOrderFilters);

        const cleanParams = new URLSearchParams();
        cleanParams.set("page", "1");
        cleanParams.set("limit", "25");

        setSearchParams(cleanParams, { replace: true });
    };

    return (
      <form className="flex flex-2 gap-4 m-2">
          <div className="grid grid-cols-6 gap-2">
              <Input
                placeholder="Name"
                value={localFilters.name}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, name: e.target.value}))
                }
              />

              <Input
                placeholder="Surname"
                value={localFilters.surname}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, surname: e.target.value}))
                }
              />

              <Input
                placeholder="Email"
                value={localFilters.email}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, email: e.target.value}))
                }
              />

              <Input
                placeholder="Phone"
                value={localFilters.phone}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, phone: e.target.value}))
                }
              />

              <Input
                placeholder="Age"
                value={localFilters.age}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, age: e.target.value}))
                }
              />

              <Select
                value={localFilters.course}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, course: e.target.value as CoursesEnum}))
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
                  setLocalFilters(prev => ({...prev, course_format: e.target.value as FormatsEnum}))
                }
              >
                  <option value="">all formats</option>
                  <option value="static">static</option>
                  <option value="online">online</option>
              </Select>

              <Select
                value={localFilters.course_type}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, course_type: e.target.value as TypesEnum}))
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
                  setLocalFilters(prev => ({...prev, status: e.target.value as StatusesEnum}))
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
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, group: e.target.value}))
                }
              >
                  <option value="">all groups</option>
                  {groups?.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                  ))}
              </Select>

              <Input
                type="date"
                placeholder="Start date"
                value={localFilters.startDate}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, startDate: e.target.value}))
                }
              />

              <Input
                type="date"
                placeholder="End date"
                value={localFilters.endDate}
                onChange={(e) =>
                  setLocalFilters(prev => ({...prev, endDate: e.target.value}))
                }
              />
          </div>

          <div className ="flex justify-center align-middle items-center px-2 py-2 gap-2 m-auto" >
              <label htmlFor='checkbox' className="flex items-center gap-1 cursor-pointer">
                  <input
                    id='checkbox'
                    type="checkbox"
                    checked={localFilters.onlyMine === "true"}
                    onChange={(e) =>
                      setLocalFilters(prev => ({
                          ...prev,
                          onlyMine: e.target.checked ? "true" : "false"
                      }))
                    }
                  />
                  My
              </label>

              <button
                type="button"
                onClick={handleReset}
                style={{ backgroundImage: `url(${refreshIcon})` }}
                className="bg-[#2e7d32] hover:bg-[#43a047] transition-colors bg-center bg-no-repeat bg-size-[20px_20px] w-10 h-10 rounded-[5px]">
              </button>

              <ExportButton filters={debouncedFilters} />
          </div>
      </form>
    );
};
export default OrdersFilters;
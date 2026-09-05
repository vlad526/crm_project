import { type FC, useState } from "react";
import type { IOrder } from "../../models/interfaces/IOrders/IOrder.ts";
import { EnumSelect } from "../EnumSelect.tsx";
import { CoursesEnum } from "../../enums/courses.enum.ts";
import { FormatsEnum } from "../../enums/formats.enum.ts";
import { TypesEnum } from "../../enums/types.enum.ts";
import { StatusesEnum } from "../../enums/statuses.enum.ts";
import Input from "../ui/input.tsx";
import Button from "../ui/button.tsx";
import { useAppDispatch, useAppSelector } from "../store/store.ts";
import { groupActions } from "../../slices/groupSlice.ts";
import type { IUpdateOrder } from "../../models/interfaces/IOrders/IUpdateOrder.ts";
import { mapOrderToUpdate } from "../../utils/orderUtils.ts";
import type { IGroup } from "../../models/interfaces/IGroup/IGroup.ts";
import { editOrderSchema } from "../../common/order.validator.ts";
import type { IApiError } from "../../models/interfaces/IError/IApiError.ts";

type EditOrderModalProps = {
    order: IOrder;
    onClose: () => void;
    onSubmit: (order: IUpdateOrder) => void;
};

export const EditOrderModal: FC<EditOrderModalProps> = ({
                                                            order,
                                                            onClose,
                                                            onSubmit,
                                                        }) => {
    const dispatch = useAppDispatch();
    const { groups } = useAppSelector((state) => state.groupStoreSlice);

    const [editedOrder, setEditedOrder] = useState<IUpdateOrder>(
      mapOrderToUpdate(order)
    );
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [groupMode, setGroupMode] = useState<"add" | "select">("add");
    const [value, setValue] = useState("");

    const getGroupId = (group: number | IGroup | undefined): string | number => {
        if (!group) return "";
        return typeof group === 'object' ? group.id : group;
    };

    const handleClose = () => {
        const initialOrder = mapOrderToUpdate(order);
        const hasOrderChanges = JSON.stringify(editedOrder) !== JSON.stringify(initialOrder);
        const hasUnsavedGroup = groupMode === "add" && value.trim() !== "";

        if (hasOrderChanges || hasUnsavedGroup) {
            const isConfirmed = window.confirm("У вас є незбережені зміни. Ви впевнені, що хочете вийти без збереження?");
            if (!isConfirmed) {
                return;
            }
        }
        onClose();
    };

    const handleAdd = async () => {
        if (groupMode === "select") {
            setGroupMode("add");
            return;
        }
        if (!value.trim()) return;
        try {
            setErrors(prev => ({ ...prev, group: "" }));

            const newGroup = await dispatch(
              groupActions.AddCreateGroup(value)
            ).unwrap();

            await dispatch(groupActions.fetchGroups());

            setEditedOrder(prev => ({
                ...prev,
                group: newGroup
            }));

            setGroupMode("select");
            setValue("");
        } catch (err: unknown) {
            const isApiError = (error: unknown): error is IApiError => {
                return (
                  typeof error === 'object' &&
                  error !== null &&
                  ('message' in error || 'statusCode' in error)
                );
            };

            let errorMessage = "Failed to create group";

            if (isApiError(err)) {
                errorMessage = Array.isArray(err.message) ? err.message[0] : (err.message || errorMessage);
            } else if (typeof err === 'string') {
                errorMessage = err;
            }

            setErrors(prev => ({
                ...prev,
                group: errorMessage
            }));
        }
    }

    const handleSelect = () => {
        setGroupMode("select");
    }

    const toNumberOrUndefined = (value: string) =>
      value === "" ? undefined : Number(value);

    const validateOrder = (): boolean => {
        const { error } = editOrderSchema.validate(editedOrder, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const newErrors: Record<string, string> = {};
            for (const detail of error.details) {
                const fieldName = detail.path[0] as string;
                if (fieldName) {
                    newErrors[fieldName] = detail.message;
                }
            }
            setErrors(newErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    return (
      <div
        className="fixed inset-0 flex items-center justify-center z-50"
        onMouseDown={handleClose}
      >
          <div className="absolute inset-0 bg-black/5 backdrop-opacity-50 pointer-events-none"></div>

          <div
            className="relative bg-white rounded-lg p-6 w-full max-w-4xl z-10 shadow-lg"
            onMouseDown={(e) => e.stopPropagation()}
          >
              <form
                onSubmit={(e) => {
                    e.preventDefault();

                    if (groupMode === "add" && value.trim() !== "") {
                        setErrors(prev => ({
                            ...prev,
                            group: "Спочатку натисніть кнопку 'Add', щоб додати цю групу"
                        }));
                        return;
                    }

                    if (validateOrder()) {
                        const payload: IUpdateOrder = { ...editedOrder };
                        onSubmit(payload);
                    }
                }}
                className="grid grid-cols-2 gap-4"
              >
                  <div>
                      <label htmlFor="group" className="block mb-1 text-gray-700">Group</label>
                      {groupMode === "add" ? (
                        <Input
                          id="group"
                          value={value}
                          onChange={(e) => {
                              setValue(e.target.value)
                              if (errors.group) {
                                  setErrors(prev => ({ ...prev, group: "" }));
                              }
                          }}

                          className="w-full bg-gray-100 border-transparent px-3 py-2 rounded-md focus:outline-none"
                          placeholder="Group"
                        />
                      ) : (
                        <select
                          value={getGroupId(editedOrder.group)}
                          onChange={(e) => {
                              const groupId = Number(e.target.value) || undefined;
                              setEditedOrder(prev => ({
                                  ...prev,
                                  group: groupId
                              }));
                          }}
                          className="w-full bg-gray-100 border-transparent px-3 py-2 rounded-md focus:outline-none"
                        >
                            <option value="">Select group</option>
                            {groups.map(group => (
                              <option key={group.id} value={group.id}>
                                  {group.name}
                              </option>
                            ))}
                        </select>
                      )}
                      {errors.group && <span className="text-red-500 text-xs">{errors.group}</span>}


                      <div className="flex w-full gap-1 mt-1">
                          <button
                            type="button"
                            onClick={handleAdd}
                            className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-[4px] text-white transition-colors ${
                              groupMode === 'add' ? 'bg-[#388e3c] shadow-inner' : 'bg-[#43a047] hover:bg-[#388e3c]'
                            }`}
                          >
                              Add
                          </button>

                          <button
                            type="button"
                            onClick={handleSelect}
                            className={`flex-1 py-1.5 text-xs font-semibold uppercase tracking-wide rounded-[4px] text-white transition-colors ${
                              groupMode === 'select' ? 'bg-[#388e3c] shadow-inner' : 'bg-[#43a047] hover:bg-[#388e3c]'
                            }`}
                          >
                              Select
                          </button>
                      </div>
                  </div>

                  <div><label htmlFor="status">Status</label>
                      <EnumSelect
                        id="status"
                        value={editedOrder.status}
                        options={Object.values(StatusesEnum)}
                        placeholder="All statuses"
                        onChange={(status) =>
                          setEditedOrder(prev => ({ ...prev, status }))
                        }
                      />
                      {errors.status && <span className="text-red-500 text-xs">{errors.status}</span>}
                  </div>

                  <div><label htmlFor="name">Name</label>
                      <Input
                        id="name"
                        value={editedOrder.name ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              name: e.target.value,
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Name"
                      />
                      {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                  </div>

                  <div><label htmlFor="sum">Sum</label>
                      <Input
                        id="sum"
                        type="number"
                        min="0"
                        value={editedOrder.sum ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              sum: toNumberOrUndefined(e.target.value),
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Sum"
                      />
                      {errors.sum && <span className="text-red-500 text-xs">{errors.sum}</span>}
                  </div>

                  <div><label htmlFor="surname">Surname</label>
                      <Input
                        id="surname"
                        value={editedOrder.surname ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              surname: e.target.value,
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Surname"
                      />
                      {errors.surname && <span className="text-red-500 text-xs">{errors.surname}</span>}
                  </div>

                  <div><label htmlFor="alreadyPaid">Already paid</label>
                      <Input
                        id="alreadyPaid"
                        type="number"
                        min="0"
                        value={editedOrder.alreadyPaid ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              alreadyPaid: toNumberOrUndefined(e.target.value),
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Already Paid"
                      />
                      {errors.alreadyPaid && <span className="text-red-500 text-xs">{errors.alreadyPaid}</span>}
                  </div>

                  <div><label htmlFor="email">Email</label>
                      <Input
                        id="email"
                        value={editedOrder.email ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              email: e.target.value,
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Email"
                      />
                      {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                  </div>

                  <div><label htmlFor="course">Course</label>
                      <EnumSelect
                        id="course"
                        value={editedOrder.course}
                        options={Object.values(CoursesEnum)}
                        placeholder="All course"
                        onChange={(course) =>
                          setEditedOrder(prev => ({ ...prev, course }))
                        }
                      />
                      {errors.course && <span className="text-red-500 text-xs">{errors.course}</span>}
                  </div>

                  <div><label htmlFor="phone">Phone</label>
                      <Input
                        id="phone"
                        value={editedOrder.phone ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              phone: e.target.value,
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Phone"
                      />
                      {errors.phone && <span className="text-red-500 text-xs">{errors.phone}</span>}
                  </div>

                  <div><label htmlFor="course">Course format</label>
                      <EnumSelect
                        id="course_format"
                        value={editedOrder.course_format}
                        options={Object.values(FormatsEnum)}
                        placeholder="All format"
                        onChange={(course_format) =>
                          setEditedOrder(prev => ({ ...prev, course_format }))
                        }
                      />
                      {errors.course_format && <span className="text-red-500 text-xs">{errors.course_format}</span>}
                  </div>

                  <div><label htmlFor="age">Age</label>
                      <Input
                        id="age"
                        type="number"
                        min="1"
                        value={editedOrder.age ?? ""}
                        onChange={(e) =>
                          setEditedOrder(prev => ({
                              ...prev,
                              age: toNumberOrUndefined(e.target.value),
                          }))
                        }
                        className="w-full border px-3 py-2"
                        placeholder="Age"
                      />
                      {errors.age && <span className="text-red-500 text-xs">{errors.age}</span>}
                  </div>

                  <div><label htmlFor="course_type">Course type</label>
                      <EnumSelect
                        id="course_type"
                        value={editedOrder.course_type}
                        options={Object.values(TypesEnum)}
                        placeholder="All type"
                        onChange={(course_type) =>
                          setEditedOrder(prev => ({ ...prev, course_type }))
                        }
                      />
                      {errors.course_type && <span className="text-red-500 text-xs">{errors.course_type}</span>}
                  </div>

                  <div></div>

                  <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        onClick={handleClose}
                        className="px-4 py-2 border hover:bg-gray-50 transition-colors"
                      >
                          Close
                      </Button>

                      <Button
                        type="submit"
                        className="px-4 py-2 border bg-[#43a047] text-white hover:bg-[#2e7d32] transition-colors"
                      >
                          Submit
                      </Button>
                  </div>
              </form>
          </div>
      </div>
    );
};
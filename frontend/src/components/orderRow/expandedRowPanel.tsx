import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import type {FC} from "react";
import {Comments} from "../comment/Comments.tsx";
import {usePermissions} from "../hooks/usePermissions.ts";

type ExpandedOrderPanelProps = {
    order: IOrder;
    onEdit: () => void;
};

export const ExpandedOrderPanel:FC<ExpandedOrderPanelProps> = ({ order, onEdit }) => {
    const { canEdit } = usePermissions(order);


    return (
        <tr>
            <td colSpan={12}>
                <div className="expandedRow flex justify-between gap-20 p-16">

                <div className="expandedLeft flex flex-col gap-8 flex-[0_0_30%]">
                        <div>
                            <strong>Message:</strong> {order.msg ?? "null"}
                        </div>

                        <div>
                            <strong>UTM:</strong> {order.utm ?? "null"}
                        </div>
                </div>



                <div className="expandedRight flex flex-col gap-12 flex-[0_0_60%]">

                    <div className="flex flex-col gap-10">

                        <Comments orderId={order.id}/>


                     </div>


                </div>


                    <button
                        onClick={e => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        disabled={!canEdit}
                        className={`px-4 py-2 text-white rounded-[5px] self-start transition-colors ${
                            canEdit
                                ? "bg-[#43a047] hover:bg-[#2e7d32] cursor-pointer"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                        title={!canEdit ? "You cannot edit someone else's application" : ""}
                    >
                        EDIT
                    </button>

                </div>
            </td>
        </tr>
    );
};

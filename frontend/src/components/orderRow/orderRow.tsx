import type { FC } from "react";
import type { IOrder } from "../../models/interfaces/IOrders/IOrder.ts";

type OrderRowProps = {
    order: IOrder;
    isExpanded?: boolean;
    onToggle?: () => void;
    onEdit?: () => void;
};

export const OrderRow: FC<OrderRowProps> = ({ order, onToggle}) => {
    return (

        <tr onClick={onToggle} className="cursor-pointer  hover:bg-green-600 hover:text-white even:bg-gray-200 ">
            <td className="px-3 py-2">{order.id}</td>
            <td className="px-3 py-2 font-medium">{order.name ?? "null"}</td>
            <td className="px-3 py-2">{order.surname ?? "null"}</td>
            <td className="px-3 py-2">{order.email ?? "null"}</td>
            <td className="px-3 py-2">{order.phone ?? "null"}</td>
            <td className="px-3 py-2 text-center">{order.age ?? "null"}</td>
            <td className="px-3 py-2">{order.course ?? "null"}</td>
            <td className="px-3 py-2">{order.course_format ?? "null"}</td>
            <td className="px-3 py-2">{order.course_type ?? "null"}</td>
            <td className="px-3 py-2">{order.status ?? "null"}</td>
            <td className="px-3 py-2">{order.sum ?? "null"}</td>
            <td className="px-3 py-2">{order.alreadyPaid ?? "null"}</td>
            <td className="px-3 py-2">{order.group ?.name ?? "null"}</td>
            <td className="px-3 py-2">
                {order.created_at
                    ? new Date(order.created_at).toLocaleDateString()
                    : "null"}
            </td>

            <td className="px-3 py-2">{order.manager?.name ?? "null"}</td>
        </tr>
    );
};


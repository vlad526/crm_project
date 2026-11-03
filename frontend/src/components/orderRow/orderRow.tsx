import type { FC } from "react";
import type { IOrder } from "../../models/interfaces/IOrders/IOrder.ts";

type OrderRowProps = {
  order: IOrder;
  isExpanded?: boolean;
  onToggle?: () => void;
  onEdit?: () => void;
};

export const OrderRow: FC<OrderRowProps> = ({ order, onToggle }) => {
  return (
    <tr onClick={onToggle} className="cursor-pointer hover:bg-green-600 hover:text-white even:bg-gray-200">
      <td className="px-3 py-2">{order.id}</td>
      <td className="px-3 py-2 font-medium">{order.name ?? ""}</td>
      <td className="px-3 py-2">{order.surname ?? ""}</td>
      <td className="px-3 py-2">{order.email ?? ""}</td>
      <td className="px-3 py-2">{order.phone ?? ""}</td>
      <td className="px-3 py-2 text-center">{order.age ?? ""}</td>
      <td className="px-3 py-2">{order.course ?? ""}</td>
      <td className="px-3 py-2">{order.course_format ?? ""}</td>
      <td className="px-3 py-2">{order.course_type ?? ""}</td>
      <td className="px-3 py-2">{order.status ?? ""}</td>
      <td className="px-3 py-2">{order.sum ?? ""}</td>
      <td className="px-3 py-2">{order.alreadyPaid ?? ""}</td>
      <td className="px-3 py-2">{order.group?.name ?? ""}</td>
      <td className="px-3 py-2">
        {order.created_at
          ? new Date(order.created_at).toLocaleDateString()
          : ""}
      </td>
      <td className="px-3 py-2">{order.manager?.name ?? ""}</td>
    </tr>
  );
};
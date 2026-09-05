import type {OrderSortField} from "../../models/types/OrderSortField.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {OrderRow} from "../orderRow/orderRow.tsx";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";
import React, {Fragment, useEffect, useState} from "react";
import {ExpandedOrderPanel} from "../orderRow/expandedRowPanel.tsx";
import {EditOrderModal} from "./EditOrderModal.tsx";
import {groupActions} from "../../slices/groupSlice.ts";
import {ordersActions} from "../../slices/ordersSlice.ts";
import type {IUpdateOrder} from "../../models/interfaces/IOrders/IUpdateOrder.ts";

type OrdersTableProps = {
    onSort: (field: OrderSortField ) => void;
    currentSort: string | null;
}


const tableColumns: { key: OrderSortField; label: string }[] = [
    { key: "id", label: "id" },
    { key: "name", label: "name" },
    { key: "surname", label: "surname" },
    { key: "email", label: "email" },
    { key: "phone", label: "phone" },
    { key: "age", label: "age" },
    { key: "course", label: "course" },
    { key: "course_format", label: "course_format" },
    { key: "course_type", label: "course_type" },
    { key: "status", label: "status" },
    { key: "sum", label: "sum" },
    { key: "alreadyPaid", label: "alreadyPaid" },
    { key: "group", label: "group" },
    { key: "created_at", label: "created_at" },
    { key: "manager", label: "Manager" },
];

const OrdersTable: React.FC<OrdersTableProps> = ({ onSort, currentSort  }) => {

    const dispatch = useAppDispatch();

    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [editOrder, setEditOrder] = useState<IOrder | null>(null);

    useEffect(() => {
        dispatch(groupActions.fetchGroups());
    }, [dispatch]);

    const { pageData, loading } = useAppSelector((state) => state.orderStoreSlice);

    const getSortArrow = (field: string) => {
        if (currentSort === field) return " ▲";
        if (currentSort === `-${field}`) return " ▼";
        return "";
    };

    if (loading && !pageData) {
        return <div className="p-4 text-center">Loading orders...</div>;
    }

    const orders: IOrder[] = pageData?.data ?? [];

    return (
      <div className="overflow-x-auto">
          <table className="min-w-full border-gray-300 text-sm">
              <thead className="bg-[#43a047] text-white">
              <tr>
                  {tableColumns.map((col) => (
                    <th
                      key={col.key}
                      className="cursor-pointer select-none hover:bg-[#2e7d32] py-2 px-1 text-left"
                      onClick={() => onSort(col.key)}
                    >
                        {col.label}
                        <span className="w-4 inline-block">{getSortArrow(col.key)}</span>
                    </th>
                  ))}
              </tr>
              </thead>

              <tbody>

              {orders.length === 0 ? (
                <tr>
                    <td colSpan={tableColumns.length} className="text-center py-8 text-gray-500">
                        Замовлень не знайдено
                    </td>
                </tr>
              ) : (
                orders.map(order => (
                  <Fragment key={order.id}>
                      <OrderRow
                        order={order}
                        isExpanded={expandedOrderId === order.id}
                        onToggle={() =>
                          setExpandedOrderId(
                            expandedOrderId === order.id ? null : order.id
                          )
                        }
                        onEdit={() => setEditOrder(order)}
                      />

                      {expandedOrderId === order.id && (
                        <ExpandedOrderPanel
                          order={order}
                          onEdit={() => setEditOrder(order)}
                        />
                      )}
                  </Fragment>
                ))
              )}
              </tbody>
          </table>

          {editOrder && (
            <EditOrderModal
              order={editOrder}
              onClose={() => setEditOrder(null)}
              onSubmit={async (updateData: IUpdateOrder) => {
                  try {
                      await dispatch(
                        ordersActions.loadUpdateOrder({
                            id: editOrder.id,
                            payload: updateData,
                        })
                      ).unwrap();

                      setEditOrder(null);
                  } catch (error) {
                      console.error("Failed to update order:", error);
                  }
              }}
            />
          )}

      </div>
    );
};

export default OrdersTable;
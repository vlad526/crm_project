import { useAppSelector } from "../store/store.ts";
import type {IOrder} from "../../models/interfaces/IOrders/IOrder.ts";



export const usePermissions = (order?: IOrder) => {
    const currentUser = useAppSelector((state) => state.authStoreSlice.me);

    if (!currentUser) {
        return { canEdit: false, canComment: false, isOwner: false, isFreeOrder: false  };
    }

    const currentUserId = Number(currentUser.id);
    const orderManagerId = order?.manager?.id ? Number(order.manager.id) : null;

    const isOwner = orderManagerId === currentUserId;
    const isFreeOrder = !orderManagerId;


    const canEdit = isFreeOrder || isOwner;
    const canComment =  isFreeOrder || isOwner;

    return {
        canEdit,
        canComment,
        isOwner,
        isFreeOrder,
        showLockIcon: !isFreeOrder && !isOwner
    };
};

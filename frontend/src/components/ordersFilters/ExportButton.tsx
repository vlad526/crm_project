import type {IOrderFilters} from "../../models/interfaces/IOrders/IOrderFilters.ts";
import {useAppDispatch, useAppSelector} from "../store/store.ts";
import {exportOrders} from "../../slices/ordersSlice.ts";
import {unwrapResult} from "@reduxjs/toolkit";
import type {FC} from "react";
import excelIcon from '../../assets/excel-icon.png';

interface ExportButtonProps {
    filters: IOrderFilters;
}

export const ExportButton: FC<ExportButtonProps> = ({ filters }) => {
    const dispatch = useAppDispatch();
    const { isExporting } = useAppSelector((state) => state.orderStoreSlice);

    const handleDownload = async () => {
        try {

            const cleanedFilters = Object.fromEntries(
              Object.entries(filters).filter(
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                ([_, value]) => value !== "" && value !== undefined && value !== null
              )
            );

            const resultAction = await dispatch(exportOrders(cleanedFilters));
            const blobData = unwrapResult(resultAction);

            if (blobData) {
                const url = window.URL.createObjectURL(new Blob([blobData as BlobPart]));
                const link = document.createElement('a');
                link.href = url;

                const date = new Date().toISOString().split('T')[0];
                link.setAttribute('download', `orders_report_${date}.xlsx`);

                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Download error:', error);
            alert('Excel file upload failed. Please try again later.');
        }
    };

    return (
      <button
        onClick={handleDownload}
        disabled={isExporting}
        style={{ backgroundImage: `url(${excelIcon})` }}
        className="bg-[#2e7d32] hover:bg-[#43a047] transition-colors bg-center bg-no-repeat bg-[length:20px_20px] w-10 h-10 rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
      </button>
    );
};
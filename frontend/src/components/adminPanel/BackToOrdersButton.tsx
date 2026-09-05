import { useNavigate } from "react-router-dom";

export const BackToOrdersButton = () => {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/app/orders')}
            className="flex items-center gap-2 px-4 py-2 bg-[#43a047] hover:bg-[#2e7d32] text-white rounded shadow-md uppercase font-bold transition-colors"
        >
            <span>←</span> Return to orders
        </button>
    );
};
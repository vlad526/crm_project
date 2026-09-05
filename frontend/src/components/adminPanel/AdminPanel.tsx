import { useAppSelector } from "../store/store.ts";
import { useState } from "react";
import { ManagerCard } from "../manager/ManagerCard.tsx";
import { CreateManagerModal } from "../manager/CreateManagerModal.tsx";
import { BackToOrdersButton } from "./BackToOrdersButton.tsx";

export const AdminPanel = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { stats, users, loading } = useAppSelector((state) => state.adminStoreSlice);

  if (loading && !users.length) {
    return <div className="text-center mt-10 text-gray-500 font-medium">Loading...</div>;
  }

  return (
    <div className="p-4 md:p-10">


      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 lg:mb-10">


        <div className="w-full lg:w-auto flex justify-center lg:justify-start">
          <button
            className="bg-[#43a047] hover:bg-[#2e7d32] text-white px-6 py-2 rounded shadow-md uppercase font-bold transition-colors w-full lg:w-auto"
            onClick={() => setIsModalOpen(true)}
          >
            Create
          </button>
        </div>


        <div className="flex flex-col items-center justify-center text-center order-first lg:order-none w-full lg:flex-1">
          <h2 className="text-xl font-bold mb-3 uppercase text-gray-800">Order Statistics</h2>


          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 font-semibold text-gray-700 text-sm md:text-base">
            <p>Total: <span className="text-[#43a047]">{stats?.total || 0}</span></p>
            <p>Agree: <span className="text-gray-900">{stats?.agree || 0}</span></p>
            <p>In work: <span className="text-gray-900">{stats?.in_work || 0}</span></p>
            <p>Disagree: <span className="text-gray-900">{stats?.disagree || 0}</span></p>
            <p>Dubbing: <span className="text-gray-900">{stats?.dubbing || 0}</span></p>
            <p>New: <span className="text-gray-900">{stats?.new || 0}</span></p>
          </div>
        </div>


        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <BackToOrdersButton />
        </div>
      </div>

      <hr className="border-[#43a047] opacity-50 mb-8" />

      <div className="max-w-5xl mx-auto space-y-4">
        {users?.length === 0 && !loading ? (
          <div className="text-center text-gray-500 py-10">
            No managers found.
          </div>
        ) : (
          users?.map(user => (
            <ManagerCard key={user.id} user={user} />
          ))
        )}
      </div>

      <CreateManagerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
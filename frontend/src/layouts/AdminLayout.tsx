import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../feature/admin";

const AdminLayout = () => {
  return (
    <div className="flex max-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-4 pt-20 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

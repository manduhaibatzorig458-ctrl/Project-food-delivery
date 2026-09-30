import Sidebar from "../food-menu/_components/sidebar";
import OrdersTable from "./_features/orders-table";

const OrdersPage = () => {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      <Sidebar />
      <div className="flex-1">
        <OrdersTable />
      </div>
    </div>
  );
};

export default OrdersPage;
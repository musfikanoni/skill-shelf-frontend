import type { Metadata } from "next";
import OrdersPage from "@/components/pages/adminDashboard/orders/OrderPage";

export const metadata: Metadata = {
  title: "Manage Orders",
  description: "Monitor customer orders, transactions, and refunds",
};

export default function Orders() {
  return (
    <div>
      <OrdersPage />
    </div>
  );
}

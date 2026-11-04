import type { Metadata } from "next";
import OrderDetailsPage from "@/components/pages/userDashboard/myOrders/orderDetails/OrderDetailsPage";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View invoice and purchase details for this order",
};

export default function OrderDetails() {
  return (
    <div>
      <OrderDetailsPage />
    </div>
  );
}

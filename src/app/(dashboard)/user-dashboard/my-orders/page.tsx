import type { Metadata } from "next";
import MyOrdersPage from "@/components/pages/userDashboard/myOrders/MyOrdersPage";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View and track all your purchase orders on SkillShelf",
};

export default function MyOrders() {
  return (
    <div>
      <MyOrdersPage />
    </div>
  );
}

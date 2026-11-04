import type { Metadata } from "next";
import SubscriptionsPage from "@/components/pages/adminDashboard/subscriptions/SubscriptionsPage";

export const metadata: Metadata = {
  title: "Subscription Plans",
  description: "Configure membership pricing tiers, recurring billing, and perks",
};

export default function Subscriptions() {
  return (
    <div>
      <SubscriptionsPage />
    </div>
  );
}

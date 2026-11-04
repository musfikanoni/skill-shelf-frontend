import type { Metadata } from "next";
import MembershipPage from "@/components/pages/userDashboard/membership/MembershipPage";

export const metadata: Metadata = {
  title: "My Membership",
  description: "Manage your active subscription plan, billing cycle, and perks",
};

export default function Membership() {
  return (
    <div>
      <MembershipPage />
    </div>
  );
}

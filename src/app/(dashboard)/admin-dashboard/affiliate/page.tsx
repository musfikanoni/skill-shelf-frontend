import type { Metadata } from "next";
import AffiliatePage from "@/components/pages/adminDashboard/affiliate/AffiliatePage";

export const metadata: Metadata = {
  title: "Affiliates Management",
  description: "Review affiliate applications, commission rates, and payouts",
};

export default function Affiliate() {
  return (
    <div>
      <AffiliatePage />
    </div>
  );
}

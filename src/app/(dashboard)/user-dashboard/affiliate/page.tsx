import type { Metadata } from "next";
import AffiliatePage from "@/components/pages/userDashboard/affiliate/AffiliatePage";

export const metadata: Metadata = {
  title: "Affiliate Portal",
  description: "Track your referral links, conversion stats, and commissions",
};

export default function Affiliate() {
  return <AffiliatePage />;
}

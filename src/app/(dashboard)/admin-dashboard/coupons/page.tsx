import type { Metadata } from "next";
import CouponsPage from "@/components/pages/adminDashboard/coupons/CouponsPage";

export const metadata: Metadata = {
  title: "Coupons",
  description: "Create and manage promotional discount codes and coupons",
};

export default function Coupons() {
  return (
    <div>
      <CouponsPage />
    </div>
  );
}

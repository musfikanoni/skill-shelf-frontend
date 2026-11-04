import type { Metadata } from "next";
import { AdminDashboardPage } from "@/components/pages/adminDashboard/overview/AdminDashboardPage";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "SkillShelf Super Admin overview and system metrics",
};

export default function AdminDashboard() {
  return (
    <div className="space-y-6 md:space-y-8 pb-10">
      <AdminDashboardPage />
    </div>
  );
}

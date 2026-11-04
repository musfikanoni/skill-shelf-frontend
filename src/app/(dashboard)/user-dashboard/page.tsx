import type { Metadata } from "next";
import OverviewPage from "@/components/pages/userDashboard/overview/OverviewPage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "View your SkillShelf account overview, stats, and quick actions",
};

export default function OverviewPageWrapper() {
  return <OverviewPage />;
}

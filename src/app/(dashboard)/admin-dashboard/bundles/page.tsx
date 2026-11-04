import type { Metadata } from "next";
import BundlesPage from "@/components/pages/adminDashboard/bundles/BundlesPage";

export const metadata: Metadata = {
  title: "Manage Bundles",
  description: "Create and manage product bundles on SkillShelf",
};

export default function Bundles() {
  return (
    <div>
      <BundlesPage />
    </div>
  );
}

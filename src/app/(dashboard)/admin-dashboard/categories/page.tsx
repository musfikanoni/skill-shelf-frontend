import type { Metadata } from "next";
import CategoriesPage from "@/components/pages/adminDashboard/categories/CategoriesPage";

export const metadata: Metadata = {
  title: "Categories",
  description: "Organize products and courses into digital categories",
};

export default function Categories() {
  return (
    <div>
      <CategoriesPage />
    </div>
  );
}

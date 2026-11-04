import type { Metadata } from "next";
import ProductsPage from "@/components/pages/adminDashboard/products/ProductsPage";

export const metadata: Metadata = {
  title: "Manage Products",
  description: "Create, edit, and organize SkillShelf digital products",
};

export default function Products() {
  return (
    <div>
      <ProductsPage />
    </div>
  );
}

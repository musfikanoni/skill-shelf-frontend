import type { Metadata } from "next";
import BundlesPage from "@/components/pages/bundlesPage/BundlesPage";

export const metadata: Metadata = {
  title: "Digital Bundles",
  description: "Explore curated packages of premium digital assets, courses, and resources",
};

const Bundles = () => {
  return (
    <div>
      <BundlesPage />
    </div>
  );
};

export default Bundles;

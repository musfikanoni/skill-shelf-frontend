import type { Metadata } from "next";
import BundleDetails from "@/components/pages/bundlesPage/BundleDetails";

export const metadata: Metadata = {
  title: "Bundle Details",
  description: "View details of this curated high-value digital bundle",
};

const BundleDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      <BundleDetails id={id} />
    </div>
  );
};

export default BundleDetailsPage;

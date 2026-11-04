import type { Metadata } from "next";
import SEOToolkitBundle from "@/components/pages/seoToolkitBundle/SEOToolkitBundle";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View complete product overview, features, commercial rights, and package options",
};

function SeoToolkit() {
  return (
    <div>
      <SEOToolkitBundle />
    </div>
  );
}

export default SeoToolkit;

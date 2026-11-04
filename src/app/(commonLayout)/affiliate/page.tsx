import type { Metadata } from "next";
import AffiliateApplication from "@/components/pages/affiliateApplication/AffiliateApplication";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Affiliate Program",
  description: "Join our affiliate program and earn up to 50% commission referring SkillShelf products and courses",
};

const AffiliatePage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/affiliate.png"
            alt="affiliate"
            width={40}
            height={40}
          />
        }
        title="Join Our Affiliate Program"
        description="Earn up to 50% commission on every sale you refer"
      />

      <AffiliateApplication />
    </div>
  );
};

export default AffiliatePage;

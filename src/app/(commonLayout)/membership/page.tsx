import type { Metadata } from "next";
import PricingPlans from "@/components/pages/home/PricingPlans";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Membership Plans",
  description: "Get unlimited access to premium SkillShelf products and courses with our membership tiers",
};

const MembershipPage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/membership.png"
            alt="membership"
            width={40}
            height={40}
          />
        }
        title="Choose Your Membership Plan"
        description="Get unlimited access to premium SkillShelf products and courses"
      />
      <PricingPlans />
    </div>
  );
};

export default MembershipPage;

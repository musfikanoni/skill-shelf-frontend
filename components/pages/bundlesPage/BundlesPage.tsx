"use client";
import PopulaProductSection from "@/components/pages/home/PopulaProductSection";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import UpgradeBanner from "@/components/shared/upgradeBanner/UpgradeBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function BundlesPage() {
  const router = useRouter();
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/bundles.png"
            alt="product"
            width={40}
            height={40}
          />
        }
        title="Product Bundles"
        description="Save big with our curated product bundles"
      />
      <PopulaProductSection />
      <UpgradeBanner
        title="Want Everything?"
        subtitle="Get unlimited access to all bundles with VIP membership"
        buttonText="Explore VIP Membership"
        onClick={() => router.push("/membership")}
      />
    </div>
  );
}

"use client"
import PopulaProductSection from '@/components/home/PopulaProductSection'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import UpgradeBanner from '@/components/shared/upgradeBanner/UpgradeBanner'
import Image from 'next/image'

export default function BundlesPage() {
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
        onClick={() => console.log("click")}
      />
    </div>
  );
}

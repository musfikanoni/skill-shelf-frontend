
import AffiliateApplication from '@/components/pages/affiliateApplication/AffiliateApplication'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Image from 'next/image'

const AffiliatePage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/affiliate.png"
            alt="product"
            width={40}
            height={40}
          />
        }
        title="Join Our Affiliate Program"
        description="Earn up to 50% commission on every sale you refer"
      />

      <AffiliateApplication />
    </div>
  )
}

export default AffiliatePage        
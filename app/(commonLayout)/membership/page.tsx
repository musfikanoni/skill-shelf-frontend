
import PricingPlans from '@/components/home/PricingPlans'
import CurrentSubscription from '@/components/shared/currentSubscription/CurrentSubscription'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Image from 'next/image'

const MembershipPage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/membership.png"
            alt="product"
            width={40}
            height={40}
          />
        }
        title="Choose Your Membership Plan"
        description="Get unlimited access to premium PLR products and courses"
      />
      <PricingPlans />
      <CurrentSubscription />
    </div>
  )
}

export default MembershipPage     
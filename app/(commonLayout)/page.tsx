import BestSellingProducts from "@/components/pages/home/BestSellingSection";
import BrowseCategory from "@/components/pages/home/BrowseCategory";
import FeaturedCourses from "@/components/pages/home/FeaturedCourses";
import HeroSection from "@/components/pages/home/HeroSection";
import OurCustomer from "@/components/pages/home/OurCustomer";
import PopulaProductSection from "@/components/pages/home/PopulaProductSection";
import PricingPlans from "@/components/pages/home/PricingPlans";
import StatsSection from "@/components/pages/home/StatsSection";
import TrustBadgeBanner from "@/components/pages/home/TrustBadgeBanner";
import VipBundlePage from "@/components/pages/home/VipBundlePage";

const page = () => {
  return (
    <div>
      <HeroSection />
      <StatsSection />
      <TrustBadgeBanner />
      <BestSellingProducts />
      <BrowseCategory />
      <FeaturedCourses />
      <VipBundlePage />
      <PopulaProductSection />
      <OurCustomer />
      <PricingPlans />
    </div>
  );
};

export default page;


import BestSellingProducts from "@/components/home/BestSellingSection";
import BrowseCategory from "@/components/home/BrowseCategory";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import HeroSection from "@/components/home/HeroSection";
import OurCustomer from "@/components/home/OurCustomer";
import PopulaProductSection from "@/components/home/PopulaProductSection";
import PricingPlans from "@/components/home/PricingPlans";
import StatsSection from "@/components/home/StatsSection";
import TrustBadgeBanner from "@/components/home/TrustBadgeBanner";
import VipBundlePage from "@/components/home/VipBundlePage";

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


"use client";
import FeaturedCourses from "@/components/pages/home/FeaturedCourses";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import UpgradeBanner from "@/components/shared/upgradeBanner/UpgradeBanner";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CoursesPage = () => {
  const router = useRouter();
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/course.png"
            alt="product"
            width={40}
            height={40}
          />
        }
        title="Online Courses"
        description="Master digital skills with our comprehensive course library"
      />
      <FeaturedCourses />

      <UpgradeBanner
        title="Get Unlimited Course Access"
        subtitle="VIP members get access to all current and future courses"
        buttonText="Upgrade to VIP"
       onClick={() => router.push("/membership")}
      />
    </div>
  );
};

export default CoursesPage;

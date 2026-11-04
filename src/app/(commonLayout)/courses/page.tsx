import type { Metadata } from "next";
import FeaturedCourses from "@/components/pages/home/FeaturedCourses";
import PageHeader from "@/components/shared/pageHeader/PageHeader";
import UpgradeBanner from "@/components/shared/upgradeBanner/UpgradeBanner";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Online Courses",
  description: "Master digital skills with our comprehensive course library",
};

const CoursesPage = () => {
  return (
    <div>
      <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/course.png"
            alt="courses"
            width={40}
            height={40}
          />
        }
        title="Online Courses"
        description="Master digital skills with our comprehensive course library"
      />
      <FeaturedCourses />

      <Link href="/membership" className="block">
        <UpgradeBanner
          title="Get Unlimited Course Access"
          subtitle="VIP members get access to all current and future courses"
          buttonText="Upgrade to VIP"
        />
      </Link>
    </div>
  );
};

export default CoursesPage;

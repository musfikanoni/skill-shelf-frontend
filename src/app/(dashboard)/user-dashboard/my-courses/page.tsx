import type { Metadata } from "next";
import MyCoursesPage from "@/components/pages/userDashboard/myCourses/MyCoursesPage";

export const metadata: Metadata = {
  title: "My Courses",
  description: "View your enrolled courses and continue learning on SkillShelf",
};

export default function MyCourses() {
  return (
    <div>
      <MyCoursesPage />
    </div>
  );
}

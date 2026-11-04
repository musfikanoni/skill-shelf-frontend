import type { Metadata } from "next";
import CoursesPage from "@/components/pages/adminDashboard/courses/CoursesPage";

export const metadata: Metadata = {
  title: "Manage Courses",
  description: "Create, edit milestones, and upload video lessons for courses",
};

export default function Courses() {
  return (
    <div>
      <CoursesPage />
    </div>
  );
}

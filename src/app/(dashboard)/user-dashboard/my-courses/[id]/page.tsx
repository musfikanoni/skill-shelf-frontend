import type { Metadata } from "next";
import CourseLearningPage from "@/components/pages/userDashboard/myCourses/CourseLearningPage";

export const metadata: Metadata = {
  title: "Course Classroom",
  description: "Watch course video lessons, track progress, and learn new skills",
};

export default function CourseLearning() {
  return <CourseLearningPage />;
}

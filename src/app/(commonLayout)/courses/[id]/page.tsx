import type { Metadata } from "next";
import CourseDetails from "@/components/pages/productsPage/CourseDetails";

export const metadata: Metadata = {
  title: "Course Details",
  description: "Learn more about this online course and start your learning journey",
};

const CourseDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return (
    <div>
      <CourseDetails id={id} />
    </div>
  );
};

export default CourseDetailsPage;

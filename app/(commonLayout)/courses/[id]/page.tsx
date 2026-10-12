
import CourseDetails from "@/components/productsPage/CourseDetails";

const CourseDetailsPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <div>
      {/* <PageHeader
        icon={
          <Image
            src="/images/pageHeaderImg/courseImg.png"
            alt="course"
            width={40}
            height={40}
          />
        }
        title="Course Details"
        description="Learn more about this course and start your journey"
      /> */}

      <CourseDetails id={id} />

    </div >
  )
}

export default CourseDetailsPage

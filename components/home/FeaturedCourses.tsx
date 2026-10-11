"use client";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCoursesQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import SectionHeader from "../shared/sectionHeader/SectionHeader";



function BookIcon({ size = "md" }: { size?: "sm" | "md" }) {
  const s = size === "sm" ? 12 : 14;
  return (
    <svg
      width={s}
      height={s}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function StarRating({
  rating,
  reviews,
  size = "md",
}: {
  rating: number;
  reviews: number;
  size?: "sm" | "md";
}) {
  const fullStars = Math.floor(rating);
  const starSize = size === "sm" ? "text-[10px]" : "text-xs";
  const textSize = size === "sm" ? "text-[10px]" : "text-xs";

  return (
    <div className="flex items-center gap-1 mb-2">
      <div className={`flex items-center gap-0.5 ${starSize} text-yellow-400`}>
        {Array(fullStars)
          .fill("★")
          .map((s, i) => (
            <span key={i}>{s}</span>
          ))}
        {rating % 1 !== 0 && <span>★</span>}
      </div>
      <span className={`${textSize} text-gray-400`}>
        {rating} ({reviews})
      </span>
    </div>
  );
}

// --- Main Component ---

export default function FeaturedCourses() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: coursesData, isLoading, error } = useGetCoursesQuery({});

  const handleViewDetails = (id: string) => {
    router.push(`/courses/${id}`);
  };

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[550px] rounded-3xl" />
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="aspect-square rounded-3xl" />
              <Skeleton className="aspect-square rounded-3xl" />
            </div>
            <Skeleton className="h-[250px] rounded-3xl" />
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-16 px-4 text-center">
        <p className="text-red-500 font-bold">
          Failed to load courses. Please try again later.
        </p>
      </section>
    );
  }

  const courses = coursesData?.data || [];
  if (courses.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 px-4">
      {pathName === "/" && (
        <SectionHeader
          badge="🌿 Learn & Grow"
          title="Featured Course"
          description="Master digital skills with expert-led training"
        />
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Large Card (Left) */}
        {courses[0] && (
          <div 
            onClick={() => handleViewDetails(courses[0]._id)}
            className="relative rounded-3xl overflow-hidden group cursor-pointer h-full min-h-[550px] flex flex-col shadow-xl"
          >
            <img
              src={courses[0].thumbnail}
              alt={courses[0].title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            <span className="absolute top-6 left-6 bg-purple-600 text-white text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full">
              {courses[0].category?.name || "COURSE"}
            </span>

            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-3xl font-bold mb-2">{courses[0].title}</h3>
              <p className="text-gray-300 mb-4 max-w-md line-clamp-2">
                {courses[0].description.replace(/"/g, "")}
              </p>
              <StarRating
                rating={courses[0].averageRating}
                reviews={courses[0].totalReviews}
              />
              <div className="border-t border-white/20 mt-4 pt-4 flex items-center justify-between text-sm mb-6">
                <span className="flex items-center gap-2">
                  <BookIcon /> {courses[0].lessons || 12} lessons
                </span>
                <span>{courses[0].hours || 6} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-black text-yellow-400">
                  ${courses[0].price}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(courses[0]._id);
                  }}
                  className="bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-black px-6 py-2 rounded-md transition-all active:scale-95 uppercase text-sm"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Right Side Column */}
        <div className="flex flex-col gap-6">
          {/* Two Small Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.slice(1, 3).map((course: any) => (
              <div
                key={course._id}
                onClick={() => handleViewDetails(course._id)}
                className="relative rounded-3xl overflow-hidden group cursor-pointer aspect-square shadow-lg"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                  {course.category?.name || "COURSE"}
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">
                    {course.title}
                  </h3>
                  <StarRating
                    rating={course.averageRating}
                    reviews={course.totalReviews}
                    size="sm"
                  />
                  <div className="border-t border-white/20 mt-3 pt-3 flex items-center justify-between text-[11px] mb-4">
                    <span className="flex items-center gap-1">
                      <BookIcon size="sm" /> {course.lessons || 8} lessons
                    </span>
                    <span>{course.hours || 4}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-yellow-400">
                      ${course.price}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(course._id);
                      }}
                      className="bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-bold text-[10px] px-4 py-2 rounded-md uppercase"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Wide Card */}
          {courses[3] && (
            <div 
              onClick={() => handleViewDetails(courses[3]._id)}
              className="relative rounded-3xl overflow-hidden group cursor-pointer flex-1 min-h-[250px] shadow-lg"
            >
              <img
                src={courses[3].thumbnail}
                alt={courses[3].title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

              <span className="absolute top-4 left-4 bg-purple-600 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                {courses[3].category?.name || "COURSE"}
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{courses[3].title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-1">
                  {courses[3].description.replace(/"/g, "")}
                </p>
                <div className="border-t border-white/20 mt-4 pt-4 flex items-center justify-between text-sm mb-4">
                  <div className="flex gap-6">
                    <span className="flex items-center gap-2">
                      <BookIcon /> {courses[3].lessons || 24} lessons
                    </span>
                    <span>{courses[3].hours || 10} hours</span>
                  </div>
                  <StarRating
                    rating={courses[3].averageRating}
                    reviews={courses[3].totalReviews}
                    size="sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-yellow-400">
                    ${courses[3].price}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(courses[3]._id);
                    }}
                    className="bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-black px-6 py-2 rounded-md transition-all active:scale-95 uppercase text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
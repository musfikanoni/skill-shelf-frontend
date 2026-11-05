"use client";

import {
  Briefcase,
  Target,
  Mail,
  Share2,
  PenTool,
  Code,
  Smartphone,
  Globe,
} from "lucide-react";
import { useGetCategoriesQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { isProductCategory } from "@/constants/productCategory";

const BrowseCategory = () => {
  const router = useRouter();
  const { data: categoryData, isLoading, error } = useGetCategoriesQuery({});

  if (isLoading) {
    return (
      <section className="bg-[#f5f6f7] py-16">
        <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
          <div className="h-9 w-64 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
          <div className="h-4 w-80 max-w-full bg-gray-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="flex flex-wrap justify-center items-center gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-[calc(50%-8px)] sm:w-44 md:w-48 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col items-center gap-3 animate-pulse"
              >
                <div className="w-12 h-12 rounded-full bg-gray-200" />
                <div className="h-4 w-20 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  const iconPool = [
    Briefcase,
    Target,
    Mail,
    Share2,
    PenTool,
    Code,
    Smartphone,
    Globe,
  ];
  const colorPool = [
    { bg: "bg-blue-100", color: "text-blue-600" },
    { bg: "bg-purple-100", color: "text-purple-600" },
    { bg: "bg-green-100", color: "text-green-600" },
    { bg: "bg-gray-100", color: "text-gray-600" },
    { bg: "bg-orange-100", color: "text-orange-500" },
    { bg: "bg-teal-100", color: "text-teal-600" },
  ];

  const rawCategories = (
    Array.isArray(categoryData?.data)
      ? categoryData.data
      : categoryData?.data?.data || []
  );

  const courseCategories = rawCategories.filter(
    (cat: any) => !isProductCategory(cat)
  );

  const categories = courseCategories.map((cat: any, index: number) => ({
    id: cat._id,
    name: cat.name,
    image: cat.image,
    icon: iconPool[index % iconPool.length],
    ...colorPool[index % colorPool.length],
  }));

  return (
    <section className="bg-[#f5f6f7] py-16">
      <div className="max-w-6xl mx-auto px-4 lg:px-0 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
          Browse by Category
        </h2>
        <p className="text-gray-500 mt-2">
          Explore our expert-led courses across popular categories
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 mt-10">
          {categories.map((cat: any) => {
            const Icon = cat.icon;

            return (
              <div
                key={cat.id}
                onClick={() => router.push(`/courses?category=${cat.id}`)}
                className="w-[calc(50%-8px)] sm:w-44 md:w-48 bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-full ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform overflow-hidden`}
                >
                  {cat.image ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className="w-6 h-6" />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-gray-700 group-hover:text-black text-center">
                  {cat.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default BrowseCategory;

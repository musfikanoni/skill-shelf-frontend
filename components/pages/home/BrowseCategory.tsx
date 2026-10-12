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
import PageLoading from "../../Others/Loading";
import Image from "next/image";

const BrowseCategory = () => {
  const { data: categoryData, isLoading, error } = useGetCategoriesQuery({});

  if (isLoading) {
    return (
      <PageLoading
        title="Loading Categories"
        message="Organizing our collections for you..."
      />
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

  const categories = (
    Array.isArray(categoryData?.data)
      ? categoryData.data
      : categoryData?.data?.data || []
  ).map((cat: any, index: number) => ({
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
          Find the perfect products for your niche
        </p>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {categories.map((item: any, index: number) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id || index}
                className="bg-white border border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center hover:shadow-md transition cursor-pointer group w-[calc(50%-12px)] sm:w-40 md:w-44 lg:w-44"
              >
                <div
                  className={`w-16 h-16 flex items-center justify-center rounded-xl overflow-hidden mb-4 ${item.bg} group-hover:scale-105 transition-transform duration-300`}
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Icon className={`w-8 h-8 ${item.color}`} />
                  )}
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.name}
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

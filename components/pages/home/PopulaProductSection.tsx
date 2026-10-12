"use client";
import { Flame, Palette, Rocket } from "lucide-react";
import SecondaryButton from "../../shared/secondaryButton/SecondaryButton";
import { IoIosArrowRoundForward } from "react-icons/io";
import SectionHeader from "../../shared/sectionHeader/SectionHeader";
import { usePathname, useRouter } from "next/navigation";
import { useGetBundlesQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import PageLoading from "../../Others/Loading";

// Types for our Bundle data
interface Bundle {
  id: string;
  badge: {
    text: string;
    icon: React.ReactNode;
    colorClass: string;
  };
  sideLabel?: {
    text: string;
    colorClass: string;
  };
  title: string;
  description: string;
  tags: string[];
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  savings: number;
  buttonColor: string;
}

export default function PopulaProductSection() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: bundlesData, isLoading, error } = useGetBundlesQuery({});

  if (isLoading) {
    return (
      <PageLoading
        title="Loading Bundles"
        message="Curating our best value packages..."
      />
    );
  }

  if (error) {
    return null;
  }

  const bundles = (bundlesData?.data || []).map(
    (bundle: any, index: number) => {
      const badges = [
        {
          text: "TOP BUNDLE — EXCLUSIVE",
          icon: <Flame className="w-4 h-4" />,
          colorClass: "text-orange-500",
        },
        {
          text: "CREATOR BUNDLE",
          icon: <Palette className="w-4 h-4" />,
          colorClass: "text-orange-400",
        },
        {
          text: "BEGINNER STARTER PACK",
          icon: <Rocket className="w-4 h-4" />,
          colorClass: "text-teal-500",
        },
      ];

      const sideLabels = [
        { text: "BEST VALUE", colorClass: "bg-orange-500" },
        { text: "CREATOR", colorClass: "bg-purple-600" },
        { text: "STARTER", colorClass: "bg-teal-500" },
      ];

      const currentPrice = bundle.price || 0;
      const originalPrice =
        bundle.products?.reduce((acc: number, prod: any) => {
          const price =
            typeof prod.price === "number"
              ? prod.price
              : prod.price?.basic || 0;
          return acc + price;
        }, 0) || currentPrice * 1.5;

      const savings = Math.max(0, originalPrice - currentPrice);
      const discountPercent =
        originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

      return {
        id: bundle._id,
        title: bundle.name,
        description: bundle.description,
        tags: bundle.products?.map((p: any) => p.name) || [],
        originalPrice,
        currentPrice,
        savings,
        discountPercent,
        badge: badges[index % badges.length],
        sideLabel: sideLabels[index % sideLabels.length],
      };
    },
  );

  return (
    <section className="bg-white py-16 px-4 font-sans">
      {pathName == "/" && (
        <SectionHeader
          badge="🎁 BUNDLE & SAVE"
          title="Popular Product Bundles"
          description="Get more value with our curated bundles — built to give you everything you need in one click."
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {bundles.map((bundle: any) => (
          <div
            key={bundle.id}
            className="relative border border-gray-200 rounded-3xl p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-8 overflow-hidden"
          >
            {bundle.sideLabel && (
              <div
                className={`absolute left-0 h-24 w-8 rounded-sm top-1/2 -translate-y-1/2 flex items-center justify-center ${bundle.sideLabel.colorClass}`}
              >
                <span className="text-white text-[10px] font-bold tracking-widest uppercase -rotate-90 whitespace-nowrap">
                  {bundle.sideLabel.text}
                </span>
              </div>
            )}

            <div className={`${bundle.sideLabel ? "pl-6" : ""} flex-1`}>
              <div
                className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${bundle.badge.colorClass}`}
              >
                {bundle.badge.icon}
                {bundle.badge.text}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {bundle.title}
              </h3>

              <p className="text-gray-400 mb-6 text-sm md:text-base font-medium">
                {bundle.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {bundle.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-purple-50 text-purple-600 px-3 py-1 rounded-md text-xs font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end justify-between min-w-[200px]">
              <div className="text-right">
                <p className="text-gray-400 text-sm line-through">
                  ${bundle.originalPrice.toFixed(0)} individually
                </p>
                <p className="text-4xl font-black text-gray-900">
                  ${bundle.currentPrice}
                </p>
                <div className="mt-2 bg-green-50 text-green-500 text-[11px] font-bold px-2 py-1 rounded-md border border-green-100">
                  You save ${bundle.savings.toFixed(0)} (
                  {bundle.discountPercent}% OFF)
                </div>
              </div>
              <div className="flex justify-center items-center">
                <SecondaryButton
                  label="VIEW BUNDLE"
                  onClick={() => router.push(`/bundles/${bundle.id}`)}
                  icon={IoIosArrowRoundForward}
                  iconPosition="right"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

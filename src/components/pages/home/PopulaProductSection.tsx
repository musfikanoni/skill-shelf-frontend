"use client";
import { Flame, Palette, Rocket, BookOpen, Package } from "lucide-react";
import SecondaryButton from "../../shared/secondaryButton/SecondaryButton";
import { IoIosArrowRoundForward } from "react-icons/io";
import SectionHeader from "../../shared/sectionHeader/SectionHeader";
import { usePathname, useRouter } from "next/navigation";
import { useGetBundlesQuery } from "@/redux/api/landingPageApi/LandingPageApi";

// Types for our Bundle data
interface BundleItem {
  name: string;
  type: "product" | "course";
  price: number;
}

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
  items: BundleItem[];
  originalPrice: number;
  currentPrice: number;
  discountPercent: number;
  savings: number;
  buttonColor?: string;
}

export default function PopulaProductSection() {
  const pathName = usePathname();
  const router = useRouter();
  const { data: bundlesData, isLoading, error } = useGetBundlesQuery({});

  if (isLoading) {
    return (
      <section className="bg-white py-16 px-4 font-sans">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <div className="h-6 w-36 bg-amber-100/70 rounded-full mx-auto mb-3 animate-pulse" />
            <div className="h-9 w-72 bg-gray-200 rounded-lg mx-auto mb-2 animate-pulse" />
            <div className="h-4 w-96 max-w-full bg-gray-200 rounded mx-auto animate-pulse" />
          </div>
          {[1, 2].map((i) => (
            <div
              key={i}
              className="border border-gray-100 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs flex flex-col md:flex-row justify-between gap-6 animate-pulse"
            >
              <div className="flex-1 space-y-4">
                <div className="h-4 w-40 bg-orange-100 rounded" />
                <div className="h-7 w-64 bg-gray-200 rounded-lg" />
                <div className="h-4 w-4/5 bg-gray-200 rounded" />
                <div className="flex flex-wrap gap-2 pt-2">
                  <div className="h-7 w-28 bg-gray-100 rounded-lg" />
                  <div className="h-7 w-32 bg-gray-100 rounded-lg" />
                  <div className="h-7 w-24 bg-gray-100 rounded-lg" />
                </div>
              </div>
              <div className="md:w-64 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6 space-y-4">
                <div className="h-8 w-32 bg-gray-200 rounded" />
                <div className="h-12 w-full bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return null;
  }

  const bundles: Bundle[] = (bundlesData?.data || []).map(
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
          colorClass: "text-purple-600",
        },
        {
          text: "GROWTH BUNDLE",
          icon: <Rocket className="w-4 h-4" />,
          colorClass: "text-blue-600",
        },
      ];

      const sideLabels = [
        { text: "TOP BUNDLE", colorClass: "bg-red-500" },
        { text: "CREATOR", colorClass: "bg-purple-600" },
        { text: "GROWTH", colorClass: "bg-blue-600" },
      ];

      const currentPrice = Number(bundle.price) || 0;

      // Extract products and courses with their names, types, and prices
      const productItems: BundleItem[] = (bundle.products || []).map(
        (p: any) => ({
          name: p.name || "Product",
          type: "product" as const,
          price:
            typeof p.price === "number" ? p.price : Number(p.price?.basic) || 0,
        })
      );

      const courseItems: BundleItem[] = (bundle.courses || []).map(
        (c: any) => ({
          name: c.title || "Course",
          type: "course" as const,
          price: Number(c.price) || 0,
        })
      );

      // Combined items (both products and courses)
      const allItems = [...productItems, ...courseItems];

      // Sum all individual item prices (both courses and products)
      const sumIndividualPrices = allItems.reduce(
        (acc: number, item: BundleItem) => acc + (Number(item.price) || 0),
        0
      );

      // Determine true original price based on individual items sum
      const originalPrice =
        sumIndividualPrices > currentPrice
          ? sumIndividualPrices
          : sumIndividualPrices > 0
          ? Math.round(currentPrice * 1.3)
          : Math.round(currentPrice * 1.5);

      const savings = Math.max(0, originalPrice - currentPrice);
      const discountPercent =
        originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

      return {
        id: bundle._id,
        title: bundle.name,
        description: bundle.description,
        items: allItems,
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
        {bundles.map((bundle: Bundle) => (
          <div
            key={bundle.id}
            className="relative border border-gray-200 rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between gap-6 md:gap-8 overflow-hidden"
          >
            {bundle.sideLabel && (
              <div
                className={`absolute left-0 h-24 w-8 rounded-sm top-1/2 -translate-y-1/2 hidden sm:flex items-center justify-center ${bundle.sideLabel.colorClass}`}
              >
                <span className="text-white text-[10px] font-bold tracking-widest uppercase -rotate-90 whitespace-nowrap">
                  {bundle.sideLabel.text}
                </span>
              </div>
            )}

            <div className={`${bundle.sideLabel ? "sm:pl-6" : ""} flex-1`}>
              <div
                className={`flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider ${bundle.badge.colorClass}`}
              >
                {bundle.badge.icon}
                {bundle.badge.text}
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                {bundle.title}
              </h3>

              <p className="text-gray-400 mb-6 text-sm md:text-base font-medium">
                {bundle.description}
              </p>

              {/* Items / Badges (both courses and products) */}
              <div className="flex flex-wrap gap-2">
                {bundle.items.map((item: BundleItem, i: number) => (
                  <span
                    key={`${item.name}-${i}`}
                    className="bg-purple-50 text-[#6C3FC5] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-purple-100/60"
                  >
                    {item.type === "course" ? (
                      <BookOpen className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                    ) : (
                      <Package className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                    )}
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end justify-between min-w-0 md:min-w-[200px] border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
              <div className="text-left md:text-right">
                <p className="text-gray-400 text-sm line-through">
                  ${bundle.originalPrice.toFixed(0)} individually
                </p>
                <p className="text-3xl sm:text-4xl font-black text-gray-900">
                  ${bundle.currentPrice}
                </p>
                <div className="mt-2 bg-green-50 text-green-600 text-[11px] font-bold px-2.5 py-1 rounded-md border border-green-100 inline-block">
                  You save ${bundle.savings.toFixed(0)} (
                  {bundle.discountPercent}% OFF)
                </div>
              </div>
              <div className="flex justify-start md:justify-center items-center mt-4 w-full md:w-auto">
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

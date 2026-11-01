
"use client";

import { Star, CheckCircle2, User } from "lucide-react";
import { useGetReviewsQuery } from "@/redux/api/landingPageApi/LandingPageApi";
import PageLoading from "../../Others/Loading";
import Image from "next/image";

interface Testimonial {
  name: string;
  role: string;
  image: string | null;
  rating: number;
  text: string;
  verified: boolean;
}

export default function OurCustomer() {
  const { data: reviewsData, isLoading, error } = useGetReviewsQuery({});

  if (isLoading) {
    return (
      <PageLoading
        title="Loading Reviews"
        message="Hearing from our amazing community..."
      />
    );
  }

  if (error) return null;

  const roles = ["User"];

  const testimonials: Testimonial[] = (reviewsData?.data || []).map(
    (review: any, index: number) => {
      return {
        name: review.user?.name || "Anonymous User",
        role: roles[index % roles.length],
        image: review.user?.photo || null,
        rating: Math.min(5, Math.max(0, Math.round(review.rating || 5))),
        text:
          review.comment ||
          "Great products and excellent service! Highly recommended for digital entrepreneurs.",
        verified: true,
      };
    }
  );

  return (
    <div className="bg-white py-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 bg-[#f3e8ff] rounded-md px-4 py-1.5 border border-purple-100">
            <span className="text-yellow-400 text-sm">⭐</span>
            <span className="font-bold text-[#7c3aed] text-xs sm:text-sm tracking-wide">
              4.9/5.0 RATING FROM 10,000+ CUSTOMERS
            </span>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#111827] mb-4 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-xl text-[#64748b]">
            Real success stories from digital entrepreneurs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-[#f8fafc]/50 rounded-2xl p-8 border border-slate-200 flex flex-col shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="relative w-12 h-12 shrink-0 overflow-hidden rounded-full border-2 border-purple-200 bg-purple-50 flex items-center justify-center">
                  {t.image ? (
                    <Image
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-purple-500" />
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-[#0f172a] text-sm">
                    {t.name}
                  </h4>
                  <p className="text-[#64748b] text-[11px] font-medium uppercase tracking-wider">
                    {t.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]"
                  />
                ))}
              </div>

              <p className="text-[#334155] text-sm leading-relaxed mb-8 flex-grow">
                &quot;{t.text}&quot;
              </p>

              <div className="h-[1px] bg-slate-200 w-full mb-4" />

              {t.verified && (
                <div className="flex items-center gap-2 text-[#22c55e]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-xs font-semibold text-[#64748b]">
                    Verified Purchase
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

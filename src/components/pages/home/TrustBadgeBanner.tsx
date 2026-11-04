"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function TrustBadgeBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="relative w-full overflow-hidden border-y py-8 sm:py-10 md:py-14"
      style={{
        background: "linear-gradient(135deg, #0a0d1a 0%, #0d1228 40%, #0a0f20 70%, #080b18 100%)",
        borderColor: "rgba(212,175,55,0.2)",
        fontFamily: "'Barlow', sans-serif",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 80% at 15% 50%, rgba(212,175,55,0.05) 0%, transparent 60%), radial-gradient(ellipse 40% 60% at 85% 50%, rgba(212,175,55,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-around gap-6 md:gap-8">
          
          {/* ── Section 1: Premium Quality ── */}
          <div
            className={`flex items-center gap-4 sm:gap-5 w-full max-w-[320px] md:max-w-none md:w-auto transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
          >
            <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] shrink-0 flex items-center justify-center">
              <Image
                src="/images/trustBadgeBanner/quality.png"
                alt="Warranty Badge"
                width={140}
                height={140}
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,197,24,0.3)]"
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <p className="text-[17px] font-bold text-gray-100 whitespace-nowrap">
                Trusted by Thousands
              </p>
              <div className="flex gap-0.5 my-0.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="text-lg text-[#f5c518] leading-none"
                    style={{
                      textShadow: "0 0 10px rgba(245,197,24,0.7)",
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[13px] text-gray-400 font-medium">
                4.9/5 Average Rating
              </p>
            </div>
          </div>

          {/* Divider 1 */}
          <div className="w-full max-w-[320px] h-px bg-amber-500/20 md:hidden" />
          <div className="hidden md:block h-20 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

          {/* ── Section 2: 30-Day Money Back ── */}
          <div
            className={`flex items-center gap-4 sm:gap-5 w-full max-w-[320px] md:max-w-none md:w-auto transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "120ms" }}
          >
            <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] shrink-0 flex items-center justify-center">
              <Image
                src="/images/trustBadgeBanner/guaranty.png"
                alt="Warranty Badge"
                width={140}
                height={140}
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,197,24,0.3)]"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[18px] font-bold leading-snug text-gray-100">30-Day</p>
              <p className="text-[18px] font-bold leading-snug text-gray-100">Money Back</p>
              <p className="text-[18px] font-bold leading-snug text-gray-100">Guarantee</p>
            </div>
          </div>

          {/* Divider 2 */}
          <div className="w-full max-w-[320px] h-px bg-amber-500/20 md:hidden" />
          <div className="hidden md:block h-20 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

          {/* ── Section 3: Secure Checkout ── */}
          <div
            className={`flex items-center gap-4 sm:gap-5 w-full max-w-[320px] md:max-w-none md:w-auto transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            }`}
            style={{ transitionDelay: "240ms" }}
          >
            <div className="w-[100px] h-[100px] sm:w-[110px] sm:h-[110px] md:w-[140px] md:h-[140px] shrink-0 flex items-center justify-center">
              <Image
                src="/images/trustBadgeBanner/secure.png"
                alt="Secure Badge"
                width={140}
                height={140}
                className="w-full h-full object-contain drop-shadow-[0_0_12px_rgba(245,197,24,0.3)]"
              />
            </div>

            <div className="flex flex-col">
              <p className="text-[17px] font-bold tracking-wider text-gray-100 whitespace-nowrap">
                100% SECURE
              </p>
              <p className="text-[17px] font-bold tracking-wider text-gray-100">
                CHECKOUT
              </p>
              <div className="mt-2 flex items-center gap-2">
                {/* Visa */}
                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-xs">
                  <span className="text-[13px] font-extrabold italic" style={{ color: "#1a1f71" }}>
                    VISA
                  </span>
                </div>

                {/* Mastercard */}
                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-xs">
                  <div className="flex">
                    <div className="h-[18px] w-[18px] rounded-full" style={{ background: "#eb001b" }} />
                    <div
                      className="h-[18px] w-[18px] -ml-2 rounded-full"
                      style={{ background: "#f79e1b", opacity: 0.92 }}
                    />
                  </div>
                </div>

                {/* PayPal */}
                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-xs">
                  <span className="text-[12px] font-extrabold" style={{ color: "#253b80" }}>
                    Pay
                  </span>
                  <span className="text-[12px] font-extrabold" style={{ color: "#179bd7" }}>
                    Pal
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

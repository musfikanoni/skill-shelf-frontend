
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
    <>
      <div
        className="relative w-full overflow-hidden border-y py-[60px]"
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

        <div className="relative z-10 mx-auto flex max-w-6xl flex-wrap items-center justify-around gap-6 px-6 py-5">

          {/* ── Section 1: Premium Quality ── */}
          <div
            className={`flex items-center gap-4 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
          >
            <Image className="w-[120px] h-[120px] md:w-[160px] md:h-[160px]"
              src="/images/trustBadgeBanner/quality.png"
              alt="Warranty Badge"
              width={180}
              height={180}
            />

            <div className="flex flex-col gap-[2px]">
              <p className="text-[17px] font-bold text-gray-100">Trusted by Thousands</p>
              <div className="flex gap-[2px]">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className="text-xl"
                    style={{
                      color: "#f5c518",
                      textShadow: "0 0 10px rgba(245,197,24,0.7)",
                      animation: "starPulse 2s ease-in-out infinite",
                      animationDelay: `${i * 0.1}s`,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="text-[13px]" style={{ color: "rgba(200,200,220,0.65)" }}>
                4.9/5 Average Rating
              </p>
            </div>
          </div>

          <div
            className="hidden h-20 w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4) 20%, rgba(212,175,55,0.4) 80%, transparent)",
            }}
          />

          {/* ── Section 2: 30-Day Money Back ── */}
          <div
            className={`flex items-center gap-4 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            style={{ transitionDelay: "120ms" }}
          >
            <Image className="w-[120px] h-[120px] md:w-[150px] md:h-[150px]"
              src="/images/trustBadgeBanner/guaranty.png"
              alt="Warranty Badge"
              width={150}
              height={150}
            />

            <div className="flex flex-col gap-[1px]">
              <p className="text-[18px] font-bold leading-snug text-gray-100">30-Day</p>
              <p className="text-[18px] font-bold leading-snug text-gray-100">Money Back</p>
              <p className="text-[18px] font-bold leading-snug text-gray-100">Guarantee</p>
            </div>
          </div>
          <div
            className="hidden h-20 w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(212,175,55,0.4) 20%, rgba(212,175,55,0.4) 80%, transparent)",
            }}
          />

          {/* ── Section 3: Secure Checkout ── */}
          <div
            className={`flex items-center gap-4 transition-all duration-500 ${visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
            style={{ transitionDelay: "240ms" }}
          >
            <Image className="w-[100px] h-[100px] md:w-[150px] md:h-[150px]"
              src="/images/trustBadgeBanner/secure.png"
              alt="Warranty Badge"
              width={130}
              height={130}
            />

            <div>
              <p className="text-[17px] font-bold tracking-wider text-gray-100">100% SECURE</p>
              <p className="text-[17px] font-bold tracking-wider text-gray-100">CHECKOUT</p>
              <div className="mt-2 flex items-center gap-2">
                {/* Visa */}
                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-lg">
                  <span className="text-[13px] font-extrabold italic" style={{ color: "#1a1f71" }}>
                    VISA
                  </span>
                </div>

                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-lg">
                  <div className="flex">
                    <div className="h-[18px] w-[18px] rounded-full" style={{ background: "#eb001b" }} />
                    <div className="h-[18px] w-[18px] -ml-2 rounded-full" style={{ background: "#f79e1b", opacity: 0.92 }} />
                  </div>
                </div>

                {/* PayPal */}
                <div className="flex h-7 items-center justify-center rounded bg-white px-2 shadow-lg">
                  <span className="text-[12px] font-extrabold" style={{ color: "#253b80" }}>Pay</span>
                  <span className="text-[12px] font-extrabold" style={{ color: "#179bd7" }}>Pal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes medalGlow {
            0%, 100% { box-shadow: 0 0 24px rgba(212,175,55,0.35), 0 4px 16px rgba(0,0,0,0.6); }
            50%       { box-shadow: 0 0 40px rgba(212,175,55,0.65), 0 4px 22px rgba(0,0,0,0.7); }
          }
          @keyframes starPulse {
            0%, 100% { text-shadow: 0 0 8px rgba(245,197,24,0.6); }
            50%       { text-shadow: 0 0 18px rgba(245,197,24,1); }
          }
          @keyframes shieldFloat {
            0%, 100% { transform: translateY(0);  }
            50%       { transform: translateY(-4px); }
          }
        `}</style>
      </div>
    </>
  );
}
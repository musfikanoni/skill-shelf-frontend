"use client";

import React, { useEffect, useRef, useState } from "react";

interface StatItem {
  value: number;
  label: string;
}

const CountUpNumber = ({ target, isLarge }: { target: number; isLarge: boolean }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const duration = 1800;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(ease * target);
            setCount(current);

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {isLarge ? count.toLocaleString() : count}
    </span>
  );
};

const StatsSection = () => {
  const stats: StatItem[] = [
    { value: 30000, label: "Happy Business Owners" },
    { value: 12, label: "Years in the Game" },
    { value: 35, label: "Countries Reached" },
  ];

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1138px] mx-auto px-4 md:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center relative px-4 md:px-8 py-6 md:py-0 animate-fadeUp"
              style={{
                animationDelay: `${index * 0.15}s`,
              }}
            >
              {/* Divider */}
              {index !== stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
              )}

              {/* Number */}
              <div className="flex items-start justify-center gap-1">
                <span className="text-4xl md:text-6xl font-bold text-gray-900 leading-none">
                  <CountUpNumber target={stat.value} isLarge={stat.value >= 1000} />
                </span>
                <span className="text-2xl md:text-4xl font-medium text-amber-600 pt-2">+</span>
              </div>

              {/* Label */}
              <p className="mt-4 text-sm md:text-base text-gray-600 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeUp {
          animation: fadeUp 0.6s ease-out forwards;
          opacity: 0;
        }

        @media (hover: hover) {
          div:hover {
            transform: translateY(-4px);
            transition: transform 0.3s ease;
          }

          div:hover .text-amber-600 {
            color: rgb(17, 24, 39);
          }

          div:hover .text-gray-900 {
            color: rgb(217, 119, 6);
          }
        }
      `}</style>
    </section>
  );
};

export default StatsSection;
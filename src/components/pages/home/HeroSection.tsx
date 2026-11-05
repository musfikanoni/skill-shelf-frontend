"use client";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";
import Image from "next/image";
import heroBgColor from "@/assets/images/home/herobg.png";

const HeroSection = () => {
  const router = useRouter();

  const exploreProducts = (type: "products" | "courses") => {
    router.push(`/${type}`);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src={heroBgColor}
          alt="hero"
          fill
          priority
          sizes="100vw"
          quality={85}
          className="w-full h-full object-cover object-right"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-12 pt-24 sm:pt-28 md:pt-32 pb-16 flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#201212] backdrop-blur-md px-4 py-1.5 rounded-full text-xs sm:text-sm text-yellow-400 font-medium border border-white/10 shadow-xs">
            ✨ Trusted by 10,000+ Digital Entrepreneurs
          </div>

          <h1 className="text-white font-extrabold text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight uppercase">
            Discover Premium <br />
            Digital Products & <br />
            <span className="text-yellow-400">Online Courses</span>
          </h1>

          <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
            Access hundreds of ready-to-use digital products, templates, and
            expert-led courses designed to help you grow your business faster.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-gray-300">
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md whitespace-nowrap">
              🔒 SSL SECURED
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md whitespace-nowrap">
              ↩️ 30-DAY MONEY BACK
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md whitespace-nowrap">
              ⬇️ INSTANT DOWNLOAD
            </span>
            <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md whitespace-nowrap">
              ⏱️ ONE-TIME PAYMENT
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => exploreProducts("products")}
              className="flex items-center justify-center gap-2 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-extrabold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all active:scale-95 shadow-lg shadow-yellow-500/20 hover:brightness-105 cursor-pointer w-full sm:w-auto"
            >
              <span>Explore Products</span>
              <IoIosArrowRoundForward className="text-2xl" />
            </button>

            <button
              onClick={() => exploreProducts("courses")}
              className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#6C3FC5] to-[#341E5F] text-white font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base uppercase tracking-wider hover:bg-purple-500 transition-all active:scale-95 shadow-lg shadow-purple-900/30 cursor-pointer w-full sm:w-auto"
            >
              Browse Courses
            </button>
          </div>

          {/* Social Proof */}
          <div className="flex items-center gap-3 pt-2 sm:pt-4">
            <div className="flex -space-x-2.5 shrink-0">
              <img
                src="/images/heroImg/User1.png"
                alt="user"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src="/images/heroImg/User2.png"
                alt="user"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src="/images/heroImg/User1.png"
                alt="user"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src="/images/heroImg/User2.png"
                alt="user"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src="/images/heroImg/User1.png"
                alt="user"
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-[#020617] object-cover"
              />
            </div>
            <span className="text-gray-300 text-xs sm:text-sm font-medium leading-tight">
              <strong className="text-white font-bold">30,000+</strong> happy Business Owners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

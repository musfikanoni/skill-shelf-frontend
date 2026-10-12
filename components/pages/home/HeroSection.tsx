"use client";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundForward } from "react-icons/io";
import SecondaryButton from "../../shared/secondaryButton/SecondaryButton";

const HeroSection = () => {
  const router = useRouter();

  const exploreProducts = (type: "products" | "courses") => {
    router.push(`/${type}`);
  };

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/heroImg/heroBgColor.png"
          alt="hero"
          className="w-full h-full object-cover object-right"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 px-6 lg:px-12 pt-32 flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#201212] backdrop-blur-md px-4 py-1.5 rounded-full text-sm text-yellow-400 font-medium border border-white/10">
            ✨ Trusted by 10,000+ Digital Entrepreneurs
          </div>

          <h1 className="text-white font-extrabold text-2xl md:text-4xl lg:text-6xl leading-tight uppercase">
            Discover Premium <br />
            Digital Products & <br />
            <span className="text-yellow-400">Online Courses</span>
          </h1>

          <p className="text-white text-base md:text-lg leading-relaxed">
            Access hundreds of ready-to-use digital products, templates, and
            expert-led courses designed to help you grow your business faster.
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
            <span>🔒 SSL SECURED</span>
            <span>|</span>
            <span>↩️ 30-DAY MONEY BACK</span>
            <span>|</span>
            <span>⬇️ INSTANT DOWNLOAD</span>
            <span>|</span>
            <span>⏱️ ONE-TIME PAYMENT</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <SecondaryButton
              label="Explore Products"
              onClick={() => exploreProducts("products")}
              icon={IoIosArrowRoundForward}
              iconPosition="right"
            />

            <button
              onClick={() => exploreProducts("courses")}
              className="bg-gradient-to-b from-[#6C3FC5] to-[#341E5F] text-white font-semibold px-6 py-3 rounded-md
             text-sm uppercase tracking-wide hover:bg-purple-500 transition cursor-pointer"
            >
              Browse Courses
            </button>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <div className="flex -space-x-3">
              <img
                src={`/images/heroImg/User1.png`}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src={`/images/heroImg/User2.png`}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src={`/images/heroImg/User1.png`}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src={`/images/heroImg/User2.png`}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-[#020617] object-cover"
              />
              <img
                src={`/images/heroImg/User1.png`}
                alt="user"
                className="w-8 h-8 rounded-full border-2 border-[#020617] object-cover"
              />
            </div>
            <span className="text-gray-300 text-sm">
              30,000+ happy Business Owners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

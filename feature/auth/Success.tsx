"use client";

import Link from "next/link";
import AuthBackground from "@/components/shared/auth/AuthBackground";

export default function Success() {
  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-8 md:p-12 rounded-2xl flex flex-col items-center">
        
        {/* Yellow Circle with Shield */}
        <div className="relative mb-8 mt-4">
          {/* Main yellow circle */}
          <div className="w-24 h-24 md:w-[100px] md:h-[100px] rounded-full bg-gradient-to-b from-[#F5C518] to-[#FF8C00] flex items-center justify-center shadow-[0_4px_14px_0_rgba(245,197,24,0.39)] relative z-10">
            {/* White Shield Icon */}
            <svg
              className="w-10 h-10 md:w-12 md:h-12 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm4.7 8.7l-5.7 5.7c-.4.4-1 .4-1.4 0l-2.6-2.6c-.4-.4-.4-1 0-1.4.4-.4 1-.4 1.4 0l1.9 1.9 5-5c.4-.4 1-.4 1.4 0 .4.4.4 1 0 1.4z" />
            </svg>
          </div>
          
          {/* Decorative yellow dots */}
          <div className="absolute top-[-5px] right-[-15px] w-2.5 h-2.5 bg-[#F5C518] rounded-full"></div>
          <div className="absolute top-[5px] left-[-20px] w-3 h-3 bg-[#F5C518] rounded-full"></div>
          <div className="absolute bottom-[-5px] left-[5px] w-2 h-2 bg-[#F5C518] rounded-full"></div>
          <div className="absolute bottom-[20px] right-[-25px] w-1.5 h-1.5 bg-[#F5C518] rounded-full"></div>
          <div className="absolute top-[-15px] left-[25px] w-1.5 h-1.5 bg-[#F5C518] rounded-full"></div>
          <div className="absolute bottom-[-15px] right-[10px] w-1 h-1 bg-[#F5C518] rounded-full"></div>
        </div>

        {/* Text content */}
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-[28px] font-bold text-[#2D2D2D] mb-3">
            Congratulations!
          </h1>
          <p className="text-[15px] md:text-[16px] text-[#6B7280]">
            You have successfully Sign Up .
          </p>
        </div>

        {/* Spinner */}
        <div className="mb-4">
          <div className="w-12 h-12 rounded-full animate-spin border-[4px] border-solid border-[#F5C518] border-t-transparent"></div>
        </div>
        <Link href="/">
        <button className="text-black rounded-lg bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] px-6 py-2 cursor-pointer">Go to Home</button>
        </Link>

      </div>
    </AuthBackground>
  );
}
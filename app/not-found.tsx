"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-6 text-white font-sans overflow-hidden relative"
      style={{
        background: "radial-gradient(ellipse at top left, #3b1a6e 0%, #1a0a3c 40%, #0f0626 100%)",
      }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full"></div>

      <div className="max-w-3xl w-full text-center relative z-10">
        
        {/* Animated 404 Header */}
        <div className="relative mb-4 flex items-center justify-center">
          <h1 
            className="text-[120px] md:text-[220px] font-black leading-none select-none tracking-tighter opacity-10 blur-[2px] absolute inset-0 flex items-center justify-center"
          >
            404
          </h1>
          <h1 
            className="text-[100px] md:text-[180px] font-black leading-none bg-clip-text text-transparent bg-gradient-to-b from-white via-gray-200 to-gray-500 animate-pulse relative z-20"
          >
            404
          </h1>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Lost in the Digital Void?
            </h2>
            <p className="text-lg md:text-xl text-purple-200/70 max-w-lg mx-auto font-medium">
              We couldn&apos;t find the page you&apos;re looking for. It might have been moved, deleted, or never existed in the first place.
            </p>
          </div>

          {/* Countdown Pill */}
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping"></span>
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
              Auto-returning in <span className="text-yellow-400 text-lg ml-1">{countdown}s</span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <button
              onClick={() => router.push("/")}
              className="cursor-pointer group flex items-center gap-3 px-8 py-4 bg-[linear-gradient(180deg,_#F5C518_50%,_#D73200_222.14%)] text-white rounded-2xl font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(245,197,24,0.3)]"
            >
              <Home size={22} className="group-hover:scale-110 transition-transform" />
              Return Home
            </button>

            <button
              onClick={() => router.back()}
              className="cursor-pointer group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-2xl font-black uppercase tracking-wider transition-all duration-300 hover:scale-[1.02] active:scale-95 backdrop-blur-sm"
            >
              <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
           <div className="flex items-center gap-4">
              <Image 
                src="/images/navbarImg/logo.png"
                alt="Logo"
                width={40}
                height={40}
                className="opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">MAXXMA DIGITAL</span>
           </div>
           <p className="text-xs text-gray-500">
             If you think this is a mistake, please reach out to our <a href="mailto:support@maxxma.com" className="text-purple-400 hover:text-purple-300 transition-colors">support team</a>.
           </p>
        </div>
      </div>
    </div>
  );
}
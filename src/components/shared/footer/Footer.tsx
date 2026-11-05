"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import footerLogo from "@/assets/images/logo.png";

export default function Footer() {
  const [email, setEmail] = useState("");
  // const [subscribed, setSubscribed] = useState(false);

  // const handleSubscribe = () => {
  //   if (email) {
  //     setSubscribed(true);
  //     setEmail("");
  //   }
  // };

  return (
    <div className="bg-[#0f0f1a] font-sans mt-12">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/footerImg/bgImg.png')",
          }}
        />

        {/* overlay */}
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-16 md:pt-20 pb-16 sm:pb-24 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left */}
          <div className="text-center lg:text-left max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 rounded-full px-4 py-1.5 mb-6">
              ✦ Earn up to 50% Commission
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-4">
              Join Our Affiliate Program
            </h2>

            <p className="text-[#FFFCF7] text-sm sm:text-base md:text-lg mb-8 leading-relaxed">
              Turn your audience into income. Earn generous commissions by
              promoting our premium digital products and expert-led courses!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                {
                  icon: "💰",
                  title: "50% Commission",
                  sub: "Earn on every sale",
                },
                {
                  icon: "🎯",
                  title: "High Converting",
                  sub: "Premium products that sell",
                },
                {
                  icon: "📊",
                  title: "Real-time Tracking",
                  sub: "Monitor your earnings",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white/8 backdrop-blur border border-white/10 rounded-xl py-3 px-3 text-center"
                >
                  <div className="text-2xl mb-1">{f.icon}</div>
                  <div className="text-white text-xs font-semibold">
                    {f.title}
                  </div>
                  <div className="text-white/70 text-[10px] mt-0.5">{f.sub}</div>
                </div>
              ))}
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link href="/affiliate">
                <button className="px-8 py-3 rounded-xl font-bold text-gray-900 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:shadow-[0_0_20px_rgba(245,197,24,0.4)] transition-all active:scale-95 text-sm sm:text-base cursor-pointer">
                  Join as Affiliate →
                </button>
              </Link>
            </div>
          </div>

          {/* Right image */}
          <div className="relative flex-shrink-0 hidden lg:flex">
            <img
              src="/images/footerImg/rightImg.png"
              alt="affiliate"
              className="w-full max-w-[420px] h-auto object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      <footer className="bg-[#0f0f1a] pt-12 sm:pt-14 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
            {/* Logo */}
            <div className="space-y-4">
              <Link href="/">
                <div className="flex items-center gap-1.5">
                  <Image
                    src={footerLogo}
                    width={44}
                    height={44}
                    alt="logo"
                    className="w-[32px] h-[32px] md:w-[48px] md:h-[48px]"
                  />
                  <p className="flex items-center leading-none">
                    <span className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#4F8EF7] to-[#7B3FE4] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
                      Skill
                    </span>
                    <span className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#FF8C00] to-[#F5C518] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
                      Shelf
                    </span>
                  </p>
                </div>
              </Link>

              <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                Discover top-tier course modules, digital books, and interactive
                learning tools designed to boost your professional career and
                personal growth.
              </p>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white font-semibold text-base sm:text-lg mb-4">
                Products
              </h4>
              <ul className="space-y-2.5">
                {[
                  { name: "Products", href: "/products" },
                  { name: "Online Courses", href: "/courses" },
                  { name: "Product Bundles", href: "/bundles" },
                  { name: "Membership Plans", href: "/membership" },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-amber-400 text-xs sm:text-sm transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold text-base sm:text-lg mb-4">Support</h4>
              <ul className="space-y-2.5">
                {[
                  "Contact Us",
                  "Refund Policy",
                  "Terms of Service",
                  "Privacy Policy",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-white/70 hover:text-amber-400 text-xs sm:text-sm transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-semibold text-base sm:text-lg mb-2">
                Stay Updated
              </h4>
              <p className="text-white/70 text-xs sm:text-sm mb-4">
                Get the latest products and special offers directly in your inbox.
              </p>
              {/* <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm rounded-lg px-3.5 py-2.5 outline-none focus:border-amber-400 transition"
                />
                <button
                  onClick={handleSubscribe}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs sm:text-sm rounded-lg py-2.5 transition active:scale-95 cursor-pointer"
                >
                  {subscribed ? "Subscribed!" : "Subscribe"}
                </button>
              </div> */}
            </div>
          </div>

          {/* bottom */}
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/70 text-center sm:text-left">
            <p>© 2026 SkillShelf. All rights reserved.</p>

            <div className="flex flex-wrap justify-center gap-5">
              {["Privacy", "Terms", "Refund Policy"].map((item) => (
                <a key={item} href="#" className="hover:text-amber-400 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

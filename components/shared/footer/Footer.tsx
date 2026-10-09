"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (email) {
            setSubscribed(true);
            setEmail("");
        }
    };

    return (
        <div className="bg-[#0f0f1a] font-sans mt-12">
            <section className="relative">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage: "url('/images/footerImg/bgImg.png')",
                    }}
                />

                {/* overlay */}
                <div className="absolute inset-0 bg-black/65 backdrop-blur-md" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-28 flex flex-col lg:flex-row items-center justify-center gap-12">

                    {/* Left */}
                    <div className="text-center lg:text-left">

                        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-amber-400 border border-amber-400/40 bg-amber-400/10 rounded-full px-4 py-1.5 mb-6">
                            ✦ Earn up to 50% Commission
                        </span>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-5">
                            Join Our Affiliate Program
                        </h1>

                        <p className="text-[#FFFCF7] text-base sm:text-lg max-w-md mx-auto lg:mx-0 mb-10 leading-relaxed">
                            Turn your audience into income. Earn generous commissions by promoting our premium products!
                        </p>

                        <div className="grid grid-cols-3 gap-3 mb-10 max-w-lg mx-auto lg:mx-0">
                            {[
                                { icon: "💰", title: "50% Commission", sub: "Earn on every sale" },
                                { icon: "🎯", title: "High Converting", sub: "Premium products that sell" },
                                { icon: "📊", title: "Real-time Tracking", sub: "Monitor your earnings" },
                            ].map((f) => (
                                <div
                                    key={f.title}
                                    className="bg-white/8 backdrop-blur border border-white/10 rounded-md py-2 px-4 text-center"
                                >
                                    <div className="text-2xl mb-1">{f.icon}</div>
                                    <div className="text-white text-xs font-semibold">{f.title}</div>
                                    <div className="text-white text-[10px]">{f.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right image */}
                    <div className="absolute -top-25 -right-4 flex-shrink-0 hidden lg:flex">
                        <img
                            src="/images/footerImg/rightImg.png"
                            alt="affiliate"
                            className="w-full h-[480px] object-cover rounded-lg"
                        />
                    </div>
                </div>
            </section>

            <footer className="bg-[#0f0f1a] pt-14 pb-8 px-6">
                <div className="max-w-6xl mx-auto">

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

                        {/* Brand */}
                        <div className="flex flex-col items-start gap-5">
                            <Link href="/">
                                <Image   
                                src="/images/navbarImg/logo2.svg"
                                width={44}
                                height={44}
                                alt="logo"
                                className="w-[40px] h-[45px] md:w-[97px] md:h-[100px]"
                                />
                            </Link>
                        </div>

                        {/* Products */}
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-4">Products</h4>
                            <ul className="space-y-2.5">
                                {[
                                    { name: "PLR Products", href: "/products" },
                                    { name: "Online Courses", href: "/courses" },
                                    { name: "Product Bundles", href: "/bundles" },
                                    { name: "Membership Plans", href: "/membership" },
                                ].map((item) => (
                                    <li key={item.name}>
                                        <a href={item.href} className="text-white hover:text-violet-400 text-xs">
                                            {item.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-4">Support</h4>
                            <ul className="space-y-2.5">
                                {["Contact Us", "Refund Policy", "Terms of Service", "Privacy Policy"].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-white hover:text-violet-400 text-xs">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Newsletter */}
                        <div>
                            <h4 className="text-white font-semibold text-lg mb-2">Stay Updated</h4>
                            <p className="text-white text-xs mb-4">
                                Get the latest products and offers.
                            </p>
                        </div>

                    </div>

                    {/* bottom */}
                    <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between text-xs text-white">
                        <p>© 2026 PLR Store. All rights reserved.</p>

                        <div className="flex gap-5">
                            {["Privacy", "Terms", "Refund Policy"].map((item) => (
                                <a key={item} href="#" className="hover:text-slate-300">
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
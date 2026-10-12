"use client";

import { useState } from "react";
import SecondaryButton from "../shared/secondaryButton/SecondaryButton";
import Image from "next/image";

interface CartItem {
    id: number;
    name: string;
    category: string;
    price: number;
    quantity: number;
    image: string;
}

const initialItems: CartItem[] = [
    {
        id: 1,
        name: "100 Marketing Email Templates",
        category: "Templates",
        price: 27,
        quantity: 1,
        image: "/images/cartPageImg/cartPageImg1.png",
    },
    {
        id: 2,
        name: "Social Media Graphics Pack",
        category: "Graphics",
        price: 47,
        quantity: 2,
        image: "/images/cartPageImg/cartPageImg2.png",
    },
];

export default function CartPage() {
    const [items, setItems] = useState<CartItem[]>(initialItems);
    const [coupon, setCoupon] = useState("");
    const [couponApplied, setCouponApplied] = useState(false);

    const updateQuantity = (id: number, delta: number) => {
        setItems((prev) =>
            prev
                .map((item) =>
                    item.id === id
                        ? { ...item, quantity: Math.max(0, item.quantity + delta) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );
    const total = subtotal;

    const handleApplyCoupon = () => {
        if (coupon.trim()) setCouponApplied(true);
    };

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 py-8 sm:py-16">
            <div className="w-full max-w-5xl overflow-hidden">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left: Cart Items */}
                    <div className="flex-1 space-y-6">
                        <div className=" p-4 sm:p-8 rounded-lg bg-white border lg:border-t-0 lg:border-l border-gray-200">
                            <h1 className="text-xl font-bold text-gray-800 lg:hidden">Your Cart</h1>

                            {/* Cart Items List */}
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-row items-start gap-3 sm:gap-4 pb-4 border-b border-dashed border-gray-200 last:border-0"
                                    >
                                        {/* Product Image */}
                                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover z-10"
                                            />

                                            {/* Fallback placeholder */}
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center text-lg z-0 ${
                                                    item.id === 1
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-slate-800 text-yellow-400"
                                                }`}
                                            >
                                                {item.id === 1 ? "📧" : "🎨"}
                                            </div>
                                        </div>

                                        {/* Product Info & Controls */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-gray-800 text-sm sm:text-base leading-tight">
                                                        {item.name}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {item.category}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                                                    aria-label="Remove item"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 sm:gap-3">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                                                    >
                                                        −
                                                    </button>
                                                    <span className="text-sm font-bold text-gray-700 min-w-[1.25rem] text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <span className="text-blue-600 font-bold text-sm sm:text-base">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Empty State */}
                            {items.length === 0 && (
                                <div className="text-center py-12 text-gray-400">
                                    <p className="text-4xl mb-3">🛒</p>
                                    <p className="text-sm font-medium">Your cart is empty</p>
                                </div>
                            )}
                        </div>

                        {/* Coupon Section */}
                        <div className="mt-8 bg-white rounded-xl p-4 sm:p-5 border lg:border-t-0 lg:border-l border-gray-200">
                            <div className="flex items-center gap-2 mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                                <span className="text-sm font-semibold text-gray-700">
                                    Have a coupon code?
                                </span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    placeholder="Enter coupon code"
                                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all bg-white"
                                />
                                <button
                                    onClick={handleApplyCoupon}
                                    className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-6 py-2.5 rounded-lg transition-colors"
                                >
                                    Apply
                                </button>
                            </div>
                            {couponApplied && (
                                <p className="text-xs text-green-600 mt-2 font-medium">
                                    ✓ Coupon applied successfully!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="bg-white w-full rounded-lg lg:w-80 p-6 sm:p-8 flex flex-col gap-5 border lg:border-t-0 lg:border-l border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800">Order Summary</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold text-gray-800">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-extrabold text-blue-600 text-xl">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3 mt-2 text-center">
                            <SecondaryButton
                                label="Proceed to Checkout"
                                onClick={() => console.log("click")}
                            />
                            <button className="md:ml-4 lg:ml-0 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-bold py-2 px-11 rounded-lg transition-colors text-sm bg-white cursor-pointer">
                                Continue Shopping
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="space-y-3 pt-5 border-t border-gray-200 mt-auto">
                            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-500 font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>Secure SSL Checkout</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-500 font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>30-day money back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
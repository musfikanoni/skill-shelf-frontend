'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProductsQuery } from '@/redux/api/landingPageApi/LandingPageApi';
import { getProductCategoryName } from '@/constants/productCategory';

interface Product {
    _id: string;
    name: string;
    category: any;
    images?: string[];
    averageRating: number;
    totalReviews: number;
    price: number | {
        basic: number;
        pro: number;
        vip: number;
    };
}

const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => {
    const safeRating = Math.min(5, Math.max(0, Number(rating) || 0));
    const reviewCount = Number(reviews) || 0;

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill={safeRating >= star ? "#FBBF24" : "#E5E7EB"}
                        stroke="none"
                    >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                ))}
            </div>

            <span className="text-xs text-gray-500 font-medium">
                {safeRating > 0 ? safeRating.toFixed(1) : "0.0"} ({reviewCount})
            </span>
        </div>
    );
};

export default function ProductSection() {
    const { data: productsData, isLoading, error } = useGetProductsQuery({});
    const products = productsData?.data || [];

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [minRating, setMinRating] = useState(0);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return products.filter((product: Product) => {
            const catName = getProductCategoryName(product.category);
            const categoryMatch = selectedCategory === 'all' || catName.toLowerCase() === selectedCategory.toLowerCase();

            const priceValue = typeof product.price === 'number'
                ? product.price
                : (product.price?.basic || 0);

            const priceMatch =
                priceRange === 'all' ||
                (priceRange === 'under50' && priceValue < 50) ||
                (priceRange === '50-100' && priceValue >= 50 && priceValue <= 100) ||
                (priceRange === 'over100' && priceValue > 100);

            const ratingMatch = (product.averageRating || 0) >= minRating;

            return categoryMatch && priceMatch && ratingMatch;
        });
    }, [products, selectedCategory, priceRange, minRating]);

    if (error) {
        return (
            <div className="min-h-screen pt-12 px-4 text-center">
                <p className="text-red-500 font-bold">Failed to load products. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0F172A] tracking-tight">Best Selling Products</h1>
                    <p className="mt-2 text-sm sm:text-base md:text-lg text-slate-500">Browse our collection of high-quality SkillShelf products</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 lg:sticky lg:top-8">
                            <div 
                                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                                className="flex items-center justify-between text-slate-800 cursor-pointer lg:cursor-default"
                            >
                                <div className="flex items-center gap-2">
                                    <FilterIcon />
                                    <span className="font-bold text-base sm:text-lg">Filters</span>
                                </div>
                                <span className="lg:hidden text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                                    {isMobileFilterOpen ? "Hide Filters" : "Show Filters"}
                                </span>
                            </div>

                            <div className={`${isMobileFilterOpen ? "block" : "hidden"} lg:block mt-6`}>
                                <FilterGroup title="Category">
                                    {['all', 'Templates', 'Graphics', 'Ebooks', 'Bundles'].map((cat) => (
                                        <RadioButton
                                            key={cat}
                                            label={cat}
                                            name="category"
                                            checked={selectedCategory === cat}
                                            onChange={() => setSelectedCategory(cat)}
                                        />
                                    ))}
                                </FilterGroup>

                                <FilterGroup title="Price Range">
                                    <RadioButton label="All Prices" name="price" checked={priceRange === 'all'} onChange={() => setPriceRange('all')} />
                                    <RadioButton label="Under $50" name="price" checked={priceRange === 'under50'} onChange={() => setPriceRange('under50')} />
                                    <RadioButton label="$50 - $100" name="price" checked={priceRange === '50-100'} onChange={() => setPriceRange('50-100')} />
                                    <RadioButton label="Over $100" name="price" checked={priceRange === 'over100'} onChange={() => setPriceRange('over100')} />
                                </FilterGroup>

                                <FilterGroup title="Minimum Rating">
                                    <RadioButton label="All" name="rating" checked={minRating === 0} onChange={() => setMinRating(0)} />
                                    <RadioButton label="4+" name="rating" checked={minRating === 4} onChange={() => setMinRating(4)} />
                                    <RadioButton label="4.5+" name="rating" checked={minRating === 4.5} onChange={() => setMinRating(4.5)} />
                                </FilterGroup>
                            </div>
                        </div>
                    </aside>

                    <section className="flex-1">
                        <div className="mb-6">
                            <span className="text-slate-500 font-medium text-center md:text-left">
                                Showing {filteredProducts.length} products
                            </span>
                        </div>

                        {/* Product Cards Grid - styled identically to Home Page */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
                            {isLoading ? (
                                Array(6).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex flex-col h-full">
                                        <Skeleton className="h-[220px] w-full rounded-none" />
                                        <div className="p-5 flex flex-col gap-3 flex-1">
                                            <Skeleton className="h-5 w-3/4 rounded" />
                                            <Skeleton className="h-4 w-1/3 rounded" />
                                            <div className="pt-2 border-t border-gray-100">
                                                <Skeleton className="h-7 w-20 rounded" />
                                            </div>
                                            <Skeleton className="h-10 w-full rounded-xl mt-5" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                filteredProducts.map((product: Product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>

                        {filteredProducts.length === 0 && !isLoading && (
                            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium">No products match your current filters.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product }: { product: Product }) {
    const router = useRouter();

    const buyNow = () => {
        router.push(`/seo-toolkit?id=${product._id}`);
    };

    const displayPrice = typeof product.price === 'number'
        ? product.price
        : (product.price?.basic || 0);

    const image = product.images?.[0] || "/images/bestSellingImg/3d-one.png";
    const rawCategory = getProductCategoryName(product.category);
    const categoryName =
        rawCategory &&
        !rawCategory.toLowerCase().includes("digital") &&
        rawCategory.toLowerCase() !== "uncategorized"
            ? rawCategory
            : "";

    return (
        <div
            className="
                group bg-white rounded-2xl
                border border-gray-100
                flex flex-col h-full
                overflow-hidden
                shadow-sm hover:shadow-xl
                hover:shadow-purple-500/10
                hover:-translate-y-1.5
                transition-all duration-300
            "
        >
            {/* Product Image Container */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 px-5 pt-5 pb-3">
                <div className="relative h-[220px] w-full flex items-center justify-center">
                    <Image
                        src={image}
                        alt={product.name}
                        width={300}
                        height={400}
                        className="
                            h-full w-full
                            object-contain
                            transition-transform duration-500
                            group-hover:scale-105
                        "
                    />
                </div>

                {/* Category Badge */}
                {categoryName && (
                    <span className="absolute top-4 left-4 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
                        {categoryName}
                    </span>
                )}
            </div>

            {/* Product Information */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex flex-col gap-3 flex-1">
                    {/* Product Name */}
                    <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[44px] group-hover:text-purple-700 transition-colors">
                        {product.name}
                    </h3>

                    {/* Real Star Rating & Review Count */}
                    <StarRating
                        rating={product.averageRating}
                        reviews={product.totalReviews}
                    />

                    {/* Price */}
                    <div className="pt-2 border-t border-gray-100">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                            Starting at
                        </p>

                        <p className="text-2xl font-extrabold text-purple-600">
                            ${displayPrice}
                        </p>
                    </div>
                </div>

                {/* View Details Button */}
                <button
                    onClick={buyNow}
                    className="
                        w-full mt-5 py-3
                        bg-gradient-to-r from-[#713FCB] to-[#341E5F]
                        hover:from-[#5D2EB0] hover:to-[#251447]
                        text-white text-xs font-bold
                        uppercase tracking-widest
                        rounded-xl
                        shadow-md shadow-purple-500/20
                        hover:shadow-lg hover:shadow-purple-500/30
                        transition-all duration-300
                        cursor-pointer
                    "
                >
                    View Details
                </button>
            </div>
        </div>
    );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-8">
            <h3 className="text-slate-900 font-bold text-sm mb-4 uppercase tracking-wider">{title}</h3>
            <div className="flex flex-col gap-3">{children}</div>
        </div>
    );
}

function RadioButton({ label, name, checked, onChange }: { label: string; name: string; checked: boolean; onChange: () => void }) {
    return (
        <label className="flex items-center group cursor-pointer">
            <div className="relative flex items-center justify-center">
                <input
                    type="radio"
                    name={name}
                    checked={checked}
                    onChange={onChange}
                    className="peer h-4 w-4 appearance-none rounded-full border-2 border-slate-300 checked:border-blue-600 transition-all cursor-pointer"
                />
                <div className="absolute h-2 w-2 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
            </div>
            <span className="ml-3 text-sm text-slate-600 group-hover:text-slate-900 font-medium capitalize transition-colors">
                {label.replace(/([A-Z])/g, ' $1').trim()}
            </span>
        </label>
    );
}

function FilterIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    );
}

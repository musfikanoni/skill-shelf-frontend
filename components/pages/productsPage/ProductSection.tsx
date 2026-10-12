'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProductsQuery } from '@/redux/api/landingPageApi/LandingPageApi';

interface Product {
    _id: string;
    name: string;
    category: {
        _id: string;
        name: string;
        image?: string;
    };
    images?: string[];
    averageRating: number;
    totalReviews: number;
    price: number | {
        basic: number;
        pro: number;
        vip: number;
    };
}

export default function ProductSection() {
    const { data: productsData, isLoading, error } = useGetProductsQuery({});
    const products = productsData?.data || [];

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [priceRange, setPriceRange] = useState('all');
    const [minRating, setMinRating] = useState(0);

    const filteredProducts = useMemo(() => {
        return products.filter((product: Product) => {
            const categoryMatch = selectedCategory === 'all' || product.category?.name.toLowerCase() === selectedCategory.toLowerCase();

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
                <header className="mb-12">
                    <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">Best Selling Products</h1>
                    <p className="mt-3 text-lg text-slate-500">Browse our collection of high-quality PLR products</p>
                </header>

                <div className="flex flex-col lg:flex-row gap-8">
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-8">
                            <div className="flex items-center gap-2 mb-8 text-slate-800">
                                <FilterIcon />
                                <span className="font-bold text-lg">Filters</span>
                            </div>

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
                    </aside>

                    <section className="flex-1">
                        <div className="mb-6">
                            <span className="text-slate-500 font-medium text-center md:text-left">Showing {filteredProducts.length} products</span>
                        </div>

                        <div className="flex gap-4 justify-center flex-wrap mb-10">
                            {isLoading ? (
                                Array(8).fill(0).map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-4 flex flex-col gap-3 flex-1 min-w-[220px] max-w-[220px]">
                                        <Skeleton className="w-full aspect-[4/5] rounded-xl" />
                                        <Skeleton className="h-4 w-2/3" />
                                        <Skeleton className="h-6 w-full" />
                                        <Skeleton className="h-4 w-1/2" />
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                </div>
                                ))
                            ) : (
                                filteredProducts.map((product: Product) => (
                                    <ProductCard key={product._id} product={product} />
                                ))
                            )}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-400">No products match your current filters.</p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}


function ProductCard({ product }: { product: Product }) {
    const [hovered, setHovered] = useState(false);
    const router = useRouter();

    const buyNow = () => {
        router.push(`/seo-toolkit?id=${product._id}`);
    }

    const productThumbnail = product.images?.[0] || "/images/bestSellingImg/3d-one.png";
    const displayPrice = typeof product.price === 'number'
        ? product.price
        : (product.price?.basic || 0);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`bg-white rounded-2xl p-4 flex flex-col gap-3 flex-1 min-w-[180px] max-w-[220px] transition-all duration-300 cursor-pointer ${hovered
                ? "shadow-lg shadow-purple-500/15 -translate-y-1"
                : "shadow-md shadow-black/6"
                }`}
        >
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#F0F4F9] p-3">
                <img
                    src={productThumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl shadow-sm"
                />
            </div>

            {/* Content Section */}
            <div className="flex flex-col gap-1.5 px-1">
        
                <span className="text-[10px] font-bold text-[#4F8AFF] uppercase tracking-wider">
                    {product.category?.name || 'PLR'}
                </span>

                <h3 className="text-base font-bold text-[#1E293B] leading-snug line-clamp-2 min-h-[44px]">
                    {product.name}
                </h3>

                <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < 4} /> 
                        ))}
                    </div>
                    <span className="text-slate-400 text-xs font-bold">
                        {product.averageRating || '4.7'} <span className="font-medium">({product.totalReviews || '189'})</span>
                    </span>
                </div>

                <p className="text-2xl font-black text-[#A855F7] mt-1">
                    ${displayPrice}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        buyNow();
                    }}
                    className="w-full py-2.5 bg-gradient-to-b from-[#6C3FC5] to-[#341E5F] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer mt-3"
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


function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg className={`w-4 h-4 ${filled ? 'fill-current' : 'text-slate-200 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
    );
}

function FilterIcon() {
    return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
    );
}
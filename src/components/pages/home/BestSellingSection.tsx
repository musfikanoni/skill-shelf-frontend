
"use client";

import { FC } from "react";
import Image from "next/image";
import SecondaryButton from "../../shared/secondaryButton/SecondaryButton";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useRouter } from "next/navigation";
import Loading from "../../Others/Loading";
import { useGetProductsQuery } from "@/redux/api/landingPageApi/LandingPageApi";

interface Product {
  _id: string;
  name: string;
  averageRating: number;
  totalReviews: number;
  price:
    | number
    | {
        basic: number;
        pro: number;
        vip: number;
      };
  images?: string[];
}

interface StarRatingProps {
  rating: number;
  reviews: number;
}

interface ProductCardProps {
  product: Product;
}

const StarRating: FC<StarRatingProps> = ({ rating, reviews }) => {
  const safeRating = Math.min(5, Math.max(0, rating || 0));

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
        {safeRating.toFixed(1)} ({reviews || 0})
      </span>
    </div>
  );
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();

  const buyNow = () => {
    router.push(`/seo-toolkit?id=${product._id}`);
  };

  const displayPrice =
    typeof product.price === "number"
      ? product.price
      : product.price?.basic || 0;

  const image =
    product.images?.[0] || "/images/bestSellingImg/3d-one.png";

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
      {/* Book Image */}
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

        {/* Product Badge */}
        <span className="absolute top-4 left-4 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
          Featured
        </span>
      </div>

      {/* Product Information */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-col gap-3 flex-1">
          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 min-h-[44px] group-hover:text-purple-700 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <StarRating
            rating={product.averageRating}
            reviews={product.totalReviews}
          />

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Starting at
              </p>

              <p className="text-2xl font-extrabold text-purple-600">
                ${displayPrice}
              </p>
            </div>

            <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-full">
              Digital Product
            </span>
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
};

const BestSellingProducts: FC = () => {
  const router = useRouter();

  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({});

  const products: Product[] = productsData?.data?.slice(0, 5) || [];

  const viewAllProducts = () => {
    router.push("/products");
  };

  if (isLoading) {
    return (
      <Loading
        title="Loading Products"
        message="Fetching our best selling items..."
      />
    );
  }

  if (error) return null;

  return (
    <section className="bg-gray-50 py-20 px-5 md:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Section Badge */}
        <div className="text-center mb-5">
          <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-widest px-5 py-2 rounded-full">
            <span>🔥</span>
            Featured Digital Products
          </span>
        </div>

        {/* Section Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Best Selling Products
          </h2>

          <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed">
            Discover premium digital products, ready to use, customize
            and resell for your business.
          </p>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500">
            No products available at the moment.
          </div>
        )}

        {/* View All Button */}
        <div className="flex justify-center items-center mt-14">
          <SecondaryButton
            label="View All Products"
            onClick={viewAllProducts}
            icon={IoIosArrowRoundForward}
            iconPosition="right"
          />
        </div>
      </div>
    </section>
  );
};

export default BestSellingProducts;

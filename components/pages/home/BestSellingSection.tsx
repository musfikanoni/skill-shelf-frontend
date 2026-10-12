"use client";

import { useState, FC } from "react";
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

interface BookCoverProps {
  product: Product;
}

interface ProductCardProps {
  product: Product;
}

const StarRating: FC<StarRatingProps> = ({ rating, reviews }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star: number) => (
        <svg
          key={star}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={rating >= star ? "#FDC700" : "#e5e7eb"}
          stroke="none"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-gray-500 ml-0.5">
        {rating}({reviews})
      </span>
    </div>
  );
};

const BookCover: FC<BookCoverProps> = ({ product }) => {
  const image = product.images?.[0] || "/images/bestSellingImg/3d-one.png";
  return (
    <div className="w-full h-[180px] rounded-md flex items-center justify-center relative overflow-hidden bg-white">
      <Image
        src={image}
        alt="Product"
        width={160}
        height={180}
        className="w-full h-full object-cover"
        priority
      />
    </div>
  );
};

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const router = useRouter();

  const buyNow = () => {
    router.push(`/seo-toolkit?id=${product._id}`);
  };

  const displayPrice =
    typeof product.price === "number"
      ? product.price
      : product.price?.basic || 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white rounded-2xl p-4 flex flex-col gap-3 flex-1 min-w-[180px] max-w-[220px] transition-all duration-300 cursor-pointer ${
        hovered
          ? "shadow-lg shadow-purple-500/15 -translate-y-1"
          : "shadow-md shadow-black/6"
      }`}
    >
      <BookCover product={product} />

      <div className="flex flex-col h-full">
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </h3>

          <StarRating
            rating={product.averageRating}
            reviews={product.totalReviews}
          />

          <p className="text-lg font-black text-purple-500">${displayPrice}</p>
        </div>

        <button
          onClick={buyNow}
          className="w-full py-2.5 bg-gradient-to-b from-[#6C3FC5] to-[#341E5F] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer mt-3"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const BestSellingProducts: FC = () => {
  const router = useRouter();
  const { data: productsData, isLoading, error } = useGetProductsQuery({});
  const products = productsData?.data?.slice(0, 5) || [];

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

  if (error) {
    return null;
  }

  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-4">
          <span className="inline-block bg-purple-100 text-purple-600 text-xs font-bold uppercase tracking-widest px-5 py-1.5 rounded-full">
            🔥 Featured Digital Products
          </span>
        </div>

        <h2 className="text-center text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight">
          Best Selling Products
        </h2>

        <p className="text-center text-base text-gray-600 mb-12">
          Premium PLR products ready to use and resell
        </p>

        <div className="flex gap-4 justify-center flex-wrap mb-10">
          {products.map((product: Product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        <div className="flex justify-center items-center">
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

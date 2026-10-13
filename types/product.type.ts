// types/product.ts

export type ProductsResponse = {
  data: Product[];
};

export type Product = {
  _id: string;
  name: string;

  price: {
    basic: number;
    pro: number;
    vip: number;
  };

  files: {
    basic: string | null;
    pro: string | null;
    vip: string | null;
  };

  category: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    image: string;
  };

  images: string[];

  averageRating: number;
  totalReviews: number;

  createdAt: string;
  updatedAt: string;

  isPurchased: boolean;
  accessSource: 'ORDER' | 'SUBSCRIPTION';
};


//can review response type
export type CanReviewResponse = {
  data: {
    canReview: boolean;
  };
};
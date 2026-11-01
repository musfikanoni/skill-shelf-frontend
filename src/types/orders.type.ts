export type OrderStatus = 'completed' | 'paid' | 'pending' | 'refunded' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  email: string;
  amount: number;
  date: string;
  status: OrderStatus;
}

export interface OrdersTableProps {
  data: Order[];
  isLoading?: boolean;
  onView?: (order: Order) => void;
  onRefresh?: (order: Order) => void;
  onSearch?: (query: string) => void;
  onStatusFilter?: (status: OrderStatus | 'all') => void;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  tableTitle?: string;
}

export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}


export type OrderResponse = {
  data: OrderData[];
};

export type OrderData = {
  _id: string;
  user: string;
  product: Product;
  planType: "basic" | "pro" | "vip";
  discountAmount: number;
  amount: number;
  currency: string;
  status: "PAID" | "PENDING" | "FAILED";
  productQuantity: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type Product = {
  price: ProductPrice;
  quantity: number;
  _id: string;
  name: string;
  category: string;
  images: string[];
  files: ProductFiles;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
};

export type ProductPrice = {
  basic: number;
  pro: number;
  vip: number;
};

export type ProductFiles = {
  basic: string;
  pro: string;
  vip: string;
};



export type OrderDetailsData = {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  itemType: 'PRODUCT';
  itemId: string;
  stripeSessionId: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  expiresAt: string;
  quantity: number;
  planType: 'basic' | 'pro' | 'vip';
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type OrderDetailsResponse = {
  data: OrderDetailsData;
};

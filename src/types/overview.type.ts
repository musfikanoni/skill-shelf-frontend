
export interface Order {
  _id: string;
  user: string;
  itemType: "PRODUCT" | "COURSE" | "SUBSCRIPTION"; 
  itemId: string;
  stripeSessionId: string;
  amount: number;
  status: "PAID" | "PENDING" | "FAILED" | "REFUNDED";
  expiresAt: string;
  quantity: number;
  planType: "pro" | "basic" | "enterprise" | null;
  createdAt: string;
  updatedAt: string; 
  __v: number;
}

export interface UserOverviewData {
  totalOrders: number;
  totalPurchasedCourses: number;
  activePlan: string | null;
  lastThreeOrders: Order[];
}

export interface UserOverviewResponse {
  data: UserOverviewData;
}
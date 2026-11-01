export type SubscriptionStatus =
  | "active"
  | "expired"
  | "expiring";

export type SubscriptionPlan =
  | "Basic"
  | "VIP"
  | "Pro";

export type Subscription = {
  user: string;
  email: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  renewalDate: string;
};


export interface CheckoutResponse {
  success: boolean;
  checkoutUrl: string;
}



export interface MySubscriptionResponse {
  data: MySubscription;
}

export interface MySubscription {
  _id: string;
  stripeSubscriptionId: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  currentPeriodEnd: string;
  plan: MySubscriptionPlan;
  status: 'ACTIVE' | 'INACTIVE' | 'CANCELED' | 'PAST_DUE';
  stripeCustomerId: string;
  trialEnd: string | null;
  updatedAt: string;
  user: string;
  __v: number;
}

export interface MySubscriptionPlan {
  access: Access;       
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'MONTH' | 'YEAR';
  features: string[];
  isActive: boolean;
  stripeProductId: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Access {
  products: ProductAccess[];
  courses: string[];
  bundles: string[];
}

export interface ProductAccess {
  product: string;
  fileAccess: 'basic' | 'pro' | 'vip';
  _id: string;
}


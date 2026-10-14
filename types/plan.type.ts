
export type FileAccess = 'basic' | 'pro' | 'vip';
export type BillingInterval = 'MONTH' | 'YEAR';

export interface AccessItem {
  product: string;
  fileAccess: FileAccess;
  _id: string;
}

export interface Access {
  products: AccessItem[];
  courses: string[];
  bundles: string[];
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  price: number;
  currency: string;
  interval: BillingInterval;
  features: string[];
  isActive: boolean;

  stripeProductId: string;
  stripePriceId: string;

  access: Access;

  createdAt: string;
  updatedAt: string;

  __v: number;
}

export interface PlansResponse {
  data: SubscriptionPlan[];
}
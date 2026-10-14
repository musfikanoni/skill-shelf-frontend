export interface ReferredUser {
  _id: string;
  name: string;
  email: string;
}

export interface ReferralData {
  _id: string;
  user: string;
  referredUser: ReferredUser;
  amount: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface MyCommissionResponse {
  data: ReferralData[];
}
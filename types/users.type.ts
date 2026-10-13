export type Membership = "Basic" | "Pro" | "VIP"

export type Users = {
  id?: string;
  name: string;
  email: string;
  membership: Membership;
  purchases: number;
  totalSpent: number;
  joined: string;
};

export const SAMPLE_USERS: Users[] = [
  {
    name: "John Doe",
    email: "john@example.com",
    membership: "Basic",
    purchases: 12,
    totalSpent: 1970.0,
    joined: "2025-01-15",
  },
];
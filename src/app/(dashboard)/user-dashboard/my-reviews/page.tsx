import type { Metadata } from "next";
import MyReviewsPage from "@/components/pages/userDashboard/myReviews/MyReviewsPage";

export const metadata: Metadata = {
  title: "My Reviews",
  description: "View and manage reviews you have left for SkillShelf products and courses",
};

export default function MyReviews() {
  return (
    <div>
      <MyReviewsPage />
    </div>
  );
}

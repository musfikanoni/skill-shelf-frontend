import type { Metadata } from "next";
import UsersPage from "@/components/pages/adminDashboard/users/UsersPage";

export const metadata: Metadata = {
  title: "Manage Users",
  description: "View and manage registered SkillShelf customer accounts and roles",
};

export default function Users() {
  return (
    <div>
      <UsersPage />
    </div>
  );
}

import type { Metadata } from "next";
import SettingsPage from "@/components/pages/userDashboard/settings/SettingsPage";

export const metadata: Metadata = {
  title: "Account Settings",
  description: "Manage your personal profile, security credentials, and preferences",
};

export default function Settings() {
  return <SettingsPage />;
}

import type { Metadata } from "next";
import SettingsPage from "@/components/pages/adminDashboard/settings/SettingsPage";

export const metadata: Metadata = {
  title: "Admin Settings",
  description: "Configure system preferences and administrator account settings",
};

export default function Settings() {
  return <SettingsPage />;
}

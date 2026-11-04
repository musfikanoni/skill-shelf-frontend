import type { Metadata } from "next";
import DownloadsPage from "@/components/pages/userDashboard/downloads/DownloadsPage";

export const metadata: Metadata = {
  title: "Downloads",
  description: "Access and download all your purchased digital products and files",
};

export default function Downloads() {
  return (
    <div>
      <DownloadsPage />
    </div>
  );
}

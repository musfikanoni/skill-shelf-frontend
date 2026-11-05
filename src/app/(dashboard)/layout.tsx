"use client";

import AppSidebar from "@/components/shared/appSidebar/app-sidebar";
import { SiteHeader } from "@/components/shared/siteHeader/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: getMeData } = useGetMeQuery({});
  const apiRole = getMeData?.data?.role;
  const inferredRole = pathname?.startsWith("/admin-dashboard")
    ? "SUPER_ADMIN"
    : "USER";
  const role = apiRole || inferredRole;

  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "280px",
            "--header-height": "80px",
          } as React.CSSProperties
        }
      >
        <AppSidebar role={role} className="border-none !border-r-0" />
        <div className="flex-1 min-w-0 w-full flex flex-col h-screen overflow-hidden bg-[#F9FAFB]">
          <SiteHeader />
          <main className="flex-1 min-w-0 w-full overflow-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  );
}

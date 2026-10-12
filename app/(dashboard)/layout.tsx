
"use client"
import AppSidebar from "@/components/shared/appSidebar/app-sidebar"
import { SiteHeader } from "@/components/shared/siteHeader/site-header"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const {data: getMeData} = useGetMeQuery("")
//   console.log("getMeData =============================", getMeData?.data?.role)
  const roleManage = getMeData?.data?.role
  console.log("roleManage" ,roleManage)
  //   const token = useAppSelector((state) => state.auth.token);
  // const decodedToken = useDecodedToken(token);
  const role = roleManage // decodedToken?.role || "USER";

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
        <AppSidebar role={role} className="border-none" />
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#F9FAFB]">
          <SiteHeader />
          <main className="flex-1 overflow-auto px-4 md:px-8 py-6 md:py-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  )
}

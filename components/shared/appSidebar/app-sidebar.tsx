"use client";

import * as React from "react";
import {
  Award,
  Download,
  GraduationCap,
  LayoutGrid,
  LogOut,
  Settings,
  ShoppingCart,
  Star,
  Users,
  Package,
  PanelTop,
  Layers,
  Tag,
  BookOpen,
  Handshake,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/redux/features/user/userSlice";
import { toast } from "sonner";
import { useLogoutMutation } from "@/redux/api/auth/AuthApi";
import Logo from "../users/Logo";

const data = {
  USER: {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutGrid,
      },
      {
        title: "My Orders",
        url: "/dashboard/my-orders",
        icon: ShoppingCart,
      },
      {
        title: "Downloads",
        url: "/dashboard/downloads",
        icon: Download,
      },
      {
        title: "My Courses",
        url: "/dashboard/my-courses",
        icon: GraduationCap,
      },
      // {
      //   title: "My Reviews",
      //   url: "/dashboard/my-reviews",
      //   icon: Star,
      // },
      {
        title: "Membership",
        url: "/dashboard/membership",
        icon: Award,
      },
      {
        title: "Affiliate",
        url: "/dashboard/affiliate",
        icon: Users,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },

  SUPER_ADMIN: {
    navMain: [
      {
        title: "Dashboard",
        url: "/admin-dashboard",
        icon: LayoutGrid,
      },
      {
        title: "Products",
        url: "/admin-dashboard/products",
        icon: Package,
      },
      {
        title: "Orders",
        url: "/admin-dashboard/orders",
        icon: ShoppingCart,
      },
      {
        title: "Users",
        url: "/admin-dashboard/users",
        icon: Users,
      },
      {
        title: "Subscriptions",
        url: "/admin-dashboard/subscriptions",
        icon: Tag,
      },
      {
        title: "Categories",
        url: "/admin-dashboard/categories",
        icon: Layers,
      },

      {
        title: "Coupons",
        url: "/admin-dashboard/coupons",
        icon: Tag,
      },
      {
        title: "Affiliate",
        url: "/admin-dashboard/affiliate",
        icon: Handshake,
      },
      {
        title: "Courses",
        url: "/admin-dashboard/courses",
        icon: BookOpen,
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/admin-dashboard/settings",
        icon: Settings,
      },
    ],
  },
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: "SUPER_ADMIN" | "USER";
};

export default function AppSidebar({ role, ...props }: AppSidebarProps) {
  const sidebarData = data[role as keyof typeof data];

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      const res = await logout({}).unwrap();
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      dispatch(logoutAction());

      toast.success(res?.message || "Logged out successfully");
      // router.push("/");
      window.location.href = "/";
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(error?.data?.message || "Logout failed. Please try again.");
    }
  };

  return (
    <Sidebar {...props} className="border-none bg-white shadow-xl">
      <SidebarHeader className="mt-6">
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4">
        <SidebarMenu className="gap-2">
          {sidebarData?.navMain.map((item) => {
            // const isActive =
            //   pathname === item.url ||
            //   (item.url !== "/dashboard" && pathname.startsWith(item.url));

            const isDashboardRoute =
              item.url === "/dashboard" || item.url === "/admin-dashboard";

            const isActive = isDashboardRoute
              ? pathname === item.url
              : pathname.startsWith(item.url);

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={isActive}
                  className={`h-12 rounded-lg transition-all duration-200 px-4 gap-3 ${isActive
                    ? "bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black shadow-md hover:from-[#F9C32C] hover:to-[#EFA00B] hover:text-black"
                    : "bg-[#F8FAFC] text-slate-500 hover:bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:text-slate-900"
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-black" : "hover:text-black"}`}
                  />
                  <span className="font-semibold">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>

        <div className="my-6 px-2">
          <SidebarSeparator className="bg-slate-100" />
        </div>

        <SidebarMenu>
          {sidebarData?.navSecondary.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={<Link href={item.url} />}
                  isActive={isActive}
                  className={`h-12 rounded-lg transition-all duration-200 px-4 gap-3 ${isActive
                    ? "bg-linear-to-r from-[#F9C32C] to-[#EFA00B] text-black shadow-md"
                    : "bg-[#F8FAFC] text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                >
                  <item.icon
                    className={`h-5 w-5 ${isActive ? "text-black" : "text-slate-500"}`}
                  />
                  <span className="font-semibold">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="h-12 w-full justify-start gap-3 rounded-lg bg-red-50 px-4 text-red-400 hover:bg-red-100 hover:text-red-500 transition-colors mb-24"
            >
              <LogOut className="h-5 w-5 rotate-180" />
              <span className="font-semibold">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

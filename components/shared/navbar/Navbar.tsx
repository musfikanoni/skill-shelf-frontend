"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { IoIosMenu } from "react-icons/io";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard } from "lucide-react";
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi";
import logoImg from "@/assets/images/logo.png";

const Navbar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const { data: userData, isLoading } = useGetMeQuery({});
  const user = userData?.data;

  const handleLogOut = () => {
    toast.success("Logged out successfully");
    setTimeout(() => {
      localStorage.removeItem("persist:root");
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("token");

      toast.success("Logged out successfully");

      router.push("/");
      window.location.reload();
    }, 1500);
  };

  // const handleDashboard = () => {
  //   if (user?.role === "SUPER_ADMIN") {
  //     router.push("/admin-dashboard");
  //   } else {
  //     router.push("/dashboard");
  //   }
  // };

  const handleDashboard = () => {
  if (user?.role === "USER") {
    router.push("/user-dashboard");
  } else if (user?.role === "SUPER_ADMIN" || user?.role === "ADMIN") {
    router.push("/admin-dashboard");
  } else {
    toast.error("Unauthorized user role");
  }
};

  return (
    <div className="sticky top-0 left-0 w-full z-50 px-3 lg:px-12 border-b border-[#5f5b5bcc] bg-black py-5">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-1">
            <Image
              src={logoImg}
              width={44}
              height={44}
              alt="logo"
              className="w-[30px] h-[30px] md:w-[60px] md:h-[60px]"
            />
            <p className="flex items-center leading-none">
              <span
                className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#4F8EF7] to-[#7B3FE4] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]"
              >
                Skill
              </span>
              <span
                className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#FF8C00] to-[#F5C518] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]"
              >
                Shelf
              </span>
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-[16px] font-medium">
          {[
            { name: "Products", path: "/products" },
            { name: "Courses", path: "/courses" },
            { name: "Bundles", path: "/bundles" },
            { name: "Membership", path: "/membership" },
            // { name: "Affiliate", path: "/affiliate" },
          ].map((item) => {
            const isActive =
              // item.path === "/products"
              item.path === "/"
                ? pathName === "/" || pathName === "" || pathName === item.path
                : pathName === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`transition ${
                  isActive
                    ? "text-[#F5C518] font-semibold text-lg"
                    : "text-[#FFFFFF] hover:text-[#F5C518] text-lg"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right */}
        <div className="hidden lg:flex items-center gap-4">
          {!user ? (
            <Link href="/signIn">
              <button className="px-8 py-2.5 rounded-lg font-bold text-gray-900 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:shadow-[0_0_15px_rgba(245,197,24,0.4)] transition-all active:scale-95 text-base">
                Login
              </button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="px-6 py-2.5 rounded-lg font-bold text-gray-900 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all flex items-center gap-2 group active:scale-95">
                    <User
                      size={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                    <span className="text-base">Account</span>
                  </button>
                }
              />
              <DropdownMenuContent
                align="end"
                className="w-56 bg-zinc-900 border-zinc-800 text-white mt-2"
              >
                <div className="px-4 py-3 border-b border-zinc-800">
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {user.email}
                  </p>
                </div>
                <DropdownMenuItem
                  render={
                    <div
                      onClick={handleDashboard}
                      className="flex items-center gap-2 py-2 cursor-pointer"
                    >
                      <LayoutDashboard size={16} className="text-[#F5C518]" />
                      <span>Dashboard</span>
                    </div>
                  }
                />
                <DropdownMenuSeparator className="bg-zinc-800" />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="flex items-center gap-2 py-2 cursor-pointer text-red-500"
                >
                  <LogOut size={16} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline">
                  <IoIosMenu size={20} />
                </Button>
              }
            />

            <DropdownMenuContent className="-ml-16">
              <DropdownMenuItem
                render={<Link href="/products">Products</Link>}
              />

              <DropdownMenuItem render={<Link href="/courses">Courses</Link>} />

              <DropdownMenuItem render={<Link href="/bundles">Bundles</Link>} />

              <DropdownMenuItem
                render={<Link href="/membership">Membership</Link>}
              />

              <DropdownMenuSeparator className="bg-zinc-800" />

              {!user ? (
                <DropdownMenuItem
                  render={
                    <Link href="/signIn" className="w-full">
                      <button className="w-full text-left font-bold text-[#F5C518]">
                        Login
                      </button>
                    </Link>
                  }
                />
              ) : (
                <>
                  <DropdownMenuItem
                    render={
                      <div
                        onClick={handleDashboard}
                        className="flex items-center gap-2 py-2"
                      >
                        <LayoutDashboard size={16} />
                        <span>Dashboard</span>
                      </div>
                    }
                  />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="flex items-center gap-2 py-2 text-red-500"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

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

  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;

  const handleLogOut = () => {
    localStorage.removeItem("persist:root");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("token");

    toast.success("Logged out successfully");
    router.push("/");
    router.refresh();
  };

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
    <div className="sticky top-0 left-0 w-full z-50 px-3 lg:px-12 border-b border-[#5f5b5bcc] bg-black py-4 md:py-5 backdrop-blur-md bg-opacity-95 transition-all">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="transition-transform active:scale-95">
          <div className="flex items-center gap-1.5">
            <Image
              src={logoImg}
              width={48}
              height={48}
              priority
              alt="SkillShelf Logo"
              className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] object-contain"
            />
            <p className="flex items-center leading-none">
              <span className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#4F8EF7] to-[#7B3FE4] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
                Skill
              </span>
              <span className="text-[1.7rem] md:text-[2rem] font-extrabold bg-gradient-to-r from-[#FF8C00] to-[#F5C518] bg-clip-text text-transparent font-[family-name:var(--font-nunito)]">
                Shelf
              </span>
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8 text-[16px] font-medium">
          {[
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: "Courses", path: "/courses" },
            { name: "Bundles", path: "/bundles" },
            { name: "Membership", path: "/membership" },
          ].map((item) => {
            const isActive =
              item.path === "/"
                ? pathName === "/" || pathName === "" || pathName === item.path
                : pathName === item.path;

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-all duration-200 text-lg relative py-1 ${
                  isActive
                    ? "text-[#F5C518] font-bold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#F5C518]"
                    : "text-white/90 hover:text-[#F5C518]"
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
              <button className="px-8 py-2.5 rounded-xl font-bold text-gray-900 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:shadow-[0_0_15px_rgba(245,197,24,0.4)] transition-all active:scale-95 text-base cursor-pointer">
                Login
              </button>
            </Link>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="px-6 py-2.5 rounded-xl font-bold text-gray-900 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] hover:shadow-[0_0_15px_rgba(245,197,24,0.3)] transition-all flex items-center gap-2 group active:scale-95 cursor-pointer">
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
                className="w-56 bg-zinc-900 border-zinc-800 text-white mt-2 shadow-2xl rounded-xl p-1"
              >
                <div className="px-4 py-3 border-b border-zinc-800/80">
                  <p className="text-xs text-gray-400 font-medium truncate">
                    {user.email}
                  </p>
                  <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <DropdownMenuItem
                  render={
                    <div
                      onClick={handleDashboard}
                      className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <LayoutDashboard size={16} className="text-[#F5C518]" />
                      <span>Dashboard</span>
                    </div>
                  }
                />
                <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                <DropdownMenuItem
                  onClick={handleLogOut}
                  className="flex items-center gap-2 py-2 px-3 cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
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
                <Button variant="outline" className="border-zinc-700 text-white bg-zinc-900 hover:bg-zinc-800">
                  <IoIosMenu size={22} />
                </Button>
              }
            />

            <DropdownMenuContent align="end" className="w-56 bg-zinc-900 border-zinc-800 text-white mt-2 shadow-2xl rounded-xl p-2">
              <DropdownMenuItem
                render={<Link href="/" className="py-2 px-3 block hover:text-[#F5C518]">Home</Link>}
              />
              <DropdownMenuItem
                render={<Link href="/products" className="py-2 px-3 block hover:text-[#F5C518]">Products</Link>}
              />

              <DropdownMenuItem
                render={<Link href="/courses" className="py-2 px-3 block hover:text-[#F5C518]">Courses</Link>}
              />

              <DropdownMenuItem
                render={<Link href="/bundles" className="py-2 px-3 block hover:text-[#F5C518]">Bundles</Link>}
              />

              <DropdownMenuItem
                render={<Link href="/membership" className="py-2 px-3 block hover:text-[#F5C518]">Membership</Link>}
              />

              <DropdownMenuSeparator className="bg-zinc-800 my-1" />

              {!user ? (
                <DropdownMenuItem
                  render={
                    <Link href="/signIn" className="w-full">
                      <button className="w-full text-left font-bold text-[#F5C518] py-2 px-3">
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
                        className="flex items-center gap-2 py-2 px-3 cursor-pointer hover:bg-zinc-800 rounded-lg"
                      >
                        <LayoutDashboard size={16} className="text-[#F5C518]" />
                        <span>Dashboard</span>
                      </div>
                    }
                  />
                  <DropdownMenuItem
                    onClick={handleLogOut}
                    className="flex items-center gap-2 py-2 px-3 cursor-pointer text-red-400 hover:bg-red-500/10 rounded-lg"
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

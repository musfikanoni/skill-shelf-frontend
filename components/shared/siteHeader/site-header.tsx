"use client"

import { Bell, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useGetMeQuery } from "@/redux/api/getMe/getMeApi"

export function SiteHeader() {
  const { data: userData, isLoading } = useGetMeQuery("");
  const user = userData?.data;

  // Format name to get first name for the welcome message
  const firstName = user?.name ? user.name.split(' ')[0] : "User";
  const fullName = user?.name || "User";
  const displayRole = user?.role === "SUPER_ADMIN" ? "Administrator" : (user?.role || "User");

  // Generate initials for the fallback
  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(fullName);

  return (
    <header className="flex h-20 items-center justify-between px-4 md:px-8 bg-white border-b border-slate-100 shrink-0">
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
        <SidebarTrigger className="-ml-1 text-slate-400 hover:bg-slate-100 rounded-md shrink-0" />
        <div className="flex flex-col truncate">
          <div className="flex items-center gap-2 md:gap-3">
            <h2 className="text-lg md:text-2xl font-extrabold text-[#1E293B] truncate">
              Welcome back, {firstName}!
            </h2>
            <div className="hidden sm:flex items-center gap-1 bg-[#FFF1F2] text-[#E11D48] px-2 md:px-3 py-0.5 md:py-1 rounded-full border border-[#FFE4E6] shrink-0">
              <Star className="h-2.5 md:h-3 w-2.5 md:w-3 fill-[#E11D48]" />
              <span className="text-[8px] md:text-[10px] font-bold tracking-wider uppercase">Pro Member</span>
            </div>
          </div>
          <p className="hidden md:block text-sm text-slate-400 font-medium">
            Here is what is happening with your account today.
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        {/* Notification Bell */}
        <div className="relative flex items-center justify-center h-10 w-10 md:h-11 md:w-11 rounded-xl border border-slate-200 bg-white shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute top-2.5 right-2.5 h-2 w-2 md:h-2.5 md:w-2.5 bg-[#FACC15] rounded-full border-2 border-white"></span>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3 bg-white pl-1 md:pl-1.5 pr-2 md:pr-4 py-1 md:py-1.5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
          <Avatar className="h-8 w-8 md:h-9 md:w-9 rounded-lg overflow-hidden">
            <AvatarImage src={user?.picture} alt={fullName} />
            <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs md:text-[13px] font-bold text-[#1E293B] leading-tight">{fullName}</span>
            <span className="text-[8px] md:text-[9px] text-slate-400 font-bold tracking-wider uppercase leading-tight">{displayRole}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

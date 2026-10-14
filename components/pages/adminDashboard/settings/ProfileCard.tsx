import React from 'react';
import { Plus, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileCardProps {
    profile: {
        firstName: string;
        lastName: string;
        avatarUrl?: string;
    };
    defaultAvatar: string;
    onImageClick: () => void;
    onRemoveImage: (e: React.MouseEvent) => void;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    role?: string;
    status?: string;
}

export const ProfileCard = ({
    profile,
    defaultAvatar,
    onImageClick,
    onRemoveImage,
    onImageChange,
    fileInputRef,
    role = "Admin",
    status = "ACTIVE"
}: ProfileCardProps) => {
    // Format role for display
    const displayRole = role === "SUPER_ADMIN" ? "Super Admin" : role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

    // Generate initials for the fallback
    const getInitials = (firstName: string, lastName: string) => {
        if (firstName && lastName) return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
        if (firstName) return firstName.charAt(0).toUpperCase();
        return "U";
    };

    const initials = getInitials(profile.firstName, profile.lastName);

    return (
        <div className="self-stretch h-48 p-8 bg-white rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-slate-200 flex justify-start items-center gap-6">
            <input
                type="file"
                ref={fileInputRef}
                onChange={onImageChange}
                className="hidden"
                accept="image/*"
            />
            <div
                className="relative inline-flex flex-col justify-start items-start cursor-pointer group"
                onClick={onImageClick}
            >
                <Avatar className="w-32 h-32 relative rounded-2xl shadow-[0px_2px_4px_-2px_rgba(0,0,0,0.10)] shadow-md border-4 border-white overflow-hidden group-hover:brightness-90 transition-all after:rounded-2xl">
                    <AvatarImage
                        src={profile.avatarUrl}
                        className="object-cover rounded-none"
                    />
                    <AvatarFallback className="bg-orange-100 text-orange-600 font-bold text-3xl rounded-none">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                {/* Remove Image Button */}
                {profile.avatarUrl && profile.avatarUrl !== defaultAvatar && (
                    <div
                        onClick={onRemoveImage}
                        className="absolute -top-2 -right-2 p-1 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-100 flex flex-col justify-start items-start shadow-md z-20 hover:bg-slate-50 transition-colors"
                    >
                        <div className="w-4 h-4 flex items-center justify-center">
                            <X size={12} className="text-red-500" strokeWidth={3} />
                        </div>
                    </div>
                )}

                {/* Add Image Badge */}
                {profile.avatarUrl === defaultAvatar && (
                    <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-slate-100 flex flex-col justify-start items-start shadow-md z-10">
                        <div className="w-5 h-5 bg-blue-600 rounded-md flex items-center justify-center">
                            <Plus size={14} className="text-white" />
                        </div>
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl overflow-hidden">
                    <div className="bg-black/20 p-2 rounded-full backdrop-blur-sm">
                        <Plus className="text-white w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch justify-center text-slate-900 text-2xl font-bold font-inter leading-8 capitalize">
                        {profile.firstName} {profile.lastName}
                    </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                    <div className="self-stretch justify-center text-slate-500 text-base font-normal font-inter leading-6">{displayRole}</div>
                </div>
                <div className="self-stretch pt-2 inline-flex justify-start items-start gap-2">
                    <div className={`px-3 py-1 rounded-full flex items-center justify-center ${status === "ACTIVE" ? "bg-blue-50" : "bg-red-50"}`}>
                        <span className={`text-xs font-bold font-inter leading-4 tracking-wide ${status === "ACTIVE" ? "text-blue-700" : "text-red-700"}`}>
                            {status === "ACTIVE" ? "ACTIVE USER" : "INACTIVE USER"}
                        </span>
                    </div>
                    {role === "SUPER_ADMIN" && (
                        <div className="px-3 py-1 bg-slate-50 rounded-full flex items-center justify-center">
                            <span className="text-slate-600 text-xs font-bold font-inter leading-4 tracking-wide">HQ TEAM</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-start items-start gap-3">
                <button
                    className="px-5 py-2.5 rounded-[8px]! flex justify-center items-center text-black text-sm font-semibold font-inter leading-5 hover:brightness-105 transition-all shadow-md border-none!"
                    style={{
                        background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
                    }}
                >
                    Send Message
                </button>
            </div>
        </div>
    );
};

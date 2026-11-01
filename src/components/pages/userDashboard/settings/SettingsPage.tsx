"use client";

import React, { useEffect, useState } from "react";
import { User, Lock, ArrowRight, User2 } from "lucide-react";
import {
  useGetMeQuery,
  useUpdateProfileMutation,
} from "@/redux/api/getMe/getMeApi";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useDeleteAccountMutation, useUpdatePasswordMutation } from "@/redux/api/userDashboardApi/userApi";
import useAuthUser from "@/hooks/useGetMe";

interface UserProfile {
  name: string;
  profilePicture: string;
}

export default function Settings() {
  const { data: getMeData } = useGetMeQuery("");
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const userData = getMeData?.data;

  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();

  const [deleteProfile, { isLoading: isDeleting }] = useDeleteAccountMutation();
  const { user } = useAuthUser();

  const handleDelete = async () => {
    try {
      await deleteProfile(user.id).unwrap();

      localStorage.removeItem("token");

      window.location.href = "/signIn";
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const [profile, setProfile] = useState<UserProfile>({
    name: userData?.name || "",
    profilePicture: userData?.picture || "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (userData?.name) {
      setProfile((prev) => ({
        ...prev,
        name: userData.name,
        profilePicture: userData.picture,
      }));
    }
  }, [userData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      console.log("profile picture preview", previewUrl);
      setProfile((prev) => ({ ...prev, profilePicture: previewUrl }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile && profile.name === user?.name) {
      toast.info("No changes to update");
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("files", selectedFile);
    }
    formData.append("name", profile.name);

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Update error:", error);
      console.log("Error data:", error?.data);
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords do not match!");
      return;
    }
    if (!passwords.current || !passwords.new) {
      toast.error("Please fill in all password fields.");
      return;
    }
    try {
      await updatePassword({
        oldPassword: passwords.current,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      } as any).unwrap();
      toast.success("Password updated successfully!");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      console.error("Password update error:", error);
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="w-full p-8 bg-[linear-gradient(180deg,#6C3FC5_50%,#341E5F_145%)] rounded-xl shadow-lg border border-purple-700/50">
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          Account Settings
        </h1>
        <p className="text-purple-100 text-base font-medium">
          Manage your profile and preferences
        </p>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-8 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-black font-bold text-lg">
              <User size={22} strokeWidth={2.5} />
              <h2 className="tracking-tight">Profile Information</h2>
            </div>

            <form
              onSubmit={handleProfileSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <div>
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                      {profile?.profilePicture ? (
                        <Image
                          src={profile?.profilePicture}
                          alt="Profile"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className=" cursor-pointer text-3xl font-bold text-white">
                          <User2 />
                        </span>
                      )}
                    </div>

                    <label
                      htmlFor="profileUpload"
                      className="absolute bottom-0 left-14 p-1.5 bg-blue-600 rounded-full cursor-pointer shadow-lg hover:bg-blue-700 transition-all duration-200 border-2 border-white"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white"
                      >
                        <path d="M17 3l4 4-7 7H10v-4l7-7z" />
                        <path d="M4 20h16" />
                      </svg>
                    </label>

                    <Input
                      id="profileUpload"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600">
                    Name
                  </label>
                  <input
                    type="text"
                    value={profile?.name || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] text-black font-bold rounded-lg active:shadow-none active:translate-y-1 transition-all cursor-pointer shadow-md hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}{" "}
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>
          </section>

          <hr className="border-gray-100" />

          <section className="space-y-6">
            <div className="flex items-center gap-3 text-black font-bold text-lg">
              <Lock size={22} strokeWidth={2.5} />
              <h2 className="tracking-tight">Change Password</h2>
            </div>

            <form
              onSubmit={handlePasswordUpdate}
              className="max-w-md space-y-4"
            >
              {(
                [
                  { label: "Current Password", key: "current" },
                  { label: "New Password", key: "new" },
                  { label: "Confirm New Password", key: "confirm" },
                ] as { label: string; key: keyof typeof passwords }[]
              ).map(({ label, key }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-600">
                    {label}
                  </label>
                  <input
                    type="password"
                    value={passwords[key]}
                    onChange={(e) =>
                      setPasswords((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              ))}
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#6C3FC5] text-white font-bold rounded-lg active:shadow-none active:translate-y-1 transition-all hover:bg-[#5a32a3] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}{" "}
                <ArrowRight size={18} />
              </button>
            </form>
          </section>
        </div>

        <div className="p-8 bg-red-50/50 border-t border-red-100 mt-8">
          <h2 className="text-red-800 font-extrabold text-xl mb-1 tracking-tight">
            Danger Zone
          </h2>
          <p className="text-red-700/90 text-sm font-semibold mb-6">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

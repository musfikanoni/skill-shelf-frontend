"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetMeQuery, useUpdateProfileMutation } from '@/redux/api/getMe/getMeApi';
import { useDeleteUserMutation } from '@/redux/api/userDashboardApi/userManagementApi';
import { DeleteAccountDialog } from './DeleteAccountDialog';
import { SettingsHeader } from './SettingsHeader';
import { ProfileCard } from './ProfileCard';
import { PersonalInfoSection } from './PersonalInfoSection';
import { PasswordSection } from './PasswordSection';
import { PaymentMethodsSection } from './PaymentMethodsSection';
import { DangerZone } from './DangerZone';
import { useChangePasswordMutation } from '@/redux/api/auth/AuthApi';

const DEFAULT_AVATAR = "https://placehold.co/128x128";

interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: string;
    phoneNumber?: string;
}

const SettingsPage = () => {
    const router = useRouter();
    const { data: userData, isLoading } = useGetMeQuery("");
    const [updateProfile] = useUpdateProfileMutation();
    const [deleteUser] = useDeleteUserMutation();
    const [changePassword] = useChangePasswordMutation();
    
    const [profile, setProfile] = React.useState<UserProfile>({
        firstName: "",
        lastName: "",
        email: "",
        avatarUrl: DEFAULT_AVATAR,
        phoneNumber: ""
    });

    React.useEffect(() => {
        if (userData?.data) {
            const user = userData.data;
            const [first, ...last] = (user.name || "").split(' ');
            setProfile({
                firstName: first || "",
                lastName: last.join(' ') || "",
                email: user.email || "",
                avatarUrl: user.picture || DEFAULT_AVATAR,
                phoneNumber: user.phoneNumber || ""
            });
        }
    }, [userData]);

    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: ""
    });

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Handlers
    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        setProfile({ ...profile, avatarUrl: DEFAULT_AVATAR });
        setSelectedFile(null);
        toast.info("Profile picture removed");
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatarUrl: reader.result as string });
                toast.success("Profile picture preview updated!");
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const toastId = toast.loading("Updating profile...");
        try {
            const formData = new FormData();
            formData.append('name', `${profile.firstName} ${profile.lastName}`.trim());
            if (profile.phoneNumber) {
                formData.append('phoneNumber', profile.phoneNumber);
            }
            if (selectedFile) {
                formData.append('files', selectedFile);
            }

            await updateProfile(formData).unwrap();
            toast.success("Profile saved successfully!", { id: toastId });
            setSelectedFile(null);
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update profile", { id: toastId });
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            toast.error("Passwords do not match!");
            return;
        }

        const toastId = toast.loading("Updating password...");
        try {
            await changePassword({
                oldPassword: passwords.current,
                newPassword: passwords.new,
                confirmPassword: passwords.confirm
            }).unwrap();
            
            toast.success("Password updated successfully!", { id: toastId });
            setPasswords({ current: "", new: "", confirm: "" });
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to update password", { id: toastId });
        }
    };

    const handleDeleteAccount = async () => {
        if (!userData?.data?._id) {
            toast.error("User ID not found");
            return;
        }

        const toastId = toast.loading("Deleting account...");
        try {
            await deleteUser(userData.data._id).unwrap();
            toast.success("Account deleted successfully!", { id: toastId });
            setIsDeleteDialogOpen(false);
            router.push('/');
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to delete account", { id: toastId });
            setIsDeleteDialogOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 relative">
            <DeleteAccountDialog 
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteAccount}
            />
            <SettingsHeader />

            <ProfileCard
                profile={profile}
                defaultAvatar={DEFAULT_AVATAR}
                onImageClick={handleImageClick}
                onRemoveImage={handleRemoveImage}
                onImageChange={handleImageChange}
                fileInputRef={fileInputRef}
                role={userData?.data?.role || "User"}
                status={userData?.data?.isActive || "INACTIVE"}
            />

            {/* Main Content Sections */}
            <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                <div className="p-8 space-y-12">
                    <PersonalInfoSection 
                        profile={profile}
                        onProfileChange={(updates) => setProfile({ ...profile, ...updates })}
                        onSubmit={handleProfileSubmit}
                    />
                    
                    <hr className="border-gray-100" />
                    
                    <PasswordSection
                        passwords={passwords}
                        onPasswordChange={setPasswords}
                        onSubmit={handlePasswordUpdate}
                    />

                    <hr className="border-gray-100" />
                    
                    <PaymentMethodsSection />
                </div>

                <DangerZone onDeleteClick={() => setIsDeleteDialogOpen(true)} />
            </div>
        </div>
    );
};

export default SettingsPage;

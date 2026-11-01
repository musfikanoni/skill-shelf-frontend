import React from 'react';

export const SettingsHeader = () => {
    return (
        <div className="w-full p-8 bg-[linear-gradient(180deg,#6C3FC5_50%,#341E5F_145%)] rounded-xl shadow-lg border border-purple-700/50">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                Account Settings
            </h1>
            <p className="text-purple-100 text-base font-medium">
                Manage your profile and preferences
            </p>
        </div>
    );
};

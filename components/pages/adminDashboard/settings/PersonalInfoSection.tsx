import React from 'react';
import { SvgProfileInfo } from '@/lib/icons';

interface PersonalInfoSectionProps {
    profile: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber?: string;
    };
    onProfileChange: (updates: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const PersonalInfoSection = ({ profile, onProfileChange, onSubmit }: PersonalInfoSectionProps) => {
    return (
        <section className="space-y-8">
            <div className="flex items-center gap-3">
                <SvgProfileInfo className="w-5 h-5" />
                <h2 className="text-slate-900 text-2xl font-medium font-poppins tracking-tight">Personal Information</h2>
            </div>

            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                {/* Name Field */}
                <div className="flex flex-col gap-3">
                    <label className="text-slate-700 text-lg font-medium font-poppins">Name</label>
                    <input 
                        type="text"
                        value={`${profile.firstName} ${profile.lastName}`}
                        onChange={(e) => {
                            const name = e.target.value;
                            const splitIndex = name.indexOf(' ');
                            if (splitIndex === -1) {
                                onProfileChange({ firstName: name, lastName: "" });
                            } else {
                                onProfileChange({ 
                                    firstName: name.substring(0, splitIndex), 
                                    lastName: name.substring(splitIndex + 1) 
                                });
                            }
                        }}
                        className="w-full h-14 px-5 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center text-slate-900 text-lg font-normal font-poppins outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Enter your name"
                    />
                </div>

                {/* Email Field */}
                <div className="flex flex-col gap-3">
                    <label className="text-slate-700 text-lg font-medium font-poppins">Email</label>
                    <input 
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full h-14 px-5 py-2 bg-slate-50/50 rounded-lg shadow-sm border border-slate-200 flex items-center text-slate-400 text-lg font-normal font-poppins outline-none cursor-not-allowed transition-all"
                        placeholder="Enter your email"
                    />
                </div>

                {/* Phone Number Field */}
                <div className="flex flex-col gap-3">
                    <label className="text-slate-700 text-lg font-medium font-poppins">Phone Number</label>
                    <input 
                        type="tel"
                        value={profile.phoneNumber || ""}
                        onChange={(e) => onProfileChange({ phoneNumber: e.target.value })}
                        className="w-full h-14 px-5 py-2 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center text-slate-900 text-lg font-normal font-poppins outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="md:col-span-2 pt-4">
                    <button
                        type="submit"
                        className="w-full md:w-52 h-14 px-7 py-2.5 rounded-[8px]! inline-flex justify-center items-center gap-2.5 shadow-md hover:brightness-105 transition-all cursor-pointer border-none! text-black text-lg font-medium font-poppins"
                        style={{
                            background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </section>
    );
};

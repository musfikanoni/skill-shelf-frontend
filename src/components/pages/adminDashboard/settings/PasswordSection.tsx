import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { SvgChangePassword } from '@/lib/icons';

interface PasswordSectionProps {
    passwords: {
        current: string;
        new: string;
        confirm: string;
    };
    onPasswordChange: (updates: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const PasswordSection = ({ passwords, onPasswordChange, onSubmit }: PasswordSectionProps) => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 text-black font-bold text-lg">
                <SvgChangePassword className="w-5 h-5" />
                <h2 className="tracking-tight text-slate-900 text-2xl font-medium font-poppins">Change Password</h2>
            </div>
            <form onSubmit={onSubmit} className="space-y-6 max-w-xl">
                {/* Current Password */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-gray-600">Current Password</label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            placeholder="••••••••"
                            value={passwords.current}
                            onChange={(e) => onPasswordChange({ ...passwords, current: e.target.value })}
                            className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                        >
                            {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* New Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">New Password</label>
                        <div className="relative">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwords.new}
                                onChange={(e) => onPasswordChange({ ...passwords, new: e.target.value })}
                                className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNew(!showNew)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-gray-600">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="••••••••"
                                value={passwords.confirm}
                                onChange={(e) => onPasswordChange({ ...passwords, confirm: e.target.value })}
                                className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white text-gray-900"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                            >
                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="flex items-center justify-center px-8 py-3 bg-[#6C3FC5] text-white font-medium rounded-[14px] hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] font-poppins text-base"
                >
                    Update Password
                </button>
            </form>
        </section>
    );
};

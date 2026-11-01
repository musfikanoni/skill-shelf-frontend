import React from 'react';
import { X } from 'lucide-react';

interface DeleteAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteAccountDialog = ({ isOpen, onClose, onConfirm }: DeleteAccountDialogProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Dialog Box */}
            <div className="w-[440px] relative bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button 
                    onClick={onClose}
                    className="w-8 h-8 absolute right-3 top-3 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors group"
                >
                    <X size={16} className="text-zinc-400 group-hover:text-zinc-800" />
                </button>

                <div className="px-10 py-10 flex flex-col items-center justify-center gap-8">
                    <h3 className="text-center text-zinc-600 text-xl font-semibold font-['Figtree',_sans-serif] leading-normal tracking-tight">
                        Do you want to delete your account?
                    </h3>
                    
                    <div className="flex justify-center items-center gap-4 w-full">
                        {/* YES Button */}
                        <button 
                            onClick={onConfirm}
                            className="flex-1 h-11 rounded-lg flex justify-center items-center shadow-md hover:brightness-105 active:scale-95 transition-all border-none! text-black text-base font-semibold font-['Figtree',_sans-serif]"
                            style={{
                                background: "linear-gradient(180deg, #F5C518 50%, #D73200 222.14%)"
                            }}
                        >
                            Yes
                        </button>
                        
                        {/* NO Button */}
                        <button 
                            onClick={onClose}
                            className="flex-1 h-11 rounded-lg outline outline-2 outline-offset-[-2px] outline-zinc-800 flex justify-center items-center hover:bg-gray-50 active:scale-95 transition-all text-zinc-800 text-base font-semibold font-['Figtree',_sans-serif]"
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

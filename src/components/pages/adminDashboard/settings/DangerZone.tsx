import React from 'react';

interface DangerZoneProps {
    onDeleteClick: () => void;
}

export const DangerZone = ({ onDeleteClick }: DangerZoneProps) => {
    return (
        <div className="p-8 bg-red-50/50 border-t border-red-100 mt-8">
            <h2 className="text-red-800 font-extrabold text-xl mb-1 tracking-tight">Danger Zone</h2>
            <p className="text-red-700/90 text-sm font-semibold mb-6">
                Once you delete your account, there is no going back. Please be certain.
            </p>
            <button 
                onClick={onDeleteClick}
                className="px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 active:scale-95 transition-all"
            >
                Delete Account
            </button>
        </div>
    );
};

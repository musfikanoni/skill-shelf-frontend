import React from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  isLoading?: boolean;
}

const DeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Delete Item", 
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  isLoading = false 
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <h2 className="text-lg font-bold text-slate-900 font-inter">{title}</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-slate-600 font-medium font-inter leading-relaxed">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading && <Loader2 size={16} className="animate-spin" />}
            {isLoading ? 'Deleting...' : 'Delete Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;

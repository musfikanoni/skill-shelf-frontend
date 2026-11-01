"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you absolutely sure?",
  description = "This action cannot be undone. This will permanently delete the record from our servers.",
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white rounded-2xl border-none shadow-2xl max-w-[400px] p-0 overflow-hidden">
        <div className="p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
            <Trash2 size={32} />
          </div>
          
          <div className="space-y-2">
            <AlertDialogTitle className="text-xl font-bold text-slate-900 leading-tight">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 text-sm font-medium">
              {description}
            </AlertDialogDescription>
          </div>
        </div>

        <AlertDialogFooter className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 sm:justify-center">
          <AlertDialogCancel 
            onClick={onClose}
            className="flex-1 h-11 rounded-xl border-slate-200 text-slate-600 font-bold hover:bg-white transition-all m-0"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              onConfirm();
            }}
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-200 border-none transition-all m-0"
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

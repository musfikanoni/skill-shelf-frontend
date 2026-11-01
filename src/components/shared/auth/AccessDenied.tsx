"use client";

import React from 'react';
import { ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AccessDeniedProps {
  title?: string;
  description?: string;
}

export function AccessDenied({ 
  title = "Access Denied", 
  description = "You do not have the required permissions to view this page. Please log in with an administrator account." 
}: AccessDeniedProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center h-[70vh]">
      <Card className="p-8 max-w-md w-full border-2 border-red-100 bg-red-50/50 shadow-xl text-center flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-600">
          {description}
        </p>
        <button 
          onClick={() => router.push('/signIn')}
          className="mt-4 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-all"
        >
          Go to Login
        </button>
      </Card>
    </div>
  );
}

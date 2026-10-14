import React from 'react';
import { Plus } from 'lucide-react';
import { SvgPaymentMethods } from '@/lib/icons';

export const PaymentMethodsSection = () => {
    return (
        <section className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-black font-bold text-lg">
                    <SvgPaymentMethods className="w-5 h-5" />
                    <h2 className="tracking-tight">Payment Methods</h2>
                </div>
            </div>

            <div className="flex items-center justify-between p-5 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-10 bg-indigo-700 rounded-md flex items-center justify-center text-white font-black text-[10px] italic shadow">
                        VISA
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 tracking-widest text-base">•••• •••• •••• 4242</p>
                        <p className="text-xs font-semibold text-gray-500 uppercase">Expires 12/2027</p>
                    </div>
                </div>
                <span className="bg-indigo-600 text-white text-[11px] px-3.5 py-1.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                    Default
                </span>
            </div>

            <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-bold flex items-center justify-center gap-2.5 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800 transition-all group">
                <Plus size={20} className="text-gray-400 group-hover:text-gray-600" /> Add New Payment Method
            </button>
        </section>
    );
};

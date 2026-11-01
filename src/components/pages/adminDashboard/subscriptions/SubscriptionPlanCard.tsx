import React from "react";
import {
  SvgPricingCheck,
  SvgPricingEdit,
  SvgPricingDeactivate,
} from "@/lib/icons";

interface SubscriptionPlanCardProps {
  title: string;
  price: string;
  interval: string;
  features: string[];
  isPopular?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  title,
  price,
  interval,
  features,
  isPopular,
  onEdit,
  onDelete,
}) => {
  return (
    <div className={`relative flex flex-col p-8 ${isPopular ? 'py-12 min-h-[640px] z-10' : 'py-8 min-h-[540px]'} bg-white rounded-3xl outline-2 outline-offset-[-2.10px] ${isPopular ? 'outline-violet-700 shadow-[0px_26px_52px_-12px_rgba(67,0,115,0.10)]' : 'outline-slate-200'} h-fit min-w-[320px] max-w-[400px] transition-all duration-300`}>
      {isPopular && (
        <div className="absolute -top-4 left-[60%] -translate-x-1/2 w-48 h-9 bg-linear-to-b from-violet-700 to-violet-950 rounded-full flex items-center justify-center text-white text-sm font-bold font-inter shadow-md">
          ⭐ MOST POPULAR
        </div>
      )}

      
      <div className="flex flex-col gap-4 mb-8">
        <h3 className="self-stretch text-center justify-start text-slate-900 text-2xl font-semibold font-dm-sans leading-7 tracking-tight">
          {title}
        </h3>
        <div className="text-center justify-start">
          <span className="text-primary-black-Color text-6xl font-bold font-dm-sans leading-[67.20px]">${price}</span>
          <span className="text-text-Color text-2xl font-semibold font-dm-sans leading-7 tracking-tight">/{interval}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <SvgPricingCheck className="w-5 h-5 shrink-0 text-[#00BC7D]" />
            <div className="justify-start text-primary-black-Color text-xl font-semibold font-dm-sans leading-6">
              {feature}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <button 
          onClick={onEdit}
          className="w-full p-3 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] rounded-[14px] flex items-center justify-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <SvgPricingEdit className="w-5 h-5 shrink-0 text-black" />
          <div className="text-center justify-start text-black text-base font-semibold font-roboto leading-6">Edit Plan</div>
        </button>
        
        <button 
          onClick={onDelete}
          className="w-full p-3 rounded-[14px] border border-[#FF4D4F] flex items-center justify-center gap-2.5 transition-colors hover:bg-red-50"
        >
          <SvgPricingDeactivate className="w-5 h-5 shrink-0 text-[#FF4D4F]" />
          <div className="text-center justify-start text-red-500 text-base font-normal font-roboto leading-6">Delete Plan</div>
        </button>
      </div>

    </div>
  );
};

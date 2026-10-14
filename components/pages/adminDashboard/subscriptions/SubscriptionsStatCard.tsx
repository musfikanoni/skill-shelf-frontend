import React from "react";

interface SubscriptionsStatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  borderColor: string;
  textColor: string;
  bgColor: string;
}

export const SubscriptionsStatCard: React.FC<SubscriptionsStatCardProps> = ({
  icon,
  label,
  value,
  borderColor,
  textColor,
  bgColor,
}) => {
  return (
    <div className={`self-stretch p-5 bg-white rounded-md border-l-4 border-r border-t border-b ${borderColor} inline-flex flex-col justify-start items-start gap-5 w-full`}>
      <div className={`w-14 h-14 p-2.5 ${bgColor} rounded-lg inline-flex justify-center items-center gap-2.5 overflow-hidden`}>
        <div className={`w-10 h-10 relative overflow-hidden flex items-center justify-center ${textColor}`}>
          {icon}
        </div>
      </div>
      <div className="self-stretch flex flex-col justify-start items-start gap-5">
        <div className="self-stretch flex flex-col justify-start items-start gap-0.5">
          <div className="self-stretch justify-start text-zinc-800 text-2xl font-bold font-roboto leading-9">
            {value}
          </div>
          <div className={`self-stretch justify-start ${textColor} text-base font-normal font-roboto leading-6`}>
            {label}
          </div>
        </div>
      </div>
    </div>
  );
};


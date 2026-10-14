import React from "react";

interface CouponsStatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const CouponsStatCard: React.FC<CouponsStatCardProps> = ({
  label,
  value,
  valueColor = "text-zinc-800",
}) => {
  return (
    <div className="self-stretch p-5 bg-white rounded-md shadow-[0px_6px_10px_-3px_rgba(0,0,0,0.05)] inline-flex flex-col justify-start items-start gap-2 w-full">
      <div className="self-stretch flex flex-col justify-start items-start">
        <div className="self-stretch justify-start text-slate-500 text-base font-normal font-roboto leading-6">
          {label}
        </div>
        <div className={`self-stretch justify-start ${valueColor} text-2xl font-bold font-roboto leading-9`}>
          {value}
        </div>
      </div>
    </div>
  );
};

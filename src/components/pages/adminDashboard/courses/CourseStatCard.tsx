import React from "react";

interface CourseStatCardProps {
  label: string;
  value: string;
  variant?: "slate" | "emerald" | "purple" | "yellow";
}

const variants = {
  slate: {
    outline: "outline-slate-200",
    text: "text-slate-900",
  },
  emerald: {
    outline: "outline-emerald-200",
    text: "text-emerald-600",
  },
  purple: {
    outline: "outline-purple-200",
    text: "text-purple-600",
  },
  yellow: {
    outline: "outline-yellow-200",
    text: "text-yellow-600",
  },
};

export const CourseStatCard: React.FC<CourseStatCardProps> = ({
  label,
  value,
  variant = "slate",
}) => {
  const styles = variants[variant];

  return (
    <div className={`w-full h-32 px-6 pt-6 pb-0.5 bg-white rounded-2xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg outline outline-2 outline-offset-[-2px] ${styles.outline} inline-flex flex-col justify-start items-start gap-2`}>
      <div className="self-stretch h-6 relative">
        <div className="left-0 top-[-2px] absolute justify-start text-slate-600 text-base font-semibold font-inter leading-6">
          {label}
        </div>
      </div>
      <div className="self-stretch h-10 relative">
        <div className={`left-0 top-[-2px] absolute justify-start ${styles.text} text-4xl font-bold font-inter leading-10`}>
          {value}
        </div>
      </div>
    </div>
  );
};

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
    <div
      className={`w-full min-h-[115px] p-5 sm:p-6 bg-white rounded-2xl shadow-sm outline outline-2 outline-offset-[-2px] ${styles.outline} flex flex-col justify-between gap-3`}
    >
      <span className="text-slate-600 text-sm sm:text-base font-semibold font-inter leading-snug">
        {label}
      </span>
      <span
        className={`${styles.text} text-3xl sm:text-4xl font-bold font-inter leading-none`}
      >
        {value}
      </span>
    </div>
  );
};

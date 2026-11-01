import React from "react";

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

const ShieldHandsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8"
    aria-hidden="true"
  >
    {/* Shield */}
    <path d="M12 2L4 5v6c0 5.25 3.5 10.15 8 11.35C16.5 21.15 20 16.25 20 11V5L12 2z" />
    {/* Hands holding */}
    <path d="M9 13c0 0 .5 2 3 2s3-2 3-2" />
    <path d="M8 10.5C8 9.67 8.67 9 9.5 9s1.5.67 1.5 1.5" />
    <path d="M13 10.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5" />
  </svg>
);

export default function PageHeader({
  icon,
  title,
  description,
  className = "",
}: PageHeaderProps) {
  return (
    <section
      className={`
        relative w-full flex flex-col items-center justify-center
        py-14 px-6 overflow-hidden
        bg-[#0d1224]
        ${className}
      `}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, rgba(99,130,255,0.07) 0%, transparent 80%)",
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Icon */}
      <div className="relative z-10 mb-4 text-slate-300 opacity-90">
        {icon ?? <ShieldHandsIcon />}
      </div>

      {/* Title */}
      <h1
        className="
          relative z-10
          text-white font-bold tracking-tight
          text-2xl sm:text-3xl
          mb-2
        "
        style={{ fontFamily: "'Inter', 'Helvetica Neue', sans-serif" }}
      >
        {title}
      </h1>


      {description && (
        <p
          className="
            relative z-10
            text-slate-400 text-sm sm:text-base
            text-center max-w-md leading-relaxed
          "
        >
          {description}
        </p>
      )}
    </section>
  );
}
"use client";
import React from "react";
import { IconType } from "react-icons";

const SecondaryButton = ({
  label,
  icon: Icon,
  iconPosition = "left",
  onClick,
  size = "md",
  disabled = false,
  type = "button",
}: {
  label: string;
  icon?: IconType;
  iconPosition?: "left" | "right";
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => {
  const sizes = {
    sm: { padding: "7px 14px", fontSize: "16px", gap: "6px", iconSize: 13 },
    md: { padding: "10px 20px", fontSize: "18px", gap: "8px", iconSize: 16 },
    lg: { padding: "13px 26px", fontSize: "24px", gap: "10px", iconSize: 18 },
  };

  const s = sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: s.gap,
        background: "var(--button-linear, linear-gradient(180deg, #F5C518 50%, #D73200 222.14%))",
        color: "#000",
        fontWeight: 700,
        fontSize: s.fontSize,
        padding: s.padding, 
        border: "none",
        borderRadius: "10px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "opacity 0.15s ease, transform 0.1s ease",
        whiteSpace: "nowrap",
        boxShadow: "0 36px 10px 0 rgba(0, 0, 0, 0.00), 0 23px 9px 0 rgba(0, 0, 0, 0.01), 0 13px 8px 0 rgba(0, 0, 0, 0.05), 0 6px 6px 0 rgba(0, 0, 0, 0.09), 0 1px 3px 0 rgba(0, 0, 0, 0.10)",
        lineHeight: 1,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "0.9";
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = "1";
      }}
    >
      {/* Left icon */}
      {Icon && iconPosition === "left" && (
        <Icon size={s.iconSize} strokeWidth={2.5} /> 
      )}

      {label}

      {/* Right icon */}
      {Icon && iconPosition === "right" && (
        <Icon size={s.iconSize} strokeWidth={2.5} />
      )}
    </button>
  );
};

export default SecondaryButton;
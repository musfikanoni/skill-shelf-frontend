import React, { forwardRef, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
  leftIcon?: React.ReactNode;
}

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      label,
      error,
      showPasswordToggle = false,
      containerClassName = "",
      labelClassName = "",
      inputClassName = "",
      errorClassName = "",
      type = "text",
      id,
      leftIcon,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType =
      showPasswordToggle && type === "password"
        ? showPassword
          ? "text"
          : "password"
        : type;

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    const baseInputClassName = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary ${
      error ? "border-red-500" : "border-gray-200"
    }`;

    const finalInputClassName = `${baseInputClassName} ${
      leftIcon ? "pl-10" : ""
    } ${inputClassName}`;

    return (
      <div className={`space-y-2 w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className={`text-sm font-medium block ${labelClassName}`}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {/* ✅ Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={inputType}
            className={finalInputClassName}
            {...props}
          />

          {/* ✅ Password Toggle */}
          {showPasswordToggle && type === "password" && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className={`text-red-500 text-xs ${errorClassName}`}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

CustomInput.displayName = "CustomInput";

export default CustomInput;
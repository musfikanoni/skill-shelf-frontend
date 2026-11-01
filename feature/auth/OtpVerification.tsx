/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useResendCodeMutation,
  useVerifyEmailMutation,
  useResetVerifyOtpMutation,
  useForgetResendOtpMutation,
} from "@/redux/api/auth/AuthApi";
import { toast } from "sonner";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import AuthBackground from "@/components/shared/auth/AuthBackground";
import Logo from "@/components/shared/Logo";
import { X } from "lucide-react";

interface OtpFormValues {
  otp: string[];
}

export default function OtpVerification() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormValues>({
    defaultValues: {
      otp: ["", "", "", ""],
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [activeInput, setActiveInput] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyEmail, { isLoading: isVerifyLoading }] =
    useVerifyEmailMutation();
  const [resendCode] = useResendCodeMutation();
  const [resetVerifyOtp, { isLoading: isForgetLoading }] =
    useResetVerifyOtpMutation();
  const [forgetResendOtp] = useForgetResendOtpMutation();

  const [timeLeft, setTimeLeft] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTime = localStorage.getItem("otpTimer");
      return savedTime ? parseInt(savedTime) : 120;
    }
    return 120;
  });

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        const newTime = timeLeft - 1;
        setTimeLeft(newTime);
        localStorage.setItem("otpTimer", newTime.toString());
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      localStorage.removeItem("otpTimer");
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleResendOTP = () => {
    const email = localStorage.getItem("email");
    localStorage.setItem("otpTimer", "120");
    setTimeLeft(120);
    console.log("Resending OTP...");

    if (type === "forget-password") {
      forgetResendOtp({ email });
    } else {
      resendCode({ email });
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const onSubmit = async (data: OtpFormValues) => {
    const email = localStorage.getItem("email");
    const otpValue = data.otp.join("");
    console.log("OTP submitted:", otpValue);

    const payload = {
      email,
      otp: Number(otpValue),
    };

    try {
      let response;
      if (type === "forget-password") {
        response = await resetVerifyOtp(payload).unwrap();
      } else {
        response = await verifyEmail(payload).unwrap();
      }

      if (response?.success) {
        toast.success("Verification successful!");
        localStorage.removeItem("otpTimer");

        if (type === "forget-password") {
          router.push("/reset-password");
        } else {
          router.push("/signIn");
        }
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Verification failed. Please try again.",
      );
    }
  };

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    if (value.length > 1) return;
    setValue(`otp.${index}`, value);

    if (value !== "" && index < 3) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === "Backspace" &&
      index > 0 &&
      !inputRefs.current[index]?.value
    ) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < 3) {
      setActiveInput(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d{4}$/.test(pastedData)) {
      pastedData.split("").forEach((digit, index) => {
        setValue(`otp.${index}`, digit, { shouldValidate: true });
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = digit;
        }
      });

      setActiveInput(3);
      inputRefs.current[3]?.focus();
    }
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-8 rounded-2xl flex flex-col items-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          aria-label="Close login"
        >
          <X size={20} />
        </button>
        {/* Logo */}
        <Logo />
        <div className="flex flex-col items-center w-full mb-8">
          <h3 className="font-bold text-2xl md:text-[28px] mb-3 text-[#2D2D2D] text-center">
            Confirm <span className="text-[#F5C518]">Email Address</span>
          </h3>
          <p className="text-gray-500 text-[15px] md:text-[16px] text-center">
            We have sent OTP to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="flex justify-center gap-4">
            {[0, 1, 2, 3].map((index) => {
              const { ref, ...rest } = register(`otp.${index}`, {
                required: true,
                pattern: /^[0-9]$/,
              });

              return (
                <input
                  key={index}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`h-14 w-14 md:h-[60px] md:w-[60px] rounded-md border text-center text-xl md:text-2xl font-bold text-[#F5C518] bg-transparent
                   focus:border-[#F5C518] focus:outline-none focus:ring-1 focus:ring-[#F5C518] transition-colors
                   ${
                     activeInput === index || errors.otp?.[index]
                       ? "border-[#F5C518] ring-1 ring-[#F5C518]"
                       : "border-gray-200"
                   }`}
                  {...rest}
                  ref={(el) => {
                    ref(el);
                    inputRefs.current[index] = el;
                  }}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  autoComplete="off"
                />
              );
            })}
          </div>

          <div className="text-center mt-6 mb-2">
            {timeLeft > 0 ? (
              <p className="text-[14px] md:text-[15px] text-[#2D2D2D] font-bold">
                Resend Code (0{formatTime(timeLeft)})
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-[14px] md:text-[15px] text-[#2D2D2D] font-bold hover:underline"
              >
                Resend Code
              </button>
            )}
          </div>

          <PrimaryButton
            type="submit"
            loading={isVerifyLoading || isForgetLoading}
            text="Verify OTP"
          />
        </form>
      </div>
    </AuthBackground>
  );
}

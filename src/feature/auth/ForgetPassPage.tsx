"use client";

import AuthBackground from "@/components/shared/auth/AuthBackground";
import Logo from "@/components/shared/Logo";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useForgetPasswordMutation } from "@/redux/api/auth/AuthApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgetPassPage() {
  const router = useRouter();
  const [forgetPassword, { isLoading }] = useForgetPasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    localStorage.setItem("email", data.email);
    console.log("Form Data:", data);
    try {
      const response = await forgetPassword(data).unwrap();
      if (response?.success) {
        console.log("OTP sent successfully");
        toast.success("OTP sent successfully to your email");
        router.push("/otp?type=forget-password");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Error sending OTP. Please try again.");
    }
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-8 rounded-2xl flex flex-col items-center">
        <Logo />

        <div className="flex flex-col items-center w-full mb-8">
          <h3 className="font-bold text-2xl md:text-[28px] mb-3 text-[#2D2D2D] text-center">
            Forgot <span className="text-[#F5C518]">Password</span>
          </h3>
          <p className="text-gray-500 text-[15px] md:text-[16px] text-center px-4 leading-relaxed">
            Enter the email address on which your account was<br className="hidden md:block" /> registered.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your Email"
            leftIcon={<img src="/images/authImage/mailIcon.png" alt="icon" className="w-5 h-5" />}
            error={errors.email?.message}
            {...register("email")}
          />

          {/* Login Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Send Otp" />
        </form>
      </div>
    </AuthBackground>
  );
}

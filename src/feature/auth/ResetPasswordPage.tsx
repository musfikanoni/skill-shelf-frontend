/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthBackground from "@/components/shared/auth/AuthBackground";
import Logo from "@/components/shared/Logo";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useResetPasswordMutation } from "@/redux/api/auth/AuthApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form"; 
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
//   const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const router = useRouter();
  const email = localStorage.getItem("email");


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await resetPassword({
        // userId,
        email,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (response?.success) {
        console.log("Password reset successfully");
        toast.success("Password reset successfully");
        router.push("/signIn");
      } else {
        console.error("Failed to reset password");
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-8 rounded-2xl flex flex-col items-center">
        {/* Logo */}
        <Logo />

        <div className="flex flex-col items-center w-full mb-8">
          <h3 className="font-bold text-2xl md:text-[28px] mt-2 mb-2 text-[#2D2D2D] text-center">
            Create New Password
          </h3>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Password Input */}
          <CustomInput
            id="newPassword"
            type="password"
            label="Password"
            placeholder="Enter your password"
            leftIcon={<img src="/images/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            showPasswordToggle={true}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          {/* Confirm Password Input */}
          <CustomInput
            id="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Enter your Confirm Password"
            leftIcon={<img src="/images/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            showPasswordToggle={true}
            {...register("confirmPassword")} 
          />

          {/* Save Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Save" />
        </form>
      </div>
    </AuthBackground>
  );
}

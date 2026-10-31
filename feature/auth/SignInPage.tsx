/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthBackground from "@/components/shared/auth/AuthBackground";
import Logo from "@/components/shared/Logo";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useSignInMutation } from "@/redux/api/auth/AuthApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" })
    .min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [signIn, { isLoading }] = useSignInMutation();

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await signIn(data).unwrap();

      if (response?.success) {
        Cookies.set("token", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);

        toast.success("Login successful");
        router.push("/");

        // const role = response?.data?.user?.role;

        // if (role === "SUPER_ADMIN") {
        //   router.push("/admin-dashboard");
        // } else {
        //   router.push("/dashboard");
        // }
      }
    } catch (error: any) {
      console.error(error);

      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-200"
          aria-label="Close login"
        >
          <X size={20} />
        </button>
        <Logo />
        <h3 className="font-bold text-3xl mb-6 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] bg-clip-text text-transparent text-center mt-4">
          Welcome Back!
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Email Input */}
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            leftIcon={
              <img
                src="/images/authImage/mailIcon.png"
                alt="icon"
                className="w-5 h-5"
              />
            }
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password Input */}
          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            error={errors.password?.message}
            leftIcon={
              <img
                src="/images/authImage/passwordIcon.png"
                alt="icon"
                className="w-5 h-5"
              />
            }
            {...register("password")}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                // {...register("rememberMe")}
                className="form-checkbox h-4 w-4 text-[#2196F3] border-[#2196F3] rounded focus:ring-[#2196F3] cursor-pointer"
              />
              <span className="text-sm font-medium text-[#2196F3]">
                Remember Me
              </span>
            </label>
            <Link
              href="/forget-password"
              className="text-sm text-[#FF4D4F] font-semibold text-[16px] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          {/* Login Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Sign In" />
        </form>
        <div className="text-center mb-3 mt-3 text-[16px] text-[#1E1E1E]">
          Are you a new member?{" "}
          <Link
            href="/signUp"
            className="bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] bg-clip-text text-transparent text-[16px] font-semibold hover:underline"
          >
            Sign up
          </Link>
          <p className="mt-4 text-sm">
            © 2026 SkillShelf. All rights reserved.
          </p>
        </div>
      </div>
    </AuthBackground>
  );
}

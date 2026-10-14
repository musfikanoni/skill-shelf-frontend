/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthBackground from "@/components/shared/auth/AuthBackground";
import Logo from "@/components/shared/Logo";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useSignUpMutation } from "@/redux/api/auth/AuthApi";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z
      .string()
      .email({ message: "Please enter a valid company email address" })
      .min(1, { message: "Company email is required" }),
    password: z
      .string()
      .min(6, { message: "Password should be at least 6 characters long" })
      .min(1, { message: "Password is required" }),
    referredByCode: z.string().optional(),
  });

type FormValues = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const [signUp, { isLoading }] = useSignUpMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      referredByCode: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    localStorage.setItem("email", data.email);
    console.log("Form Data:", data);  

    const payload = { 
      name: data.name,
      email: data.email,
      password: data.password,
      referredByCode: data.referredByCode,
    };  

    try {
      const response = await signUp(payload).unwrap();
      if (response?.success) {
        router.push("/otp?type=signup");
      }
    } catch (error: any) {
      console.error("Error during sign up:", error);
      toast(error?.data?.message || "Sign up failed");
    }
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl">
        <Logo />
        <h3 className="font-bold text-3xl mb-6 bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] bg-clip-text text-transparent text-center mt-4">
          Welcome
        </h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">

          <CustomInput
            id="name"
            label="Full Name"
            placeholder="Enter your Full Name"
            leftIcon={<img src="/images/authImage/man.png" alt="icon" className="w-5 h-5" />}
            error={errors.name?.message}
            {...register("name")}
          />

          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your Email"
            leftIcon={<img src="/images/authImage/mailIcon.png" alt="icon" className="w-5 h-5" />}
            error={errors.email?.message}
            {...register("email")}
          />

          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            leftIcon={<img src="/images/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            showPasswordToggle={true}
            error={errors.password?.message}
            {...register("password")}
          />

          <CustomInput
            id="referredByCode"
            label="Referral Code (Optional)"
            placeholder="Enter Referral Code if any"
            error={errors.referredByCode?.message}
            {...register("referredByCode")}
          />

          <PrimaryButton type="submit" loading={isLoading} text="Sign Up" />
        </form>

        <div className="text-center mb-3 mt-3 text-[16px] text-[#1E1E1E]">
          Already have an account?{" "}
          <Link href="/signIn" className="bg-[linear-gradient(180deg,#F5C518_50%,#D73200_222.14%)] bg-clip-text text-transparent text-[16px] font-semibold hover:underline">
            Sign In!
          </Link>
          <p className="mt-4">© 2026 PLR Store. All rights reserved.</p>
        </div>
      </div>
    </AuthBackground>
  );
}

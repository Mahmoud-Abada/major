"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from "react-icons/fa";
import { z } from "zod";

// Define validation schema using Zod
const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string(),
  /*.min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")*/ rememberMe:
    z.boolean().optional().default(true),
});

const SigninForm = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  interface FormValues {
    email: string;
    password: string;
    rememberMe: boolean;
  }

  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    setApiError(null);

    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          const isValidUser =
            data.email === "test@example.com" && data.password === "Test@1234";
          if (isValidUser) {
            resolve("Success");
          } else {
            reject(new Error("Invalid credentials!"));
          }
        }, 1500),
      );

      alert("Signin Successful! Redirecting...");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";

      setApiError(errorMessage);
      setError("email", { message: "Invalid email or password" });
      setError("password", { message: "Invalid email or password" });
    }
  };

  if (!isClient) return null; // Prevents rendering on the server

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-[90%] sm:w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-md"
    >
      {/* Sign In Title */}
      <div className="flex mb-6 items-center justify-between">
        <h2 className=" text-3xl font-semibold text-gray-900">Sign in</h2>
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={48}
          height={46}
          className="block lg:hidden"
        />
      </div>
      {/* API Error Message */}
      {apiError ? (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600"
        >
          {apiError}
        </motion.p>
      ) : null}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className={`w-full h-10 rounded-lg border px-3 text-sm text-gray-700 placeholder-gray-500 focus:outline-none ${
              errors.email
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-100"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="mb-1 flex justify-between text-sm font-medium text-gray-600">
            Password
            <a
              href="/forgot-password"
              className="text-sm font-medium text-gray-900 underline"
            >
              Forgot your password?
            </a>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full h-10 rounded-lg border px-3 pr-10 text-sm text-gray-700 placeholder-gray-500 focus:outline-none ${
                errors.password
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 bg-gray-100"
              }`}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            {...register("rememberMe")}
            className="h-4 w-4 rounded border-gray-400 focus:ring-gray-500"
          />
          <label htmlFor="remember" className="ml-2 text-sm text-gray-900">
            Remember me
          </label>
        </div>

        {/* Sign In Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition-all ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-b from-gray-700 to-gray-900 hover:cursor-pointer hover:opacity-90"
          } focus:outline-none`}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </motion.button>
      </form>

      {/* Signup Link */}
      <p className="mt-4 text-center text-sm font-normal text-gray-900">
        Don&apos;t have an account!{" "}
        <a
          href="/signup"
          className="font-semibold text-gray-900 hover:cursor-pointer underline"
        >
          Sign up
        </a>
      </p>
      <div className="hidden">
        {/* Divider */}
        <div className="my-4 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-900">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="mb-2 flex w-full h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm font-semibold text-gray-900 hover:cursor-pointer transition-all hover:bg-gray-200 active:shadow-inner focus:outline-none"
        >
          <FaGoogle className="mr-2 text-red-500" />
          Sign in with Google
        </motion.button>

        {/* Facebook Sign In */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="flex w-full h-[2.5rem] items-center justify-center rounded-lg border border-gray-300 bg-gray-50 text-sm font-semibold text-gray-900 hover:cursor-pointer transition-all hover:bg-gray-200 active:shadow-inner focus:outline-none"
        >
          <FaFacebook className="mr-2 text-blue-600" />
          Sign in with Facebook
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SigninForm;

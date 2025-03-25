"use client";

import { useState } from "react";
import Image from "next/image";
import { FaGoogle, FaFacebook, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEffect } from "react";

// Define validation schema using Zod
const schema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name must be at least 2 characters")
      .max(30, "First name cannot exceed 30 characters"),
    lastName: z
      .string()
      .min(2, "Last name must be at least 2 characters")
      .max(30, "Last name cannot exceed 30 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignupForm = () => {
  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );
  const roleData = useSelector(
    (state: RootState) => state.userRole.roleData[selectedRole || ""],
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  interface FormValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  useEffect(() => {
    if (roleData) {
      setValue("firstName", roleData.firstName || "");
      setValue("lastName", roleData.lastName || "");
      setValue("email", roleData.email);
      setValue("password", roleData.password);
      setValue("confirmPassword", roleData.password);
    }
  }, [selectedRole, roleData, setValue]);

  // Simulated API request
  const onSubmit = async (data: FormValues) => {
    console.log("Form data:", data);
    setApiError(null);

    try {
      await new Promise((resolve, reject) =>
        setTimeout(() => {
          if (Math.random() > 0.5) {
            resolve("Success");
          } else {
            reject(new Error("Sign up failed, please try again!"));
          }
        }, 1500),
      );

      alert("Signup Successful! Redirecting...");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setApiError(errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-[90%] sm:w-full max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-md"
    >
      {/* Sign Up Title */}
      <div className="flex mb-6 items-center justify-between">
        <h2 className=" text-3xl font-semibold text-gray-900">Sign up</h2>
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
        {/* Name Fields */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="text-sm text-gray-600">First Name</label>
            <input
              type="text"
              placeholder="John"
              {...register("firstName")}
              className={`w-full p-2 border rounded-md ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName.message}</p>
            )}
          </div>

          <div className="flex-1">
            <label className="text-sm text-gray-600">Last Name</label>
            <input
              type="text"
              placeholder="Doe"
              {...register("lastName")}
              className={`w-full p-2 border rounded-md ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register("email")}
            className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="relative">
          <label className="text-sm text-gray-600">Password</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("password")}
            className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <label className="text-sm text-gray-600">Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            {...register("confirmPassword")}
            className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
          />
          <button
            type="button"
            className="absolute right-3 top-9 text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Signup Button */}
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileTap={{ scale: 0.98 }}
          className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition ${
            isSubmitting
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gradient-to-b from-gray-700 to-gray-900 hover:cursor-pointer hover:opacity-90"
          } focus:outline-none`}
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </motion.button>
      </form>

      {/* Login Link */}
      <p className="mt-4 text-center text-sm font-normal text-gray-900">
        Already have an account?{" "}
        <a
          href="/signin"
          className="font-semibold text-gray-900 hover:cursor-pointer underline"
        >
          Sign in
        </a>
      </p>

      {/* Divider */}
      <div className="my-4 flex items-center">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-sm font-normal text-gray-900">or</span>
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
    </motion.div>
  );
};

export default SignupForm;

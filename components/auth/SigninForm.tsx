"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../store/hooks";
import { loginUser } from "../../store/slices/authSlice";

const SigninForm = () => {
  const { theme } = useTheme();
  const locale = useLocale(); // 'en' | 'fr' | 'ar'
  const t = useTranslations("auth");
  const [isClient, setIsClient] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const schema = z.object({
    email: z
      .string()
      .nonempty(t("validation.required"))
      .email(t("validation.email")),
    password: z.string().nonempty(t("validation.required")),
    rememberMe: z.boolean().optional().default(true),
  });

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

  useEffect(() => setIsClient(true), []);

  const onSubmit = async (data: {
    email: string;
    password: string;
    rememberMe: boolean;
  }) => {
    try {
      const resultAction = await dispatch(
        loginUser({
          identifier: data.email.trim().toLowerCase(),
          password: data.password,
        }),
      );

      const loggedUser = resultAction.payload.user;
      console.log("Logged User:", loggedUser);
      const token = loggedUser?.token ?? "";
      localStorage.setItem("token", token);
      if (loginUser.fulfilled.match(resultAction)) {
        router.push("/dashboard");
      } else {
        throw new Error(resultAction.payload as string);
      }
      // router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  if (!isClient) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={`w-[90%] sm:w-full max-w-md rounded-lg border p-6 shadow-md ${
        theme === "dark"
          ? "bg-neutral-800 border-neutral-700"
          : "bg-neutral-100 border-neutral-300"
      }`}
    >
      <div className="flex mb-6 items-center justify-between">
        <h2
          className={`text-3xl font-semibold ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}
        >
          {t("signIn")}
        </h2>
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={48}
          height={46}
          className="block lg:hidden"
        />
      </div>

      {apiError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 rounded p-2 text-sm ${
            theme === "dark"
              ? "bg-red-900 text-red-400"
              : "bg-red-100 text-red-600"
          }`}
        >
          {apiError}
        </motion.p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            className={`mb-1 capitalize block text-sm font-medium ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("email")}
          </label>
          <input
            type="email"
            placeholder={t("emailPlaceholder")}
            {...register("email", { required: t("validation.required") })}
            className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
              errors.email
                ? theme === "dark"
                  ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                  : "border-red-500 bg-red-50 text-neutral-900"
                : theme === "dark"
                  ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                  : "border-neutral-300 bg-neutral-100 text-neutral-900"
            }`}
          />
          {errors.email && (
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            className={`mb-1 flex justify-between text-sm font-medium ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("password")}
            <Link
              href="/forgot-password"
              className={`text-sm font-medium underline ${
                theme === "dark" ? "text-neutral-100" : "text-neutral-900"
              }`}
            >
              {t("forgotPassword")}
            </Link>
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              {...register("password", { required: t("validation.required") })}
              className={`w-full h-10 rounded-lg border px-3 ${
                locale === "ar" ? "text-right" : "text-left"
              } text-sm placeholder-gray-500 focus:outline-none ${
                errors.password
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            />
            <button
              type="button"
              className={`absolute inset-y-0 ${
                locale === "ar" ? "left-3" : "right-3"
              } flex items-center ${
                theme === "dark" ? "text-neutral-300" : "text-neutral-600"
              }`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            {...register("rememberMe")}
            className={`h-4 w-4 rounded focus:ring-2 ${
              theme === "dark"
                ? "border-neutral-600 bg-neutral-700 focus:ring-blue-400"
                : "border-neutral-400 focus:ring-blue-500"
            }`}
          />
          <label
            htmlFor="remember"
            className={`ml-2 text-sm ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("rememberMe")}
          </label>
        </div>

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting}
          className={`w-full h-10 rounded-lg text-sm font-semibold transition-all ${
            isSubmitting
              ? "cursor-not-allowed"
              : "hover:cursor-pointer hover:opacity-90"
          } ${
            theme === "dark"
              ? "bg-gradient-to-b from-neutral-400 to-neutral-200 text-neutral-950"
              : "bg-gradient-to-b from-neutral-600 to-neutral-800 text-neutral-50"
          }`}
        >
          {isSubmitting ? t("signingIn") : t("signIn")}
        </motion.button>
      </form>

      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("noAccount")}{" "}
        <Link
          href="/signup"
          className={`font-semibold underline ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}
        >
          {t("signUp")}
        </Link>
      </p>
    </motion.div>
  );
};

export default SigninForm;

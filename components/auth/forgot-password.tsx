"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useLocale, useTranslations } from "next-intl";

const PasswordResetForm = () => {
  const { theme } = useTheme();
  const locale = useLocale(); // 'en' | 'fr' | 'ar'
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const schema = z
    .object({
      email: z
        .string()
        .nonempty(t("validation.required"))
        .email(t("validation.email")),
      newPassword: z
        .string()
        .nonempty(t("validation.required"))
        .min(8, t("validation.minLength").replace("{length}", "8"))
        .regex(/[A-Z]/, t("validation.passwordUppercase"))
        .regex(/[a-z]/, t("validation.passwordLowercase"))
        .regex(/[^A-Za-z]/, t("validation.passwordSpecialChar")),
      confirmPassword: z.string().nonempty(t("validation.required")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("validation.passwordMatch"),
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: { email: string; newPassword: string }) => {
    // Clear previous errors
    setApiError(null);

    try {
      // API configuration
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const endpoint = `${API_BASE_URL}/auth/forget-password`;

      // Add request timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Locale: locale, // Pass user's language preference
        },
        body: JSON.stringify({
          email: data.email.trim().toLowerCase(), // Normalize email
          newPassword: data.newPassword,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message
          ? t(`apiErrors.${errorData.message}`, errorData.message) // Try to translate
          : t("apiErrors.default");
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Validate response structure
      if (!result.success) {
        throw new Error(t("apiErrors.invalidResponse"));
      }

      // Show success notification
      /*showToast({
        type: 'success',
        message: t('resetPassword.success'),
        autoClose: 5000,
      });*/

      router.push("/login");
    } catch (error: unknown) {
      // Handle specific error types
      if (error instanceof DOMException && error.name === "AbortError") {
        setApiError(t("apiErrors.timeout"));
      } else {
        const errorMessage =
          error instanceof Error ? error.message : t("apiErrors.unknown");

        setApiError(errorMessage);

        // Set field-specific errors when appropriate
        if (errorMessage.includes("email")) {
          setError("email", { message: errorMessage });
        } else if (errorMessage.includes("password")) {
          setError("newPassword", { message: errorMessage });
        }
      }

      // Log error for debugging
      console.error("Password Reset Error:", error);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
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
            {t("resetPassword")}
          </h2>
          <Image
            src={"/major-logo.svg"}
            alt={"major app"}
            width={48}
            height={46}
            className="block lg:hidden"
          />
        </div>

        <div className="text-center py-8">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              theme === "dark" ? "bg-green-900/20" : "bg-green-100"
            }`}
          >
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h3
            className={`text-xl font-semibold mb-2 ${
              theme === "dark" ? "text-neutral-50" : "text-neutral-950"
            }`}
          >
            {t("resetSuccessful")}
          </h3>
          <p
            className={`mb-6 ${
              theme === "dark" ? "text-neutral-300" : "text-neutral-600"
            }`}
          >
            {t("passwordUpdated")}
          </p>

          <Link
            href="/signin"
            className={`w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
              theme === "dark"
                ? "bg-gradient-to-b from-neutral-400 to-neutral-200 text-neutral-950"
                : "bg-gradient-to-b from-neutral-600 to-neutral-800 text-neutral-50"
            } hover:opacity-90 focus:outline-none`}
          >
            {t("signInNow")}
          </Link>
        </div>
      </motion.div>
    );
  }

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
          {t("resetPassword")}
        </h2>
        <Image
          src={"/major-logo.svg"}
          alt={"major app"}
          width={48}
          height={46}
          className="block lg:hidden"
        />
      </div>

      <p
        className={`mb-6 text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-600"
        }`}
      >
        {t("resetPasswordInstructions")}
      </p>

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
        {/* Email */}
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
            {...register("email")}
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

        {/* New Password */}
        <div>
          <label
            className={`mb-1 block text-sm font-medium ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("newPassword")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("newPasswordPlaceholder")}
              {...register("newPassword")}
              className={`w-full h-10 rounded-lg border px-3 ${
                locale === "ar" ? "text-right" : "text-left"
              } text-sm placeholder-gray-500 focus:outline-none ${
                errors.newPassword
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
          {errors.newPassword && (
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            className={`mb-1 block text-sm font-medium ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("confirmPassword")}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder={t("confirmPasswordPlaceholder")}
              {...register("confirmPassword")}
              className={`w-full h-10 rounded-lg border px-3 ${
                locale === "ar" ? "text-right" : "text-left"
              } text-sm placeholder-gray-500 focus:outline-none ${
                errors.confirmPassword
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
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash size={18} />
              ) : (
                <FaEye size={18} />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              className={`text-sm mt-1 ${
                theme === "dark" ? "text-red-400" : "text-red-600"
              }`}
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Password Requirements */}
        <div
          className={`p-3 rounded-lg text-sm ${
            theme === "dark"
              ? "bg-neutral-700/50 text-neutral-300"
              : "bg-neutral-200/50 text-neutral-600"
          }`}
        >
          <p
            className={`font-medium mb-1 ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("passwordRequirements")}:
          </p>
          <ul className="list-none space-y-1">
            <li className="flex items-center gap-2">
              <span
                className={
                  watch("newPassword")?.length >= 8
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-500"
                      : "text-neutral-400"
                }
              >
                {watch("newPassword")?.length >= 8 ? "✓" : "○"}
              </span>
              <span
                className={
                  watch("newPassword")?.length >= 8
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-600"
                }
              >
                {t("atLeast8Chars")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={
                  /[a-z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-500"
                      : "text-neutral-400"
                }
              >
                {/[a-z]/.test(watch("newPassword")) ? "✓" : "○"}
              </span>
              <span
                className={
                  /[a-z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-600"
                }
              >
                {t("atLeastLowercase")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={
                  /[A-Z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-500"
                      : "text-neutral-400"
                }
              >
                {/[A-Z]/.test(watch("newPassword")) ? "✓" : "○"}
              </span>
              <span
                className={
                  /[A-Z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-600"
                }
              >
                {t("atLeastUppercase")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={
                  /[^A-Za-z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-500"
                      : "text-neutral-400"
                }
              >
                {/[^A-Za-z]/.test(watch("newPassword")) ? "✓" : "○"}
              </span>
              <span
                className={
                  /[^A-Za-z]/.test(watch("newPassword"))
                    ? "text-green-500"
                    : theme === "dark"
                      ? "text-neutral-300"
                      : "text-neutral-600"
                }
              >
                {t("atLeastSpecialChar")}
              </span>
            </li>
          </ul>
        </div>

        {/* Reset Button */}
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
          {isSubmitting ? t("resetting") : t("resetPassword")}
        </motion.button>
      </form>

      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("rememberPassword")}{" "}
        <Link
          href="/signin"
          className={`font-semibold underline ${
            theme === "dark" ? "text-neutral-50" : "text-neutral-950"
          }`}
        >
          {t("signIn")}
        </Link>
      </p>
    </motion.div>
  );
};

export default PasswordResetForm;

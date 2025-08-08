"use client";

import { useAuth } from "@/hooks/useAuth";
import { createResetPasswordSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import AuthForm from "./AuthForm";
import { TextField } from "./FormField";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const t = useTranslations("auth");
  const { resetPassword, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const schema = createResetPasswordSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const watchPassword = form.watch("newPassword");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    clearError();
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const passwordRequirements = [
    {
      test: (password: string) => password.length >= 8,
      message: t("passwordRequirements.minLength"),
    },
    {
      test: (password: string) => /[a-z]/.test(password),
      message: t("passwordRequirements.lowercase"),
    },
    {
      test: (password: string) => /[A-Z]/.test(password),
      message: t("passwordRequirements.uppercase"),
    },
    {
      test: (password: string) => /[0-9]/.test(password),
      message: t("passwordRequirements.number"),
    },
    {
      test: (password: string) => /[^A-Za-z0-9]/.test(password),
      message: t("passwordRequirements.specialChar"),
    },
  ];

  return (
    <AuthForm
      title={t("resetPassword")}
      description={t("resetPasswordDescription")}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={loading ? t("resetting") : t("resetPassword")}
      error={error}
    >
      <div className="relative">
        <TextField
          control={form.control}
          name="newPassword"
          label={t("newPassword")}
          placeholder={t("newPasswordPlaceholder")}
          type={showPassword ? "text" : "password"}
          required
        />
        <button
          type="button"
          className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-neutral-600 dark:text-neutral-300"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>

      <div className="relative">
        <TextField
          control={form.control}
          name="confirmPassword"
          label={t("confirmPassword")}
          placeholder={t("confirmPasswordPlaceholder")}
          type={showConfirmPassword ? "text" : "password"}
          required
        />
        <button
          type="button"
          className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-neutral-600 dark:text-neutral-300"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
        </button>
      </div>

      {/* Password Requirements */}
      <div className="rounded-lg bg-neutral-200/50 p-3 text-sm dark:bg-neutral-700/50">
        <p className="mb-2 font-medium text-neutral-800 dark:text-neutral-200">
          {t("passwordRequirements.title")}:
        </p>
        <ul className="space-y-1">
          {passwordRequirements.map((requirement, index) => {
            const isValid = requirement.test(watchPassword || "");
            return (
              <li key={index} className="flex items-center gap-2">
                <span
                  className={
                    isValid
                      ? "text-green-500"
                      : "text-neutral-400 dark:text-neutral-500"
                  }
                >
                  {isValid ? "✓" : "○"}
                </span>
                <span
                  className={
                    isValid
                      ? "text-green-500"
                      : "text-neutral-600 dark:text-neutral-300"
                  }
                >
                  {requirement.message}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="pt-4">
        <p className="text-center text-sm text-neutral-950 dark:text-neutral-300">
          {t("rememberPassword")}{" "}
          <Link
            href="/signin"
            className="font-semibold text-neutral-950 underline dark:text-neutral-50"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}

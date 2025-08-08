"use client";

import { useAuth } from "@/hooks/useAuth";
import { createForgotPasswordSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthForm from "./AuthForm";
import { TextField } from "./FormField";

export default function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const { forgetPassword, loading, error, clearError } = useAuth();

  const schema = createForgotPasswordSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    clearError();
    try {
      // For the forgot password flow, we need to find the user first
      // This is a simplified implementation - you might need to adjust based on your API
      await forgetPassword({
        userId: data.identifier, // This might need to be handled differently
      });
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <AuthForm
      title={t("forgotPassword")}
      description={t("forgotPasswordDescription")}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={loading ? t("sending") : t("sendResetCode")}
      error={error}
    >
      <TextField
        control={form.control}
        name="identifier"
        label={t("emailOrPhone")}
        placeholder={t("emailOrPhonePlaceholder")}
        type="text"
        required
      />

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

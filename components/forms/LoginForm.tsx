"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { createLoginSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import AuthForm from "./AuthForm";
import { TextField } from "./FormField";

export default function LoginForm() {
  const t = useTranslations("auth");
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const schema = createLoginSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    clearError();
    try {
      await login({
        identifier: data.identifier.trim().toLowerCase(),
        password: data.password,
      });
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <AuthForm
      title={t("signIn")}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={loading ? t("signingIn") : t("signIn")}
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

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {t("password")}
           
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-neutral-900 underline dark:text-neutral-100"
          >
            {t("forgotPassword")}
          </Link>
        </div>
        <div className="relative">
          <TextField
            control={form.control}
            name="password"
            label=""
            placeholder={t("passwordPlaceholder")}
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
      </div>

      <FormField
        control={form.control}
        name="rememberMe"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm text-neutral-800 dark:text-neutral-200">
                {t("rememberMe")}
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <div className="pt-4">
        <p className="text-center text-sm text-neutral-950 dark:text-neutral-300">
          {t("noAccount")}{" "}
          <Link
            href="/signup"
            className="font-semibold text-neutral-950 underline dark:text-neutral-50"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}

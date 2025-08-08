"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { createOTPSchema } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AuthForm from "./AuthForm";

type VerificationMethod = "email" | "phone";
type OTPType = "verification" | "reset";

export default function OTPForm() {
  const t = useTranslations("auth");
  const searchParams = useSearchParams();
  const { verifyOTP, sendOTP, loading, error, clearError } = useAuth();

  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("email");
  const [contactInfo, setContactInfo] = useState("example@email.com");
  const [otpDigits, setOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const otpType: OTPType =
    (searchParams?.get("type") as OTPType) || "verification";

  const schema = createOTPSchema(t);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      otp: "",
    },
  });

  // Handle resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, resendTimer]);

  // Auto-focus first input on load
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  // Update form value when OTP digits change
  useEffect(() => {
    const otpValue = otpDigits.join("");
    form.setValue("otp", otpValue);
  }, [otpDigits, form]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      // Auto-focus next input if there's a value
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      // Handle backspace/delete
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = "";
      setOtpDigits(newOtpDigits);

      // Focus previous input on backspace if current is empty
      if (index > 0 && !newOtpDigits[index]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (pasteData.length === 6) {
      const newOtpDigits = pasteData.split("");
      setOtpDigits(newOtpDigits);
      inputRefs.current[5]?.focus();
    }
  };

  const toggleVerificationMethod = () => {
    const newMethod = verificationMethod === "email" ? "phone" : "email";
    setVerificationMethod(newMethod);
    setContactInfo(newMethod === "email" ? "example@email.com" : "0778564321");
  };

  const handleResendOTP = async () => {
    const userId =
      sessionStorage.getItem(otpType === "reset" ? "resetUserId" : "userId") ||
      "";

    try {
      clearError();
      await sendOTP({
        userId,
        sendWhere: verificationMethod === "phone" ? "sms" : "email",
      });

      setResendDisabled(true);
      setResendTimer(60);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    clearError();
    const userId =
      sessionStorage.getItem(otpType === "reset" ? "resetUserId" : "userId") ||
      "";

    try {
      await verifyOTP({
        userId,
        otp: data.otp,
      });
    } catch (err) {
      // Clear OTP and focus first input on error
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  const title = otpType === "reset" ? t("verifyResetCode") : t("verifyAccount");
  const description =
    otpType === "reset"
      ? t("resetCodeSentMessage")
      : t("verificationCodeSentMessage");

  return (
    <AuthForm
      title={title}
      description={`${description} ${contactInfo}`}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={loading ? t("verifying") : t("verify")}
      error={error}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            {t("verificationCode")}
          </label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            disabled={resendDisabled || loading}
            className="h-auto p-0 text-sm underline"
          >
            {resendDisabled
              ? t("resendIn", { time: resendTimer.toString() })
              : t("resendCode")}
          </Button>
        </div>

        <div
          className="flex justify-between gap-1 sm:gap-2"
          onPaste={handlePaste}
        >
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg border border-neutral-300 bg-neutral-100 text-center text-lg sm:text-xl font-semibold text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-blue-400 dark:focus:ring-blue-400/20"
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="text-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleVerificationMethod}
            className="text-sm underline"
          >
            {t("useInstead", {
              method: verificationMethod === "email" ? t("phone") : t("email"),
            })}
          </Button>
        </div>
      </div>

      <div className="pt-4 space-y-2">
        <p className="text-center text-sm text-neutral-950 dark:text-neutral-300">
          {t("alreadyAccount")}{" "}
          <Link
            href="/signin"
            className="font-semibold text-neutral-950 underline dark:text-neutral-50"
          >
            {t("signIn")}
          </Link>
        </p>

        <p className="text-center text-sm text-neutral-950 dark:text-neutral-300">
          {t("havingTrouble")}{" "}
          <Link
            href="/support"
            className="font-semibold text-neutral-950 underline dark:text-neutral-50"
          >
            {t("contactSupport")}
          </Link>
        </p>
      </div>
    </AuthForm>
  );
}

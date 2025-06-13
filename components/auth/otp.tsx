"use client";

import { useLanguage, useTheme } from "@/lib/redux/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslation } from "../../config/i18n/client";

type VerificationMethod = "email" | "phone";

const OTPVerificationForm = () => {
  const { theme } = useTheme();
  const { lang } = useLanguage();
  const { t } = useTranslation(lang, "auth");
  const [isClient] = useState(true);
  const [verificationMethod, setVerificationMethod] =
    useState<VerificationMethod>("email");
  const [contactInfo, setContactInfo] = useState("example@email.com");
  const [apiError, setApiError] = useState<string | null>(null);
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
  const router = useRouter();
  const schema = z.object({
    otp: z
      .string()
      .length(6, { message: t("validation.otpLength") }) // Use translation for error message
      .regex(/^\d+$/, { message: t("validation.otpDigits") }), // Ensure OTP contains only digits
  });

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { otp: "" },
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
    if (isClient && inputRefs.current[0]) {
      inputRefs.current[0]?.focus();
    }
  }, [isClient]);

  const handleOtpChange = (index: number, value: string) => {
    if (/^[0-9]$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      // Update the `otp` field in react-hook-form
      setValue("otp", newOtpDigits.join(""));

      // Auto-focus next input if there's a value
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (value === "") {
      // Handle backspace/delete
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = "";
      setOtpDigits(newOtpDigits);

      // Update the `otp` field in react-hook-form
      setValue("otp", newOtpDigits.join(""));

      // Focus previous input on backspace if current is empty
      if (index > 0 && !newOtpDigits[index]) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text/plain").replace(/\D/g, "");
    if (pasteData.length === 6) {
      const newOtpDigits = pasteData.split("");
      setOtpDigits(newOtpDigits);

      // Focus the last input after paste
      inputRefs.current[5]?.focus();
    }
  };


  const toggleVerificationMethod = () => {
    const newMethod = verificationMethod === "email" ? "phone" : "email";
    setVerificationMethod(newMethod);
    setContactInfo(newMethod === "email" ? "example@email.com" : "0778564321");
  };

  const sendOTP = async (sendWhere: "whatsapp" | "sms" | "email") => {
    try {
      setApiError(null);

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const endpoint = `${API_BASE_URL}/auth/send-otp`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Get userId from your auth state or session
      const userId = sessionStorage.getItem("userId") || "";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Locale: lang, // 'en', 'fr', or 'ar'
        },
        body: JSON.stringify({
          userId,
          sendWhere,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message
          ? t(`apiErrors.${errorData.message}`, errorData.message)
          : t("apiErrors.default");
        throw new Error(errorMessage);
      }

      const result = await response.json();

      // Store session token securely
      if (result.sessionToken) {
        sessionStorage.setItem("otpSessionToken", result.sessionToken);
      }

      // Update UI state
      setResendDisabled(true);
      setResendTimer(60);
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      /*showToast({
        type: 'success',
        message: t('otp.sentSuccess', { method: t(sendWhere) }),
        autoClose: 3000,
      });*/
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t("apiErrors.unknown");

      setApiError(errorMessage);
      console.error("OTP Send Error:", error);
    }
  };

  const verifyOTP = async (otpValue: string) => {
    try {
      setApiError(null);

      // Basic validation
      if (otpValue.length !== 6 || !/^\d+$/.test(otpValue)) {
        throw new Error(t("validation.otpInvalid"));
      }

      const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
      const endpoint = `${API_BASE_URL}/auth/verify-otp`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      // Get userId from your auth state or session
      const userId = sessionStorage.getItem("userId") || "";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Locale: lang,
        },
        body: JSON.stringify({
          userId,
          otp: otpValue,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message
          ? t(`apiErrors.${errorData.message}`, errorData.message)
          : t("apiErrors.default");
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.verified) {
        throw new Error(t("apiErrors.otpVerificationFailed"));
      }

      // Store tokens and user data
      if (result.token) {
        sessionStorage.setItem("authToken", result.token);
      }

      // Clear OTP session token after successful verification
      sessionStorage.removeItem("otpSessionToken");

      /*showToast({
        type: 'success',
        message: t('otp.verificationSuccess'),
        autoClose: 3000,
      });*/

      router.push("/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : t("apiErrors.unknown");

      setApiError(errorMessage);
      setError("otp", { message: errorMessage });

      // Clear OTP and focus first input on error
      setOtpDigits(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();

      console.error("OTP Verification Error:", error);
    }
  };

  const handleResendOTP = () => {
    const method = verificationMethod === "email" ? "email" : "sms";
    sendOTP(method);
  };

  const onSubmit = handleSubmit(() => {
    verifyOTP(otpDigits.join(""));
  });


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
          {t("verifyAccount")}
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
          theme === "dark" ? "text-neutral-200" : "text-neutral-800"
        }`}
      >
        {t("sentCodeMessage")}{" "}
        <span className="font-medium">{contactInfo}</span>
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

      <form onSubmit={onSubmit}>
        <label
          className={`flex justify-between text-sm font-medium ${
            theme === "dark" ? "text-neutral-200" : "text-neutral-800"
          }`}
        >
          {t("verificationCode")}
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={resendDisabled}
            className={`text-sm ${
              resendDisabled
                ? "text-neutral-500"
                : theme === "dark"
                  ? "text-neutral-100"
                  : "text-neutral-900"
            } ${!resendDisabled ? "underline" : ""}`}
          >
            {resendDisabled
              ? `${t("resendIn").replace("{time}", resendTimer.toString())}`
              : t("resendCode")}
          </button>
        </label>
        <div className="flex justify-between gap-2 mt-6" onPaste={handlePaste}>
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digit && index > 0) {
                  inputRefs.current[index - 1]?.focus();
                }
              }}
              className={`h-12 w-12 mb-2 rounded-lg border text-center text-xl font-semibold focus:outline-none focus:ring-2 ${
                errors.otp
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100 focus:ring-blue-400"
                    : "border-red-500 bg-red-50 text-neutral-900 focus:ring-blue-500"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100 focus:ring-blue-400"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900 focus:ring-blue-500"
              }`}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {errors.otp?.type === "validate" && (
          <p className="text-red-500 text-sm">{errors.otp.message}</p>
        )}

        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || otpDigits.some((d) => d === "")}
          className={`w-full mt-4 h-10 rounded-lg text-sm font-semibold transition-all ${
            isSubmitting || otpDigits.some((d) => d === "")
              ? "cursor-not-allowed"
              : "hover:cursor-pointer"
          }
              ${
                theme === "dark"
                  ? "bg-gradient-to-b from-neutral-400 to-neutral-200 hover:opacity-90"
                  : "bg-gradient-to-b from-neutral-600 to-neutral-800 hover:opacity-90"
              } ${theme === "dark" ? "text-neutral-950" : "text-neutral-50"}`}
        >
          {isSubmitting ? t("verifying") : t("verify")}
        </motion.button>
      </form>

      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("noCodeMessage")}{" "}
        <button
          type="button"
          onClick={toggleVerificationMethod}
          className={`font-semibold ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"} underline`}
        >
          {t("useInstead").replace(
            "{method}",
            verificationMethod === "email" ? t("phone") : t("email")
          )}
        </button>
      </p>

      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("alreadyAccount")}{" "}
        <a
          href="/signin"
          className={`font-semibold ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"} underline`}
        >
          {t("signIn")}
        </a>
      </p>
      <p
        className={`mt-4 text-center text-sm ${
          theme === "dark" ? "text-neutral-300" : "text-neutral-950"
        }`}
      >
        {t("havingTrouble")}{" "}
        <a
          href="/support"
          className={`font-semibold ${theme === "dark" ? "text-neutral-50" : "text-neutral-950"} underline`}
        >
          {t("contactSupport")}
        </a>
      </p>
    </motion.div>
  );
};

export default OTPVerificationForm;

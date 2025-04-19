"use client";

import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/components/ui/stepper";
import { schoolSchema } from "@/lib/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";
import LocationSelector from "../LocationSelector";
import { LocationData } from "../../types/location";
import { redirect } from "next/navigation";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "../ui/toast";

interface UseProgressTimerProps {
  duration: number;
  interval?: number;
  onComplete?: () => void;
}

//type ApiStatus = "idle" | "pending" | "success" | "error";

function useProgressTimer({
  duration,
  interval = 100,
  onComplete,
}: UseProgressTimerProps) {
  const [progress, setProgress] = useState(duration);
  const timerRef = useRef(0);
  const timerState = useRef({
    startTime: 0,
    remaining: duration,
    isPaused: false,
  });

  const cleanup = useCallback(() => {
    window.clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    cleanup();
    setProgress(duration);
    timerState.current = {
      startTime: 0,
      remaining: duration,
      isPaused: false,
    };
  }, [duration, cleanup]);

  const start = useCallback(() => {
    const state = timerState.current;
    state.startTime = Date.now();
    state.isPaused = false;

    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - state.startTime;
      const remaining = Math.max(0, state.remaining - elapsedTime);

      setProgress(remaining);

      if (remaining <= 0) {
        cleanup();
        onComplete?.();
      }
    }, interval);
  }, [interval, cleanup, onComplete]);

  const pause = useCallback(() => {
    const state = timerState.current;
    if (!state.isPaused) {
      cleanup();
      state.remaining = Math.max(
        0,
        state.remaining - (Date.now() - state.startTime),
      );
      state.isPaused = true;
    }
  }, [cleanup]);

  const resume = useCallback(() => {
    const state = timerState.current;
    if (state.isPaused && state.remaining > 0) {
      start();
    }
  }, [start]);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    progress,
    start,
    pause,
    resume,
    reset,
  };
}

const SchoolSignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showCustomSchoolType, setShowCustomSchoolType] = useState(false);
  const [showCustomRole, setShowCustomRole] = useState(false);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [open, setOpen] = useState(false);
  const toastDuration = 5000;
  const { progress, start, pause, resume } = useProgressTimer({
    duration: toastDuration,
    onComplete: () => setOpen(false),
  });

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setTimeout(() => {
        setOpen(isOpen);
        if (isOpen) {
          start();
        }
      }, 1000);
      setTimeout(() => {
        redirect("/otp");
      }, 4000);
    },
    [, start],
  );

  const handleButtonClick = useCallback(() => {
    if (open) {
      setOpen(false);
      // Wait for the close animation to finish
      window.setTimeout(() => {
        handleOpenChange(true);
      }, 150);
    } else {
      handleOpenChange(true);
    }
  }, [open, handleOpenChange]);

  const steps = [1, 2, 3];
  type FormValues = z.infer<typeof schoolSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
  });

  const schoolType = watch("schoolType");
  const representativeRole = watch("representativeRole");

  useEffect(() => {
    setShowCustomSchoolType(schoolType === "other");
  }, [schoolType]);

  useEffect(() => {
    setShowCustomRole(representativeRole === "other");
  }, [representativeRole]);

  const nextStep = async () => {
    // Validate current step fields before proceeding
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger([
        "schoolName",
        "schoolType",
        "location",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "representativeName",
        "representativeRole",
        "branchesCount",
        "approxTeachers",
        "approxStudents",
      ]);
    } else {
      // Step 3 has no required fields (all optional)
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: FormValues) => {
    setApiError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Form submitted:", data);
      alert("Signup Successful! Redirecting...");
    } catch (error) {
      setApiError(
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* API Error Message */}
      {apiError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600"
        >
          {apiError}
        </motion.p>
      )}

      {/* Step 1 - School Basic Info */}
      {currentStep === 1 && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              School Name
            </label>
            <input
              type="text"
              placeholder="Major Academy"
              {...register("schoolName")}
              className={`w-full p-2 border rounded-md ${errors.schoolName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.schoolName && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              School Type
            </label>
            <select
              {...register("schoolType")}
              defaultValue="private"
              className={`w-full p-2 border rounded-md ${errors.schoolType ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="private">Private School</option>
              <option value="public">Public School</option>
              <option value="university">University</option>
              <option value="private-university">Private University</option>
              <option value="preschool">Preschool</option>
              <option value="language">Language School</option>
              <option value="support">Support School</option>
              <option value="formation">Formation Center</option>
              <option value="other">Other</option>
            </select>
            {showCustomSchoolType && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify school type"
                  {...register("schoolType")}
                  className={`w-full p-2 border rounded-md ${errors.schoolType ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.schoolType && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.schoolType.message}
                  </p>
                )}
              </div>
            )}
            {errors.schoolType && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.schoolType.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Location</label>
            {/* Location */}
            <LocationSelector
              value={locationData}
              onChange={setLocationData}
              error={errors.location?.message}
            />
            {errors.location && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.location.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="school@example.com"
              {...register("email")}
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="0123456789"
              {...register("phone")}
              className={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.phone && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`w-full p-2 border rounded-md ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.password && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword")}
              className={`w-full p-2 border rounded-md ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
            {errors.confirmPassword && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Step 2 - Representative and School Stats */}
      {currentStep === 2 && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Representative Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              {...register("representativeName")}
              className={`w-full p-2 border rounded-md ${errors.representativeName ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.representativeName && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.representativeName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Representative Role
            </label>
            <select
              {...register("representativeRole")}
              defaultValue="principal"
              className={`w-full p-2 border rounded-md ${errors.representativeRole ? "border-red-500" : "border-gray-300"}`}
            >
              <option value="principal">Principal</option>
              <option value="owner">Owner</option>
              <option value="administrator">Administrator</option>
              <option value="manager">Manager</option>
              <option value="other">Other</option>
            </select>
            {showCustomRole && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify representative role"
                  {...register("representativeRole")}
                  className={`w-full p-2 border rounded-md ${errors.representativeRole ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.representativeRole && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.representativeRole.message}
                  </p>
                )}
              </div>
            )}
            {errors.representativeRole && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.representativeRole.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Number of Branches
            </label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="1"
              {...register("branchesCount", { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md ${errors.branchesCount ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.branchesCount && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.branchesCount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Approximate Number of Teachers
            </label>
            <input
              type="number"
              min="1"
              placeholder="50"
              {...register("approxTeachers", { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md ${errors.approxTeachers ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.approxTeachers && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.approxTeachers.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Approximate Number of Students
            </label>
            <input
              type="number"
              min="1"
              placeholder="500"
              {...register("approxStudents", { valueAsNumber: true })}
              className={`w-full p-2 border rounded-md ${errors.approxStudents ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.approxStudents && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.approxStudents.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Step 3 - Optional Fields */}
      {currentStep === 3 && (
        <>
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              placeholder="https://example.com/profile.jpg"
              {...register("profilePicture")}
              className={`w-full p-2 border rounded-md ${errors.profilePicture ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.profilePicture && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.profilePicture.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Social Links (comma separated)
            </label>
            <input
              type="text"
              placeholder="facebook:url, twitter:url, instagram:url"
              {...register("socialLinks")}
              className={`w-full p-2 border rounded-md ${errors.socialLinks ? "border-red-500" : "border-gray-300"}`}
              onChange={(e) => {
                const links = e.target.value.split(",").reduce(
                  (acc, item) => {
                    const [platform, url] = item.trim().split(":");
                    if (platform && url) {
                      acc[platform] = url.trim();
                    }
                    return acc;
                  },
                  {} as Record<string, string>,
                );
                setValue("socialLinks", links);
              }}
            />
            {errors.socialLinks && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.socialLinks?.message?.toString()}
              </p>
            )}
          </div>
        </>
      )}

      {/* Stepper Navigation */}
      <div className="mx-auto max-w-xl text-center">
        <div className="flex items-center gap-2">
          <Button
            className="shrink-0"
            variant="ghost"
            size="icon"
            onClick={prevStep}
            disabled={currentStep === 1}
            aria-label="Prev step"
            type="button"
          >
            <ChevronLeftIcon size={16} aria-hidden="true" />
          </Button>
          <Stepper
            value={currentStep}
            onValueChange={setCurrentStep}
            className="gap-1"
          >
            {steps.map((step) => (
              <StepperItem key={step} step={step} className="flex-1">
                <StepperTrigger
                  className="w-full flex-col items-start gap-2"
                  asChild
                >
                  <StepperIndicator asChild className="bg-border h-1 w-full">
                    <span className="sr-only">{step}</span>
                  </StepperIndicator>
                </StepperTrigger>
              </StepperItem>
            ))}
          </Stepper>
          <Button
            className="shrink-0"
            variant="ghost"
            size="icon"
            onClick={nextStep}
            disabled={currentStep === steps.length}
            aria-label="Next step"
            type="button"
          >
            <ChevronRightIcon size={16} aria-hidden="true" />
          </Button>
        </div>
        <span className="text-sm text-gray-500 font-bold">
          Step {currentStep} of {steps.length}
        </span>
      </div>
      {/* Submit/Next Button */}
      <motion.button
        type={currentStep === steps.length ? "submit" : "button"}
        onClick={currentStep === steps.length ? handleButtonClick : nextStep}
        disabled={status === "pending"}
        whileTap={{ scale: 0.98 }}
        className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition ${
          status === "pending"
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-b from-gray-700 to-gray-900 hover:cursor-pointer hover:opacity-90"
        } focus:outline-none`}
      >
        {status === "pending"
          ? "Signing up..."
          : currentStep === steps.length
            ? "Sign up"
            : "Continue"}
      </motion.button>
      <Toast
        open={open}
        onOpenChange={handleOpenChange}
        onPause={pause}
        onResume={resume}
      >
        <div className="flex w-full justify-between gap-3">
          <CircleCheckIcon
            className="mt-0.5 shrink-0 text-emerald-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow flex-col gap-3">
            <div className="space-y-1">
              <ToastTitle>Your registration was completed!</ToastTitle>
              <ToastDescription>
                You will be redirected shortly.
              </ToastDescription>
            </div>
          </div>
          <ToastClose asChild>
            <Button
              variant="ghost"
              className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
              aria-label="Close notification"
            >
              <XIcon
                size={16}
                className="opacity-60 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </Button>
          </ToastClose>
        </div>
        <div className="contents" aria-hidden="true">
          <div
            className="pointer-events-none absolute bottom-0 right-0 h-1 w-full bg-emerald-500"
            style={{
              width: `${(progress / toastDuration) * 100}%`,
              transition: "width 100ms linear",
            }}
          />
        </div>
      </Toast>
      <ToastViewport className="right-0" />
    </form>
  );
};

export default SchoolSignupForm;

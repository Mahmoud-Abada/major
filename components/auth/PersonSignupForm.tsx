"use client";

import LocationSelector from "@/components/LocationSelector";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/components/ui/stepper";
import { personSchema } from "@/lib/validationSchemas";
import { RootState } from "@/store/store";
import { LocationData } from "@/types/location";
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
import { useSelector } from "react-redux";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { redirect } from "next/navigation";

interface UseProgressTimerProps {
  duration: number;
  interval?: number;
  onComplete?: () => void;
}

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

type ApiStatus = "idle" | "pending" | "success" | "error";

const PersonSignupForm = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );

  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );
  const roleData = useSelector(
    (state: RootState) => state.userRole.roleData[selectedRole || ""],
  );

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
    [start],
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

  const steps = [1, 2];
  type FormValues = z.infer<typeof personSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(personSchema),
    mode: "onChange",
  });

  const role = watch("role");

  useEffect(() => {
    setIsMounted(true);
    reset();
    setCurrentStep(1);
  }, [selectedRole, reset]);

  useEffect(() => {
    if (roleData && selectedRole) {
      const defaultValues = {
        ...roleData,
        confirmPassword: roleData.password,
      };
      Object.entries(defaultValues).forEach(([key, value]) => {
        setValue(key as keyof FormValues, value);
      });
    }
  }, [selectedRole, roleData, setValue]);

  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger([
        "firstName",
        "lastName",
        "gender",
        "dob",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ]);
    } else {
      isValid = true;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setValue("profilePicture", file); // Cast to any due to zod File type
    }
  };

  const onSubmit = async (data: FormValues) => {
    setApiStatus("pending");
    setApiError(null);

    try {
      const formData = new FormData();

      console.log(formData);
      // Append all form data
      Object.entries(data).forEach(([key, value]) => {
        if (key === "profilePicture" && profilePictureFile) {
          formData.append(key, profilePictureFile);
        } else if (value !== undefined && value !== null) {
          if (value instanceof Date) {
            formData.append(key, value.toISOString());
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append location data
      if (locationData) {
        formData.append("location", JSON.stringify(locationData));
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
        headers: {
          locale: "en", // Replace with actual locale from user preferences
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("error" + errorData.message);
        throw new Error(errorData.message || "Registration failed");
      }
      handleButtonClick();

      setApiStatus("success");
      // Handle successful registration (redirect, show success message, etc.)
      alert("Signup Successful! Redirecting...");
    } catch (error: unknown) {
      setApiStatus("error");
      setApiError(
        error instanceof Error
          ? error.message
          : "An error occurred during signup",
      );
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
      {/* API Status Messages */}
      {apiStatus === "error" && apiError && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded bg-red-100 p-2 text-sm text-red-600"
        >
          {apiError}
        </motion.p>
      )}

      {apiStatus === "success" && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-4 rounded bg-green-100 p-2 text-sm text-green-600"
        >
          Registration successful! Redirecting...
        </motion.p>
      )}

      {/* Step 1 - Required Fields */}
      {currentStep === 1 && (
        <>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                {...register("firstName")}
                className={`w-full p-2 border rounded-md ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.firstName && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                {...register("lastName")}
                className={`w-full p-2 border rounded-md ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.lastName && (
                <p className="mt-1 text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Gender</label>
            <div className="flex space-x-6">
              <label className="flex items-center text-gray-600">
                <input
                  type="radio"
                  value="male"
                  {...register("gender")}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm">Male</span>
              </label>
              <label className="flex items-center text-gray-600">
                <input
                  type="radio"
                  value="female"
                  {...register("gender")}
                  className="text-gray-600 focus:ring-gray-500"
                />
                <span className="ml-2 text-sm">Female</span>
              </label>
            </div>
            {errors.gender && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              {...register("dob", { valueAsDate: true })}
              className={`w-full p-2 border rounded-md ${errors.dob ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.dob && (
              <p className="mt-1 text-red-500 text-xs">
                {role === "student"
                  ? "You must be at least 18 years old"
                  : "You must be at least 21 years old"}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              {...register("email")}
              className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
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

          {/* Password */}
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

          {/* Confirm Password */}
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

      {/* Step 2 - Optional Fields */}
      {currentStep === 2 && (
        <>
          {/* Location */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Location</label>
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

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className={`w-full p-2 border rounded-md ${errors.profilePicture ? "border-red-500" : "border-gray-300"}`}
            />
            {profilePictureFile && (
              <p className="mt-1 text-sm text-gray-500">
                Selected: {profilePictureFile.name}
              </p>
            )}
            {errors.profilePicture && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.profilePicture.message}
              </p>
            )}
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Interests (comma separated)
            </label>
            <input
              type="text"
              placeholder="Reading, Sports, Music"
              {...register("interests")}
              className={`w-full p-2 border rounded-md ${errors.interests ? "border-red-500" : "border-gray-300"}`}
              onChange={(e) => {
                //const interests = e.target.value
                //.split(",")
                //.map((item) => item.trim());
                setValue("interests", e.target.value);
              }}
            />
            {errors.interests && (
              <p className="mt-1 text-red-500 text-xs">
                {errors.interests.message}
              </p>
            )}
          </div>

          {/* Education Fields (only for students) */}
          {role === "student" && (
            <>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Education Level
                </label>
                <select
                  {...register("educationLevel")}
                  className={`w-full p-2 border rounded-md ${errors.educationLevel ? "border-red-500" : "border-gray-300"}`}
                >
                  <option value="">Select education level</option>
                  <option value="high-school">High School</option>
                  <option value="bachelor">Bachelor&apos;s Degree</option>
                  <option value="master">Master&apos;s Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
                {errors.educationLevel && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.educationLevel.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Field of Study
                </label>
                <input
                  type="text"
                  placeholder="Computer Science, Biology, etc."
                  {...register("educationField")}
                  className={`w-full p-2 border rounded-md ${errors.educationField ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.educationField && (
                  <p className="mt-1 text-red-500 text-xs">
                    {errors.educationField.message}
                  </p>
                )}
              </div>
            </>
          )}
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
        disabled={apiStatus === "pending"}
        whileTap={{ scale: 0.98 }}
        className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition ${
          apiStatus === "pending"
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-gradient-to-b from-gray-700 to-gray-900 hover:cursor-pointer hover:opacity-90"
        } focus:outline-none`}
      >
        {apiStatus === "pending"
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

export default PersonSignupForm;

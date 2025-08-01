"use client";

import LocationSelector from "@/components/LocationSelector";

import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperTrigger,
} from "@/components/ui/stepper";

import { personSchema } from "@/lib/validationSchemas";
import { LocationType } from "@/types/location";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../store/hooks";
import { registerUser } from "../../store/slices/authSlice";
import { RootState } from "../../store/store";
import { RegisterData } from "../../types/authTypes";

type ApiStatus = "idle" | "pending" | "success" | "error";

const PersonSignupForm = () => {
  const { theme } = useTheme();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [isMounted, setIsMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [locationData, setLocationData] = useState<LocationType | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  const selectedRole = useSelector(
    (state: RootState) => state.userRole.selectedRole,
  );

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
    defaultValues: {
      role:
        selectedRole === "student" || selectedRole === "teacher"
          ? selectedRole
          : "student",
    },
  });

  const role = watch("role");

  useEffect(() => {
    setIsMounted(true);
    reset();
    setCurrentStep(1);
    setApiError(null);
  }, [selectedRole, reset]);

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
      setValue("profilePicture", file, { shouldValidate: true });
    }
  };

  const onSubmit = async (data: FormValues) => {
    setApiStatus("pending");
    setApiError(null);

    try {
      // Prepare the data structure that matches RegisterData
      const registerData: RegisterData = {
        userData: {
          email: data.email,
          name: data.firstName,
          last: data.lastName,
          password: data.password,
          DOB: data.dob ? new Date(data.dob).getTime() : 0,
          username: data.email.split("@")[0], // or generate a username
          phoneNumber: data.phone,
          location: {
            fullLocation: locationData?.fullLocation
              ? locationData.fullLocation
              : "",
            coordinates: locationData?.coordinates
              ? locationData.coordinates
              : { lat: 0, long: 0 },
            wilaya: locationData?.wilaya ? locationData.wilaya : "",
            commune: locationData?.commune ? locationData.commune : "",
          },
          profilePicture:
            (profilePictureFile as unknown as string) ??
            "https://default-avatar.com/placeholder.png",
          isVerified: false,
          verificationType: "email",
          socialLinks: {
            website: "",
            youtube: "",
          },
          description: data.interests || "",
          userType: role as "student" | "teacher",
        },
      };
      const resultAction = await dispatch(registerUser(registerData));

      const registeredUser = resultAction.payload;
      const userId = registeredUser._id;
      localStorage.setItem("pendingVerificationUserId", userId);
      if (registerUser.fulfilled.match(resultAction)) {
        setApiStatus("success");
        reset();
        setProfilePictureFile(null);
        setLocationData(null);
        router.push("/otp");
      } else {
        throw new Error(resultAction.payload as string);
      }
    } catch (error: unknown) {
      setApiStatus("error");
      console.error("Registration error:", error);
      setApiError(
        error instanceof Error ? error.message : t("registration_error"),
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
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 flex items-center justify-between rounded p-2 text-sm ${
            theme === "dark"
              ? "bg-red-900 text-red-400"
              : "bg-red-100 text-red-600"
          }`}
        >
          <span>{apiError}</span>
          <button
            type="button"
            onClick={() => setApiError(null)} // Clear the error when clicked
            className={`ml-2 ${
              theme === "dark" ? "text-red-400" : "text-red-600"
            }`}
            aria-label={t("dismissError")}
          >
            <XIcon size={16} />
          </button>
        </motion.div>
      )}

      {apiStatus === "success" && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`mb-4 rounded p-2 text-sm ${
            theme === "dark"
              ? "bg-green-900 text-green-400"
              : "bg-green-100 text-green-600"
          }`}
        >
          {t("registrationSuccessful")}
        </motion.p>
      )}

      {/* Step 1 - Required Fields */}
      {currentStep === 1 && (
        <>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label
                className={`mb-1 block text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                }`}
              >
                {t("firstName")}
              </label>
              <input
                type="text"
                placeholder={t("firstNamePlaceholder")}
                {...register("firstName")}
                className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                  errors.firstName
                    ? theme === "dark"
                      ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                      : "border-red-500 bg-red-50 text-neutral-900"
                    : theme === "dark"
                      ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                      : "border-neutral-300 bg-neutral-100 text-neutral-900"
                }`}
              />
              {errors.firstName && (
                <p
                  className={`mt-1 text-sm ${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label
                className={`mb-1 block text-sm font-medium ${
                  theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                }`}
              >
                {t("lastName")}
              </label>
              <input
                type="text"
                placeholder={t("lastNamePlaceholder")}
                {...register("lastName")}
                className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                  errors.lastName
                    ? theme === "dark"
                      ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                      : "border-red-500 bg-red-50 text-neutral-900"
                    : theme === "dark"
                      ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                      : "border-neutral-300 bg-neutral-100 text-neutral-900"
                }`}
              />
              {errors.lastName && (
                <p
                  className={`mt-1 text-sm ${
                    theme === "dark" ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("gender")}
            </label>
            <div className="flex space-x-6">
              <label
                className={`flex items-center space-x-1 ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                <input
                  type="radio"
                  value="male"
                  {...register("gender")}
                  className={`mr-2 ${
                    theme === "dark"
                      ? "text-neutral-300 focus:ring-neutral-400"
                      : "text-neutral-600 focus:ring-neutral-500"
                  }`}
                />
                <span className="text-sm">{t("male")}</span>
              </label>
              <label
                className={`flex items-center space-x-1 ${
                  theme === "dark" ? "text-neutral-300" : "text-neutral-600"
                }`}
              >
                <input
                  type="radio"
                  value="female"
                  {...register("gender")}
                  className={`mr-2 ${
                    theme === "dark"
                      ? "text-neutral-300 focus:ring-neutral-400"
                      : "text-neutral-600 focus:ring-neutral-500"
                  }`}
                />
                <span className="text-sm">{t("female")}</span>
              </label>
            </div>
            {errors.gender && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("dateOfBirth")}
            </label>
            <div className="relative">
              <input
                type="date"
                {...register("dob", { valueAsDate: true })}
                className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                  errors.dob
                    ? theme === "dark"
                      ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                      : "border-red-500 bg-red-50 text-neutral-900"
                    : theme === "dark"
                      ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                      : "border-neutral-300 bg-neutral-100 text-neutral-900"
                }`}
              />
            </div>
            {errors.dob && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {role === "student"
                  ? t("studentAgeRequirement")
                  : t("teacherAgeRequirement")}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
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
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("phoneNumber")}
            </label>
            <input
              type="tel"
              placeholder={t("phonePlaceholder")}
              {...register("phone")}
              className={`w-full h-10 ${
                locale === "ar" ? "text-right" : "text-left"
              } rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.phone
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            />
            {errors.phone && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}

          <label
            className={`mb-1 flex justify-between text-sm font-medium ${
              theme === "dark" ? "text-neutral-200" : "text-neutral-800"
            }`}
          >
            {t("password")}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder={t("passwordPlaceholder")}
              {...register("password")}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
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

          {/* Confirm Password */}
          <div className="relative">
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
                className={`w-full h-10 rounded-lg border px-3 
               text-sm placeholder-gray-500 focus:outline-none ${
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
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
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
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("location")}
            </label>
            <LocationSelector
              value={locationData}
              onChange={setLocationData}
              error={errors.location?.message}
            />
            {errors.location && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("profilePicture")}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                errors.profilePicture
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            />
            {profilePictureFile && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-neutral-400" : "text-neutral-500"
                }`}
              >
                {t("selectedFile")}: {profilePictureFile.name}
              </p>
            )}
            {errors.profilePicture && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.profilePicture.message}
              </p>
            )}
          </div>

          {/* Interests */}
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("interests")}
            </label>
            <input
              type="text"
              placeholder={t("interestsPlaceholder")}
              {...register("interests")}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.interests
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
              onChange={(e) => {
                setValue("interests", e.target.value);
              }}
            />
            {errors.interests && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.interests.message}
              </p>
            )}
          </div>

          {/* Education Fields (only for students) */}
          {role === "student" && (
            <>
              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  }`}
                >
                  {t("educationLevel")}
                </label>
                <select
                  {...register("educationLevel")}
                  className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                    errors.educationLevel
                      ? theme === "dark"
                        ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                        : "border-red-500 bg-red-50 text-neutral-900"
                      : theme === "dark"
                        ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                        : "border-neutral-300 bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <option value="">{t("selectEducationLevel")}</option>
                  <option value="high-school">{t("highSchool")}</option>
                  <option value="bachelor">{t("bachelorsDegree")}</option>
                  <option value="master">{t("mastersDegree")}</option>
                  <option value="phd">{t("phd")}</option>
                  <option value="other">{t("other")}</option>
                </select>
                {errors.educationLevel && (
                  <p
                    className={`mt-1 text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {errors.educationLevel.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  className={`mb-1 block text-sm font-medium ${
                    theme === "dark" ? "text-neutral-200" : "text-neutral-800"
                  }`}
                >
                  {t("educationField")}
                </label>
                <input
                  type="text"
                  placeholder={t("educationFieldPlaceholder")}
                  {...register("educationField")}
                  className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                    errors.educationField
                      ? theme === "dark"
                        ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                        : "border-red-500 bg-red-50 text-neutral-900"
                      : theme === "dark"
                        ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                        : "border-neutral-300 bg-neutral-100 text-neutral-900"
                  }`}
                />
                {errors.educationField && (
                  <p
                    className={`mt-1 text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  >
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
            aria-label={t("prevStep")}
            type="button"
          >
            {locale === "ar" ? (
              <ChevronRightIcon
                size={16}
                aria-hidden="true"
                className={
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }
              />
            ) : (
              <ChevronLeftIcon
                size={16}
                aria-hidden="true"
                className={
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }
              />
            )}
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
                  <div>
                    {" "}
                    {/* Wrap in a div */}
                    <StepperIndicator
                      asChild
                      className={`h-1 w-full ${
                        step <= currentStep
                          ? theme === "dark"
                            ? "bg-neutral-300"
                            : "bg-neutral-800"
                          : theme === "dark"
                            ? "bg-neutral-700"
                            : "bg-neutral-300"
                      }`}
                    >
                      <span className="sr-only">{step}</span>
                    </StepperIndicator>
                  </div>
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
            aria-label={t("nextStep")}
            type="button"
          >
            {locale === "ar" ? (
              <ChevronLeftIcon
                size={16}
                aria-hidden="true"
                className={
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }
              />
            ) : (
              <ChevronRightIcon
                size={16}
                aria-hidden="true"
                className={
                  theme === "dark" ? "text-neutral-300" : "text-neutral-700"
                }
              />
            )}
          </Button>
        </div>
        <span
          className={`text-sm font-bold ${
            theme === "dark" ? "text-neutral-300" : "text-neutral-700"
          }`}
        >
          {t("step")} {currentStep} {t("of")} {steps.length}
        </span>
      </div>

      {/* Submit/Next Button */}
      <motion.button
        type="button" // Always set type to "button" to prevent form submission
        onClick={currentStep < steps.length ? nextStep : handleSubmit(onSubmit)} // Call handleSubmit only on the last step
        disabled={apiStatus === "pending"}
        whileTap={{ scale: 0.98 }}
        className={`w-full h-10 rounded-lg text-sm font-semibold transition-all ${
          apiStatus === "pending"
            ? "cursor-not-allowed"
            : "hover:cursor-pointer hover:opacity-90"
        } ${
          theme === "dark"
            ? "bg-gradient-to-b from-neutral-400 to-neutral-200 text-neutral-950"
            : "bg-gradient-to-b from-neutral-600 to-neutral-800 text-neutral-50"
        } focus:outline-none`}
      >
        {apiStatus === "pending"
          ? t("signingUp")
          : currentStep === steps.length
            ? t("signUp")
            : t("continue")}
      </motion.button>
    </form>
  );
};

export default PersonSignupForm;

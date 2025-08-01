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
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { z } from "zod";

import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "../../store/hooks";
import { registerUser } from "../../store/slices/authSlice";
import { RegisterData } from "../../types/authTypes";
import { LocationType } from "../../types/location";
import LocationSelector from "../LocationSelector";

type ApiStatus = "idle" | "pending" | "success" | "error";

const SchoolSignupForm = () => {
  const { theme } = useTheme();
  const locale = useLocale(); // 'en' | 'fr' | 'ar'
  const t = useTranslations("auth");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<ApiStatus>("idle");
  const [currentStep, setCurrentStep] = useState(1);
  const [locationData, setLocationData] = useState<LocationType | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null,
  );
  const router = useRouter();
  const dispatch = useAppDispatch();

  const steps = [1, 2, 3];
  type FormValues = z.infer<typeof schoolSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    trigger,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schoolSchema),
    mode: "onChange",
    defaultValues: {
      role: "school",
    },
  });

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePictureFile(file);
      setValue("profilePicture", file, { shouldValidate: true });
    }
  };

  useEffect(() => {
    setIsMounted(true);
    reset();
    setCurrentStep(1);
    setApiError(null);
  }, [reset]);
  const nextStep = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await trigger([
        "schoolName",
        "schoolType",
        "customSchoolType",
        //"location",
        "email",
        "phone",
        "password",
        "confirmPassword",
      ]);
    } else if (currentStep === 2) {
      isValid = await trigger([
        "representativeName",
        "representativeRole",
        "customRepresentativeRole",
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
    setApiStatus("pending");
    setApiError(null);

    try {
      // Prepare the data structure that matches RegisterData
      const registerData: RegisterData = {
        userData: {
          email: data.email,
          name: data.schoolName,
          password: data.password,
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
          profilePicture: profilePictureFile
            ? URL.createObjectURL(profilePictureFile)
            : "",
          isVerified: false,
          verificationType: "email",
          socialLinks: {
            website: data.socialLinks?.website || "",
            youtube: data.socialLinks?.youtube || "",
          },
          description: "", // Add if you have this field
          userType: "school",
          schoolType:
            data.schoolType === "other"
              ? data.customSchoolType
              : data.schoolType,
        },
        schoolForm: {
          representativeName: data.representativeName,
          role:
            data.representativeRole === "other"
              ? data.customRepresentativeRole
                ? data.customRepresentativeRole
                : "principal"
              : data.representativeRole
                ? data.representativeRole
                : "principal",
          approximateTeachers: data.approxTeachers,
          approximateStudents: data.approxStudents,
          numberOfBranches: data.branchesCount,
          attachements: [],
        },
      };

      const resultAction = await dispatch(registerUser(registerData));
      console.log(resultAction);
      const registeredUser = resultAction.payload.user;
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
      setApiError(
        error instanceof Error ? error.message : t("registration_error"),
      );
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

      {/* Step 1 - School Basic Info */}
      {currentStep === 1 && (
        <>
          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("schoolName")}
            </label>
            <input
              type="text"
              placeholder={t("schoolNamePlaceholder")}
              {...register("schoolName")}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.schoolName
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            />
            {errors.schoolName && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.schoolName.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("schoolType")}
            </label>
            <select
              {...register("schoolType")}
              defaultValue="language"
              className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                errors.schoolType
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            >
              <option value="private">{t("schoolTypes.private")}</option>
              <option value="public">{t("schoolTypes.public")}</option>
              <option value="university">{t("schoolTypes.university")}</option>
              <option value="preschool">{t("schoolTypes.preschool")}</option>
              <option value="language">{t("schoolTypes.language")}</option>
              <option value="support">{t("schoolTypes.support")}</option>
              <option value="formation">{t("schoolTypes.formation")}</option>
              <option value="other">{t("schoolTypes.other")}</option>
            </select>
            {watch("schoolType") === "other" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={t("specifySchoolType")}
                  {...register("customSchoolType")}
                  className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                    errors.customSchoolType
                      ? theme === "dark"
                        ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                        : "border-red-500 bg-red-50 text-neutral-900"
                      : theme === "dark"
                        ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                        : "border-neutral-300 bg-neutral-100 text-neutral-900"
                  }`}
                />
                {errors.customSchoolType && (
                  <p
                    className={`mt-1 text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {errors.customSchoolType.message}
                  </p>
                )}
              </div>
            )}
            {errors.schoolType && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.schoolType.message}
              </p>
            )}
          </div>

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
              className={`w-full h-10 rounded-lg border px-3  text-sm placeholder-gray-500 focus:outline-none ${
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
              className={`text-sm mt-[-20px] ${
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
                className={`w-full h-10 rounded-lg border px-3  text-sm placeholder-gray-500 focus:outline-none ${
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
                className={`mt-[-20px] text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
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
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("representativeName")}
            </label>
            <input
              type="text"
              placeholder={t("representativeNamePlaceholder")}
              {...register("representativeName")}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.representativeName
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            />
            {errors.representativeName && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.representativeName.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("representativeRole")}
            </label>
            <select
              {...register("representativeRole")}
              defaultValue="principal"
              className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                errors.representativeRole
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              }`}
            >
              <option value="principal">
                {t("representativeRoles.principal")}
              </option>
              <option value="owner">{t("representativeRoles.owner")}</option>
              <option value="administrator">
                {t("representativeRoles.administrator")}
              </option>
              <option value="manager">
                {t("representativeRoles.manager")}
              </option>
              <option value="other">{t("representativeRoles.other")}</option>
            </select>
            {watch("representativeRole") === "other" && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder={t("specifyRepresentativeRole")}
                  {...register("customRepresentativeRole")}
                  className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                    errors.customRepresentativeRole
                      ? theme === "dark"
                        ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                        : "border-red-500 bg-red-50 text-neutral-900"
                      : theme === "dark"
                        ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                        : "border-neutral-300 bg-neutral-100 text-neutral-900"
                  }`}
                />
                {errors.customRepresentativeRole && (
                  <p
                    className={`mt-1 text-sm ${
                      theme === "dark" ? "text-red-400" : "text-red-600"
                    }`}
                  >
                    {errors.customRepresentativeRole.message}
                  </p>
                )}
              </div>
            )}
            {errors.representativeRole && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.representativeRole.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("numberOfBranches")}
            </label>
            <input
              type="number"
              min="1"
              max="100"
              placeholder="1"
              {...register("branchesCount", { valueAsNumber: true })}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.branchesCount
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              } ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
              style={{
                WebkitAppearance: "textfield",
                MozAppearance: "textfield",
                appearance: "textfield",
                colorScheme: theme === "dark" ? "dark" : "light",
              }}
            />
            {errors.branchesCount && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.branchesCount.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("approxTeachers")}
            </label>
            <input
              type="number"
              min="1"
              placeholder="50"
              {...register("approxTeachers", { valueAsNumber: true })}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.approxTeachers
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              } ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
              style={{
                WebkitAppearance: "textfield",
                MozAppearance: "textfield",
                appearance: "textfield",
                colorScheme: theme === "dark" ? "dark" : "light",
              }}
            />
            {errors.approxTeachers && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.approxTeachers.message}
              </p>
            )}
          </div>

          <div>
            <label
              className={`mb-1 block text-sm font-medium ${
                theme === "dark" ? "text-neutral-200" : "text-neutral-800"
              }`}
            >
              {t("approxStudents")}
            </label>
            <input
              type="number"
              min="1"
              placeholder="500"
              {...register("approxStudents", { valueAsNumber: true })}
              className={`w-full h-10 rounded-lg border px-3 text-sm placeholder-gray-500 focus:outline-none ${
                errors.approxStudents
                  ? theme === "dark"
                    ? "border-red-500/60 bg-red-900/10 text-neutral-100"
                    : "border-red-500 bg-red-50 text-neutral-900"
                  : theme === "dark"
                    ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                    : "border-neutral-300 bg-neutral-100 text-neutral-900"
              } ${theme === "dark" ? "text-neutral-100" : "text-neutral-900"}`}
              style={{
                WebkitAppearance: "textfield",
                MozAppearance: "textfield",
                appearance: "textfield",
                colorScheme: theme === "dark" ? "dark" : "light",
              }}
            />
            {errors.approxStudents && (
              <p
                className={`mt-1 text-sm ${
                  theme === "dark" ? "text-red-400" : "text-red-600"
                }`}
              >
                {errors.approxStudents.message}
              </p>
            )}
          </div>
        </>
      )}

      {/* Step 3 - Optional Fields */}
      {currentStep === 3 && (
        <>
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
          <div>
            <label
              className={`mb-2 block text-sm font-medium ${theme === "dark" ? "text-neutral-200" : "text-neutral-800"}`}
            >
              {t("socialLinks")}
            </label>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <select
                  onChange={(e) => {
                    const platform = e.target.value;
                    if (platform && !watch(`socialLinks.${platform}`)) {
                      setValue(`socialLinks.${platform}`, "");
                    }
                  }}
                  className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                    theme === "dark"
                      ? "border-neutral-700 bg-neutral-800 text-neutral-100"
                      : "border-neutral-300 bg-neutral-100 text-neutral-900"
                  }`}
                >
                  <option value="">{t("addSocialLink")}</option>
                  {[
                    "facebook",
                    "twitter",
                    "instagram",
                    "linkedin",
                    "tiktok",
                    "youtube",
                    "website",
                  ]
                    .filter(
                      (platform) =>
                        !Object.keys(watch("socialLinks") || {}).includes(
                          platform,
                        ),
                    )
                    .map((platform) => (
                      <option key={platform} value={platform}>
                        {platform.charAt(0).toUpperCase() + platform.slice(1)}
                      </option>
                    ))}
                </select>
              </div>

              {Object.keys(watch("socialLinks") || {}).map((platform) => (
                <div className="flex-col items-center gap-4" key={platform}>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder={`${platform === "website" ? "https://yourdomain.com" : `https://${platform}.com/yourusername`}`}
                      {...register(`socialLinks.${platform}`)}
                      className={`w-full h-10 rounded-lg border px-3 text-sm focus:outline-none ${
                        errors.socialLinks?.[platform]
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
                      onClick={() => {
                        const updatedLinks = { ...watch("socialLinks") };
                        delete updatedLinks[platform];
                        setValue("socialLinks", updatedLinks);
                      }}
                      className={` ${
                        theme === "dark"
                          ? "text-neutral-300 hover:text-neutral-100"
                          : "text-neutral-700 hover:text-neutral-800"
                      }`}
                      aria-label={t("removeLink")}
                    >
                      <XIcon size={20} />
                    </button>
                  </div>
                  {errors.socialLinks?.[platform] && (
                    <p
                      className={`mt-1 text-sm ${
                        theme === "dark" ? "text-red-400" : "text-red-600"
                      }`}
                    >
                      {t(`invalidUrl.${platform}`)}
                    </p>
                  )}
                </div>
              ))}
            </div>
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
        type="button"
        onClick={currentStep < steps.length ? nextStep : handleSubmit(onSubmit)}
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

export default SchoolSignupForm;

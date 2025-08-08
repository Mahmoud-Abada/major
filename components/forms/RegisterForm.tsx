"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import comunesData from "@/data/Comunes.json";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { LocationType } from "@/types/location";
import {
  createEmailSchema,
  createRequiredStringSchema,
} from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  MapPin,
  Plus,
  Search,
  Twitter,
  X,
  Youtube,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaTiktok } from "react-icons/fa";
import { z } from "zod";
import AuthForm from "./AuthForm";
import { SelectField, TextField } from "./FormField";

type UserType = "student" | "teacher" | "school";

interface SocialLink {
  platform: string;
  url: string;
}

export default function RegisterForm() {
  const t = useTranslations("auth");
  const { register, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<UserType>("student");

  // Location state
  const [selectedWilaya, setSelectedWilaya] = useState<string>("");
  const [selectedCommune, setSelectedCommune] = useState<string>("");
  const [detailedAddress, setDetailedAddress] = useState<string>("");
  const [wilayaSearch, setWilayaSearch] = useState<string>("");
  const [communeSearch, setCommuneSearch] = useState<string>("");
  const [showWilayaDropdown, setShowWilayaDropdown] = useState(false);
  const [showCommuneDropdown, setShowCommuneDropdown] = useState(false);

  // Social links state
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [showSocialDropdown, setShowSocialDropdown] = useState(false);

  // Preferences state
  const [preferences, setPreferences] = useState<string[]>([]);
  const [newPreference, setNewPreference] = useState("");

  // Date of birth state with separate selects
  const [dobDay, setDobDay] = useState<string>("");
  const [dobMonth, setDobMonth] = useState<string>("");
  const [dobYear, setDobYear] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<Date>();

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string>("");

  // Attachments state for schools
  const [attachments, setAttachments] = useState<
    Array<{
      attachement: string;
      type: string;
      title: string;
    }>
  >([]);

  // Update dateOfBirth when individual components change
  useEffect(() => {
    if (dobDay && dobMonth && dobYear) {
      const date = new Date(
        parseInt(dobYear),
        parseInt(dobMonth) - 1,
        parseInt(dobDay),
      );
      setDateOfBirth(date);
    } else {
      setDateOfBirth(undefined);
    }
  }, [dobDay, dobMonth, dobYear]);

  // Generate date options
  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString().padStart(2, "0"),
  }));

  const monthOptions = [
    { value: "1", label: t("months.january") || "January" },
    { value: "2", label: t("months.february") || "February" },
    { value: "3", label: t("months.march") || "March" },
    { value: "4", label: t("months.april") || "April" },
    { value: "5", label: t("months.may") || "May" },
    { value: "6", label: t("months.june") || "June" },
    { value: "7", label: t("months.july") || "July" },
    { value: "8", label: t("months.august") || "August" },
    { value: "9", label: t("months.september") || "September" },
    { value: "10", label: t("months.october") || "October" },
    { value: "11", label: t("months.november") || "November" },
    { value: "12", label: t("months.december") || "December" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 100 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  const createSchema = () => {
    const baseSchema = z.object({
      email: createEmailSchema(t),
      name: createRequiredStringSchema(t),
      password: z.string().min(8, t("validation.minLength", { length: 8 })),
      confirmPassword: createRequiredStringSchema(t),
      phoneNumber: z
        .string()
        .min(1, t("validation.required"))
        .regex(
          /^(06|07|05)\d{8}$/,
          "Phone number must be 10 digits starting with 06, 07, or 05",
        ),
      verificationType: z
        .enum(["email", "sms", "whatsapp"])
        .optional()
        .default("email"),
      description: z.string().optional(),
    });

    if (userType === "school") {
      return baseSchema
        .extend({
          schoolType: z.enum([
            "private",
            "language",
            "university",
            "formation",
            "public",
            "support",
            "private-university",
            "preschool",
          ]),
          representativeName: createRequiredStringSchema(t),
          role: z.enum(["owner", "manager", "secretary", "teacher", "other"]),
          approximateTeachers: z.number().min(1, t("validation.required")),
          approximateStudents: z.number().min(1, t("validation.required")),
          numberOfBranches: z.number().min(1, t("validation.required")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("validation.passwordMatch"),
          path: ["confirmPassword"],
        });
    } else {
      return baseSchema
        .extend({
          last: createRequiredStringSchema(t),
          gender: z.enum(["male", "female"], {
            required_error: t("validation.required"),
          }),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("validation.passwordMatch"),
          path: ["confirmPassword"],
        });
    }
  };

  const form = useForm({
    resolver: zodResolver(createSchema()),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
      verificationType: "email" as const,
      description: "",
      ...(userType === "school"
        ? {
          schoolType: "private" as const,
          representativeName: "",
          role: "owner",
          approximateTeachers: 1,
          approximateStudents: 1,
          numberOfBranches: 1,
        }
        : {
          last: "",
          gender: undefined,
        }),
    },
  });

  // Get unique wilayas from communes data with search
  const wilayas = useMemo(() => {
    const uniqueWilayas = Array.from(
      new Set(comunesData.map((c) => c.wilaya_id)),
    )
      .sort((a, b) => parseInt(a) - parseInt(b))
      .map((id) => {
        const comune = comunesData.find((c) => c.wilaya_id === id);
        return {
          id,
          name: comune?.name.split(" ")[0] || `Wilaya ${id}`,
          ar_name: comune?.ar_name || "",
        };
      });

    if (!wilayaSearch) return uniqueWilayas;

    return uniqueWilayas.filter(
      (w) =>
        w.name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
        w.ar_name.toLowerCase().includes(wilayaSearch.toLowerCase()) ||
        w.id.includes(wilayaSearch),
    );
  }, [wilayaSearch]);

  // Get available communes with search
  const availableComunes = useMemo(() => {
    if (!selectedWilaya) return [];

    const communes = comunesData.filter((c) => c.wilaya_id === selectedWilaya);

    if (!communeSearch) return communes;

    return communes.filter(
      (c) =>
        c.name.toLowerCase().includes(communeSearch.toLowerCase()) ||
        c.ar_name.toLowerCase().includes(communeSearch.toLowerCase()) ||
        c.id.includes(communeSearch),
    );
  }, [selectedWilaya, communeSearch]);

  // Social platforms configuration
  const socialPlatforms = [
    { key: "facebook", label: "Facebook", icon: Facebook },
    { key: "twitter", label: "Twitter", icon: Twitter },
    { key: "instagram", label: "Instagram", icon: Instagram },
    { key: "linkedin", label: "LinkedIn", icon: Linkedin },
    { key: "tiktok", label: "TikTok", icon: FaTiktok },
    { key: "youtube", label: "YouTube", icon: Youtube },
    { key: "website", label: "Website", icon: Globe },
  ];

  // Available social platforms (not yet added)
  const availablePlatforms = socialPlatforms.filter(
    (platform) => !socialLinks.some((link) => link.platform === platform.key),
  );

  const handleWilayaSelect = (wilayaId: string, wilayaName: string) => {
    setSelectedWilaya(wilayaId);
    setSelectedCommune("");
    setWilayaSearch(wilayaName);
    setShowWilayaDropdown(false);
  };

  const handleCommuneSelect = (communeId: string, communeName: string) => {
    setSelectedCommune(communeId);
    setCommuneSearch(communeName);
    setShowCommuneDropdown(false);
  };

  const addSocialLink = (platform: string) => {
    setSocialLinks([...socialLinks, { platform, url: "" }]);
    setShowSocialDropdown(false);
  };

  const updateSocialLink = (index: number, url: string) => {
    const updated = [...socialLinks];
    updated[index].url = url;
    setSocialLinks(updated);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const addPreference = () => {
    if (newPreference.trim() && !preferences.includes(newPreference.trim())) {
      setPreferences([...preferences, newPreference.trim()]);
      setNewPreference("");
    }
  };

  const removePreference = (preference: string) => {
    setPreferences(preferences.filter((p) => p !== preference));
  };

  // Map verification type from form to backend format
  const mapVerificationType = (formVerificationType: string) => {
    if (formVerificationType === "sms" || formVerificationType === "whatsapp") {
      return "phone";
    }
    return "email";
  };

  const onSubmit = async (data: any) => {
    console.log("📝 RegisterForm.onSubmit called with form data:", data);
    console.log("👤 User type:", userType);
    console.log("📍 Location state:", { selectedWilaya, selectedCommune, detailedAddress });
    console.log("🎂 Date of birth:", dateOfBirth);
    console.log("🔗 Social links:", socialLinks);
    console.log("⚙️ Preferences:", preferences);

    clearError();

    // Validation with toast messages
    if (!selectedWilaya || !selectedCommune) {
      console.log("❌ Validation failed: Missing location");
      toast({
        title: "Error",
        description: "Please select both wilaya and commune",
        variant: "destructive",
      });
      return;
    }

    if (userType !== "school" && !dateOfBirth) {
      console.log("❌ Validation failed: Missing date of birth");
      toast({
        title: "Error",
        description: "Please select your date of birth",
        variant: "destructive",
      });
      return;
    }

    if (userType !== "school" && !data.gender) {
      console.log("❌ Validation failed: Missing gender");
      toast({
        title: "Error",
        description: "Please select your gender",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("🏗️ Building registration data...");

      // Build location object
      const wilaya = wilayas.find((w) => w.id === selectedWilaya);
      const comune = availableComunes.find((c) => c.id === selectedCommune);

      const location: LocationType = {
        fullLocation: detailedAddress
          ? `${detailedAddress}, ${comune?.name}, ${wilaya?.name}`
          : `${communeSearch}, ${wilayaSearch}`,
        coordinates: {
          lat: parseFloat(comune?.latitude || "0"),
          long: parseFloat(comune?.longitude || "0"),
        },
        wilaya: `${selectedWilaya}-${wilayaSearch}-${wilaya?.ar_name || ""}`,
        commune: `${selectedCommune}-${communeSearch}-${comune?.ar_name || ""}`,
      };

      console.log("📍 Built location object:", location);

      // Build social links object
      const socialLinksObj = socialLinks
        .filter((link) => link.url.trim())
        .reduce((acc, link) => ({ ...acc, [link.platform]: link.url }), {});

      console.log("🔗 Built social links object:", socialLinksObj);

      const registerData = {
        userData: {
          email: data.email.trim().toLowerCase(),
          name: data.name.trim(),
          password: data.password,
          username: "", // Auto-generated in backend
          phoneNumber: data.phoneNumber.trim(),
          location,
          profilePicture:
            profilePicture || "https://example.com/default-avatar.png",
          isDeleted: false,
          isVerified: false,
          verificationType: mapVerificationType(
            data.verificationType || "email",
          ),
          socialLinks:
            Object.keys(socialLinksObj).length > 0 ? socialLinksObj : undefined,
          description: data.description || "",
          preferences: preferences.length > 0 ? preferences : [],
          userType,
          last: userType === "school" ? null : data.last.trim(),
          schoolType: userType === "school" ? data.schoolType : null,
          DOB:
            userType === "school"
              ? null
              : dateOfBirth
                ? dateOfBirth.getTime()
                : null,
          gender: userType === "school" ? null : data.gender || null,
        },
        ...(userType === "school" && {
          schoolForm: {
            representativeName: data.representativeName.trim(),
            role: data.role,
            approximateTeachers: data.approximateTeachers,
            approximateStudents: data.approximateStudents,
            numberOfBranches: data.numberOfBranches,
            attachements: attachments,
            isValidated: null,
            note: "pending",
            isIdentifierVerified: false,
          },
        }),
      };

      console.log("🚀 Final registration data:", JSON.stringify(registerData, null, 2));
      console.log("📞 Calling register function...");

      await register(registerData);

      console.log("✅ Registration completed successfully");
      toast({
        title: "Success",
        description:
          "Registration successful! Please check your verification method.",
        variant: "default",
      });
    } catch (err) {
      console.log("💥 Registration failed in form:", err);
      console.log("🔍 Error details:", {
        name: err instanceof Error ? err.name : 'Unknown',
        message: err instanceof Error ? err.message : String(err),
        stack: err instanceof Error ? err.stack : undefined
      });

      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const schoolTypeOptions = [
    { value: "private", label: t("schoolTypes.private") },
    { value: "language", label: t("schoolTypes.language") },
    { value: "university", label: t("schoolTypes.university") },
    { value: "formation", label: t("schoolTypes.formation") },
    { value: "public", label: t("schoolTypes.public") },
    { value: "support", label: t("schoolTypes.support") },
    { value: "private-university", label: t("schoolTypes.privateUniversity") },
    { value: "preschool", label: t("schoolTypes.preschool") },
  ];

  const roleOptions = [
    { value: "owner", label: t("roles.owner") },
    { value: "manager", label: t("roles.manager") },
    { value: "secretary", label: t("roles.secretary") },
    { value: "teacher", label: t("roles.teacher") },
    { value: "other", label: t("roles.other") },
  ];

  return (
    <AuthForm
      title={t("signUp")}
      form={form}
      onSubmit={onSubmit}
      loading={loading}
      submitText={loading ? t("signingUp") : t("signUp")}
      error={error}
      className="w-full max-w-md lg:max-w-2xl"
    >
      <Tabs
        value={userType}
        onValueChange={(value) => setUserType(value as UserType)}
      >
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="student">{t("roles.student")}</TabsTrigger>
          <TabsTrigger value="teacher">{t("roles.teacher")}</TabsTrigger>
          <TabsTrigger value="school">{t("roles.school")}</TabsTrigger>
        </TabsList>

        <TabsContent value={userType} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("basicInformation")}</h3>

            {/* Name fields - full width when school, half width when individual */}
            {userType === "school" ? (
              <TextField
                control={form.control}
                name="name"
                label={t("schoolName")}
                placeholder={t("schoolNamePlaceholder")}
                required
                className="w-full"
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  control={form.control}
                  name="name"
                  label={t("firstName")}
                  placeholder={t("firstNamePlaceholder")}
                  required
                />
                <TextField
                  control={form.control}
                  name="last"
                  label={t("lastName")}
                  placeholder={t("lastNamePlaceholder")}
                  required
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextField
                control={form.control}
                name="email"
                label={t("email")}
                placeholder={t("emailPlaceholder")}
                type="email"
                required
              />

              <TextField
                control={form.control}
                name="phoneNumber"
                label={t("phoneNumber")}
                placeholder="0612345678"
                type="tel"
                required
              />
            </div>

            {/* Verification Type Selection */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>
                  {t("verificationType")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="group relative">
                  <div className="cursor-help text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg hidden group-hover:block transition-opacity duration-200 whitespace-nowrap z-10">
                    {t("verificationTypeTooltip")}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              <RadioGroup
                value={form.watch("verificationType") || "email"}
                onValueChange={(value) =>
                  form.setValue(
                    "verificationType",
                    value as "email" | "sms" | "whatsapp",
                  )
                }
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="email" id="email-verify" />
                  <Label htmlFor="email-verify">
                    {t("verificationTypes.email")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sms" id="sms-verify" />
                  <Label htmlFor="sms-verify">
                    {t("verificationTypes.sms")}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="whatsapp-verify" />
                  <Label htmlFor="whatsapp-verify">
                    {t("verificationTypes.whatsapp")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative">
                <TextField
                  control={form.control}
                  name="password"
                  label={t("password")}
                  placeholder={t("passwordPlaceholder")}
                  type={showPassword ? "text" : "password"}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-8 text-neutral-600 dark:text-neutral-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
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
                  {showConfirmPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Profile Picture Upload - Compact */}
            <div className="space-y-2">
              <Label>{t("profilePicture")}</Label>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const mockUrl = `https://example.com/uploads/profile_${Date.now()}.jpg`;
                      setProfilePicture(mockUrl);
                    }
                  }}
                  className="h-11 flex-1"
                />
                {profilePicture && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setProfilePicture("")}
                    className="h-11 px-3"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              {profilePicture && (
                <div className="text-xs text-green-600">
                  ✓ Profile picture uploaded
                </div>
              )}
            </div>
          </div>

          {/* Location Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              {t("location")}
            </h3>

            {/* Wilaya Selection */}
            <div className="space-y-2">
              <Label>
                {t("wilaya")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder={t("wilayaPlaceholder")}
                  value={wilayaSearch}
                  onChange={(e) => {
                    setWilayaSearch(e.target.value);
                    setShowWilayaDropdown(true);
                  }}
                  onFocus={() => setShowWilayaDropdown(true)}
                  className="h-11 w-full"
                />
                <Search className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                {showWilayaDropdown && wilayaSearch && (
                  <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border border-border rounded-lg bg-card shadow-lg">
                    {wilayas.map((wilaya) => (
                      <button
                        key={wilaya.id}
                        type="button"
                        onClick={() =>
                          handleWilayaSelect(wilaya.id, wilaya.name)
                        }
                        className="w-full text-left px-3 py-2 hover:bg-accent border-b border-border last:border-b-0"
                      >
                        <div className="text-sm font-medium">
                          {wilaya.id} - {wilaya.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {wilaya.ar_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Commune Selection */}
            <div className="space-y-2">
              <Label>
                {t("commune")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Input
                  placeholder={
                    selectedWilaya
                      ? t("communePlaceholder")
                      : t("selectWilayaFirst")
                  }
                  value={communeSearch}
                  onChange={(e) => {
                    setCommuneSearch(e.target.value);
                    setShowCommuneDropdown(true);
                  }}
                  onFocus={() => setShowCommuneDropdown(true)}
                  disabled={!selectedWilaya}
                  className="h-11 w-full"
                />
                <Search className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                {showCommuneDropdown && communeSearch && selectedWilaya && (
                  <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto border border-border rounded-lg bg-card shadow-lg">
                    {availableComunes.map((comune) => (
                      <button
                        key={comune.id}
                        type="button"
                        onClick={() =>
                          handleCommuneSelect(comune.id, comune.name)
                        }
                        className="w-full text-left px-3 py-2 hover:bg-accent border-b border-border last:border-b-0"
                      >
                        <div className="text-sm font-medium">
                          {comune.id} - {comune.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {comune.ar_name}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Address */}
            <div className="space-y-2">
              <Label>{t("detailedAddress")}</Label>
              <Input
                placeholder={t("detailedAddressPlaceholder")}
                value={detailedAddress}
                onChange={(e) => setDetailedAddress(e.target.value)}
                disabled={!selectedCommune}
                className="h-11 w-full"
              />
            </div>
          </div>

          {/* User Type Specific Fields */}
          {userType === "school" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("schoolInformation")}
              </h3>

              <SelectField
                control={form.control}
                name="schoolType"
                label={t("schoolType")}
                options={schoolTypeOptions}
                required
                className="w-full"
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <TextField
                  control={form.control}
                  name="representativeName"
                  label={t("representativeName")}
                  placeholder={t("representativeNamePlaceholder")}
                  required
                />

                <SelectField
                  control={form.control}
                  name="role"
                  label={t("role")}
                  options={roleOptions}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>
                    {t("approximateTeachers")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.watch("approximateTeachers") || ""}
                    onChange={(e) => form.setValue("approximateTeachers", parseInt(e.target.value) || 1)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("approximateStudents")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={form.watch("approximateStudents") || ""}
                    onChange={(e) => form.setValue("approximateStudents", parseInt(e.target.value) || 1)}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    {t("numberOfBranches")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="1"
                    value={form.watch("numberOfBranches") || ""}
                    onChange={(e) => form.setValue("numberOfBranches", parseInt(e.target.value) || 1)}
                    className="h-11"
                  />
                </div>
              </div>

              {/* Attachments - Compact */}
              <div className="space-y-2">
                <Label>{t("attachments")}</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      const newAttachments = files.map((file) => ({
                        attachement: `https://example.com/uploads/${file.name}`,
                        type: file.type.startsWith("image/")
                          ? "image"
                          : "document",
                        title: file.name,
                      }));
                      setAttachments([...attachments, ...newAttachments]);
                    }}
                    className="h-11 flex-1"
                  />
                  {attachments.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAttachments([])}
                      className="h-11 px-3"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {attachments.length > 0 && (
                  <div className="text-xs text-green-600">
                    ✓ {attachments.length} file(s) uploaded
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Personal Information for non-school users */}
          {userType !== "school" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {t("personalInformation")}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Date of Birth with three selects */}
                <div className="space-y-2">
                  <Label>
                    {t("dateOfBirth")} <span className="text-red-500">*</span>
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Select value={dobDay} onValueChange={setDobDay}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("day") || "Day"} />
                      </SelectTrigger>
                      <SelectContent>
                        {dayOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dobMonth} onValueChange={setDobMonth}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("month") || "Month"} />
                      </SelectTrigger>
                      <SelectContent>
                        {monthOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={dobYear} onValueChange={setDobYear}>
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder={t("year") || "Year"} />
                      </SelectTrigger>
                      <SelectContent>
                        {yearOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Gender - vertically centered with DOB */}
                <div className="space-y-2 flex flex-col justify-center">
                  <Label>
                    {t("gender.label")} <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={form.watch("gender")}
                    onValueChange={(value) =>
                      form.setValue("gender", value as "male" | "female")
                    }
                    className="flex gap-6 items-center h-11"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{t("gender.male")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{t("gender.female")}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("description")}</h3>
            <Textarea
              placeholder={t("descriptionPlaceholder")}
              value={form.watch("description")}
              onChange={(e) => form.setValue("description", e.target.value)}
              rows={3}
              className="resize-none w-full"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("socialLinks")}</h3>
              {availablePlatforms.length > 0 && (
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSocialDropdown(!showSocialDropdown)}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t("addSocialLink")}
                  </Button>

                  {showSocialDropdown && (
                    <div className="absolute right-0 top-full mt-1 z-10 w-48 border border-border rounded-lg bg-card shadow-lg">
                      {availablePlatforms.map((platform) => {
                        const Icon = platform.icon;
                        return (
                          <button
                            key={platform.key}
                            type="button"
                            onClick={() => addSocialLink(platform.key)}
                            className="w-full text-left px-3 py-2 hover:bg-accent border-b border-border last:border-b-0 flex items-center gap-2"
                          >
                            {typeof Icon === "function" ? (
                              <Icon className="h-4 w-4" />
                            ) : (
                              <Icon size={16} />
                            )}
                            {platform.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {socialLinks.length > 0 && (
              <div className="space-y-3">
                {socialLinks.map((link, index) => {
                  const platform = socialPlatforms.find(
                    (p) => p.key === link.platform,
                  );
                  const Icon = platform?.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
                        {Icon &&
                          (typeof Icon === "function" ? (
                            <Icon className="h-4 w-4" />
                          ) : (
                            <Icon size={16} />
                          ))}
                        <span className="text-sm font-medium">
                          {platform?.label}
                        </span>
                      </div>
                      <Input
                        placeholder={`Enter your ${platform?.label} URL`}
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, e.target.value)
                        }
                        className="h-11 flex-1"
                        type="url"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSocialLink(index)}
                        className="flex-shrink-0 h-11 w-11 p-0 text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("preferences")}</h3>

            <div className="flex gap-2">
              <Input
                placeholder={t("addPreference")}
                value={newPreference}
                onChange={(e) => setNewPreference(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addPreference())
                }
                className="h-11 flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={addPreference}
                disabled={!newPreference.trim()}
                className="flex-shrink-0 h-11"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {preferences.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {preferences.map((preference, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {preference}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removePreference(preference)}
                      className="h-auto w-auto p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3 hover:text-destructive" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div className="pt-4">
        <p className="text-center text-sm text-neutral-950 dark:text-neutral-300">
          {t("alreadyAccount")}{" "}
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

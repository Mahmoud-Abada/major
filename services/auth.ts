import { ApiResponse } from "@/types/api";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  userData: {
    email: string;
    name: string;
    password: string;
    username: string;
    phoneNumber: string;
    location: {
      fullLocation: string;
      coordinates: {
        lat: number;
        long: number;
      };
      wilaya: string;
      commune: string;
    };
    profilePicture: string;
    isDeleted: boolean;
    isVerified: boolean;
    verificationType: "phone" | "email";
    socialLinks?: {
      website?: string;
      youtube?: string;
      facebook?: string;
      twitter?: string;
      instagram?: string;
      linkedin?: string;
      tiktok?: string;
    };
    description?: string;
    preferences: string[];
    userType: "student" | "teacher" | "school";
    last: string | null;
    schoolType:
    | "private"
    | "language"
    | "university"
    | "formation"
    | "public"
    | "support"
    | "private-university"
    | "preschool"
    | null;
    DOB: number | null;
    gender: "male" | "female" | null;
  };
  schoolForm?: {
    representativeName: string;
    role: string;
    approximateTeachers: number;
    approximateStudents: number;
    numberOfBranches: number;
    attachements?: Array<{
      attachement: string;
      type: string;
      title: string;
    }>;
    isValidated: boolean | null;
    note: string;
    isIdentifierVerified: boolean;
  };
}

export interface SendOTPRequest {
  userId: string;
  sendWhere: "email" | "sms" | "whatsapp";
}

export interface VerifyOTPRequest {
  userId: string;
  otp: string;
}

export interface ForgetPasswordRequest {
  userId: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface UpdateSchoolFormRequest {
  schoolForm: {
    note: string;
    attachements: Array<{
      attachement: string;
      type: string;
      title: string;
    }>;
    isValidated: boolean;
  };
  schoolId: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  userType: "student" | "teacher" | "school";
  isVerified: boolean;
  token: string;
}

export interface LoginResponse extends ApiResponse {
  user: AuthUser;
}

export interface RegisterResponse extends ApiResponse {
  user?: AuthUser;
  status?: string;
  payload?: {
    _id: string;
  };
}

export interface OTPResponse extends ApiResponse {
  message: string;
}

export interface VerifyOTPResponse extends ApiResponse {
  verified: boolean;
  token?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

class AuthService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    locale?: string,
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (locale) {
      headers["locale"] = locale;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle different HTTP status codes
      if (response.status === 401) {
        throw new Error(
          errorData.message ||
          "Authentication failed. Please check your credentials.",
        );
      }
      if (response.status === 403) {
        throw new Error(
          errorData.message || "Access denied. You do not have permission.",
        );
      }
      if (response.status === 404) {
        throw new Error(
          errorData.message || "The requested resource was not found.",
        );
      }
      if (response.status === 422) {
        throw new Error(
          errorData.message || "Validation failed. Please check your input.",
        );
      }
      if (response.status === 429) {
        throw new Error(
          errorData.message || "Too many requests. Please try again later.",
        );
      }
      if (response.status >= 500) {
        throw new Error(
          errorData.message || "Server error. Please try again later.",
        );
      }

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return response.json();
  }

  async login(data: LoginRequest, locale?: string): Promise<LoginResponse> {
    return this.makeRequest<LoginResponse>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async register(
    data: RegisterRequest,
    locale?: string,
  ): Promise<RegisterResponse> {
    console.log("🌐 AuthService.register called with:");
    console.log("📤 Request data:", JSON.stringify(data, null, 2));
    console.log("🗣️ Locale:", locale);
    console.log("🔗 API URL:", `${API_BASE_URL}/auth/register`);

    try {
      const response = await this.makeRequest<RegisterResponse>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(data),
        },
        locale,
      );

      console.log("📥 AuthService.register response:", JSON.stringify(response, null, 2));
      return response;
    } catch (error) {
      console.log("💥 AuthService.register error:", error);
      console.log("🔍 Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  async sendOTP(data: SendOTPRequest, locale?: string): Promise<OTPResponse> {
    return this.makeRequest<OTPResponse>(
      "/auth/send-otp",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async verifyOTP(
    data: VerifyOTPRequest,
    locale?: string,
  ): Promise<VerifyOTPResponse> {
    return this.makeRequest<VerifyOTPResponse>(
      "/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async forgetPassword(
    data: ForgetPasswordRequest,
    locale?: string,
  ): Promise<OTPResponse> {
    return this.makeRequest<OTPResponse>(
      "/auth/forget-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async resetPassword(
    data: ResetPasswordRequest,
    locale?: string,
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(
      "/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async updateSchoolForm(
    data: UpdateSchoolFormRequest,
    locale?: string,
  ): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(
      "/auth/update-school-form",
      {
        method: "POST",
        body: JSON.stringify(data),
      },
      locale,
    );
  }

  async getSchoolForm(locale?: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>(
      "/auth/get-school-form",
      {
        method: "GET",
      },
      locale,
    );
  }

  async getJWKS(): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>("/auth/getJWTK", {
      method: "GET",
    });
  }
}

export const authService = new AuthService();

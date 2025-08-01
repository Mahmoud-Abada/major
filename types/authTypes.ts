// Types
export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  otp: {
    sent: boolean;
    verified: boolean;
  };
  passwordReset: {
    requested: boolean;
    completed: boolean;
  };
  schoolForm: SchoolForm | null;
}

export interface User {
  _id: string;
  email: string;
  name: string;
  username: string;
  phoneNumber: string;
  profilePicture: string;
  isVerified: boolean;
  userType: "student" | "teacher" | "school";
  schoolType?: string;
  // Add other user fields as needed
}

export interface SchoolForm {
  representativeName: string;
  role: string;
  approximateTeachers: number;
  approximateStudents: number;
  numberOfBranches: number;
  attachements: Array<{
    attachement: string;
    type: string;
    title: string;
  }>;
  isValidated: boolean | null;
  note: string;
  isIdentifierVerified: boolean;
}

export interface LoginCredentials {
  identifier: string;
  password: string;
}

export interface RegisterData {
  userData: {
    email: string;
    name: string;
    last?: string;
    password: string;
    username: string;
    phoneNumber: string;
    DOB?: number;
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
    isVerified: boolean;
    verificationType: string;
    socialLinks: {
      website: string;
      youtube: string;
    };
    description: string;
    userType: "student" | "teacher" | "school";
    schoolType?: string;
  };
  schoolForm?: {
    representativeName: string;
    role: string;
    approximateTeachers: number;
    approximateStudents: number;
    numberOfBranches: number;
    attachements: Array<{
      attachement: string;
      type: string;
      title: string;
    }>;
  };
}

export interface OTPRequest {
  userId: string;
  sendWhere: "email" | "phone";
}

export interface OTPVerification {
  userId: string;
  otp: string;
}

export interface PasswordReset {
  token: string;
  newPassword: string;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  otp: {
    sent: false,
    verified: false,
  },
  passwordReset: {
    requested: false,
    completed: false,
  },
  schoolForm: null,
};

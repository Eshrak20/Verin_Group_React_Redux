export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    email: string;
    email_verification_required: boolean;
  };
}

// verify otp types
export interface VerifyOtpRequest {
  email: string;
  otp: string;
  purpose: string;
}

export interface VerifyOtpProfile {
  id: number;
  user_id: number;
  phone: string | null;
  avatar: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  country: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface VerifyOtpUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  is_active: boolean | null;
  profile: VerifyOtpProfile;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    verified: boolean;
    user: VerifyOtpUser;
    token: string;
  };
}

// resend otp types
export interface ResendOtpRequest {
  email: string;
  purpose: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    email: string;
    email_verification_required: boolean;
  };
}

// login types
export interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    user: VerifyOtpUser;
    token: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MyProfileResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    user: VerifyOtpUser;
  };
}

// logout
export interface LogoutResponse {
  success: boolean;
  message: string;
  code: number;
  data: null;
}

export type ForgotPasswordResponse = LogoutResponse;

// reset password types
export interface ResetPasswordRequest {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export type ResetPasswordResponse = LogoutResponse;



// change password types
export interface ChangePasswordRequest {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export type ChangePasswordResponse = LogoutResponse;

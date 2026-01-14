// Signup API Types
export interface SignupRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface SignupSuccessResponse {
  message: string;
  data: [];
  customStatusCode: number;
}

export interface SignupErrorResponse {
  message: string | string[];
  error?: string;
  statusCode: number;
}

export interface SignupResponse {
  success: boolean;
  message?: string | string[];
  data?: [];
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}

// Email Verification API Types
export interface VerifyEmailRequest {
  code: string;
}

export interface VerifyEmailSuccessResponse {
  message: string;
  data: [];
  customStatusCode: number;
}

export interface VerifyEmailErrorResponse {
  message: string;
  error: string;
  statusCode: number;
}

export interface VerifyEmailResponse {
  success: boolean;
  message?: string;
  data?: [];
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}

// Login API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  message: string;
  data: {
    token: string;
  };
  customStatusCode: number;
}

export interface LoginErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
  };
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}

// Logout API Types
export interface LogoutResponse {
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Forgot Password API Types
export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordSuccessResponse {
  message: string;
  data: [];
  customStatusCode: number;
}

export interface ForgotPasswordErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  data?: [];
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}

// Password Reset Code Validation API Types
export interface ValidateResetCodeRequest {
  passwordResetCode: string;
}

export interface ValidateResetCodeSuccessResponse {
  message: string;
  data: [];
  customStatusCode: number;
}

export interface ValidateResetCodeErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ValidateResetCodeResponse {
  success: boolean;
  message?: string;
  data?: [];
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}

// Reset Password API Types
export interface ResetPasswordRequest {
  passwordResetCode: string;
  newPassword: string;
}

export interface ResetPasswordSuccessResponse {
  message: string;
  data: [];
  customStatusCode: number;
}

export interface ResetPasswordErrorResponse {
  message: string;
  error?: string;
  statusCode: number;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  data?: [];
  customStatusCode?: number;
  error?: string;
  statusCode?: number;
}


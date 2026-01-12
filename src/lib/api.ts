const BASE_URL = "https://reachiwell-git-17355259644.europe-west1.run.app/v1";

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

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  try {
    const response = await fetch(`${BASE_URL}/users/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phone: data.phone,
      }),
    });

    const responseData: SignupSuccessResponse | SignupErrorResponse = await response.json();

    if (!response.ok) {
      const errorData = responseData as SignupErrorResponse;
      
      // Handle validation errors (400) - message is an array
      if (response.status === 400 && Array.isArray(errorData.message)) {
        const errorMessages = errorData.message.join(", ");
        return {
          success: false,
          message: errorData.message,
          error: errorMessages,
          statusCode: errorData.statusCode,
        };
      }
      
      // Handle other errors (409, etc.) - message is a string
      return {
        success: false,
        message: typeof errorData.message === "string" ? errorData.message : undefined,
        error: errorData.error || (typeof errorData.message === "string" ? errorData.message : "Signup failed. Please try again."),
        statusCode: errorData.statusCode,
      };
    }

    // Success response
    const successData = responseData as SignupSuccessResponse;
    return {
      success: true,
      message: successData.message,
      data: successData.data,
      customStatusCode: successData.customStatusCode,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error. Please check your connection and try again.",
    };
  }
}

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

export async function verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
  try {
    const response = await fetch(`${BASE_URL}/users/auth/email/verification`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: data.code,
      }),
    });

    const responseData: VerifyEmailSuccessResponse | VerifyEmailErrorResponse = await response.json();

    if (!response.ok) {
      const errorData = responseData as VerifyEmailErrorResponse;
      return {
        success: false,
        message: errorData.message,
        error: errorData.error || errorData.message,
        statusCode: errorData.statusCode,
      };
    }

    // Success response
    const successData = responseData as VerifyEmailSuccessResponse;
    return {
      success: true,
      message: successData.message,
      data: successData.data,
      customStatusCode: successData.customStatusCode,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error. Please check your connection and try again.",
    };
  }
}


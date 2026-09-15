export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  confirm_password: string;
}

export interface LoginPayload {
  phone_number: string;
  password: string;
}


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface UserResponse {
  id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  email_verified: boolean;
  phone_verified: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface CustomerResponse {
  id: string;
  is_verified: boolean;
}

export interface LoginResponseData {
  user: UserResponse;
  tokens: AuthTokens;
}

export interface RegisterResponseData {
  user: UserResponse;
  customer: CustomerResponse;
}

export interface UserProfileResponse {
  id: string;
  phone_number: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  profile_image_url: string | null;
  profile_image_public_id: string | null;
  is_active: boolean;
}

export interface UpdateProfileImagePayload {
  profile_image_url: string;
  profile_image_public_id: string;
}
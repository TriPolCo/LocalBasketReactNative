// types/addressTypes.ts
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Address {
  id: string;
  address_type: "HOME" | "WORK" | "OTHER" | string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  latitude?: number | null;
  longitude?: number | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export type AddressPayload = {
  address_type?: string;
  full_name: string;
  phone_number: string;
  address_line_1: string;
  address_line_2?: string;
  landmark?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default?: boolean;
};
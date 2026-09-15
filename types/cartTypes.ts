export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CartImage {
  id: string;
  image_url: string;
  cloudinary_public_id: string;
}

export interface CartItem {
  id: string;
  variant_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  mrp: string;
  selling_price: string;
  stock: number;
  quantity: number;
  item_total: number;
  primary_image: CartImage | null;
  created_at: string;
  updated_at: string;
}

export interface CartData {
  id: string;
  total_items: number;
  total_quantity: number;
  subtotal: number;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export type CartResponse = ApiResponse<CartData>;

export interface AddToCartPayload {
  variant_id: string;
  quantity: number;
}

export interface UpdateQuantityPayload {
  quantity: number;
}
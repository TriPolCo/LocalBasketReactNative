import { Address } from "./addressTypes";

export interface OrderItem {
  id: string;
  product: string;
  variant: string;
  product_name: string;
  sku: string;
  quantity: number;
  image: string;
  mrp: string;
  selling_price: string;
  item_discount: string;
  item_total: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  status: "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  payment_method: string;
  payment_status: string;
  subtotal: string;
  delivery_fee: string;
  discount: string;
  tax: string;
  total_amount: string;
  shipping_address: Address;
  items: OrderItem[];
  delivered_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlaceOrderPayload {
  cart_id: string;
  address_id: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order[] | Order;
}
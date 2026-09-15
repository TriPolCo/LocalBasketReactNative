export interface ProductImage {
  id?: string;
  cloudinary_public_id: string;
  image_url: string;
  is_primary?: boolean;
  display_order?: number;
}

export interface AttributeDetail {
  id: string;
  name: string;
  code: string;
}

export interface ValueDetail {
  id: string;
  value: string;
  is_active: boolean;
}

export interface VariantAttributeResponseMapping {
  id: string;
  attribute: AttributeDetail;
  value: ValueDetail;
}

export interface VariantAttributePayloadMapping {
  attribute: string; // UUID
  value: string; // UUID
}

export interface ProductVariant {
  id?: string;
  sku: string;
  mrp: string;
  selling_price: string;
  stock: number;
  is_active?: boolean;
  attributes: VariantAttributePayloadMapping[] | VariantAttributeResponseMapping[];
  images: ProductImage[];
  primary_image?: ProductImage;
  created_at?: string;
  updated_at?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
}

export interface SubcategorySummary {
  id: string;
  name: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategorySummary;
  subcategory: SubcategorySummary;
  brand: string | null;
  image?: ProductImage;
  variants: ProductVariant[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string | null;
  is_active: boolean;
  variants: {
    sku: string;
    mrp: string;
    selling_price: string;
    stock: number;
    attributes: VariantAttributePayloadMapping[];
    images: ProductImage[];
  }[];
}
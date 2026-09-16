export interface Product {
  id: string;
  name: string;
  image_url: string;
  category_id: string;
  category_name: string;
  subcategory_id: string;
  subcategory_name: string;
}

export interface ProductSearchResponse {
  success: boolean;
  message: string;
  search: string;
  count: number;
  data: Product[];
}
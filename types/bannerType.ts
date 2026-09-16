export interface NavigationTarget {
  type: string;
  id: string;
}

export interface BannerButton {
  id: string;
  label: string;
  navigation: NavigationTarget;
  display_order: number;
  is_active: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image_url: string;
  mobile_image_url: string;
  section: string;
  navigation: NavigationTarget;
  buttons: BannerButton[];
  display_order: number;
  is_active: boolean;
  start_at: string | null;
  end_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BannerResponse {
  success: boolean;
  message: string;
  data: Banner[];
}
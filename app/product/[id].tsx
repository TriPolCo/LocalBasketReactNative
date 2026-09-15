import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProductById } from "@/hooks/products/useProductById";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useCart } from "@/hooks/cart/useCart";
import { ProductVariant, VariantAttributeResponseMapping } from "@/types/productTypes";

const recommendedProducts = [
  { id: "rec1", name: "Fresh Tomatoes", price: 40, image: "https://media.istockphoto.com/id/1095798054/photo/fresh-tomatoes-in-a-box.webp?a=1&b=1&s=612x612&w=0&k=20&c=UVnVRQ0TfdTL4Y_E5HVhpAJUxk4oZ1r9ny8atZbm-D8=" },
  { id: "rec2", name: "Farm Potatoes", price: 35, image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=900&auto=format&fit=crop&q=60" },
  { id: "rec3", name: "Fresh Onions", price: 42, image: "https://images.unsplash.com/photo-1668295037469-8b0e8d11cd2a?w=900&auto=format&fit=crop&q=60" },
  { id: "rec4", name: "Green Capsicum", price: 45, image: "https://media.istockphoto.com/id/137350104/photo/green-peppers.webp?a=1&b=1&s=612x612&w=0&k=20&c=7u2DZpZoSZIWkSDyvAbxkvNU09BrvPdQCPzM4LcsxvU=" },
];

const dummyReviews = [
  { id: "rev1", name: "Rahul Sharma", rating: 5, date: "2 days ago", comment: "Super fresh quality! Delivered right on time in pristine condition." },
  { id: "rev2", name: "Priya Patel", rating: 4, date: "1 week ago", comment: "Good packaging and very fresh produce. Will definitely order again." },
];

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: response, isLoading, isError } = useProductById(id);
  const { data: cartData } = useCart();
  const addToCartMutation = useAddToCart();
  const product = response?.data;

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Pincode checking states
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<null | { success: boolean; message: string }>(null);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-sm text-slate-500">Loading product details...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text className="mt-2 text-base font-bold text-slate-800">Failed to load product</Text>
        <Pressable 
          onPress={() => router.back()}
          className="mt-4 rounded-xl bg-emerald-700 px-5 py-2.5"
        >
          <Text className="font-bold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const activeVariant: ProductVariant = product.variants?.[selectedVariantIndex] ?? product.variants?.[0] ?? {};
  const activeVariantId = activeVariant.id ?? product.id;
  const price = Number(activeVariant.selling_price ?? 0);
  const originalPrice = Number(activeVariant.mrp ?? price);
  const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  
  const variantImages = activeVariant.images && activeVariant.images.length > 0 
    ? activeVariant.images.map(img => img.image_url) 
    : [product.image?.image_url].filter(Boolean) as string[];

  // Check if active variant exists in the fetched cart items
  const cartItems = cartData?.items || [];
  const existingCartItem = cartItems.find((item) => item.variant_id === activeVariantId);
  const isInCart = !!existingCartItem;

  const handleCheckPincode = () => {
    if (pincode.length !== 6) {
      setDeliveryStatus({ success: false, message: "Please enter a valid 6-digit pincode." });
      return;
    }
    setDeliveryStatus({ success: true, message: "Delivery available in 30 minutes! Express shipping active." });
  };

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      variant_id: activeVariantId,
      quantity: quantity,
    });
  };

  return (
    <View className="flex-1 bg-slate-100">
      {/* Premium Fixed Header Bar */}
      <View 
        className="flex-row items-center justify-between border-b border-slate-200 bg-white px-4 pb-3 shadow-xs"
        style={{ paddingTop: Math.max(insets.top, 12) }}
      >
        <Pressable 
          onPress={() => router.back()}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
        >
          <Ionicons name="arrow-back" size={20} color="#1E293B" />
        </Pressable>

        <Text className="text-base font-extrabold text-slate-900 tracking-tight" numberOfLines={1}>
          {product.name}
        </Text>

        <Pressable 
          onPress={() => setIsWishlisted(!isWishlisted)}
          className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
        >
          <Ionicons name={isWishlisted ? "heart" : "heart-outline"} size={19} color={isWishlisted ? "#DC2626" : "#1E293B"} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Modern Image Carousel with Horizontal Scroll */}
        <View className="bg-white pb-4">
          <View className="relative h-72 w-full bg-slate-50">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                const slide = Math.round(e.nativeEvent.contentOffset.x / e.nativeEvent.layoutMeasurement.width);
                if (slide !== activeImageIndex) setActiveImageIndex(slide);
              }}
              scrollEventThrottle={16}
            >
              {variantImages.map((imgUrl, idx) => (
                <View key={idx} className="h-72 w-screen items-center justify-center px-4">
                  <Image source={{ uri: imgUrl }} className="h-64 w-64 rounded-xl" resizeMode="contain" />
                </View>
              ))}
            </ScrollView>

            {discount > 0 && (
              <View className="absolute left-4 top-4 rounded-lg bg-emerald-700 px-2.5 py-1 shadow-sm">
                <Text className="text-xs font-extrabold text-white">{discount}% OFF</Text>
              </View>
            )}
          </View>

          {/* Slide Indicator Dots */}
          {variantImages.length > 1 && (
            <View className="mt-3 flex-row justify-center gap-1.5">
              {variantImages.map((_, idx) => (
                <View
                  key={idx}
                  className={`h-2 rounded-full transition-all ${
                    activeImageIndex === idx ? "w-5 bg-emerald-700" : "w-2 bg-slate-300"
                  }`}
                />
              ))}
            </View>
          )}
        </View>

        {/* Product Details Card */}
        <View className="mt-2.5 bg-white px-5 pt-5 pb-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              {product.category?.name} › {product.subcategory?.name}
            </Text>
            <View className="flex-row items-center rounded-md bg-emerald-50 px-2.5 py-1 border border-emerald-100">
              <Ionicons name="star" size={12} color="#047857" />
              <Text className="ml-1 text-xs font-extrabold text-emerald-800">4.5 · 812 Reviews</Text>
            </View>
          </View>

          <Text className="mt-2 text-2xl font-extrabold text-slate-900">{product.name}</Text>

          <View className="mt-3 flex-row items-baseline">
            <Text className="text-3xl font-black text-slate-900">₹{price}</Text>
            {originalPrice > price && (
              <Text className="ml-2.5 text-sm text-slate-400 line-through">₹{originalPrice}</Text>
            )}
            <Text className="ml-2 text-xs font-bold text-emerald-600">(Inclusive of all taxes)</Text>
          </View>

          {/* Variant Selector */}
          {product.variants && product.variants.length > 0 && (
            <View className="mt-5 border-t border-slate-100 pt-4">
              <Text className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">Select Weight / Size</Text>
              <View className="flex-row flex-wrap gap-2.5">
                {product.variants.map((variant, idx) => {
                  const attrMap = variant.attributes?.[0] as VariantAttributeResponseMapping | undefined;
                  const label = attrMap?.value?.value || variant.sku;
                  const isSelected = selectedVariantIndex === idx;

                  return (
                    <Pressable
                      key={variant.id ?? idx}
                      onPress={() => {
                        setSelectedVariantIndex(idx);
                        setActiveImageIndex(0);
                      }}
                      className={`rounded-xl border px-4 py-2.5 ${
                        isSelected 
                          ? "border-emerald-700 bg-emerald-50 shadow-xs" 
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <Text className={`text-xs font-bold ${isSelected ? "text-emerald-800" : "text-slate-700"}`}>
                        {label} · ₹{variant.selling_price}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Flipkart-Style Pincode Delivery Check Section */}
        <View className="mt-2.5 bg-white px-5 py-5">
          <Text className="text-sm font-bold text-slate-900">Delivery & Services</Text>
          <View className="mt-3 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-3 py-1">
            <Ionicons name="location-outline" size={18} color="#047857" />
            <TextInput
              value={pincode}
              onChangeText={setPincode}
              placeholder="Enter Pincode (e.g. 765001)"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={6}
              className="ml-2 flex-1 text-sm text-slate-800 py-2.5"
            />
            <Pressable onPress={handleCheckPincode} className="rounded-lg bg-emerald-700 px-3 py-2">
              <Text className="text-xs font-bold text-white">Check</Text>
            </Pressable>
          </View>

          {deliveryStatus && (
            <View className={`mt-2.5 rounded-lg p-2.5 ${deliveryStatus.success ? "bg-emerald-50" : "bg-rose-50"}`}>
              <Text className={`text-xs font-bold ${deliveryStatus.success ? "text-emerald-800" : "text-rose-700"}`}>
                {deliveryStatus.message}
              </Text>
            </View>
          )}

          <View className="mt-4 space-y-3">
            <View className="flex-row items-center">
              <Ionicons name="flash-outline" size={18} color="#047857" />
              <Text className="ml-3 text-xs font-semibold text-slate-700">Superfast 30-Minute Delivery Available</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="shield-checkmark-outline" size={18} color="#047857" />
              <Text className="ml-3 text-xs font-semibold text-slate-700">100% Freshness Guarantee & Easy Returns</Text>
            </View>
          </View>
        </View>

        {/* Product Description */}
        <View className="mt-2.5 bg-white px-5 py-4">
          <Text className="text-sm font-bold text-slate-900">Product Description</Text>
          <Text className="mt-2 text-xs leading-relaxed text-slate-600">
            {product.description || "Freshly sourced high-quality produce packed with essential nutrients and vitamins. Ideal for daily cooking and healthy meal preparations."}
          </Text>
        </View>

        {/* Customer Reviews Section */}
        <View className="mt-2.5 bg-white px-5 py-4">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-bold text-slate-900">Customer Ratings & Reviews</Text>
            <Pressable>
              <Text className="text-xs font-bold text-emerald-700">View All (42)</Text>
            </Pressable>
          </View>

          <View className="mt-3 space-y-3">
            {dummyReviews.map((rev) => (
              <View key={rev.id} className="border-b border-slate-100 pb-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs font-bold text-slate-800">{rev.name}</Text>
                  <Text className="text-[10px] text-slate-400">{rev.date}</Text>
                </View>
                <View className="mt-1 flex-row items-center">
                  {[...Array(5)].map((_, i) => (
                    <Ionicons 
                      key={i} 
                      name={i < rev.rating ? "star" : "star-outline"} 
                      size={12} 
                      color="#F59E0B" 
                    />
                  ))}
                </View>
                <Text className="mt-1.5 text-xs text-slate-600">{rev.comment}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recommended Products Carousel */}
        <View className="mt-2.5 bg-white px-5 py-4 mb-6">
          <Text className="text-sm font-bold text-slate-900 mb-3">Similar Products You Might Like</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {recommendedProducts.map((rec) => (
              <View key={rec.id} className="w-32 rounded-xl border border-slate-100 bg-slate-50 p-2.5">
                <Image source={{ uri: rec.image }} className="h-24 w-full rounded-lg bg-white" resizeMode="cover" />
                <Text numberOfLines={1} className="mt-2 text-xs font-bold text-slate-800">{rec.name}</Text>
                <Text className="mt-0.5 text-xs font-extrabold text-emerald-700">₹{rec.price}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Sticky Action Bar */}
      <View 
        className="absolute bottom-0 left-0 right-0 flex-row items-center border-t border-slate-200 bg-white px-5 py-3 shadow-lg"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {!isInCart && (
          <View className="mr-3 flex-row items-center rounded-xl border border-slate-200 bg-slate-50 px-2 py-2">
            <Pressable onPress={() => setQuantity((q) => Math.max(1, q - 1))} className="px-2">
              <Ionicons name="remove" size={16} color="#334155" />
            </Pressable>
            <Text className="px-2 text-sm font-bold text-slate-900">{quantity}</Text>
            <Pressable onPress={() => setQuantity((q) => q + 1)} className="px-2">
              <Ionicons name="add" size={16} color="#334155" />
            </Pressable>
          </View>
        )}

        <Pressable 
          onPress={() => {
            if (isInCart) {
              router.push("/cart" as any);
            } else {
              handleAddToCart();
            }
          }}
          disabled={addToCartMutation.isPending}
          className="flex-1 items-center rounded-xl bg-emerald-700 py-3.5 shadow-sm"
        >
          <Text className="text-sm font-extrabold text-white">
            {isInCart
              ? "GO TO CART"
              : addToCartMutation.isPending
              ? "ADDING..."
              : `ADD TO CART · ₹${price * quantity}`}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
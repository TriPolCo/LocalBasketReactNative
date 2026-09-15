import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { type ReactNode, useMemo, useRef, useState } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useProducts } from "@/hooks/products/useProducts";
import { useAddToCart } from "@/hooks/cart/useAddToCart";
import { useCart } from "@/hooks/cart/useCart";
import { ProductResponse, ProductVariant, VariantAttributeResponseMapping } from "@/types/productTypes";

type SortOption =
  | "Popular"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Customer Rating";

const sortOptions: SortOption[] = [
  "Popular",
  "Price: Low to High",
  "Price: High to Low",
  "Customer Rating",
];

const BASE_HEADER_HEIGHT = 64;
const SORT_BAR_HEIGHT = 50;

export default function GroceriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: response, isLoading, isError } = useProducts("grocery");
  const { data: cartData } = useCart();
  const addToCartMutation = useAddToCart();

  const [sortOption, setSortOption] = useState<SortOption>("Popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  const HEADER_HEIGHT = BASE_HEADER_HEIGHT + insets.top;
  const TOTAL_TOP_HEIGHT = HEADER_HEIGHT + SORT_BAR_HEIGHT;

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const rawProducts: ProductResponse[] = useMemo(() => {
    if (!response) return [];
    if (Array.isArray(response?.data)) return response.data;
    if (Array.isArray((response as any)?.data?.data)) return (response as any).data.data;
    return [];
  }, [response]);

  const products = useMemo(() => {
    let result = [...rawProducts];

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    if (sortOption === "Price: Low to High") {
      return result.sort((a, b) => {
        const priceA = Number(a.variants?.[0]?.selling_price ?? 0);
        const priceB = Number(b.variants?.[0]?.selling_price ?? 0);
        return priceA - priceB;
      });
    }

    if (sortOption === "Price: High to Low") {
      return result.sort((a, b) => {
        const priceA = Number(a.variants?.[0]?.selling_price ?? 0);
        const priceB = Number(b.variants?.[0]?.selling_price ?? 0);
        return priceB - priceA;
      });
    }

    return result;
  }, [sortOption, searchQuery, rawProducts]);

  const cartItems = cartData?.items || [];
  const cartCount = cartData?.total_quantity || 0;
  const cartTotal = cartData?.subtotal || 0;

  const getCartQtyForVariant = (variantId: string) => {
    const item = cartItems.find((i) => i.variant_id === variantId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (variantId: string) => {
    addToCartMutation.mutate({
      variant_id: variantId,
      quantity: 1,
    });
  };

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Top Title Header */}
      <Animated.View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: HEADER_HEIGHT,
          zIndex: 20,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <View 
          className="flex-1 flex-row items-center justify-between bg-white px-4 shadow-sm"
          style={{ paddingTop: insets.top }}
        >
          <View>
            <Text className="text-2xl font-extrabold tracking-tight text-indigo-900">
              Supermarket Groceries
            </Text>
            <Text className="mt-0.5 text-xs text-slate-500">
              {products.length} essential items · express delivery
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setSearchVisible((v) => !v)}
              className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50"
            >
              <Ionicons name="search-outline" size={19} color="#3730A3" />
            </Pressable>

            <Pressable 
              onPress={() => router.push("/cart" as any)}
              className="h-10 w-10 items-center justify-center rounded-full bg-indigo-50"
            >
              <Ionicons name="cart-outline" size={19} color="#3730A3" />
              {cartCount > 0 && (
                <View className="absolute -right-1 -top-1 h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1">
                  <Text className="text-[9px] font-extrabold text-white">
                    {cartCount}
                  </Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Animated.View>

      {/* Sticky Sort & Filter Bar */}
      <Animated.View
        style={{
          position: "absolute",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          height: SORT_BAR_HEIGHT,
          zIndex: 20,
          transform: [{ translateY: headerTranslateY }],
        }}
      >
        <View className="h-full flex-row border-y border-slate-200 bg-white">
          <Pressable
            onPress={() => setSortSheetVisible(true)}
            className="flex-1 flex-row items-center justify-center border-r border-slate-200"
          >
            <Ionicons name="swap-vertical-outline" size={18} color="#3730A3" />
            <Text className="ml-2 text-sm font-bold text-slate-800">
              Sort · {sortOption}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterDrawerVisible(true)}
            className="flex-1 flex-row items-center justify-center"
          >
            <Ionicons name="options-outline" size={18} color="#3730A3" />
            <Text className="ml-2 text-sm font-bold text-slate-800">
              Filter
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Dropdown Search Bar */}
      {searchVisible && (
        <>
          <Pressable
            onPress={() => setSearchVisible(false)}
            style={{
              position: "absolute",
              top: HEADER_HEIGHT,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 24,
              backgroundColor: "rgba(15,23,42,0.25)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: HEADER_HEIGHT,
              left: 0,
              right: 0,
              zIndex: 25,
            }}
            className="bg-white px-4 py-3 shadow-md"
          >
            <View className="flex-row items-center rounded-2xl bg-slate-100 px-4 py-3">
              <Ionicons name="search-outline" size={18} color="#64748B" />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search rice, milk, coffee..."
                placeholderTextColor="#94A3B8"
                className="ml-2 flex-1 text-sm text-slate-800"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </Pressable>
              )}
            </View>
          </View>
        </>
      )}

      {/* Main Content List */}
      <Animated.FlatList
        data={products}
        keyExtractor={(item: ProductResponse) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: TOTAL_TOP_HEIGHT + 12,
          paddingHorizontal: 10,
          paddingBottom: cartCount > 0 ? 110 + insets.bottom : 24 + insets.bottom,
        }}
        columnWrapperStyle={{ gap: 10, justifyContent: "space-between" }}
        ListEmptyComponent={
          <View className="mt-24 items-center px-8">
            {isLoading ? (
              <Text className="text-sm text-slate-400">Loading products...</Text>
            ) : isError ? (
              <Text className="text-sm text-rose-500">Failed to load products.</Text>
            ) : (
              <>
                <Ionicons name="basket-outline" size={40} color="#CBD5E1" />
                <Text className="mt-3 text-center text-sm text-slate-400">
                  No grocery items match your search.
                </Text>
              </>
            )}
          </View>
        }
        renderItem={({ item }: { item: ProductResponse }) => {
          const firstVariant: ProductVariant = item.variants?.[0] ?? {};
          const variantId = firstVariant.id ?? item.id;
          const price = Number(firstVariant.selling_price ?? 0);
          const originalPrice = Number(firstVariant.mrp ?? price);
          const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
          
          const imageUrl = item.image?.image_url || firstVariant.primary_image?.image_url;
          const qtyInCart = getCartQtyForVariant(variantId);
          const isWishlisted = !!wishlist[item.id];

          const firstAttrMapping = firstVariant.attributes?.[0] as VariantAttributeResponseMapping | undefined;
          const attributeLabel = firstAttrMapping?.attribute?.name;
          const attributeValue = firstAttrMapping?.value?.value;
          const displayAttributeText = attributeLabel && attributeValue ? `${attributeLabel}: ${attributeValue}` : (firstVariant.sku ?? item.category?.name);

          return (
            <Pressable
              onPress={() => router.push(`/product/${item.id}` as any)}
              className="mb-3 w-[48%] overflow-hidden rounded-md bg-white shadow-sm shadow-slate-200"
            >
              <View>
                <Image
                  source={{ uri: imageUrl }}
                  className="h-36 w-full bg-slate-100"
                  resizeMode="cover"
                />

                {discount > 0 && (
                  <View className="absolute left-2 top-2 rounded-md bg-indigo-600 px-2 py-1">
                    <Text className="text-[10px] font-extrabold text-white">
                      {discount}% OFF
                    </Text>
                  </View>
                )}

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-white/90"
                >
                  <Ionicons
                    name={isWishlisted ? "heart" : "heart-outline"}
                    size={16}
                    color={isWishlisted ? "#DC2626" : "#475569"}
                  />
                </Pressable>
              </View>

              <View className="p-3">
                <Text
                  numberOfLines={1}
                  className="text-sm font-bold text-slate-900"
                >
                  {item.name}
                </Text>

                <Text numberOfLines={1} className="mt-0.5 text-xs text-slate-500 font-medium">
                  {displayAttributeText}
                </Text>

                <View className="mt-2 flex-row items-baseline justify-between">
                  <View className="flex-row items-baseline">
                    <Text className="text-base font-extrabold text-slate-900">
                      ₹{price}
                    </Text>
                    {originalPrice > price && (
                      <Text className="ml-1.5 text-xs text-slate-400 line-through">
                        ₹{originalPrice}
                      </Text>
                    )}
                  </View>
                </View>

                {qtyInCart === 0 ? (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(variantId);
                    }}
                    className="mt-3 items-center rounded-md bg-indigo-600 border border-indigo-700 py-2"
                  >
                    <Text className="text-xs font-extrabold text-white">
                      ADD TO CART
                    </Text>
                  </Pressable>
                ) : (
                  <View className="mt-3 flex-row items-center justify-between rounded-xl bg-indigo-600 py-1.5 px-3">
                    <Text className="text-xs font-extrabold text-white">
                      In Cart: {qtyInCart}
                    </Text>
                    <Pressable
                      onPress={(e) => {
                        e.stopPropagation();
                        handleAddToCart(variantId);
                      }}
                      className="h-6 w-6 items-center justify-center"
                    >
                      <Ionicons name="add" size={16} color="#fff" />
                    </Pressable>
                  </View>
                )}
              </View>
            </Pressable>
          );
        }}
      />

      {/* Floating Bottom Cart Bar */}
      {cartCount > 0 && (
        <View 
          className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between rounded-t-2xl bg-indigo-900 px-5 py-4 shadow-lg"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          <View>
            <Text className="text-xs font-semibold text-indigo-200">
              {cartCount} item{cartCount > 1 ? "s" : ""} in cart
            </Text>
            <Text className="text-base font-extrabold text-white">
              ₹{cartTotal}
            </Text>
          </View>

          <Pressable 
            onPress={() => router.push("/cart" as any)}
            className="flex-row items-center rounded-xl bg-white px-4 py-2.5"
          >
            <Text className="mr-1 text-sm font-extrabold text-indigo-900">
              View Cart
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#312E81" />
          </Pressable>
        </View>
      )}

      {/* Sort Options Bottom Sheet Modal */}
      <Modal
        visible={sortSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSortSheetVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable
            className="flex-1"
            onPress={() => setSortSheetVisible(false)}
          />

          <View 
            className="rounded-t-3xl bg-white px-5 pt-5"
            style={{ paddingBottom: Math.max(insets.bottom, 24) }}
          >
            <View className="mb-5 flex-row items-center justify-between">
              <Text className="text-xl font-bold text-slate-900">
                Sort items by
              </Text>

              <Pressable onPress={() => setSortSheetVisible(false)}>
                <Ionicons name="close" size={24} color="#334155" />
              </Pressable>
            </View>

            {sortOptions.map((option) => {
              const selected = option === sortOption;

              return (
                <Pressable
                  key={option}
                  onPress={() => {
                    setSortOption(option);
                    setSortSheetVisible(false);
                  }}
                  className="flex-row items-center justify-between border-b border-slate-100 py-4"
                >
                  <Text
                    className={`text-base ${
                      selected
                        ? "font-bold text-indigo-700"
                        : "font-medium text-slate-700"
                    }`}
                  >
                    {option}
                  </Text>

                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={22}
                    color={selected ? "#4338CA" : "#94A3B8"}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Filter Side Drawer Modal */}
      <Modal
        visible={filterDrawerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterDrawerVisible(false)}
      >
        <View className="flex-1 flex-row bg-black/40">
          <Pressable
            className="flex-1"
            onPress={() => setFilterDrawerVisible(false)}
          />

          <View className="h-full w-[88%] bg-white">
            <View 
              className="flex-row items-center justify-between border-b border-slate-200 px-5 pb-4"
              style={{ paddingTop: Math.max(insets.top, 16) + 12 }}
            >
              <View>
                <Text className="text-2xl font-extrabold text-indigo-900">
                  Filters
                </Text>
                <Text className="mt-1 text-sm text-slate-500">
                  Refine your grocery list
                </Text>
              </View>

              <Pressable
                onPress={() => setFilterDrawerVisible(false)}
                className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={23} color="#334155" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FilterSection title="Grocery Category">
                <FilterRow label="Atta, Rice & Dal" />
                <FilterRow label="Milk, Butter & Cheese" />
                <FilterRow label="Tea, Coffee & Drinks" />
                <FilterRow label="Munchies & Chocolates" />
                <FilterRow label="Soap & Bath Essentials" />
              </FilterSection>

              <FilterSection title="Price Range">
                <FilterRow label="Under ₹100" />
                <FilterRow label="₹100 to ₹300" />
                <FilterRow label="₹300 to ₹600" />
                <FilterRow label="Above ₹600" />
              </FilterSection>

              <FilterSection title="Customer Rating">
                <FilterRow label="4.5★ & above" />
                <FilterRow label="4.0★ & above" />
              </FilterSection>
            </ScrollView>

            <View 
              className="flex-row border-t border-slate-200 bg-white p-4"
              style={{ paddingBottom: Math.max(insets.bottom, 16) }}
            >
              <Pressable className="mr-3 flex-1 items-center rounded-xl border border-indigo-700 py-3">
                <Text className="font-bold text-indigo-700">Clear All</Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterDrawerVisible(false)}
                className="flex-1 items-center rounded-xl bg-indigo-600 py-3"
              >
                <Text className="font-bold text-white">Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View className="border-b border-slate-100 px-5 py-5">
      <Text className="mb-3 text-base font-bold text-slate-900">{title}</Text>
      {children}
    </View>
  );
}

function FilterRow({ label }: { label: string }) {
  return (
    <Pressable className="flex-row items-center py-2">
      <Ionicons name="square-outline" size={21} color="#64748B" />
      <Text className="ml-3 text-sm text-slate-700">{label}</Text>
    </Pressable>
  );
}
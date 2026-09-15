import { Ionicons } from "@expo/vector-icons";
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

type FoodCategory = "Starters" | "Main Course" | "Breads" | "Biryani" | "Desserts";

type FoodItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  isVeg: boolean;
  isBestseller?: boolean;
  category: FoodCategory;
  image: string;
};

type PromoBanner = {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  bgColor: string;
  accentColor: string;
};

const promoBanners: PromoBanner[] = [
  {
    id: "p1",
    title: "50% OFF on Chicken Delights",
    subtitle: "Up to ₹120 discount on your favorite mains",
    code: "FEAST50",
    bgColor: "#FEF2F2",
    accentColor: "#EF4444",
  },
  {
    id: "p2",
    title: "Free Butter Naan",
    subtitle: "On orders above ₹499 with any Gravy",
    code: "FREENAAN",
    bgColor: "#FFFBEB",
    accentColor: "#D97706",
  },
  {
    id: "p3",
    title: "Biryani Fiesta",
    subtitle: "Flat ₹75 Cashback on Dum Biryanis",
    code: "DUMPARTY",
    bgColor: "#F0FDF4",
    accentColor: "#16A34A",
  },
];

const foodItems: FoodItem[] = [
  {
    id: "f1",
    name: "Butter Chicken",
    description: "Tender chicken cooked in a rich, creamy tomato and butter gravy.",
    price: 360,
    originalPrice: 420,
    rating: 4.8,
    reviews: 1850,
    isVeg: false,
    isBestseller: true,
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f2",
    name: "Garlic Butter Naan",
    description: "Leavened flatbread topped with minced garlic and fresh butter.",
    price: 60,
    originalPrice: 75,
    rating: 4.7,
    reviews: 2100,
    isVeg: true,
    isBestseller: true,
    category: "Breads",
    image:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f3",
    name: "Chicken Tikka Kebab",
    description: "Marinated boneless chicken chunks grilled in a traditional tandoor.",
    price: 320,
    originalPrice: 380,
    rating: 4.6,
    reviews: 940,
    isVeg: false,
    category: "Starters",
    image:
      "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f4",
    name: "Hyderabadi Chicken Dum Biryani",
    description: "Slow-cooked basmati ricelayered with spiced chicken and aromatic herbs.",
    price: 390,
    originalPrice: 450,
    rating: 4.9,
    reviews: 3200,
    isVeg: false,
    isBestseller: true,
    category: "Biryani",
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f5",
    name: "Paneer Butter Masala",
    description: "Cubes of cottage cheese simmered in a mildly sweet tomato cashew gravy.",
    price: 310,
    originalPrice: 360,
    rating: 4.7,
    reviews: 1420,
    isVeg: true,
    category: "Main Course",
    image:
      "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f6",
    name: "Tandoori Roti",
    description: "Whole wheat unleavened flatbread baked in a clay tandoor oven.",
    price: 30,
    originalPrice: 35,
    rating: 4.5,
    reviews: 880,
    isVeg: true,
    category: "Breads",
    image:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=800&auto=format&fit=crop&q=60",
  },
  {
    id: "f7",
    name: "Gulab Jamun (2 Pcs)",
    description: "Soft fried dough balls soaked in cardamom flavored sugar syrup.",
    price: 90,
    originalPrice: 110,
    rating: 4.8,
    reviews: 1290,
    isVeg: true,
    category: "Desserts",
    image:
      "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=60",
  },
];

type SortOption =
  | "Popularity"
  | "Price: Low to High"
  | "Price: High to Low"
  | "Rating";

const sortOptions: SortOption[] = [
  "Popularity",
  "Price: Low to High",
  "Price: High to Low",
  "Rating",
];

const HEADER_HEIGHT = 108;
const SORT_BAR_HEIGHT = 54;

export default function RestaurantMenuScreen() {
  const [sortOption, setSortOption] = useState<SortOption>("Popularity");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [vegOnly, setVegOnly] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [sortSheetVisible, setSortSheetVisible] = useState(false);
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const clampedScrollY = useRef(
    Animated.diffClamp(scrollY, 0, HEADER_HEIGHT)
  ).current;

  const headerTranslateY = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: "clamp",
  });

  const cartCount = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  );

  const cartTotal = useMemo(
    () =>
      Object.entries(cart).reduce((sum, [id, qty]) => {
        const item = foodItems.find((f) => f.id === id);
        return item ? sum + item.price * qty : sum;
      }, 0),
    [cart]
  );

  const products = useMemo(() => {
    let result = [...foodItems];

    if (vegOnly) {
      result = result.filter((item) => item.isVeg);
    }

    if (searchQuery.trim().length > 0) {
      const query = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      );
    }

    if (sortOption === "Price: Low to High") {
      return result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "Price: High to Low") {
      return result.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "Rating") {
      return result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [sortOption, searchQuery, vegOnly]);

  const addToCart = (id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[id] ?? 0) - 1;
      if (qty <= 0) {
        delete next[id];
      } else {
        next[id] = qty;
      }
      return next;
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* Top Header */}
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
        <View className="flex-1 flex-row items-center justify-between bg-white px-4 pb-3 pt-12 shadow-sm">
          <View>
            <Text className="text-2xl font-extrabold tracking-tight text-slate-900">
              Spice Kitchen & Grill
            </Text>
            <Text className="mt-1 text-sm text-slate-500">
              North Indian, Biryani · 30-35 mins
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setSearchVisible((v) => !v)}
              className="h-10 w-10 items-center justify-center rounded-full bg-orange-50"
            >
              <Ionicons name="search-outline" size={19} color="#EA580C" />
            </Pressable>

            <View className="h-10 w-10 items-center justify-center rounded-full bg-orange-50">
              <Ionicons name="bag-handle-outline" size={19} color="#EA580C" />
              {cartCount > 0 && (
                <View className="absolute -right-1 -top-1 h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-600 px-1">
                  <Text className="text-[9px] font-extrabold text-white">
                    {cartCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Sticky Filter & Veg Toggle Bar */}
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
        <View className="h-full flex-row items-center border-y border-slate-200 bg-white px-4">
          <Pressable
            onPress={() => setVegOnly((v) => !v)}
            className={`mr-3 flex-row items-center rounded-full border px-3 py-1.5 ${
              vegOnly ? "border-emerald-600 bg-emerald-50" : "border-slate-300 bg-white"
            }`}
          >
            <View className="h-3 w-3 items-center justify-center border border-emerald-600 bg-white p-0.5">
              <View className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            </View>
            <Text
              className={`ml-1.5 text-xs font-bold ${
                vegOnly ? "text-emerald-700" : "text-slate-700"
              }`}
            >
              Veg Only
            </Text>
          </Pressable>

          <View className="h-4 w-[1px] bg-slate-200" />

          <Pressable
            onPress={() => setSortSheetVisible(true)}
            className="flex-1 flex-row items-center justify-center"
          >
            <Ionicons name="swap-vertical-outline" size={16} color="#EA580C" />
            <Text className="ml-1.5 text-xs font-bold text-slate-800">
              Sort · {sortOption}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setFilterDrawerVisible(true)}
            className="flex-1 flex-row items-center justify-center border-l border-slate-200"
          >
            <Ionicons name="options-outline" size={16} color="#EA580C" />
            <Text className="ml-1.5 text-xs font-bold text-slate-800">
              Filters
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Search Bar Overlay */}
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
                placeholder="Search Butter Chicken, Naan, Biryani..."
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

      {/* Food Items List */}
      <Animated.FlatList
        data={products}
        keyExtractor={(item: FoodItem) => item.id}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: HEADER_HEIGHT + SORT_BAR_HEIGHT + 12,
          paddingHorizontal: 16,
          paddingBottom: cartCount > 0 ? 110 : 24,
        }}
        ListHeaderComponent={
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={300}
              decelerationRate="fast"
            >
              {promoBanners.map((banner) => (
                <View
                  key={banner.id}
                  style={{ backgroundColor: banner.bgColor }}
                  className="mr-3 w-[290px] flex-row items-center justify-between rounded-2xl p-4 border border-slate-200/50"
                >
                  <View className="flex-1 pr-2">
                    <Text className="text-sm font-extrabold text-slate-900">
                      {banner.title}
                    </Text>
                    <Text className="mt-1 text-xs text-slate-600">
                      {banner.subtitle}
                    </Text>
                    <View
                      style={{ backgroundColor: banner.accentColor }}
                      className="mt-2.5 self-start rounded-lg px-2 py-0.5"
                    >
                      <Text className="text-[10px] font-black text-white">
                        USE {banner.code}
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="flame" size={32} color={banner.accentColor} />
                </View>
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          <View className="mt-24 items-center px-8">
            <Ionicons name="restaurant-outline" size={40} color="#CBD5E1" />
            <Text className="mt-3 text-center text-sm text-slate-400">
              No dish found matching your selection.
            </Text>
          </View>
        }
        renderItem={({ item }: { item: FoodItem }) => {
          const qtyInCart = cart[item.id] ?? 0;

          return (
            <View className="mb-4 flex-row justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100">
              <View className="flex-1 pr-4">
                <View className="flex-row items-center gap-2">
                  {/* Veg / Non-Veg Icon */}
                  <View
                    className={`h-4 w-4 items-center justify-center border ${
                      item.isVeg ? "border-emerald-600" : "border-red-600"
                    }`}
                  >
                    <View
                      className={`h-2 w-2 rounded-full ${
                        item.isVeg ? "bg-emerald-600" : "bg-red-600"
                      }`}
                    />
                  </View>

                  {item.isBestseller && (
                    <View className="rounded bg-amber-100 px-1.5 py-0.5">
                      <Text className="text-[9px] font-extrabold text-amber-800">
                        BESTSELLER
                      </Text>
                    </View>
                  )}
                </View>

                <Text className="mt-1.5 text-base font-extrabold text-slate-900">
                  {item.name}
                </Text>

                <View className="mt-1 flex-row items-center">
                  <Text className="text-sm font-bold text-slate-900">
                    ₹{item.price}
                  </Text>
                  <Text className="ml-1.5 text-xs text-slate-400 line-through">
                    ₹{item.originalPrice}
                  </Text>
                </View>

                <View className="mt-1 flex-row items-center">
                  <Ionicons name="star" size={12} color="#EAB308" />
                  <Text className="ml-1 text-xs font-bold text-slate-700">
                    {item.rating}
                  </Text>
                  <Text className="ml-1 text-xs text-slate-400">
                    ({item.reviews})
                  </Text>
                </View>

                <Text
                  numberOfLines={2}
                  className="mt-2 text-xs text-slate-500 leading-relaxed"
                >
                  {item.description}
                </Text>
              </View>

              <View className="items-center">
                <Image
                  source={{ uri: item.image }}
                  className="h-28 w-28 rounded-2xl bg-slate-100"
                  resizeMode="cover"
                />

                <View className="-mt-4 w-24">
                  {qtyInCart === 0 ? (
                    <Pressable
                      onPress={() => addToCart(item.id)}
                      className="items-center rounded-xl bg-white border border-orange-500 py-1.5 shadow-sm"
                    >
                      <Text className="text-xs font-black text-orange-600">
                        ADD
                      </Text>
                    </Pressable>
                  ) : (
                    <View className="flex-row items-center justify-between rounded-xl bg-orange-600 py-1 px-1 shadow-sm">
                      <Pressable
                        onPress={() => removeFromCart(item.id)}
                        className="h-6 w-6 items-center justify-center"
                      >
                        <Ionicons name="remove" size={14} color="#fff" />
                      </Pressable>
                      <Text className="text-xs font-black text-white">
                        {qtyInCart}
                      </Text>
                      <Pressable
                        onPress={() => addToCart(item.id)}
                        className="h-6 w-6 items-center justify-center"
                      >
                        <Ionicons name="add" size={14} color="#fff" />
                      </Pressable>
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

      {/* Floating Bottom Cart Floating Bar */}
      {cartCount > 0 && (
        <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between rounded-t-2xl bg-slate-900 px-5 py-4 shadow-xl">
          <View>
            <Text className="text-xs font-semibold text-slate-400">
              {cartCount} ITEM{cartCount > 1 ? "S" : ""} ADDED
            </Text>
            <Text className="text-base font-extrabold text-white">
              ₹{cartTotal}
            </Text>
          </View>

          <Pressable className="flex-row items-center rounded-xl bg-orange-600 px-4 py-2.5">
            <Text className="mr-1.5 text-sm font-extrabold text-white">
              View Cart
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </Pressable>
        </View>
      )}

      {/* Sort Sheet Modal */}
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

          <View className="rounded-t-3xl bg-white px-5 pb-8 pt-5">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-extrabold text-slate-900">
                Sort Menu By
              </Text>

              <Pressable onPress={() => setSortSheetVisible(false)}>
                <Ionicons name="close" size={22} color="#334155" />
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
                  className="flex-row items-center justify-between border-b border-slate-100 py-3.5"
                >
                  <Text
                    className={`text-sm ${
                      selected
                        ? "font-extrabold text-orange-600"
                        : "font-medium text-slate-700"
                    }`}
                  >
                    {option}
                  </Text>

                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={20}
                    color={selected ? "#EA580C" : "#94A3B8"}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Filter Drawer Modal */}
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

          <View className="h-full w-[85%] bg-white">
            <View className="flex-row items-center justify-between border-b border-slate-200 px-5 pb-4 pt-14">
              <View>
                <Text className="text-2xl font-extrabold text-slate-900">
                  Filters
                </Text>
                <Text className="mt-0.5 text-xs text-slate-500">
                  Refine menu items
                </Text>
              </View>

              <Pressable
                onPress={() => setFilterDrawerVisible(false)}
                className="h-9 w-9 items-center justify-center rounded-full bg-slate-100"
              >
                <Ionicons name="close" size={20} color="#334155" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <FilterSection title="Dietary Preference">
                <FilterRow label="Vegetarian Only" />
                <FilterRow label="Non-Vegetarian" />
              </FilterSection>

              <FilterSection title="Course Categories">
                <FilterRow label="Starters & Kebabs" />
                <FilterRow label="Main Course Gravies" />
                <FilterRow label="Fresh Tandoori Breads" />
                <FilterRow label="Biryani & Rice" />
                <FilterRow label="Desserts & Sweets" />
              </FilterSection>

              <FilterSection title="Price Bracket">
                <FilterRow label="Under ₹150" />
                <FilterRow label="₹150 to ₹350" />
                <FilterRow label="Above ₹350" />
              </FilterSection>
            </ScrollView>

            <View className="flex-row border-t border-slate-200 bg-white p-4">
              <Pressable className="mr-3 flex-1 items-center rounded-xl border border-slate-300 py-3">
                <Text className="font-bold text-slate-700">Clear All</Text>
              </Pressable>

              <Pressable
                onPress={() => setFilterDrawerVisible(false)}
                className="flex-1 items-center rounded-xl bg-orange-600 py-3"
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
    <View className="border-b border-slate-100 px-5 py-4">
      <Text className="mb-2.5 text-sm font-bold text-slate-900">{title}</Text>
      {children}
    </View>
  );
}

function FilterRow({ label }: { label: string }) {
  return (
    <Pressable className="flex-row items-center py-2">
      <Ionicons name="square-outline" size={18} color="#64748B" />
      <Text className="ml-2.5 text-xs text-slate-700">{label}</Text>
    </Pressable>
  );
}
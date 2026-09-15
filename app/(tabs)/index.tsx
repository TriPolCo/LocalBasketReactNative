import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const logo = require("../../assets/images/logo22.png");

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 40;
const SLIDE_STRIDE = SLIDE_WIDTH + 12;
const AUTO_SLIDE_INTERVAL = 3200;

type Slide = {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  image: string;
  tint: string;
};

const slides: Slide[] = [
  {
    id: "1",
    title: "Fresh veggies,\nfarm to door",
    subtitle: "Up to 40% off on daily greens",
    cta: "Shop Vegetables",
    image: "https://media.istockphoto.com/id/139496979/photo/assortment-of-fruits-and-vegetables-background.jpg?s=612x612&w=0&k=20&c=Tns4-67GV8LoJoN9YYwRM9PhpYKQ4kfbWg70_NJc9L8=",
    tint: "rgba(4,120,87,0.70)",
  },
  {
    id: "2",
    title: "Your monthly\ngrocery run, sorted",
    subtitle: "Rice, oil, atta & more essentials",
    cta: "Shop Groceries",
    image: "https://media.istockphoto.com/id/1442400348/photo/shopping-cart-with-groceries-at-store.jpg?s=612x612&w=0&k=20&c=3bs1GSt2R9my1WqF0L8aAjOxte3woI9AF7HEOQUpFjo=",
    tint: "rgba(194,65,12,0.70)",
  },
  {
    id: "3",
    title: "Hot meals,\ndelivered fast",
    subtitle: "From your favourite local kitchens",
    cta: "Order Food",
    image: "https://media.istockphoto.com/id/1345624336/photo/chicken-biriyani.jpg?s=612x612&w=0&k=20&c=adU_N0P-1SKMQLZu5yu7aPknfLLgbViI8XILqLP92A4=",
    tint: "rgba(4,120,87,0.70)",
  },
];

const quickCategories = [
  { icon: "leaf-outline", title: "Vegetables", route: "/vegetables" },
  { icon: "basket-outline", title: "Grocery", route: "/groceries" },
  { icon: "restaurant-outline", title: "Food", route: "/food" },
  { icon: "grid-outline", title: "More", route: "/categories" },
];

const categories = [
  { icon: "leaf-outline", title: "Vegetables", color: "#DCFCE7" },
  { icon: "nutrition-outline", title: "Fruits", color: "#F3E8FF" },
  { icon: "basket-outline", title: "Groceries", color: "#FEF3C7" },
  { icon: "restaurant-outline", title: "Food", color: "#FFEDD5" },
  { icon: "water-outline", title: "Dairy", color: "#DBEAFE" },
  { icon: "fast-food-outline", title: "Snacks", color: "#FFE4E6" },
  { icon: "cafe-outline", title: "Beverages", color: "#FFEDD5" },
  { icon: "medkit-outline", title: "Wellness", color: "#E0F2FE" },
];

type PromoBanner = {
  title: string;
  subtitle: string;
  image: string;
};

const promoBanners: PromoBanner[] = [
  {
    title: "Vegetable Fest",
    subtitle: "Flat 30% off",
    image: "https://loremflickr.com/500/500/tomato,vegetable",
  },
  {
    title: "Weekend Meals",
    subtitle: "Combos from ₹149",
    image: "https://loremflickr.com/500/500/foodplate,meal",
  },
];

type Product = {
  id: string;
  name: string;
  unit: string;
  price: string;
  originalPrice?: string;
  rating: number;
  image: string;
};

const popularProducts: Product[] = [
  { id: "p1", name: "Basmati Rice", unit: "10 kg", price: "₹599", originalPrice: "₹699", rating: 4.6, image: "https://loremflickr.com/300/300/rice,grain" },
  { id: "p2", name: "Fresh Tomatoes", unit: "1 kg", price: "₹40", originalPrice: "₹55", rating: 4.5, image: "https://loremflickr.com/300/300/tomato,vegetable" },
  { id: "p3", name: "Amul Milk", unit: "1 litre", price: "₹68", rating: 4.7, image: "https://loremflickr.com/300/300/milk,dairy" },
  { id: "p4", name: "Farm Potatoes", unit: "1 kg", price: "₹35", originalPrice: "₹45", rating: 4.4, image: "https://loremflickr.com/300/300/potato,vegetable" },
];

const orderAgainProducts: Product[] = [
  popularProducts[1],
  popularProducts[2],
  popularProducts[3],
];

const trendingSearches = [
  { term: "Onions", bg: "bg-emerald-100/80", text: "text-emerald-900" },
  { term: "Paneer", bg: "bg-orange-100/80", text: "text-orange-900" },
  { term: "Cold drinks", bg: "bg-emerald-100/80", text: "text-emerald-900" },
  { term: "Chicken", bg: "bg-orange-100/80", text: "text-orange-900" },
];

const trustBadges = [
  { icon: "bicycle-outline", title: "Free Delivery", subtitle: "On orders ₹199+" },
  { icon: "shield-checkmark-outline", title: "Secure Payments", subtitle: "100% protected" },
];

const reviews = [
  { name: "Ananya S.", rating: 5, comment: "Vegetables arrive fresh and delivery is super fast." },
  { name: "Rohit K.", rating: 4, comment: "Great prices on daily groceries and awesome packaging." },
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {searchVisible && (
        <>
          <Pressable
            onPress={() => setSearchVisible(false)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 34,
              backgroundColor: "rgba(15,23,42,0.35)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: insets.top,
              left: 0,
              right: 0,
              zIndex: 35,
            }}
            className="bg-white px-5 py-3 shadow-sm border-b border-[#E2E8F0]"
          >
            <View className="flex-row items-center rounded-md bg-[#F8FAFC] px-3.5 border border-[#E2E8F0]">
              <Ionicons name="search-outline" size={18} color="#64748B" />
              <TextInput
                autoFocus
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search rice, vegetables, food..."
                placeholderTextColor="#94A3B8"
                className="ml-2.5 h-10 flex-1 text-xs font-medium text-[#0F172A]"
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery("")} className="mr-1">
                  <Ionicons name="close-circle" size={16} color="#94A3B8" />
                </Pressable>
              )}
              <Pressable onPress={() => setSearchVisible(false)} className="ml-2 pl-2 border-l border-[#E2E8F0]">
                <Text className="text-xs font-bold text-[#047857]">Cancel</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* Header */}
      <View 
        className="bg-emerald-900 px-5 pb-3.5 z-20 border-b border-[#EA580C]"
        style={{ paddingTop: Math.max(insets.top, 12) }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image source={logo} className="h-9 w-9 rounded-md mr-2.5 " resizeMode="contain" />
            <View>
              <View className="flex-row items-center">
                <Text className="text-xl font-black tracking-tight text-white">
                  Daily
                </Text>
                <Text className="text-xl font-black  tracking-tight text-orange-500">
                  Drop
                </Text>
              </View>
              <View className="flex-row items-center mt-0.5">
                <Ionicons name="location-sharp" size={11} color="#FFEDD5" />
                <Text className="ml-1 text-[11px] font-medium text-slate-100" numberOfLines={1}>
                  Rayagada, Odisha · 765001
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={() => setSearchVisible(true)}
              className="h-9 w-9 items-center justify-center rounded-md bg-white/15 active:bg-white/25"
            >
              <Ionicons name="search-outline" size={17} color="#FFFFFF" />
            </Pressable>
            <Pressable 
              onPress={() => router.push("/cart")}
              className="h-9 w-9 items-center justify-center rounded-md bg-[#EA580C] active:bg-orange-600 shadow-sm"
            >
              <Ionicons name="cart-outline" size={17} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Quick Access Category Bar */}
        <View className="px-5 mt-4">
          <View className="flex-row justify-between bg-white p-2.5 rounded-md border border-[#E2E8F0] shadow-sm">
            {quickCategories.map((item) => (
              <TouchableOpacity
                key={item.title}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.8}
                className="items-center flex-1 py-1"
              >
                <View className="h-9 w-9 items-center justify-center rounded-md bg-emerald-50 border border-emerald-100">
                  <Ionicons name={item.icon as any} size={18} color="#047857" />
                </View>
                <Text className="mt-1 text-[11px] font-bold text-[#0F172A]" numberOfLines={1}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="mt-4">
          <HeroSlider />
        </View>

        <View className="px-5">
          <FlashSaleBanner />

          <Text className="mb-3 mt-6 text-xl font-black tracking-tight text-[#0F172A]">
            Shop by category
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <Category
                key={category.title}
                icon={category.icon}
                title={category.title}
                color={category.color}
              />
            ))}
          </View>

          <Text className="mb-2 mt-4 text-sm font-bold tracking-tight text-[#64748B]">
            Trending searches
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {trendingSearches.map(({ term, bg, text }) => (
              <View key={term} className={`rounded-full px-3 py-1 border border-black/5 ${bg}`}>
                <Text className={`text-xs font-bold ${text}`}>{term}</Text>
              </View>
            ))}
          </View>

          <Text className="mb-3 mt-6 text-xl font-black tracking-tight text-[#0F172A]">
            Today's deals
          </Text>
          <View className="flex-row gap-3">
            {promoBanners.map((banner) => (
              <TouchableOpacity
                key={banner.title}
                activeOpacity={0.9}
                className="flex-1 overflow-hidden rounded-md border border-[#E2E8F0] shadow-sm"
              >
                <ImageBackground
                  source={{ uri: banner.image }}
                  className="h-28 justify-end p-3"
                  imageStyle={{ borderRadius: 6 }}
                >
                  <View
                    style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
                    className="absolute inset-0 rounded-md"
                  />
                  <Text className="text-sm font-extrabold tracking-tight text-white">
                    {banner.title}
                  </Text>
                  <Text className="text-xs font-semibold text-[#FFEDD5]">
                    {banner.subtitle}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>

          <View className="mb-3 mt-6 flex-row items-center justify-between">
            <Text className="text-xl font-black tracking-tight text-[#0F172A]">
              Order again
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-xs font-extrabold tracking-wider text-[#047857] uppercase">
                See all
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        >
          {orderAgainProducts.map((product) => (
            <View
              key={product.id}
              className="w-36 overflow-hidden rounded-md bg-white p-2 border border-[#E2E8F0] shadow-sm"
            >
              <ImageBackground
                source={{ uri: product.image }}
                className="h-24 w-full overflow-hidden rounded-md bg-[#F8FAFC]"
                imageStyle={{ borderRadius: 6 }}
              />
              <Text numberOfLines={1} className="mt-2 text-xs font-bold text-[#0F172A]">
                {product.name}
              </Text>
              <Text className="text-[11px] font-medium text-[#64748B]">{product.unit}</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-xs font-black text-[#0F172A]">
                  {product.price}
                </Text>
                <TouchableOpacity className="h-6 w-6 items-center justify-center rounded-md bg-emerald-50 border border-emerald-200">
                  <Ionicons name="add" size={14} color="#047857" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="px-5">
          <View className="mb-3 mt-6 flex-row items-center justify-between">
            <Text className="text-xl font-black tracking-tight text-[#0F172A]">
              Popular products
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-xs font-extrabold tracking-wider text-[#047857] uppercase">
                See all
              </Text>
            </TouchableOpacity>
          </View>

          {popularProducts.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}

          <Text className="mb-3 mt-6 text-xl font-black tracking-tight text-[#0F172A]">
            Why shop with us
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {trustBadges.map((badge) => (
              <View
                key={badge.title}
                className="mb-3 w-[48%] rounded-md bg-white p-3.5 border border-[#E2E8F0] shadow-sm"
              >
                <View className="h-9 w-9 items-center justify-center rounded-md bg-[#FFEDD5] border border-orange-100">
                  <Ionicons name={badge.icon as any} size={18} color="#EA580C" />
                </View>
                <Text className="mt-2.5 text-xs font-bold text-[#0F172A]">
                  {badge.title}
                </Text>
                <Text className="mt-0.5 text-[11px] text-[#64748B] leading-4">
                  {badge.subtitle}
                </Text>
              </View>
            ))}
          </View>

          <Text className="mb-3 mt-4 text-xl font-black tracking-tight text-[#0F172A]">
            What customers say
          </Text>
          {reviews.map((review) => (
            <View key={review.name} className="mb-3 rounded-md bg-white p-3.5 border border-[#E2E8F0] shadow-sm">
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-bold text-[#0F172A]">
                  {review.name}
                </Text>
                <View className="flex-row items-center bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Ionicons name="star" size={11} color="#D97706" />
                  <Text className="ml-1 text-[11px] font-black text-amber-900">
                    {review.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text className="mt-2 text-xs leading-4 text-[#64748B] font-medium">
                "{review.comment}"
              </Text>
            </View>
          ))}

          <View className="mb-8 mt-6 items-center border-t border-[#E2E8F0] pt-6">
            <View className="flex-row items-center">
              <Text className="text-sm font-black text-[#047857]">Daily</Text>
              <Text className="text-sm font-black text-[#EA580C]">Drop</Text>
            </View>
            <Text className="mt-2 text-center text-xs text-[#64748B] px-6 leading-4 font-medium">
              Groceries, vegetables & food from your neighbourhood — delivered straight to your doorstep.
            </Text>
            <Text className="mt-4 text-[11px] font-semibold text-slate-400">
              © 2026 DailyDrop. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FlashSaleBanner() {
  const [secondsLeft, setSecondsLeft] = useState(2 * 60 * 60 + 45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((secondsLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(secondsLeft % 60)
    .toString()
    .padStart(2, "0");

  return (
    <View
      style={{ backgroundColor: "#FFEDD5", borderColor: "#FED7AA" }}
      className="mt-4 flex-row items-center justify-between rounded-md px-3.5 py-3 border shadow-sm"
    >
      <View className="flex-row items-center flex-1 mr-2">
        <View
          style={{ backgroundColor: "#EA580C" }}
          className="h-9 w-9 items-center justify-center rounded-md shadow-sm"
        >
          <Ionicons name="flash" size={17} color="#FFFFFF" />
        </View>
        <View className="ml-2.5 flex-1">
          <Text className="text-xs font-extrabold text-[#0F172A] tracking-tight">
            Flash Sale — ends soon
          </Text>
          <Text className="text-[11px] font-semibold text-[#EA580C] mt-0.5">
            Extra 15% off on select items
          </Text>
        </View>
      </View>

      <View
        style={{ backgroundColor: "#EA580C" }}
        className="rounded-md px-2.5 py-1.5 shadow-sm"
      >
        <Text className="text-xs font-black tracking-wider text-white">
          {hours}:{minutes}:{seconds}
        </Text>
      </View>
    </View>
  );
}

function HeroSlider() {
  const scrollRef = useRef<Animated.ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % slides.length;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * SLIDE_STRIDE, animated: true });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const handleMomentumScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / SLIDE_STRIDE);
    indexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  return (
    <View>
      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        snapToInterval={SLIDE_STRIDE}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {slides.map((slide, index) => {
          const inputRange = [
            (index - 1) * SLIDE_STRIDE,
            index * SLIDE_STRIDE,
            (index + 1) * SLIDE_STRIDE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.97, 1, 0.97],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={slide.id}
              style={{
                width: SLIDE_WIDTH,
                transform: [{ scale }],
                opacity,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.92}
                className="overflow-hidden rounded-md border border-[#E2E8F0] shadow-sm"
              >
                <ImageBackground
                  source={{ uri: slide.image }}
                  className="h-44 justify-end p-4"
                  imageStyle={{ borderRadius: 6 }}
                >
                  <View
                    style={{ backgroundColor: slide.tint }}
                    className="absolute inset-0 rounded-md"
                  />
                  <Text className="text-xl font-black leading-6 text-white tracking-tight">
                    {slide.title}
                  </Text>
                  <Text className="mt-1 text-xs font-semibold text-white/90">
                    {slide.subtitle}
                  </Text>
                  <View className="mt-3 flex-row items-center self-start rounded-md bg-[#EA580C] px-3.5 py-1.5 shadow-sm">
                    <Text className="text-xs font-black text-white">
                      {slide.cta}
                    </Text>
                    <Ionicons
                      name="arrow-forward"
                      size={12}
                      color="#FFFFFF"
                      style={{ marginLeft: 4 }}
                    />
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </Animated.ScrollView>

      <View className="mt-2.5 flex-row justify-center gap-1.5">
        {slides.map((slide, index) => (
          <View
            key={slide.id}
            className={`h-1 rounded-full ${
              index === activeIndex ? "w-5 bg-[#EA580C]" : "w-1.5 bg-slate-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}

function Category({
  icon,
  title,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
}) {
  return (
    <TouchableOpacity
      style={{ backgroundColor: color }}
      activeOpacity={0.8}
      className="mb-2.5 h-24 w-[23%] items-center justify-center rounded-md border border-black/5 shadow-sm"
    >
      <View className="h-9 w-9 items-center justify-center rounded-full bg-white/70">
        <Ionicons name={icon} size={20} color="#047857" />
      </View>
      <Text className="mt-1.5 text-center text-[11px] font-bold text-[#0F172A]" numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

function ProductRow({ product }: { product: Product }) {
  return (
    <View className="mb-2.5 flex-row items-center rounded-md bg-white p-2.5 border border-[#E2E8F0] shadow-sm">
      <ImageBackground
        source={{ uri: product.image }}
        className="h-14 w-14 overflow-hidden rounded-md bg-[#F8FAFC] border border-[#E2E8F0]"
        imageStyle={{ borderRadius: 6 }}
      />

      <View className="ml-3 flex-1">
        <Text className="text-xs font-extrabold text-[#0F172A]" numberOfLines={1}>
          {product.name}
        </Text>
        <Text className="mt-0.5 text-[11px] font-medium text-[#64748B]">{product.unit}</Text>
        <View className="mt-1 flex-row items-center">
          <Ionicons name="star" size={10} color="#D97706" />
          <Text className="ml-1 text-[11px] font-bold text-[#64748B]">
            {product.rating}
          </Text>
        </View>
      </View>

      <View className="items-end">
        <View className="flex-row items-center">
          <Text className="text-xs font-black text-[#0F172A]">{product.price}</Text>
          {product.originalPrice && (
            <Text className="ml-1 text-[10px] font-medium text-slate-400 line-through">
              {product.originalPrice}
            </Text>
          )}
        </View>
        <TouchableOpacity activeOpacity={0.8} className="mt-1.5 rounded-md bg-[#EA580C] px-3 py-1 shadow-sm active:bg-orange-600">
          <Text className="text-[11px] font-black tracking-wider text-white">ADD</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
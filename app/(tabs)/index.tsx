import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryGrid } from "@/components/index/CategoryGrid";
import { CustomerReviews } from "@/components/index/CustomerReviews"; 
import { FlashSaleBanner } from "@/components/index/FlashSaleBanner";
import { Header } from "@/components/index/Header";
import { HeroSlider } from "@/components/index/HeroSlider";
import { HorizontalProductScroll } from "@/components/index/HorizontalProductScroll";
import { ProductRow } from "@/components/index/ProductRow";
import { PromoBanners } from "@/components/index/PromoBanners";
import { QuickCategories } from "@/components/index/QuickCategories";
import { SearchOverlay } from "@/components/index/SearchOverlay";
import { TrendingSearches } from "@/components/index/TrendingSearches";
import { TrustBadges } from "@/components/index/TrustBadges";

const popularProducts = [
  { id: "p1", name: "Basmati Rice", unit: "10 kg", price: "₹599", originalPrice: "₹699", rating: 4.6, image: "https://loremflickr.com/300/300/rice,grain" },
  { id: "p2", name: "Fresh Tomatoes", unit: "1 kg", price: "₹40", originalPrice: "₹55", rating: 4.5, image: "https://loremflickr.com/300/300/tomato,vegetable" },
  { id: "p3", name: "Amul Milk", unit: "1 litre", price: "₹68", rating: 4.7, image: "https://loremflickr.com/300/300/milk,dairy" },
  { id: "p4", name: "Farm Potatoes", unit: "1 kg", price: "₹35", originalPrice: "₹45", rating: 4.4, image: "https://loremflickr.com/300/300/potato,vegetable" },
];

const orderAgainProducts = [
  popularProducts[1],
  popularProducts[2],
  popularProducts[3],
];

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      <SearchOverlay
        searchVisible={searchVisible}
        setSearchVisible={setSearchVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        topInset={insets.top}
      />

      <Header
        topInset={insets.top}
        onOpenSearch={() => setSearchVisible(true)}
        onPressCart={() => router.push("/cart")}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <QuickCategories onPressRoute={(route) => router.push(route as any)} />

        <View className="mt-4">
          <HeroSlider />
        </View>

        <View className="px-5">
          <FlashSaleBanner />

          <Text className="mb-3 mt-6 text-xl font-black tracking-tight text-[#0F172A]">
            Shop by category
          </Text>
          <CategoryGrid />

          <TrendingSearches />

          <Text className="mb-3 mt-6 text-xl font-black tracking-tight text-[#0F172A]">
            Today's deals
          </Text>
          <PromoBanners />

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

        <HorizontalProductScroll products={orderAgainProducts} />

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
          <TrustBadges />

          <Text className="mb-3 mt-4 text-xl font-black tracking-tight text-[#0F172A]">
            What customers say
          </Text>
          <CustomerReviews />

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
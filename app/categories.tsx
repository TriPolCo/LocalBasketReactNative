import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const categories = [
  {
    id: "1",
    title: "Vegetables",
    subtitle: "120+ items",
    icon: "leaf-outline",
    background: "#ECFDF5",
  },
  {
    id: "2",
    title: "Fruits",
    subtitle: "100+ items",
    icon: "nutrition-outline",
    background: "#F3E8FF",
  },
  {
    id: "3",
    title: "Groceries",
    subtitle: "500+ items",
    icon: "basket-outline",
    background: "#FEF3C7",
  },
  {
    id: "4",
    title: "Food",
    subtitle: "200+ items",
    icon: "restaurant-outline",
    background: "#FFEDD5",
  },
  {
    id: "5",
    title: "Dairy",
    subtitle: "120+ items",
    icon: "water-outline",
    background: "#DBEAFE",
  },
  {
    id: "6",
    title: "Snacks",
    subtitle: "150+ items",
    icon: "fast-food-outline",
    background: "#FFE4E6",
  },
  {
    id: "7",
    title: "Beverages",
    subtitle: "180+ items",
    icon: "cafe-outline",
    background: "#FFEDD5",
  },
  {
    id: "8",
    title: "Bakery",
    subtitle: "100+ items",
    icon: "restaurant-outline",
    background: "#FEF3C7",
  },
  {
    id: "9",
    title: "Meat & Seafood",
    subtitle: "120+ items",
    icon: "fish-outline",
    background: "#FEE2E2",
  },
  {
    id: "10",
    title: "Personal Care",
    subtitle: "300+ items",
    icon: "body-outline",
    background: "#EDE9FE",
  },
  {
    id: "11",
    title: "Household",
    subtitle: "250+ items",
    icon: "home-outline",
    background: "#DCFCE7",
  },
  {
    id: "12",
    title: "Wellness",
    subtitle: "200+ items",
    icon: "medkit-outline",
    background: "#E0F2FE",
  },
  {
    id: "13",
    title: "Baby Care",
    subtitle: "150+ items",
    icon: "happy-outline",
    background: "#FCE7F3",
  },
  {
    id: "14",
    title: "Pet Care",
    subtitle: "100+ items",
    icon: "paw-outline",
    background: "#F3E8FF",
  },
  {
    id: "15",
    title: "Print & Xerox",
    subtitle: "20+ services",
    icon: "print-outline",
    background: "#ECFDF5",
  },
];

export default function MoreCategoriesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCategoryPress = (category) => {
    if (category.title === "Vegetables") {
      router.push("/vegetables");
    } else if (category.title === "Groceries") {
      router.push("/groceries");
    } else if (category.title === "Food") {
      router.push("/food");
    } else if (category.title === "Print & Xerox") {
      router.push("/printing");
    } else {
      router.push({
        pathname: "/category/[id]",
        params: {
          id: category.id,
          name: category.title,
        },
      });
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFC]">
      {/* Header */}
      <View
        className="bg-[#047857] px-5 pb-4 z-20 border-b border-[#EA580C]"
        style={{ paddingTop: Math.max(insets.top, 12) }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.75}
              className="h-9 w-9 items-center justify-center rounded-md bg-white/15 mr-3 active:bg-white/25"
            >
              <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black tracking-tight text-white">
                More Categories
              </Text>
              <Text className="text-xs font-medium text-emerald-100 mt-0.5">
                Explore all our categories
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/cart")}
            activeOpacity={0.75}
            className="h-9 w-9 items-center justify-center rounded-md bg-[#EA580C] shadow-sm relative"
          >
            <Ionicons name="cart-outline" size={18} color="#FFFFFF" />
            <View className="absolute -top-1 -right-1 h-4 w-4 items-center justify-center rounded-full bg-orange-600 border border-white">
              <Text className="text-[9px] font-black text-white">3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Search Bar */}
        <View className="px-5 mt-4">
          <View className="flex-row items-center rounded-md bg-white px-3.5 border border-[#E2E8F0] shadow-sm h-12">
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search categories..."
              placeholderTextColor="#94A3B8"
              className="ml-2.5 flex-1 text-sm font-medium text-[#0F172A]"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} className="mr-1">
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Category Grid */}
        <View className="px-5 mt-4">
          {filteredCategories.length === 0 ? (
            <View className="items-center justify-center py-16">
              <Ionicons name="search-outline" size={40} color="#94A3B8" />
              <Text className="mt-3 text-sm font-bold text-[#0F172A]">
                No categories found
              </Text>
              <Text className="mt-1 text-xs text-[#64748B]">
                Try searching for another category
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredCategories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => handleCategoryPress(category)}
                  activeOpacity={0.75}
                  className="mb-3 w-[48%] bg-white p-3.5 rounded-md border border-[#E2E8F0] shadow-sm justify-between"
                >
                  <View className="flex-row items-center justify-between">
                    <View
                      style={{ backgroundColor: category.background }}
                      className="h-11 w-11 items-center justify-center rounded-md"
                    >
                      <Ionicons
                        name={category.icon}
                        size={22}
                        color="#047857"
                      />
                    </View>
                    <Ionicons
                      name="chevron-forward-outline"
                      size={16}
                      color="#64748B"
                    />
                  </View>

                  <View className="mt-4">
                    <Text
                      className="text-sm font-extrabold text-[#0F172A]"
                      numberOfLines={1}
                    >
                      {category.title}
                    </Text>
                    <Text className="mt-0.5 text-xs font-medium text-[#64748B]">
                      {category.subtitle}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Promotional / Quality Banner */}
        <View className="px-5 mt-2">
          <View className="bg-[#ECFDF5] rounded-md p-4 border border-emerald-200 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-lg font-black text-[#065F46] tracking-tight">
                Quality products
              </Text>
              <Text className="text-xs font-medium text-[#047857] mt-0.5">
                for a better everyday
              </Text>
              <Text className="text-xs font-bold text-[#065F46] mt-2">
                Fresh. Local. Reliable.
              </Text>
            </View>
            <View className="h-14 w-14 items-center justify-center rounded-md bg-emerald-100 border border-emerald-200">
              <Ionicons name="leaf-outline" size={28} color="#047857" />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

const reviews = [
  { name: "Ananya S.", rating: 5, comment: "Vegetables arrive fresh and delivery is super fast." },
  { name: "Rohit K.", rating: 4, comment: "Great prices on daily groceries and awesome packaging." },
];

export function CustomerReviews() {
  return (
    <>
      {reviews.map((review) => (
        <View key={review.name} className="mb-3 rounded-md bg-white p-3.5 border border-[#E2E8F0] shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-[#0F172A]">{review.name}</Text>
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
    </>
  );
}
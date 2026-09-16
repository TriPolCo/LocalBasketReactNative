import { Text, View } from "react-native";

const trendingSearches = [
  { term: "Onions", bg: "bg-emerald-100/80", text: "text-emerald-900" },
  { term: "Paneer", bg: "bg-orange-100/80", text: "text-orange-900" },
  { term: "Cold drinks", bg: "bg-emerald-100/80", text: "text-emerald-900" },
  { term: "Chicken", bg: "bg-orange-100/80", text: "text-orange-900" },
];

export function TrendingSearches() {
  return (
    <>
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
    </>
  );
}
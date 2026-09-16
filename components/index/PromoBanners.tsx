import { ImageBackground, Text, TouchableOpacity, View } from "react-native";

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

export function PromoBanners() {
  return (
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
            <Text className="text-sm font-extrabold tracking-tight text-white">{banner.title}</Text>
            <Text className="text-xs font-semibold text-[#FFEDD5]">{banner.subtitle}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </View>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export function FlashSaleBanner() {
  const [secondsLeft, setSecondsLeft] = useState(2 * 60 * 60 + 45 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(secondsLeft / 3600).toString().padStart(2, "0");
  const minutes = Math.floor((secondsLeft % 3600) / 60).toString().padStart(2, "0");
  const seconds = Math.floor(secondsLeft % 60).toString().padStart(2, "0");

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

      <View style={{ backgroundColor: "#EA580C" }} className="rounded-md px-2.5 py-1.5 shadow-sm">
        <Text className="text-xs font-black tracking-wider text-white">
          {hours}:{minutes}:{seconds}
        </Text>
      </View>
    </View>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useBanners } from "@/hooks/banner/useBanners";
import { Banner } from "@/types/bannerType";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const SLIDE_WIDTH = SCREEN_WIDTH - 40;
const SLIDE_STRIDE = SLIDE_WIDTH + 12;
const AUTO_SLIDE_INTERVAL = 3200;

export function HeroSlider() {
  const { banners, isLoading } = useBanners();
  const scrollRef = useRef<Animated.ScrollView>(null);
  
  // FIXED: Use useState with lazy initialization instead of useRef().current to prevent render-time ref access error
  const [scrollX] = useState(() => new Animated.Value(0));
  
  const [activeIndex, setActiveIndex] = useState(0);
  const indexRef = useRef(0);

  // Auto-slide effect based on fetched banners length
  useEffect(() => {
    if (!banners || banners.length === 0) return;

    const timer = setInterval(() => {
      const nextIndex = (indexRef.current + 1) % banners.length;
      indexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({ x: nextIndex * SLIDE_STRIDE, animated: true });
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, [banners]);

  const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / SLIDE_STRIDE);
    indexRef.current = nextIndex;
    setActiveIndex(nextIndex);
  };

  // If loading or no banners available, show a clean empty/loading state container
  if (isLoading || !banners || banners.length === 0) {
    return (
      <View style={{ width: SLIDE_WIDTH, height: 176 }} className="mx-auto bg-slate-100 rounded-md border border-[#E2E8F0] items-center justify-center">
        <Text className="text-xs text-slate-400 font-medium">Loading banners...</Text>
      </View>
    );
  }

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
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
          useNativeDriver: true,
        })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
      >
        {banners.map((banner: Banner, index: number) => {
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

          const ctaLabel = banner.buttons?.[0]?.label || "Shop Now";
          const bannerImage = banner.mobile_image_url || banner.image_url;

          return (
            <Animated.View
              key={banner.id}
              style={{
                width: SLIDE_WIDTH,
                transform: [{ scale }],
                opacity,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.92}
                className="overflow-hidden rounded-md border border-[#E2E8F0] shadow-sm bg-white"
              >
                <ImageBackground
                  source={{ 
                    uri: bannerImage,
                    cache: 'force-cache'
                  }}
                  style={{ width: SLIDE_WIDTH, height: 176 }}
                  className="justify-end p-4"
                  resizeMode="cover"
                  imageStyle={{ borderRadius: 6 }}
                >
                  {/* Dark overlay for contrast and clarity */}
                  <View
                    style={{ backgroundColor: "rgba(15, 23, 42, 0.45)" }}
                    className="absolute inset-0 rounded-md"
                  />
                  
                  <Text className="text-xl font-black leading-6 text-white tracking-tight">
                    {banner.title}
                  </Text>
                  
                  <Text className="mt-1 text-xs font-semibold text-white/95">
                    {banner.subtitle}
                  </Text>

                  <View className="mt-3 flex-row items-center self-start rounded-md bg-[#EA580C] px-3.5 py-1.5 shadow-sm">
                    <Text className="text-xs font-black text-white">{ctaLabel}</Text>
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
        {banners.map((banner: Banner, index: number) => (
          <View
            key={banner.id}
            className={`h-1 rounded-full ${
              index === activeIndex ? "w-5 bg-[#EA580C]" : "w-1.5 bg-slate-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}
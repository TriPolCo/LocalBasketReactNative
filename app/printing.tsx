import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const printerIllustration = require("../assets/images/printer.png");

const services = [
  {
    id: "print",
    title: "Print",
    subtitle: "Color / B&W",
    icon: "print-outline",
  },
  {
    id: "xerox",
    title: "Xerox",
    subtitle: "Quick Copies",
    icon: "copy-outline",
  },
  {
    id: "scan",
    title: "Scan",
    subtitle: "High Quality",
    icon: "scan-outline",
  },
  {
    id: "other",
    title: "Other",
    subtitle: "Binding, Lamination etc.",
    icon: "ellipsis-horizontal-circle-outline",
  },
];

const pricingList = [
  { id: "p1", title: "B&W Print / Xerox", price: "₹2 / page", desc: "Standard A4 paper" },
  { id: "p2", title: "Color Print", price: "₹10 / page", desc: "High resolution ink" },
  { id: "p3", title: "Document Scan", price: "₹5 / page", desc: "Digital PDF delivery" },
  { id: "p4", title: "Spiral Binding", price: "₹25 / book", desc: "Includes front/back cover" },
];

const recentFiles = [
  {
    id: "1",
    name: "resume.pdf",
    pages: "3 pages",
    size: "245 KB",
    status: "Ready to Print",
    type: "pdf",
  },
  {
    id: "2",
    name: "certificate.jpg",
    pages: "1 page",
    size: "120 KB",
    status: "Printed",
    type: "image",
  },
];

const printOptions = [
  {
    id: "color",
    title: "Color",
    subtitle: "Color / B&W",
    icon: "color-palette-outline",
  },
  {
    id: "size",
    title: "Paper Size",
    subtitle: "A4, A3, A5",
    icon: "document-outline",
  },
  {
    id: "pages",
    title: "Pages",
    subtitle: "Select Range",
    icon: "layers-outline",
  },
  {
    id: "copies",
    title: "Copies",
    subtitle: "1, 2, 3...",
    icon: "copy-outline",
  },
];

export default function PrintAndXeroxScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedService, setSelectedService] = useState("print");

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
              onPress={() => router.push("/")}
              activeOpacity={0.75}
              className="h-9 w-9 items-center justify-center rounded-md bg-white/15 mr-3 active:bg-white/25"
            >
              <Ionicons name="home-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-black tracking-tight text-white">
                Print & Xerox
              </Text>
              <Text className="text-xs font-medium text-emerald-100 mt-0.5">
                Upload • Select • Get it Printed
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/printing/orders")}
            activeOpacity={0.75}
            className="flex-row items-center bg-white/15 px-3 py-2 rounded-md active:bg-white/25"
          >
            <Ionicons name="document-text-outline" size={16} color="#FFFFFF" />
            <Text className="ml-1.5 text-xs font-bold text-white">My Orders</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
      >
        {/* Hero Section with Photo */}
        <View className="px-1">
          <View className=" h-40 w-full rounded-md">
            <Image
              source={printerIllustration}
              className="w-full h-40 rounded-md"
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Our Services */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-black text-[#0F172A]">
              Our Services
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-xs font-extrabold text-[#047857] uppercase">
                View All {">"}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10 }}
          >
            {services.map((service) => {
              const isSelected = selectedService === service.id;
              return (
                <TouchableOpacity
                  key={service.id}
                  onPress={() => setSelectedService(service.id)}
                  activeOpacity={0.8}
                  className={`w-36 p-3 rounded-md border shadow-sm ${
                    isSelected
                      ? "bg-[#ECFDF5] border-[#047857]"
                      : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-md ${
                      isSelected ? "bg-emerald-200" : "bg-slate-100"
                    }`}
                  >
                    <Ionicons
                      name={service.icon}
                      size={20}
                      color={isSelected ? "#047857" : "#64748B"}
                    />
                  </View>
                  <Text className="mt-2.5 text-sm font-extrabold text-[#0F172A]">
                    {service.title}
                  </Text>
                  <Text className="mt-0.5 text-xs font-medium text-[#64748B]">
                    {service.subtitle}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Pricing Chart Section */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-black text-[#0F172A] mb-3">
            Transparent Pricing
          </Text>
          <View className="flex-row flex-wrap justify-between">
            {pricingList.map((item) => (
              <View
                key={item.id}
                className="w-[48%] bg-white p-3.5 rounded-md border border-[#E2E8F0] shadow-sm mb-3"
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-xs font-bold text-[#64748B]">
                    {item.title}
                  </Text>
                  <Ionicons name="pricetag-outline" size={14} color="#EA580C" />
                </View>
                <Text className="text-base font-black text-[#047857]">
                  {item.price}
                </Text>
                <Text className="text-[11px] text-slate-400 mt-0.5">
                  {item.desc}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Upload Document Section */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-black text-[#0F172A] mb-3">
            Upload Document
          </Text>
          <View className="bg-white rounded-md p-6 border border-dashed border-[#047857] items-center shadow-sm bg-emerald-50/30">
            <View className="h-12 w-12 items-center justify-center rounded-md bg-emerald-100 mb-3">
              <Ionicons name="cloud-upload-outline" size={24} color="#047857" />
            </View>
            <Text className="text-sm font-extrabold text-[#0F172A]">
              Upload Your Document
            </Text>
            <Text className="text-xs font-medium text-[#64748B] mt-1 text-center">
              PDF, DOC, DOCX, JPG, PNG
            </Text>
            <Text className="text-[11px] text-slate-400 mt-0.5">
              (Max 10MB)
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/printing/upload")}
              activeOpacity={0.8}
              className="mt-4 bg-[#047857] px-5 py-2.5 rounded-md shadow-sm"
            >
              <Text className="text-xs font-black text-white">Choose File</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Files */}
        <View className="px-5 mt-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-black text-[#0F172A]">
              Recent Files
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-xs font-extrabold text-[#047857] uppercase">
                View All {">"}
              </Text>
            </TouchableOpacity>
          </View>

          {recentFiles.map((file) => {
            const isReady = file.status === "Ready to Print";
            return (
              <View
                key={file.id}
                className="bg-white p-3.5 rounded-md border border-[#E2E8F0] shadow-sm mb-2.5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View className="h-10 w-10 items-center justify-center rounded-md bg-slate-100 mr-3">
                    <Ionicons
                      name={
                        file.type === "pdf"
                          ? "document-text-outline"
                          : "image-outline"
                      }
                      size={20}
                      color="#047857"
                    />
                  </View>
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center">
                      <Text className="text-sm font-extrabold text-[#0F172A] mr-2">
                        {file.name}
                      </Text>
                      <View
                        className={`px-2 py-0.5 rounded-full ${
                          isReady ? "bg-orange-100" : "bg-emerald-100"
                        }`}
                      >
                        <Text
                          className={`text-[9px] font-black ${
                            isReady ? "text-orange-800" : "text-emerald-800"
                          }`}
                        >
                          {file.status}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs font-medium text-[#64748B] mt-0.5">
                      {file.pages} • {file.size}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity className="p-1">
                  <Ionicons
                    name="ellipsis-vertical"
                    size={16}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Print Options */}
        <View className="px-5 mt-6">
          <Text className="text-lg font-black text-[#0F172A]">
            Print Options
          </Text>
          <Text className="text-xs font-medium text-[#64748B] mt-0.5 mb-3">
            You can select options after uploading your file
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {printOptions.map((option) => (
              <View
                key={option.id}
                className="w-[48%] bg-white p-3.5 rounded-md border border-[#E2E8F0] shadow-sm mb-3"
              >
                <View className="h-9 w-9 items-center justify-center rounded-md bg-emerald-50 mb-2">
                  <Ionicons name={option.icon} size={18} color="#047857" />
                </View>
                <Text className="text-sm font-extrabold text-[#0F172A]">
                  {option.title}
                </Text>
                <Text className="text-xs font-medium text-[#64748B] mt-0.5">
                  {option.subtitle}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Security / Privacy Information */}
        <View className="px-5 mt-4">
          <View className="bg-[#ECFDF5] rounded-md p-4 border border-emerald-200 shadow-sm flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-md bg-emerald-100 mr-3">
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color="#047857"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-extrabold text-[#065F46]">
                Your files are safe and secure
              </Text>
              <Text className="text-[11px] font-medium text-[#047857] mt-0.5">
                We respect your privacy and never share your documents.
              </Text>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <View className="px-5 mt-6">
          <TouchableOpacity
            onPress={() => router.push("/printing/upload")}
            activeOpacity={0.85}
            className="bg-[#047857] h-13 rounded-md flex-row items-center justify-center shadow-sm py-4"
          >
            <Text className="text-sm font-black text-white mr-2">Continue</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
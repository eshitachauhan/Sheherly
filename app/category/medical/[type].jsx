import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import medicalData from "../../data/medicalData.json";

export default function MedicalTypePage() {
  const { type } = useLocalSearchParams();

  let rawData = [];

  if (type === "hospitals") {
    rawData = medicalData.hospitals || [];
  }

  if (type === "pharmacies") {
    rawData = medicalData.pharmacies || [];
  }

  const data = rawData.map((item, index) => ({
    id: item["@id"] || item.id || `medical_${index}`,
    name:
      item.name ||
      item["name:en"] ||
      "Medical Facility",
    info:
      item["addr:street"] ||
      item["addr:city"] ||
      "Jaipur",
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#eef7f6]">

    
      <View className="p-6">
        <Text className="text-3xl font-bold text-[#0d47a1] capitalize">
          {type}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available {type} near you
        </Text>
      </View>

    
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {item.info}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No services available 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}
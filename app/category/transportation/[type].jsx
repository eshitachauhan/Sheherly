import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import transportationData from "../../data/transportationData.json"


export default function TransportTypePage() {
  const { type } = useLocalSearchParams();

  const rawData = transportationData[type] || [];
  const data = rawData.map(item => {
  
    if (item.cab_type) {
      return {
        id: item.cab_type + item.pickup_location + item.destination,
        name: item.cab_type,
        info: `${item.pickup_location} → ${item.destination} · ${item.price_estimate} · ETA ${item.eta_minutes} min`
      };
    }
    if (item.bike_id) {
      return {
        id: item.bike_id,
        name: item.name,
        info: `${item.type} · ₹${item.price_per_hour}/hr · ${item.available ? "Available" : "Not Available"}`
      };
    }
    if (item.driver_id) {
      return {
        id: item.driver_id,
        name: `${item.driver_name} (${item.vehicle_model})`,
        info: `${item.operating_zone} · ${item.service_type} · ${item.availability ? "Available" : "Not Available"}`
      };
    }
    if (item.name && item.public_transport_type) {
      return {
        id: item.ref || item.name,
        name: item.name,
        info: `${item.network || "Unknown Network"} · ${item.public_transport_type}`
      };
    }
    return {
      id: item.id || JSON.stringify(item),
      name: item.name || "Unknown",
      info: JSON.stringify(item)
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fb]">
      <View className="p-6">
        <Text className="text-3xl font-bold text-[#0b3d91] capitalize">
          {type}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available services
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold">{item.name}</Text>
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

import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import localServicesData from "../../data/localServicesData.json";

export default function LocalServiceTypePage() {
  const { service } = useLocalSearchParams();

  const normalizeLocalServices = (service, rawData = []) => {
    return rawData
      .map((item) => {

        //  GROCERY 
        if (item.store_id && item.opening_hours) {
          return {
            id: `${item.name}_${item.area}_${item.lat}_${item.lng}`
              .replace(/\s+/g, "_")
              .toLowerCase(),

            name: item.name,

            info: `${item.area} · ${item.type} · 🕒 ${item.opening_hours} · ${
              item.delivery ? "Delivery Available" : "No Delivery"
            }`,
          };
        }

        //  BANK 
        if (item.amenity === "bank" || item.amenity === "atm") {
          return {
            id: `${item.id}_${item.lat}_${item.lon}`
              .replace(/\s+/g, "_")
              .toLowerCase(),

            name: item.name || item.brand || "Bank / ATM",

            info: `${item.amenity.toUpperCase()} · ${
              item["addr:city"] || "Jaipur"
            } · ${item.opening_hours || "Hours N/A"}`,
          };
        }

        // MARKETS 
        if (item.market_id && item.opening_hours) {
          return {
            id: `${item.name}_${item.area}_${item.lat}_${item.lng}`
              .replace(/\s+/g, "_")
              .toLowerCase(),

            name: item.name,

            info: `${item.area} · ${item.type} · 🕒 ${item.opening_hours}`,
          };
        }
        return null;
      })
      .filter(Boolean); 
  };

  const rawData = localServicesData[service] || [];
  const data = normalizeLocalServices(service, rawData);

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {service.replace("-", " ")}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available services
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.info}</Text>
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

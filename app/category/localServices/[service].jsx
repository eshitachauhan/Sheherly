import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import localServicesData from "../../data/localData.json";

export default function LocalServiceTypePage() {
  const { service } = useLocalSearchParams();

  // 🔥 Normalize Data
  const normalizeLocalServices = (rawData = []) => {
    return rawData
      .map((item) => {

        // 🏦 BANK / ATM
        if (item.amenity === "bank" || item.amenity === "atm") {
          return {
            id: item.id,
            name: item.name || item.brand || "Bank / ATM",
            lat: item.lat,
            lng: item.lon,
            type: item.amenity.toUpperCase(),
            address: item.address,
            opening_hours: item.opening_hours
          };
        }

        // 🥕 GROCERIES
        if (item.store_id) {
          return {
            id: item.store_id,
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            type: item.type,
            address: item.address,
            opening_hours: item.opening_hours,
            delivery: item.delivery
          };
        }

        // 🧺 MARKETS
        if (item.market_id) {
          return {
            id: item.market_id,
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            type: item.type,
            address: item.address,
            opening_hours: item.opening_hours
          };
        }

        // 🧹 HOUSE SERVICES
        if (item.phone) {
          return {
            id: item.id,
            name: item.name,
            lat: item.lat,
            lng: item.lng,
            type: item.type,
            address: item.area,
            opening_hours: item.opening_hours,
            phone: item.phone
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const rawData = localServicesData[service] || [];
  const data = normalizeLocalServices(rawData);

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">

      {/* 🔹 Header */}
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {service.replace(/-/g, " ")}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available services near you
        </Text>
      </View>

      {/* 🔹 List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow">

            {/* Name */}
            <Text className="text-lg font-semibold">{item.name}</Text>

            {/* Info */}
            <Text className="text-sm text-gray-500 mt-1">
              {item.type} · {item.address}
            </Text>

            <Text className="text-xs text-gray-400 mt-1">
              🕒 {item.opening_hours || "N/A"}
            </Text>

            {/* 🚚 Delivery (only groceries) */}
            {item.delivery !== undefined && (
              <Text className="text-xs mt-1 text-gray-500">
                {item.delivery ? "🛵 Delivery Available" : "🚫 No Delivery"}
              </Text>
            )}

            {/* 📍 Directions Button */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
                )
              }
              className="mt-3 bg-blue-500 px-3 py-2 rounded-lg"
            >
              <Text className="text-white text-center text-sm">
                Get Directions
              </Text>
            </TouchableOpacity>

            {/* 📞 Call Button (only if phone exists) */}
            {item.phone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                className="mt-2 bg-green-500 px-3 py-2 rounded-lg"
              >
                <Text className="text-white text-center text-sm">
                  Call Now
                </Text>
              </TouchableOpacity>
            )}
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

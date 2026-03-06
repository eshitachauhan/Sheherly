import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import accommodationData from "../../data/accommodationData.json";

export default function AccommodationTypePage() {
  const { type } = useLocalSearchParams();

  const normalizeAccommodation = (rawData = []) => {
    return rawData
      .map((item, index) => {
        //  AIRBNB
        if (item.price_per_night && item.location) {
          return {
            id: `airbnb_${item.name}_${item.location.lat}_${item.location.lon}`
              .replace(/\s+/g, "_")
              .toLowerCase(),
            name: item.name,
            info: `₹${item.price_per_night}/night · ${item.room_type} · ⭐${item.rating} · Guests: ${item.guests}`,
          };
        }

        //  HOTEL
        if (item.name || item.stars) {
          return {
            id: `hotel_${item.name || item.hotel_name}_${item.city || index}`
              .replace(/\s+/g, "_")
              .toLowerCase(),
            name: item.name || item.hotel_name,
            info: `${item.city || "City"} · ⭐${item.stars || "N/A"} · ₹${item.price || "N/A"}`,
          };
        }

        //  HOSTEL
        if (item.tourism === "hostel") {
          return {
            id: `hostel_${item.name}_${index}`,
            name: item.name,
            info: "Hostel · Shared accommodation",
          };
        }

        //  PG / GUEST HOUSE
        if (item.tourism === "guest_house" || item.amenity === "college") {
          return {
            id: `pg_${item.name}_${index}`,
            name: item.name,
            info: "PG / Guest House · Jaipur",
          };
        }

        return null;
      })
      .filter(Boolean);
  };

  const rawData = accommodationData[type] || [];
  const data = normalizeAccommodation(rawData);

  return (
    <SafeAreaView className="flex-1 bg-[#f3f5f9]">
      
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {type}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available {type} options
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold text-gray-800">
              {item.name}
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {item.info}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No options available 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}



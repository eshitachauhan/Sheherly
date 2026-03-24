import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import accommodationData from "../../data/accommodationData.json";

export default function AccommodationTypePage() {
  const { type } = useLocalSearchParams();

  const data = accommodationData[type] || [];

  return (
    <SafeAreaView className="flex-1 bg-[#f3f5f9]">

      {/* Header */}
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {type}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Compare prices across platforms
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => {

          const isPG = type === "pg";

          return (
            <View className="bg-white p-4 rounded-2xl mb-4 shadow">

              {/* Name */}
              <Text className="text-lg font-semibold">
                {item.name}
              </Text>

              {/* Info */}
              <Text className="text-sm text-gray-500 mt-1">
                📍 {item.location} · ⭐ {item.rating} ({item.reviews} reviews)
              </Text>

              {/* Directions */}
              <TouchableOpacity
                onPress={() =>
                  Linking.openURL(
                    `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
                  )
                }
                className="mt-2 bg-gray-200 px-3 py-2 rounded-lg"
              >
                <Text className="text-center text-sm">View Location</Text>
              </TouchableOpacity>

              {/* 🔥 PG SPECIAL UI */}
              {isPG ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${item.phone}`)}
                  className="mt-3 bg-green-500 px-3 py-2 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">
                    📞 Call Now
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  {/* Platforms */}
                  <View className="mt-3">
                    {item.platforms.map((platform, index) => {
                      const cheapest = item.platforms.reduce((min, p) =>
                        p.price < min.price ? p : min
                      );

                      return (
                        <View
                          key={index}
                          className={`flex-row justify-between items-center p-2 rounded-lg mb-2 ${platform.price === cheapest.price
                              ? "bg-green-100"
                              : "bg-gray-100"
                            }`}
                        >
                          <Text className="text-sm font-medium">
                            {platform.name}
                          </Text>

                          <Text className="text-sm font-bold">
                            ₹{platform.price}
                          </Text>

                          <TouchableOpacity
                            onPress={() => Linking.openURL(platform.link)}
                            className="bg-blue-500 px-2 py-1 rounded"
                          >
                            <Text className="text-white text-xs">
                              Book
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                  </View>

                  {/* Best Price */}
                  <Text className="text-xs text-green-600 mt-2">
                    💰 Best price: {
                      item.platforms.reduce((min, p) =>
                        p.price < min.price ? p : min
                      ).name
                    }
                  </Text>
                </>
              )}

            </View>
          );
        }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No options available 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}


import { View, Text, FlatList, TouchableOpacity, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import accommodationData from "../../data/accommodationData.json";

export default function AccommodationTypePage() {
  const { type } = useLocalSearchParams();

  const data = accommodationData[type] || [];

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Error", "Invalid link");
    }
  };

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

          // 🔥 Pre-calculate cheapest & sorted platforms
          const sortedPlatforms = item.platforms
            ? [...item.platforms].sort((a, b) => a.price - b.price)
            : [];

          const cheapest = sortedPlatforms[0];

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
                  openLink(
                    `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
                  )
                }
                className="mt-2 bg-gray-200 px-3 py-2 rounded-lg"
              >
                <Text className="text-center text-sm">View Location</Text>
              </TouchableOpacity>

              {/* 🔥 PG UI */}
              {isPG ? (
                <TouchableOpacity
                  onPress={() => openLink(`tel:${item.phone}`)}
                  className="mt-3 bg-green-500 px-3 py-2 rounded-lg"
                >
                  <Text className="text-white text-center font-semibold">
                    📞 Call Now
                  </Text>
                </TouchableOpacity>
              ) : (
                <>
                  {/* Platforms - Horizontal Scroll */}
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={sortedPlatforms}
                    keyExtractor={(p, i) => i.toString()}
                    className="mt-3"
                    renderItem={({ item: platform }) => {

                      const isCheapest = platform.price === cheapest?.price;

                      return (
                        <View
                          className={`mr-3 p-3 rounded-xl min-w-[140px] ${
                            isCheapest ? "bg-green-100" : "bg-gray-100"
                          }`}
                        >
                          <Text className="text-sm font-medium">
                            {platform.name}
                          </Text>

                          <Text className="text-sm font-bold mt-1">
                            ₹{platform.price}
                          </Text>

                          <TouchableOpacity
                            onPress={() => openLink(platform.link)}
                            className="bg-blue-500 mt-2 px-2 py-1 rounded"
                          >
                            <Text className="text-white text-xs text-center">
                              Book
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />

                  {/* Best Price */}
                  {cheapest && (
                    <Text className="text-xs text-green-600 mt-2">
                      💰 Best deal on {cheapest.name} for ₹{cheapest.price}
                    </Text>
                  )}
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
import { View, Text, FlatList, TouchableOpacity, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import foodData from "../../data/foodData.json";

export default function FoodTypePage() {
  const { slug } = useLocalSearchParams();  

  const data = slug && foodData[slug] ? foodData[slug] : [];

  return (
    <SafeAreaView className="flex-1 bg-[#f3f5f9]">

      {/* Header */}
      <View className="p-6">
        <Text className="text-3xl font-bold capitalize text-gray-800">
          {slug ? slug.replace(/-/g, " ") : "Food"}
        </Text>

        <Text className="text-sm text-gray-600 mt-1">
          Explore food places
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}

        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow">

            <Text className="text-lg font-semibold">{item.name}</Text>

            <Text className="text-sm text-gray-500 mt-1">
              📍 {item.location} · ⭐ {item.rating}
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              🕒 {item.timings}
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
              <Text className="text-center text-sm">
                Get Directions
              </Text>
            </TouchableOpacity>

            {/* Call (if available) */}
            {item.phone && (
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${item.phone}`)}
                className="mt-2 bg-green-500 px-3 py-2 rounded-lg"
              >
                <Text className="text-white text-center">
                  📞 Call
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No places found 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}
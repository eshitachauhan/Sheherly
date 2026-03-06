import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function FoodIndex() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f3f5f9]">
      
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800">Food & Dining</Text>
        <Text className="text-sm text-gray-600 mt-1">
          Find good food around you
        </Text>
      </View>

      
      <View className="px-4">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push("/category/food/type?category=restaurants")
          }
          className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow"
        >
          <Text className="text-4xl mr-4">🍽️</Text>

          <View className="flex-1">
            <Text className="text-lg font-semibold">Nearby Restaurants</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Dine-in & family places
            </Text>
          </View>

          <Text className="text-xl text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push("/category/food/type?category=street-food")
          }
          className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow"
        >
          <Text className="text-4xl mr-4">🌮</Text>

          <View className="flex-1">
            <Text className="text-lg font-semibold">Street Food</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Quick bites & local flavors
            </Text>
          </View>

          <Text className="text-xl text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push("/category/food/type?category=chill-cafes")
          }
          className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow"
        >
          <Text className="text-4xl mr-4">☕</Text>

          <View className="flex-1">
            <Text className="text-lg font-semibold">Chill Cafes</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Coffee, work & conversations
            </Text>
          </View>

          <Text className="text-xl text-gray-400">›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            router.push("/category/food/type?category=night-cafes")
          }
          className="flex-row items-center bg-white p-4 rounded-2xl mb-3 shadow"
        >
          <Text className="text-4xl mr-4">🍔</Text>

          <View className="flex-1">
            <Text className="text-lg font-semibold">Open Night Cafes</Text>
            <Text className="text-sm text-gray-500 mt-1">
              Late-night cravings sorted
            </Text>
          </View>

          <Text className="text-xl text-gray-400">›</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


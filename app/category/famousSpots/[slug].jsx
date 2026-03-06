import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const dummySpotData = {
  "parks-gardens": [
    { id: "1", name: "City Central Park", info: "Open 6AM-8PM · Free entry" },
    { id: "2", name: "Botanical Garden", info: "Open 7AM-6PM · Entry ₹50" },
  ],
  "historic-monuments": [
    { id: "1", name: "Old Fort", info: "Guided tours available" },
    { id: "2", name: "Heritage Palace", info: "Ticket ₹100" },
  ],
  "art-galleries": [
    { id: "1", name: "Modern Art Museum", info: "Entry ₹150" },
    { id: "2", name: "Local Art Gallery", info: "Free entry" },
  ],
  "shopping-malls": [
    { id: "1", name: "City Mall", info: "Brands, food courts, cinema" },
    { id: "2", name: "Mega Mall", info: "Open till 10PM" },
  ],
  "local-markets": [
    { id: "1", name: "Street Market A", info: "Souvenirs & snacks" },
    { id: "2", name: "Bazaar B", info: "Clothes & accessories" },
  ],
  "water-parks": [
    { id: "1", name: "Splash Water Park", info: "Entry ₹300" },
  ],
  "religious-places": [
    { id: "1", name: "City Temple", info: "Open 5AM-9PM" },
  ],
  "view-points": [
    { id: "1", name: "Sunset Hill", info: "Best time: evening" },
  ],
};

export default function FamousSpotTypePage() {
  const { slug } = useLocalSearchParams();
  const data = dummySpotData[slug] || [];

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {slug.replace(/-/g, " ")}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">Available spots</Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{item.info}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No spots available 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}


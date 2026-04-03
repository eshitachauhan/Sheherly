import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import foodData from "../../data/foodData.json";

export default function FoodTypePage() {
  const { slug } = useLocalSearchParams();

  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("");

  // Load data
  useEffect(() => {
    if (slug && foodData[slug]) {
      setData(foodData[slug]);
    }
  }, [slug]);

  // ⭐ Sort by rating
  const getSortedData = () => {
    let sorted = [...data];

    if (sortType === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    }

    return sorted;
  };

  const finalData = getSortedData();

  return (
    <SafeAreaView className="flex-1 bg-[#f3f5f9]">

      {/* HEADER */}
      <View className="p-6">
        <Text className="text-3xl font-bold capitalize text-gray-800">
          {slug ? slug.replace(/-/g, " ") : "Food"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Explore food places
        </Text>
      </View>

      {/* FILTER */}
      <View className="mb-4">
        <TouchableOpacity
          onPress={() => setSortType("rating")}
          className="bg-white px-4 py-2 rounded-lg shadow self-start ml-4"
        >
          <Text>⭐ Top Rated</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={finalData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}

        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow">

            {/* TOP ROW */}
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold flex-1">
                {item.name}
              </Text>

              {/* ICONS RIGHT */}
              <View className="flex-row items-center">

                {/* MAP */}
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`
                    )
                  }
                  className="ml-2"
                >
                  <Text className="text-lg">📍</Text>
                </TouchableOpacity>

                {/* CALL */}
                {item.phone && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${item.phone}`)}
                    className="ml-3"
                  >
                    <Text className="text-lg">📞</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* DETAILS */}
            <Text className="text-sm text-gray-500 mt-1">
              {item.location} · ⭐ {item.rating}
            </Text>

            <Text className="text-sm text-gray-500 mt-1">
              🕒 {item.timings}
            </Text>

            {/* ZOMATO BUTTON */}
            {item.zomato && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.zomato)}
                className="mt-3 bg-red-200 px-3 py-2 rounded-lg"
              >
                <Text className="text-center text-red-800 font-medium">
                  🍽️ Zomato
                  {item.zomatoPrice ? ` · ${item.zomatoPrice}` : ""}
                </Text>
              </TouchableOpacity>
            )}

            {/* SWIGGY BUTTON */}
            {item.swiggy && (
              <TouchableOpacity
                onPress={() => Linking.openURL(item.swiggy)}
                className="mt-2 bg-orange-200 px-3 py-2 rounded-lg"
              >
                <Text className="text-center text-orange-800 font-medium">
                  🛵 Swiggy
                  {item.swiggyPrice ? ` · ${item.swiggyPrice}` : ""}
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
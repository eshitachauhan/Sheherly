import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";

const BASE_URL = "http://10.231.186.139:9000"; // 🔥 replace with your laptop IP

export default function FamousSpotTypePage() {
  const { slug } = useLocalSearchParams();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFamousSpots = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/admin/data/famous/${slug}`);
      const json = await response.json();

      const formattedData = (json || []).map((item) => ({
        id: item.id,
        name: item.name,
        lat: item.lat,
        lng: item.lng,
        address: item.address || item.location || "No address available",
        timings: item.timings || "Not available",
      }));

      setData(formattedData);
    } catch (error) {
      console.error("FAMOUS SPOTS FETCH ERROR:", error);
      Alert.alert("Error", "Could not load famous spots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchFamousSpots();
    }
  }, [slug]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-[#f6f7fb] justify-center items-center">
        <ActivityIndicator size="large" color="#218fb4" />
        <Text className="mt-3 text-gray-600">Loading famous spots...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">

      {/* Header */}
      <View className="p-6">
        <Text className="text-3xl font-bold text-gray-800 capitalize">
          {slug ? slug.replace(/-/g, " ") : "Famous Spots"}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Popular places in Jaipur
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow">

            <Text className="text-lg font-semibold">{item.name}</Text>

            <Text className="text-sm text-gray-500 mt-1">
              📍 {item.address}
            </Text>

            <Text className="text-xs text-gray-400 mt-1">
              🕒 {item.timings}
            </Text>

            {/* Directions */}
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

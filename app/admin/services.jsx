import { useEffect, useState } from "react";
import {
  View,
 Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "http://10.231.186.139:9000"; // 🔥 replace this

const categories = {
  food: ["restaurants", "street-food", "chill-cafes", "night-cafes"],
  medical: ["hospitals", "pharmacies", "clinics", "labs"],
  transportation: ["bus", "cab", "rickshaw", "bikeRentals"],
  local: ["finance", "groceries", "local-markets", "house-services"],
  accommodation: ["hotels", "hostels", "pg", "homestays", "resorts"],
  famous: ["parks-gardens", "historic-monuments", "art-galleries", "shopping-malls", "local-markets", "water-parks", "religious-places", "view-points"],
  safety: null,
};

export default function Services() {
  const [category, setCategory] = useState("food");
  const [type, setType] = useState("restaurants");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const url = type
        ? `${BASE_URL}/api/admin/data/${category}/${type}`
        : `${BASE_URL}/api/admin/data/${category}`;

      const res = await fetch(url);
      const json = await res.json();

      if (Array.isArray(json)) {
        setData(json);
      } else {
        setData([]);
      }
    } catch (err) {
      console.log("FETCH ERROR:", err);
      Alert.alert("Error", "Failed to load data");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category === "safety") {
      setType(null);
    } else {
      setType(categories[category]?.[0] || null);
    }
  }, [category]);

  useEffect(() => {
    fetchData();
  }, [category, type]);

  const handleAdd = async () => {
    if (!newItemName.trim()) {
      Alert.alert("Error", "Please enter a name");
      return;
    }

    const item = {
      id: Date.now().toString(),
      name: newItemName,
    };

    try {
      const url = type
        ? `${BASE_URL}/api/admin/data/${category}/${type}`
        : `${BASE_URL}/api/admin/data/${category}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert("Error", result.message || "Failed to add item");
        return;
      }

      setNewItemName("");
      setShowAddModal(false);
      fetchData();
    } catch (err) {
      console.log("ADD ERROR:", err);
      Alert.alert("Error", "Failed to add item");
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = type
        ? `${BASE_URL}/api/admin/data/${category}/${type}/${id}`
        : `${BASE_URL}/api/admin/data/${category}/${id}`;

      const res = await fetch(url, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        Alert.alert("Error", result.message || "Failed to delete item");
        return;
      }

      fetchData();
    } catch (err) {
      console.log("DELETE ERROR:", err);
      Alert.alert("Error", "Failed to delete item");
    }
  };

  const getDisplayName = (item) => {
    return (
      item.name ||
      item.title ||
      item.route ||
      item.type ||
      item.service ||
      item.category ||
      item.address ||
      "Unnamed Item"
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fb]">
      <FlatList
        data={data}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className="px-6 pt-6 pb-4">
              <Text className="text-3xl font-bold text-gray-900">
                Manage Services
              </Text>
            </View>

            {/* Category chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              <View className="flex-row">
                {Object.keys(categories).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategory(cat)}
                    className={`px-5 py-3 rounded-2xl mr-3 ${
                      category === cat ? "bg-[#3C91E6]" : "bg-[#e8ebf2]"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        category === cat ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Subcategory chips */}
            {categories[category] && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14 }}
              >
                <View className="flex-row">
                  {categories[category].map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => setType(t)}
                      className={`px-4 py-2 rounded-xl mr-2 ${
                        type === t ? "bg-[#CDEB8B]" : "bg-[#eef1f6]"
                      }`}
                    >
                      <Text
                        className={`text-sm font-medium ${
                          type === t ? "text-[#2E5E1A]" : "text-gray-700"
                        }`}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            {/* Add Button */}
            <View className="px-6 mt-6">
              <TouchableOpacity
                onPress={() => setShowAddModal(true)}
                className="bg-[#218fb4] py-4 rounded-2xl"
              >
                <Text className="text-white text-center text-lg font-semibold">
                  + Add Item
                </Text>
              </TouchableOpacity>
            </View>

            {/* Loading */}
            {loading && (
              <View className="mt-8 items-center">
                <ActivityIndicator size="large" color="#218fb4" />
                <Text className="mt-2 text-gray-500">Loading...</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View className="bg-white mx-6 mt-5 px-5 py-5 rounded-3xl shadow-sm border border-[#eef1f6]">
            <Text className="text-lg font-semibold text-gray-900">
              {getDisplayName(item)}
            </Text>

            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Delete Item",
                  `Delete "${getDisplayName(item)}"?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => handleDelete(item.id),
                    },
                  ]
                )
              }
              className="mt-4"
            >
              <Text className="text-red-500 font-semibold text-base">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text className="text-center text-gray-500 mt-12">
              No items found
            </Text>
          ) : null
        }
      />

      {/* Add Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View className="flex-1 bg-black/30 justify-end">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">
            <Text className="text-2xl font-bold text-gray-900 mb-5">
              Add New Item
            </Text>

            <TextInput
              placeholder="Enter item name"
              value={newItemName}
              onChangeText={setNewItemName}
              className="border border-gray-300 rounded-2xl px-4 py-4 text-base bg-[#f8f9fc]"
            />

            <TouchableOpacity
              onPress={handleAdd}
              className="bg-[#218fb4] py-4 rounded-2xl mt-5"
            >
              <Text className="text-white text-center text-lg font-semibold">
                Save Item
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowAddModal(false);
                setNewItemName("");
              }}
              className="py-4 rounded-2xl mt-3 bg-[#eef1f6]"
            >
              <Text className="text-center text-gray-700 text-lg font-medium">
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
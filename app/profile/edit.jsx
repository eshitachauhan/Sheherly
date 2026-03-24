import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.108.85.250:8000";

export default function EditProfile() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    const loadProfile = async () => {
      const token = await SecureStore.getItemAsync("token");
      if (!token) return;

      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setName(data?.name || "");
      setPhone(data?.phone || "");
    };

    loadProfile();
  }, []);
 
  const handleSave = async () => {
    if (!name && !phone) {
      Alert.alert("Nothing to update");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");
      console.log("Token:", token); 

    if (!token) {
      Alert.alert("Not logged in or token missing");
      setLoading(false);
      return;
    }

      const res = await fetch(`${BASE_URL}/api/auth/update-profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, phone }),
      });

      console.log("Status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (!res.ok) {
      Alert.alert("Update failed", data.message || "Unknown error");
      return;
    }

      Alert.alert("Profile updated ✅");
      router.back(); 
    } catch (err) {
      Alert.alert("Error updating profile");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScrollView className="mx-6 mt-6">
        <Text className="text-xl font-bold text-gray-800 mb-6">
          Edit Profile
        </Text>

        
        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-1">Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
            className="bg-white p-3 rounded-2xl shadow text-gray-800"
          />
        </View>

      \
        <View className="mb-4">
          <Text className="text-sm text-gray-500 mb-1">Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter phone"
            keyboardType="phone-pad"
            className="bg-white p-3 rounded-2xl shadow text-gray-800"
          />
        </View>

        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-blue-500 p-4 rounded-2xl items-center mt-6"
        >
          <Text className="text-white font-semibold text-base">
            {loading ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


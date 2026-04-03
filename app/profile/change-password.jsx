import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const BASE_URL = "http://10.231.186.139:8000";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Error", "User not logged in");
        router.replace("/signin");
        return;
      }

      const res = await fetch(`${BASE_URL}/api/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json(); // ✅ FIXED

      if (!res.ok) {
        Alert.alert("Error", data.message || "Failed to update password");
        return;
      }

      // Success
      Alert.alert(
        "Password Updated",
        "Please signin again",
        [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.removeItem("token"); // logout
              router.replace("/signin");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.log("CHANGE PASSWORD ERROR 👉", error);
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb] px-6 pt-6">
      <Text className="text-xl font-bold text-gray-800 mb-6">
        Change Password
      </Text>

      <TextInput
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
        className="bg-white p-3 rounded-2xl shadow mb-4"
      />

      <TextInput
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
        className="bg-white p-3 rounded-2xl shadow mb-4"
      />

      <TextInput
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        className="bg-white p-3 rounded-2xl shadow mb-6"
      />

      <TouchableOpacity
        onPress={handleChangePassword}
        className="bg-blue-500 p-4 rounded-2xl items-center"
      >
        <Text className="text-white font-semibold text-base">
          Update Password
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
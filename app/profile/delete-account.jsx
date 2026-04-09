import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const BASE_URL = "http://10.224.117.139:5000";

export default function DeleteAccount() {
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    if (confirmText !== "DELETE") {
      Alert.alert("Error", "Type DELETE to confirm");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message || "Delete failed");
        return;
      }

     
      await AsyncStorage.removeItem("token");

      Alert.alert("Account Deleted", "Your account has been deleted", [
        {
          text: "OK",
          onPress: () => router.replace("/signup"),
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb] px-6 pt-6">
      <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
        Delete Account
      </Text>

      <Text className="text-sm text-gray-500 text-center mb-4">
        This action is permanent and cannot be undone.
      </Text>

      <View className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <Text className="text-red-700 text-sm">
          • Your profile will be deleted{"\n"}
          • You will lose all data{"\n"}
          • This cannot be recovered
        </Text>
      </View>

      <Text className="text-sm text-gray-600 mb-2">
        Type DELETE to confirm
      </Text>

      <TextInput
        value={confirmText}
        onChangeText={setConfirmText}
        placeholder="DELETE"
        className="bg-white p-3 rounded-2xl shadow mb-6"
      />

      <TouchableOpacity
        onPress={handleDelete}
        disabled={confirmText !== "DELETE"}
        className={`p-4 rounded-2xl items-center ${
          confirmText === "DELETE" ? "bg-red-600" : "bg-red-300"
        }`}
      >
        <Text className="text-white font-semibold">
          Permanently Delete Account
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}


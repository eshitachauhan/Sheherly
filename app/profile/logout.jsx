import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LAST_USER_KEY, CACHED_PROFILE_KEY } from "../../constants/storageKeys";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Clear stored session so offline check won't bypass welcome page
      await AsyncStorage.removeItem(LAST_USER_KEY);
      await AsyncStorage.removeItem(CACHED_PROFILE_KEY);
      await signOut(auth);
      router.replace("/");
    } catch (error) {
      console.log("Logout error:", error);
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb] items-center justify-center px-6">
      <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
        Are you sure you want to logout?
      </Text>

      <View className="flex-row space-x-4">
        <TouchableOpacity
          className="bg-gray-300 p-4 rounded-2xl w-32 items-center"
          onPress={() => router.push("/profile")}
        >
          <Text className="text-gray-800 font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-red-500 p-4 rounded-2xl w-32 items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

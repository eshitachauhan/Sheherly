import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Logout() {

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb] items-center justify-center px-6">
      <Text className="text-xl font-bold text-gray-800 mb-6 text-center">
        Are you sure you want to logout?
      </Text>

      <View className="flex-row space-x-4">
        <TouchableOpacity className="bg-gray-300 p-4 rounded-2xl w-32 items-center">
          <Text className="text-gray-800 font-semibold" onPress={()=>router.push("/profile")} >Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-red-500 p-4 rounded-2xl w-32 items-center" onPress={()=>router.push("/signin")}>
          <Text className="text-white font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

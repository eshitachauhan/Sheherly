import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const logo = require("../../assets/images/sheherlyTitle.png");

export default function Dashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white flex-1">
      <StatusBar barStyle={"dark-content"} backgroundColor={"white"} />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-start items-center mt-10">

          {/* Logo */}
          <Image source={logo} style={{ width: 300, height: 300 }} />

          {/* Buttons */}
          <View className="w-3/4 mt-4">

            <TouchableOpacity
              onPress={() => router.push("/admin/users")}
              className="p-3 my-2 bg-white border border-[#218fb4ff] rounded-lg"
            >
              <Text className="text-lg font-semibold text-center text-[#218fb4ff]">
                Manage Users
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/admin/services")}
              className="p-3 my-2 bg-white border border-[#218fb4ff] rounded-lg"
            >
              <Text className="text-lg font-semibold text-center text-[#218fb4ff]">
                Manage Services
              </Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
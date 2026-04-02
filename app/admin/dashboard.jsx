import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 30 }}>
        Admin Dashboard
      </Text>

      <TouchableOpacity 
        onPress={() => router.push("/admin/users")}
        style={{ margin: 10 }}
      >
        <Text style={{ color: "blue", fontSize: 18 }}>Manage Users</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push("/admin/services")}
        style={{ margin: 10 }}
      >
        <Text style={{ color: "blue", fontSize: 18 }}>Manage Services</Text>
      </TouchableOpacity>

    </View>
  );
}
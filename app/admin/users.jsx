import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BASE_URL = "http://10.231.186.250:8000";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${BASE_URL}/api/auth/users`);
      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.message || "Failed to fetch users");
        return;
      }

      setUsers(data.users || []);
    } catch (error) {
      console.error("FETCH USERS ERROR:", error);
      Alert.alert("Error", "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <StatusBar barStyle="dark-content" />

      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 26, fontWeight: "700", color: "#222" }}>
          Manage Users
        </Text>
        <Text style={{ marginTop: 5, color: "#666", fontSize: 15 }}>
          Total Registered Users: {users.length}
        </Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#218fb4" />
          <Text style={{ marginTop: 10, color: "#555" }}>Loading users...</Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: "white",
                padding: 16,
                borderRadius: 14,
                marginBottom: 12,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#222" }}>
                {index + 1}. {item.email}
              </Text>


              <Text style={{ marginTop: 6, color: "#555" }}>
                Name: {item.name && item.name.trim() !== "" ? item.name : "N/A"}
              </Text>


              <Text style={{ marginTop: 4, color: "#555" }}>
                Phone: {item.phone && item.phone.trim() !== "" ? item.phone : "N/A"}
              </Text>


              <Text style={{ marginTop: 6, color: "#888", fontSize: 12 }}>
                ID: {item._id}
              </Text>

              <View
                style={{
                  marginTop: 10,
                  alignSelf: "flex-start",
                  backgroundColor:
                    item.role === "admin" ? "#ffe0b2" : "#dcedc8",
                  paddingVertical: 5,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    fontWeight: "600",
                    color: item.role === "admin" ? "#e65100" : "#2e7d32",
                  }}
                >
                  {item.role.toUpperCase()}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40, color: "#777" }}>
              No users found
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
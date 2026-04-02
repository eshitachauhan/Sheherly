import { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

const BASE_URL = "http://10.231.186.250:9000";

export default function Users() {
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${BASE_URL}/api/admin/user/${id}`, {
        method: "DELETE",
      });
      getUsers();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>

      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Users List
      </Text>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 15 }}>
            <Text>{item.email}</Text>

            <TouchableOpacity onPress={() => deleteUser(item._id)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}
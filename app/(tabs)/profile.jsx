import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "http://10.209.84.139:8000";

const settingsOptions = [
  { id: "1", title: "Edit Profile", emoji: "✏️", route: "edit" },
  { id: "2", title: "Change Password", emoji: "🔒", route: "change-password" },
  { id: "3", title: "Notifications", emoji: "🔔", route: "notifications" },
  { id: "4", title: "Delete Account", emoji: "🗑️", route: "delete-account" },
  { id: "5", title: "Logout", emoji: "🚪", route: "logout", danger: true },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

 
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const token = await SecureStore.getItemAsync("token");
          if (!token) {
            setLoading(false);
            return;
          }

          const res = await fetch(`${BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json();
          setUser(data);
        } catch (err) {
          console.log("PROFILE FETCH ERROR:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading profile...</Text>
      </SafeAreaView>
    );
  }

 
  const profileSections = [
    {
      title: "Personal Details",
      items: [
        { label: "Name", value: String(user?.name || "Add name") },
        { label: "Email", value: String(user?.email || "Add email") },
        { label: "Phone", value: String(user?.phone || "Add phone number") },
      ],
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      <ScrollView showsVerticalScrollIndicator={false}>
       
        <View className="items-center mt-8 mb-6">
          <View className="w-24 h-24 rounded-full bg-blue-200 items-center justify-center">
            <Text className="text-5xl">👤</Text>
          </View>
        </View>

       
        <View className="mx-6">
          {profileSections.map((section, index) => (
            <View
              key={index}
              className="bg-white rounded-2xl p-4 mb-5 shadow"
            >
              <Text className="text-base font-bold text-gray-800 mb-3">
                {section.title}
              </Text>

              {section.items.map((item, i) => {
                const valueStr = String(item.value);
                const isAdd = valueStr.startsWith("Add");

                return (
                  <View
                    key={i}
                    className="flex-row justify-between py-2 border-b border-gray-100 last:border-b-0"
                  >
                    <Text className="text-sm text-gray-500">{item.label}</Text>

                    {isAdd ? (
                      <TouchableOpacity
                        onPress={() => {
                          if (item.label === "Email") {
                            router.push("/signin");
                          } else {
                            router.push("/profile/edit");
                          }
                        }}
                      >
                        <Text className="text-sm font-semibold text-blue-500">
                          {valueStr}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text className="text-sm font-semibold text-gray-800">
                        {valueStr}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>

       
        <View className="mx-6">
          <Text className="text-base font-bold text-gray-800 mb-3">
            Settings
          </Text>

          {settingsOptions.map((option) => (
            <Link key={option.id} href={`/profile/${option.route}`} asChild>
              <TouchableOpacity
                activeOpacity={0.8}
                className={`flex-row items-center p-4 rounded-2xl mb-4 shadow
                  ${option.danger ? "bg-red-50" : "bg-white"}`}
              >
                <Text className="text-2xl mr-4">{option.emoji}</Text>

                <Text
                  className={`flex-1 text-base font-semibold ${
                    option.danger ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {option.title}
                </Text>

                <Text className="text-gray-400 text-xl">›</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}








import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const API_URL = "http://10.209.84.138:8000/chat"; 

export default function ChatbotScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const tabBarHeight = useBottomTabBarHeight();

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.text }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      const botText =
        data.reply ||
        data.response ||
        data.message ||
        data.answer ||
        "No response";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: botText,
        },
      ]);
    } catch (err) {
      console.log("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "bot",
          text: " Server not reachable right now.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7fb]">
      
      <Text className="text-2xl font-bold px-4 py-3">
        Sheherly Chatbot
      </Text>


      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            className={`max-w-[80%] px-4 py-3 rounded-2xl my-1 ${
              item.role === "user"
                ? "self-end bg-blue-600"
                : "self-start bg-gray-200"
            }`}
          >
            <Text
              className={`text-[15px] ${
                item.role === "user" ? "text-white" : "text-black"
              }`}
            >
              {item.text}
            </Text>
          </View>
        )}
      />

      {loading && (
        <ActivityIndicator size="small" color="#2563eb" className="mb-2" />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "height" : "padding"}
        keyboardVerticalOffset={tabBarHeight}
      >
        <View className="flex-row items-center bg-white mx-3 mb-3 px-4 py-3 rounded-full">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask about Jaipur..."
            className="flex-1 text-base"
          />

          <TouchableOpacity onPress={sendMessage}>
            <Text className="text-xl pl-3">➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}



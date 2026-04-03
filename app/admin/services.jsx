import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import medData from "../data/medData.json";
import foodData from "../data/foodData.json";
import transData from "../data/transData.json";
import localData from "../data/localData.json";
import accommodationData from "../data/accommodationData.json";
import famousSpots from "../data/famousSpots.json";
import policeData from "../data/policeData.json";

const allData = {
  medical: medData,
  food: foodData,
  transport: transData,
  localServices: localData,
  accommodation: accommodationData,
  famousSpots: famousSpots,
  police: policeData,
};

export default function Services() {
  const [selectedMain, setSelectedMain] = useState("medical");
  const [data, setData] = useState(allData["medical"]);

  const isNested = typeof data === "object" && !Array.isArray(data);

  const [selectedCategory, setSelectedCategory] = useState(
    isNested ? Object.keys(data)[0] : null
  );

  const switchMain = (key) => {
    const newData = allData[key];
    setSelectedMain(key);
    setData(newData);

    if (typeof newData === "object" && !Array.isArray(newData)) {
      setSelectedCategory(Object.keys(newData)[0]);
    } else {
      setSelectedCategory(null);
    }
  };

  const currentList = isNested ? data[selectedCategory] : data;

  const deleteItem = (index) => {
    if (isNested) {
      const updated = [...data[selectedCategory]];
      updated.splice(index, 1);

      setData({
        ...data,
        [selectedCategory]: updated,
      });
    } else {
      const updated = [...data];
      updated.splice(index, 1);
      setData(updated);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f7fa" }}>
      <StatusBar barStyle="dark-content" />

      {/* 🔹 TOP CONTAINER (fixed background) */}
      <View
        style={{
          backgroundColor: "white",
          paddingVertical: 10,
          paddingLeft: 15,
          borderBottomWidth: 1,
          borderColor: "#ddd",
        }}
      >
        {/* MAIN CATEGORY */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {Object.keys(allData).map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => switchMain(key)}
              style={{
                height: 36,
                justifyContent: "center",
                paddingHorizontal: 15,
                borderRadius: 20,
                marginRight: 10,
                backgroundColor:
                  selectedMain === key ? "#218fb4" : "#eef2f5",
              }}
            >
              <Text
                style={{
                  color: selectedMain === key ? "white" : "#333",
                  fontWeight: "600",
                }}
              >
                {key.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* SUBCATEGORY */}
        {isNested && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "center", marginTop: 8 }}
          >
            {Object.keys(data).map((key) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedCategory(key)}
                style={{
                  height: 32,
                  justifyContent: "center",
                  paddingHorizontal: 12,
                  borderRadius: 15,
                  marginRight: 8,
                  backgroundColor:
                    selectedCategory === key ? "#ffd54f" : "#fff3cd",
                }}
              >
                <Text
                  style={{
                    color: "#333",
                    fontWeight:
                      selectedCategory === key ? "600" : "400",
                  }}
                >
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      {/* 🔹 CONTENT AREA */}
      <View style={{ flex: 1, padding: 15 }}>

        {/* ADD BUTTON */}
        <TouchableOpacity
          style={{
            alignSelf: "flex-end",
            marginBottom: 10,
            backgroundColor: "#218fb4",
            paddingVertical: 6,
            paddingHorizontal: 15,
            borderRadius: 10,
          }}
          onPress={() => console.log("Add new item")}
        >
          <Text style={{ color: "white", fontWeight: "600" }}>
            + Add
          </Text>
        </TouchableOpacity>

        {/* LIST */}
        <FlatList
          data={currentList || []}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              style={{
                backgroundColor: "white",
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.name || item.title}
              </Text>

              <TouchableOpacity
                onPress={() => deleteItem(index)}
                style={{ marginTop: 8 }}
              >
                <Text style={{ color: "red", fontWeight: "500" }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
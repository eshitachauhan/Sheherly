import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import medData from "../data/medData.json";
import foodData from "../data/foodData.json";

const allData = {
  medical: medData,
  food: foodData,
};

export default function Services() {
  const [selectedMain, setSelectedMain] = useState("medical");
  const [data, setData] = useState(allData["medical"]);
  const [selectedCategory, setSelectedCategory] = useState(
    Object.keys(allData["medical"])[0]
  );

  const switchMain = (key) => {
    setSelectedMain(key);
    setData(allData[key]);
    setSelectedCategory(Object.keys(allData[key])[0]);
  };

  const deleteItem = (index) => {
    const updated = [...data[selectedCategory]];
    updated.splice(index, 1);

    setData({
      ...data,
      [selectedCategory]: updated,
    });
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>

      {/* MAIN TYPE (medical / food) */}
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {Object.keys(allData).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => switchMain(key)}
            style={{ marginRight: 10 }}
          >
            <Text style={{ color: "blue" }}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CATEGORY (hospitals, clinics, etc) */}
      <View style={{ flexDirection: "row", marginBottom: 15 }}>
        {Object.keys(data).map((key) => (
          <TouchableOpacity
            key={key}
            onPress={() => setSelectedCategory(key)}
            style={{ marginRight: 10 }}
          >
            <Text style={{ color: "green" }}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* LIST */}
      <FlatList
        data={data[selectedCategory]}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={{ marginBottom: 10 }}>
            <Text>{item.name || item.title}</Text>

            <TouchableOpacity onPress={() => deleteItem(index)}>
              <Text style={{ color: "red" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

    </View>
  );
}
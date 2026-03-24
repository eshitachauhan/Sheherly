/*import { View, Text, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

import transportationData from "../../data/transportationData.json"


export default function TransportTypePage() {
  const { type } = useLocalSearchParams();

  const rawData = transportationData[type] || [];
  const data = rawData.map(item => {
  
    if (item.cab_type) {
      return {
        id: item.cab_type + item.pickup_location + item.destination,
        name: item.cab_type,
        info: `${item.pickup_location} → ${item.destination} · ${item.price_estimate} · ETA ${item.eta_minutes} min`
      };
    }
    if (item.bike_id) {
      return {
        id: item.bike_id,
        name: item.name,
        info: `${item.type} · ₹${item.price_per_hour}/hr · ${item.available ? "Available" : "Not Available"}`
      };
    }
    if (item.driver_id) {
      return {
        id: item.driver_id,
        name: `${item.driver_name} (${item.vehicle_model})`,
        info: `${item.operating_zone} · ${item.service_type} · ${item.availability ? "Available" : "Not Available"}`
      };
    }
    if (item.name && item.public_transport_type) {
      return {
        id: item.ref || item.name,
        name: item.name,
        info: `${item.network || "Unknown Network"} · ${item.public_transport_type}`
      };
    }
    return {
      id: item.id || JSON.stringify(item),
      name: item.name || "Unknown",
      info: JSON.stringify(item)
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fb]">
      <View className="p-6">
        <Text className="text-3xl font-bold text-[#0b3d91] capitalize">
          {type}
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Available services
        </Text>
      </View>

      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-3 shadow">
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500 mt-1">
              {item.info}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No services available 😕
          </Text>
        }
      />
    </SafeAreaView>
  );
}
*/






import {
  View, Text, FlatList, TouchableOpacity,
  ScrollView, Linking, Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import transportationData from "../../data/transData.json";

// ─── Open external booking URL ───────────────────────────────────────────────
const openURL = async (url) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Could not open link", "Please try manually.");
  }
};

// ─── Open Google Maps for directions ─────────────────────────────────────────
const openMaps = (from, to) => {
  const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)},Jaipur&destination=${encodeURIComponent(to)},Jaipur`;
  openURL(url);
};

// ════════════════════════════════════════════════════════════════════════════
// BUS VIEW
// ════════════════════════════════════════════════════════════════════════════
function BusView({ data }) {
  const [filter, setFilter] = useState("all"); // "all" | "ac" | "non-ac"

  const filtered = data.filter(b => {
    if (filter === "ac") return b.ac === true;
    if (filter === "non-ac") return b.ac === false;
    return true;
  }).sort((a, b) => b.rating - a.rating);

  return (
    <>
      {/* Filter Pills */}
      <View className="flex-row px-4 mb-4 gap-2">
        {["all", "ac", "non-ac"].map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setFilter(f)}
            className={`px-4 py-2 rounded-full border ${filter === f ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
          >
            <Text className={`text-sm font-medium capitalize ${filter === f ? "text-white" : "text-gray-600"}`}>
              {f === "all" ? "All Buses" : f === "ac" ? "AC Only" : "Non-AC"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl mb-3 shadow p-4">
            {/* Header row */}
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <View className="bg-blue-100 px-2 py-0.5 rounded">
                    <Text className="text-blue-700 font-bold text-xs">Route {item.route_number}</Text>
                  </View>
                  {item.ac && (
                    <View className="bg-green-100 px-2 py-0.5 rounded">
                      <Text className="text-green-700 text-xs font-medium">AC</Text>
                    </View>
                  )}
                </View>
                <Text className="text-base font-semibold mt-1">{item.name}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">via {item.via}</Text>
              </View>
              <View className="items-end">
                <Text className="text-lg font-bold text-green-600">₹{item.fare}</Text>
                <Text className="text-xs text-gray-400">per trip</Text>
              </View>
            </View>

            {/* Info row */}
            <View className="flex-row mt-2 gap-3">
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-gray-500">🕒 {item.duration_minutes} mins</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-gray-500">🔁 {item.frequency}</Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-gray-500">⭐ {item.rating}</Text>
              </View>
            </View>

            <Text className="text-xs text-gray-400 mt-1">
              First: {item.first_bus} · Last: {item.last_bus}
            </Text>

            {/* View on Maps button */}
            <TouchableOpacity
              className="mt-3 bg-blue-50 border border-blue-200 rounded-xl py-2 items-center"
              onPress={() => openMaps(item.from, item.to)}
            >
              <Text className="text-blue-600 font-semibold text-sm">🗺️ View Route on Maps</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// CAB VIEW — comparison cards
// ════════════════════════════════════════════════════════════════════════════
function CabView({ data }) {
  const [distanceKm, setDistanceKm] = useState(5);
  const distances = [3, 5, 8, 10, 15];

  // Calculate fare for given distance
  const calcFare = (cab, km) =>
    Math.round(cab.base_fare + cab.per_km_rate * km);

  const sorted = [...data].sort((a, b) => calcFare(a, distanceKm) - calcFare(b, distanceKm));

  const providerColors = {
    Ola: { bg: "bg-yellow-50", border: "border-yellow-300", badge: "bg-yellow-400", text: "text-yellow-800" },
    Uber: { bg: "bg-gray-50", border: "border-gray-300", badge: "bg-gray-800", text: "text-white" },
    Rapido: { bg: "bg-yellow-50", border: "border-yellow-400", badge: "bg-yellow-500", text: "text-gray-900" },
  };

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}>
      {/* Distance selector */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-600 mb-2">Estimate for distance:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {distances.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => setDistanceKm(d)}
                className={`px-4 py-2 rounded-full border ${distanceKm === d ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
              >
                <Text className={`text-sm font-medium ${distanceKm === d ? "text-white" : "text-gray-600"}`}>
                  {d} km
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <Text className="text-xs text-gray-400 mb-3">Sorted by price for {distanceKm} km · Tap to book</Text>

      {sorted.map((item, index) => {
        const c = providerColors[item.provider] || providerColors["Ola"];
        const fare = calcFare(item, distanceKm);
        return (
          <View key={item.id} className={`rounded-2xl mb-3 shadow p-4 border ${c.bg} ${c.border}`}>
            <View className="flex-row justify-between items-start">
              <View>
                {index === 0 && (
                  <View className="bg-green-100 px-2 py-0.5 rounded mb-1 self-start">
                    <Text className="text-green-700 text-xs font-bold">💸 Cheapest</Text>
                  </View>
                )}
                <View className={`px-2 py-0.5 rounded self-start mb-1 ${c.badge}`}>
                  <Text className={`text-xs font-bold ${c.text}`}>{item.provider}</Text>
                </View>
                <Text className="text-base font-semibold">{item.cab_type}</Text>
                <Text className="text-xs text-gray-500 mt-0.5">~{item.avg_wait_minutes} min wait · ⭐ {item.rating}</Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-gray-800">₹{fare}</Text>
                <Text className="text-xs text-gray-400">est. for {distanceKm} km</Text>
                <Text className="text-xs text-gray-400">₹{item.per_km_rate}/km</Text>
              </View>
            </View>

            {/* Features */}
            <View className="flex-row flex-wrap gap-1 mt-2">
              {item.features.map(f => (
                <View key={f} className="bg-white px-2 py-0.5 rounded-full border border-gray-200">
                  <Text className="text-xs text-gray-600">{f}</Text>
                </View>
              ))}
            </View>

            {/* Book button */}
            <TouchableOpacity
              className="mt-3 bg-white border border-gray-300 rounded-xl py-2 items-center"
              onPress={() => openURL(item.book_url)}
            >
              <Text className="text-gray-700 font-semibold text-sm">Book on {item.provider} →</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      <View className="bg-blue-50 rounded-xl p-3 mt-2">
        <Text className="text-xs text-blue-600 font-medium">💡 Local Tip</Text>
        <Text className="text-xs text-blue-500 mt-1">
          Fares may vary with surge pricing. UberGo and Ola Mini are usually the cheapest options for distances under 8 km in Jaipur.
        </Text>
      </View>
    </ScrollView>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// RICKSHAW VIEW
// ════════════════════════════════════════════════════════════════════════════
function RickshawView({ data }) {
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-2xl mb-3 shadow p-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-base font-semibold flex-1">{item.type}</Text>
            <View className="bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
              <Text className="text-yellow-700 text-xs font-medium">⭐ {item.rating}</Text>
            </View>
          </View>

          <Text className="text-sm text-gray-500 mb-3">{item.description}</Text>

          <View className="bg-gray-50 rounded-xl p-3 mb-3">
            <Text className="text-xs font-semibold text-gray-600 mb-2">Approximate Fares</Text>
            <Text className="text-xs text-gray-500 mb-1">🟢 Short (&lt;3 km): {item.typical_short_ride}</Text>
            <Text className="text-xs text-gray-500 mb-1">🟡 Medium (3–8 km): {item.typical_medium_ride}</Text>
            <Text className="text-xs text-gray-500">🔴 Long (&gt;8 km): {item.typical_long_ride}</Text>
          </View>

          <View className="flex-row justify-between mb-2">
            <Text className="text-xs text-gray-400">🕒 {item.availability}</Text>
            <Text className="text-xs text-gray-400">Best for: {item.best_for}</Text>
          </View>

          <View className="bg-amber-50 border border-amber-200 rounded-xl p-2 mb-3">
            <Text className="text-xs text-amber-700">💡 {item.tip}</Text>
          </View>

          {item.booking_app !== "Street hail only" && item.booking_app !== "Not available — street hail only" && (
            <TouchableOpacity
              className="bg-blue-50 border border-blue-200 rounded-xl py-2 items-center"
              onPress={() => openURL("https://m.uber.com/")}
            >
              <Text className="text-blue-600 font-semibold text-sm">Book via {item.booking_app} →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    />
  );
}

// ════════════════════════════════════════════════════════════════════════════
// BIKE RENTALS VIEW
// ════════════════════════════════════════════════════════════════════════════
function BikeRentalsView({ data }) {
  const [filter, setFilter] = useState("all"); // "all" | "available" | "no-license"

  const filtered = data.filter(b => {
    if (filter === "available") return b.available === true;
    if (filter === "no-license") return b.license_required === false;
    return true;
  }).sort((a, b) => a.price_per_day - b.price_per_day);

  return (
    <>
      <View className="flex-row px-4 mb-4 gap-2 flex-wrap">
        {[
          { key: "all", label: "All" },
          { key: "available", label: "Available Now" },
          { key: "no-license", label: "No License Needed" },
        ].map(f => (
          <TouchableOpacity
            key={f.key}
            onPress={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-full border ${filter === f.key ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"}`}
          >
            <Text className={`text-sm font-medium ${filter === f.key ? "text-white" : "text-gray-600"}`}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className={`bg-white rounded-2xl mb-3 shadow p-4 ${!item.available ? "opacity-60" : ""}`}>
            <View className="flex-row justify-between items-start mb-1">
              <View className="flex-1">
                <Text className="text-base font-semibold">{item.name}</Text>
                <Text className="text-xs text-gray-400">{item.model}</Text>
              </View>
              <View className="items-end">
                {!item.available && (
                  <View className="bg-red-100 px-2 py-0.5 rounded mb-1">
                    <Text className="text-red-600 text-xs font-medium">Unavailable</Text>
                  </View>
                )}
                <Text className="text-lg font-bold text-green-600">₹{item.price_per_day}/day</Text>
                <Text className="text-xs text-gray-400">₹{item.price_per_hour}/hr</Text>
              </View>
            </View>

            <View className="flex-row flex-wrap gap-1 mt-2 mb-2">
              {[
                item.ac ? "AC" : null,
                item.helmet_included ? "Helmet ✓" : "No Helmet",
                item.license_required ? "License Required" : "No License Needed",
                item.fuel_included ? "Fuel ✓" : "Fuel Extra",
              ].filter(Boolean).map(tag => (
                <View key={tag} className="bg-gray-100 px-2 py-0.5 rounded-full">
                  <Text className="text-xs text-gray-600">{tag}</Text>
                </View>
              ))}
            </View>

            <Text className="text-xs text-gray-500 mb-1">
              📍 Pickup: {item.pickup_locations.join(", ")}
            </Text>
            <Text className="text-xs text-gray-500 mb-1">
              💰 Deposit: {item.deposit === 0 ? "No deposit" : `₹${item.deposit}`} · Min age: {item.min_age}+
            </Text>

            <View className="bg-amber-50 border border-amber-200 rounded-xl p-2 my-2">
              <Text className="text-xs text-amber-700">💡 {item.tip}</Text>
            </View>

            {item.available && (
              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-2.5 items-center mt-1"
                onPress={() => openURL(item.booking_url)}
              >
                <Text className="text-white font-bold text-sm">Book on {item.name} →</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ════════════════════════════════════════════════════════════════════════════
const TYPE_CONFIG = {
  bus: { title: "Bus Routes", subtitle: "RSRTC & city buses in Jaipur", emoji: "🚌" },
  cab: { title: "Cab Comparison", subtitle: "Compare Ola, Uber & Rapido fares", emoji: "🚕" },
  rickshaw: { title: "Rickshaw Guide", subtitle: "Auto, E-rickshaw & cycle rickshaws", emoji: "🛺" },
  bikeRentals: { title: "Bike Rentals", subtitle: "Rent bikes & scooters in Jaipur", emoji: "🏍️" },
};

export default function TransportTypePage() {
  const { type } = useLocalSearchParams();
  const data = transportationData[type] || [];
  const config = TYPE_CONFIG[type] || { title: type, subtitle: "Available services", emoji: "🚗" };

  return (
    <SafeAreaView className="flex-1 bg-[#f4f6fb]">
      {/* Header */}
      <View className="px-5 pt-4 pb-4">
        <Text className="text-3xl">{config.emoji}</Text>
        <Text className="text-2xl font-bold text-[#0b3d91] mt-1">{config.title}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{config.subtitle}</Text>
      </View>

      {/* Render correct view per type */}
      {type === "bus" && <BusView data={data} />}
      {type === "cab" && <CabView data={data} />}
      {type === "rickshaw" && <RickshawView data={data} />}
      {type === "bikeRentals" && <BikeRentalsView data={data} />}

      {data.length === 0 && (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400 text-lg">No data available 😕</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

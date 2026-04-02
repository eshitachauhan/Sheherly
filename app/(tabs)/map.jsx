import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";

const BASE_URL = "https://superobjectionable-unalliterative-ligia.ngrok-free.dev";

export default function Map() {
  const mapRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Location permission denied");
          Alert.alert("Permission Denied", "Location permission is required.");
          return;
        }

        const loc = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch (err) {
        console.log("LOCATION ERROR:", err);
      }
    })();
  }, []);

  const searchPlace = async () => {
    if (!search.trim()) {
      Alert.alert("Enter a place", "Please type a location to search.");
      return;
    }

    try {
      setRouteCoords([]);
      setDistance(null);
      setDuration(null);

      const res = await fetch(
        `${BASE_URL}/api/search?place=${encodeURIComponent(search)}`
      );

      const text = await res.text();
      console.log("SEARCH RAW RESPONSE:", text);

      if (!res.ok) {
        throw new Error(`Search failed with status ${res.status}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.log("SEARCH JSON PARSE ERROR:", jsonErr);
        throw new Error("Backend did not return valid JSON for search");
      }

      if (!data.success || !data.data) {
        Alert.alert("Not found", "Could not find that place.");
        return;
      }

      const place = {
        latitude: data.data.latitude,
        longitude: data.data.longitude,
      };

      setDestination(place);

      mapRef.current?.animateToRegion(
        {
          ...place,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
    } catch (err) {
      console.log("SEARCH ERROR:", err);
      Alert.alert("Search Error", err.message);
    }
  };

  const findRoute = async () => {
    if (!userLocation || !destination) {
      Alert.alert("Missing location", "Search a destination first.");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: userLocation,
          destination,
          mode: "car",
        }),
      });

      const text = await res.text();
      console.log("ROUTE RAW RESPONSE:", text);

      if (!res.ok) {
        throw new Error(`Route failed with status ${res.status}`);
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch (jsonErr) {
        console.log("ROUTE JSON PARSE ERROR:", jsonErr);
        throw new Error("Backend did not return valid JSON for route");
      }

      if (!data.success || !data.data?.polyline) {
        Alert.alert("Route Error", "Could not get route.");
        return;
      }

      setDistance(data.data.distance);
      setDuration(data.data.duration);

      const decoded = polyline.decode(data.data.polyline).map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      setRouteCoords(decoded);
    } catch (err) {
      console.log("ROUTE ERROR:", err);
      Alert.alert("Route Error", err.message);
    }
  };

  if (!userLocation) {
    return <Text className="mt-10 text-center">Loading map...</Text>;
  }

  return (
    <View className="flex-1">
      <View className="absolute top-6 left-3 right-3 z-10 bg-white p-3 rounded-xl shadow-lg">
        <TextInput
          placeholder="Search place"
          value={search}
          onChangeText={setSearch}
          className="bg-gray-100 p-3 rounded-md mb-2"
        />

        <TouchableOpacity
          className="bg-blue-400 p-3 rounded-md mt-1"
          onPress={searchPlace}
        >
          <Text className="text-white text-center font-medium">Search</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-400 p-3 rounded-md mt-2"
          onPress={findRoute}
        >
          <Text className="text-white text-center font-medium">
            Find Route
          </Text>
        </TouchableOpacity>
      </View>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={{
          ...userLocation,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation
        zoomControlEnabled
        showsCompass={false}
        showsMyLocationButton={false}
      >
        {destination && <Marker coordinate={destination} />}

        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="black"
          />
        )}
      </MapView>

      {distance && duration && (
        <View className="absolute bottom-10 left-3 right-3 bg-black/45 p-4 rounded-xl">
          <Text className="text-white text-center">
            Distance: {(distance / 1000).toFixed(1)} km
          </Text>
          <Text className="text-white text-center mt-1">
            Time by car: {(duration / 60).toFixed(0)} mins
          </Text>
        </View>
      )}
    </View>
  );
}
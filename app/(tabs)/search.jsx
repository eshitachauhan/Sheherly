import { View, TextInput, FlatList, Pressable, Text } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

const SEARCH_INTENTS = [
  {
    category: "accommodation",
    route: "/category/accommodation",
    keywords: [
      "stay", "stays", "room", "rooms", "place to stay", "accommodation", "living",
      "hotel", "hotels", "budget hotel", "luxury hotel", "cheap hotel",
      "hostel", "hostels", "boys hostel", "girls hostel",
      "pg", "p.g", "paying guest", "guest house", "guesthouse",
      "flat", "flats", "room rent", "rent room", "rent",
      "1bhk", "2bhk", "3bhk",
      "shared room", "single room", "rooms",
      "airbnb", "homestay"
    ],
  },

  {
    category: "food",
    route: "/category/food",
    keywords: [
      "food", "foods", "eat", "eating",
      "restaurant", "restaurants", "restro",
      "cafe", "cafes", "coffee", "tea",
      "bakery", "sweet shop",
      "street food", "fast food",
      "pizza", "burger", "biryani",
      "veg food", "non veg",
      "mess", "tiffin", "dabba",
      "lunch", "dinner", "breakfast",
      "nearby food", "food near me"
    ],
  },

  {
    category: "transportation",
    route: "/category/transportation",
    keywords: [
      "transport", "travel",
      "bus", "buses", "bus stop",
      "train", "railway", "railway station",
      "metro", "subway",
      "auto", "auto rickshaw",
      "rickshaw",
      "taxi", "cab", "cabs",
      "ola", "uber", "rapido",
      "bike taxi",
      "cycle", "bicycle",
      "public transport",
      "nearest station"
    ],
  },

  {
    category: "medical",
    route: "/category/medical",
    keywords: [
      "hospital", "hospitals",
      "clinic", "clinics",
      "doctor", "doctors",
      "medical", "medical store",
      "pharmacy", "pharmacies",
      "chemist", "medicine", "medicines",
      "emergency", "ambulance",
      "dentist", "eye doctor",
      "health care", "healthcare",
      "nearby hospital"
    ],
  },

  {
    category: "localServices",
    route: "/category/localServices",
    keywords: [
      "bank", "banks",
      "atm", "atms",
      "market", "markets",
      "shop", "shops",
      "grocery", "groceries",
      "kirana", "general store",
      "supermarket", "mart",
      "medical shop",
      "stationery",
      "mobile shop",
      "electronics",
      "laundry", "dry clean",
      "salon", "parlour",
      "repair", "service center"
    ],
  },

  {
    category: "famousSpots",
    route: "/category/famousSpots",
    keywords: [
      "famous places", "famous spot", "tourist places",
      "tourist spot", "places to visit",
      "hangout", "hangout places",
      "mall", "malls", "shopping mall",
      "park", "parks", "garden", "gardens",
      "water park", "amusement park",
      "monument", "monuments",
      "museum", "zoo",
      "view point", "viewpoint",
      "lake", "riverfront",
      "temple", "mandir",
      "gurudwara", "gurdwara",
      "mosque", "masjid",
      "church",
      "nearby places",
      "weekend places"
    ],
  }
];

const detectIntent = (text) => {
  const lower = text.toLowerCase();
  return SEARCH_INTENTS.find(intent =>
    intent.keywords.some(keyword => lower.includes(keyword))
  );
};

const extractFilters = (text) => {
  const lower = text.toLowerCase();
  let type = null;
  let maxPrice = null;

  if (lower.includes("airbnb")) type = "airbnb";
  else if (lower.includes("hotel")) type = "hotel";
  else if (lower.includes("hostel")) type = "hostel";
  else if (lower.includes("pg") || lower.includes("guest")) type = "pg";

  const priceMatch = lower.match(/under\s*(\d+)/);
  if (priceMatch) {
    maxPrice = Number(priceMatch[1]);
  }

  return { type, maxPrice };
};

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);


  const handleChange = (text) => {
    setQuery(text);

    if (!text.trim()) {
      setSuggestions([]);
      return;
    }

    const lower = text.toLowerCase();

    const matched = SEARCH_INTENTS
      .filter(intent =>
        intent.keywords.some(keyword => keyword.startsWith(lower))
      )
      .map(intent => intent.category);

    setSuggestions([...new Set(matched)]);
  };

  const handleSearch = (text) => {
    const intent = detectIntent(text);

    if (!intent) {
      return;
    }

    const filters = extractFilters(text);

    router.push({
      pathname: intent.route,
      params: filters,
    });

    setQuery("");
    setSuggestions([]);
  };


  return (
    <View className="flex-1 bg-white p-6">
      
      <View className="border top-10 rounded-xl px-3 py-2">
        <TextInput
          placeholder="Search...."
          value={query}
          onChangeText={handleChange}
          onSubmitEditing={() => handleSearch(query)}
          className="text-base"
        />
      </View>

      
      {suggestions.length > 0 && (
        <View className="mt-3 bg-white rounded-xl shadow">
          <FlatList
            data={suggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSearch(item)}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text className="text-base capitalize">{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
}


import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const API_URL = "http://10.209.84.138:8000/nearby-restaurants";

const getRandomRating = () =>
  +(Math.random() * (5 - 1) + 1).toFixed(1);

export default function Type() {
  const router = useRouter();
  const { mode = "restaurants" } = useLocalSearchParams();

  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    setLoading(true);

    if (mode === "restaurants") {
      fetchNearbyRestaurants();
    } else {
      const withRatings = (STATIC_DATA[mode] || []).map(item => ({
        ...item,
        rating: getRandomRating(),
      }));

      setData(withRatings);
      setLoading(false);
    }
  }, [mode]);

  const fetchNearbyRestaurants = async () => {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();

      const withRatings = (json.restaurants || []).map(item => ({
        ...item,
        rating: item.rating ?? getRandomRating(),
      }));

      setData(withRatings);
    } catch (e) {
      console.log("Backend error:", e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = (() => {
    let list = data.filter(item =>
      item.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (filterType === "ratingHigh") {
      list.sort((a, b) => b.rating - a.rating);
    }

    if (filterType === "ratingLow") {
      list.sort((a, b) => a.rating - b.rating);
    }

    if (filterType === "distanceNear") {
      list.sort((a, b) => (a.distance_m || 0) - (b.distance_m || 0));
    }

    return list;
  })();

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TouchableOpacity style={styles.location}>
          <Text>📍 Jaipur ▼</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />

        <TouchableOpacity
          style={styles.filter}
          onPress={() => setShowFilter(true)}
        >
          <Text>⚙ Filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/category/food/restaurants/[id]",
                params: {
                  id: item.name,
                  data: JSON.stringify(item),
                },
              })
            }
          >
            <Text style={styles.name}>{item.name}</Text>
            <Text>{((item.distance_m || 1000) / 1000).toFixed(1)} km</Text>
            <Text>₹300 for two</Text>

            <View style={styles.rating}>
              <Text style={{ color: "#fff" }}>{item.rating}★</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal transparent visible={showFilter} animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Sort By</Text>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setFilterType("ratingHigh");
                setShowFilter(false);
              }}
            >
              <Text>Rating: High to Low</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setFilterType("ratingLow");
                setShowFilter(false);
              }}
            >
              <Text>Rating: Low to High</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => {
                setFilterType("distanceNear");
                setShowFilter(false);
              }}
            >
              <Text>Distance: Nearest</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.clearBtn}
              onPress={() => {
                setFilterType(null);
                setShowFilter(false);
              }}
            >
              <Text>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f6f6f6" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  top: { gap: 12, marginBottom: 16 },
  location: { backgroundColor: "#fff", padding: 12, borderRadius: 12 },
  search: { backgroundColor: "#fff", padding: 12, borderRadius: 12 },
  filter: {
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  name: { fontSize: 18, fontWeight: "600" },

  rating: {
    position: "absolute",
    right: 16,
    top: 16,
    backgroundColor: "green",
    paddingHorizontal: 8,
    borderRadius: 6,
  },

  modalBg: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  option: {
    paddingVertical: 12,
  },
  clearBtn: {
    marginTop: 12,
    alignItems: "center",
  },
});


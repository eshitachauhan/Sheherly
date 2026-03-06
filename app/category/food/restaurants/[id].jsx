import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";

export default function RestaurantDetails() {
  const { data } = useLocalSearchParams();
  const scrollRef = useRef(null);

  const snacksRef = useRef(null);
  const mainRef = useRef(null);
  const dessertRef = useRef(null);
  const reviewsRef = useRef(null);

  const restaurant = data ? JSON.parse(data) : null;

  const [dish, setDish] = useState(null);
  const [showMenuOptions, setShowMenuOptions] = useState(false);

  if (!restaurant) {
    return (
      <SafeAreaView style={styles.center}>
        <Text>Loading restaurant...</Text>
      </SafeAreaView>
    );
  }


  const snacks = [
    { name: "Veg Pakora", rating: 4.1, swiggy: 99, zomato: 105 },
  ];

  const mainCourse = [
    { name: "Shahi Paneer", rating: 4.4, swiggy: 149, zomato: 155 },
    { name: "Matar Paneer", rating: 4.2, swiggy: 119, zomato: 125 },
  ];

  const desserts = [
    { name: "Gulab Jamun", rating: 4.6, swiggy: 79, zomato: 85 },
  ];

  const reviews = [
    { user: "Aman", rating: 4, text: "Food quality is good, service can improve." },
    { user: "Neha", rating: 3.5, text: "Average ambience, taste is decent." },
    { user: "Rohit", rating: 4.5, text: "Paneer dishes are excellent." },
  ];

  const scrollTo = (ref) => {
    ref.current?.measureLayout(scrollRef.current, (x, y) => {
      scrollRef.current.scrollTo({ y, animated: true });
    });
    setShowMenuOptions(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
        {/* IMAGE */}
        <Image source={{ uri: restaurant.image }} style={styles.cover} />

     
        <View style={styles.header}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text>Jaipur • {(restaurant.distance_m / 1000).toFixed(1)} km</Text>

          <View style={styles.ratingBox}>
            <Text style={{ color: "#fff" }}>
              {(restaurant.rating ?? 4.0).toFixed(1)}★
            </Text>
          </View>
        </View>

       
        <View style={styles.actions}>
          <ActionBtn label="📋 Menu" onPress={() => setShowMenuOptions(true)} />
          <ActionBtn
            label="📍 Direction"
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?query=${restaurant.name}`
              )
            }
          />
          <ActionBtn
            label="⭐ Reviews"
            onPress={() => scrollTo(reviewsRef)}
          />
          <ActionBtn
            label="📞 Call"
            onPress={() =>
              Linking.openURL(`tel:${restaurant.phone || "+917656000000"}`)
            }
          />
        </View>

       
        <View ref={snacksRef}>
          <Text style={styles.section}>Snacks</Text>
          {snacks.map((i, idx) => (
            <DishCard key={idx} item={i} onPress={setDish} />
          ))}
        </View>

       
        <View ref={mainRef}>
          <Text style={styles.section}>Main Course</Text>
          {mainCourse.map((i, idx) => (
            <DishCard key={idx} item={i} onPress={setDish} />
          ))}
        </View>

        
        <View ref={dessertRef}>
          <Text style={styles.section}>Desserts</Text>
          {desserts.map((i, idx) => (
            <DishCard key={idx} item={i} onPress={setDish} />
          ))}
        </View>

        
        <View ref={reviewsRef}>
          <Text style={styles.section}>Customer Reviews</Text>
          {reviews.map((r, i) => (
            <View key={i} style={styles.reviewCard}>
              <Text style={styles.reviewUser}>
                {r.user} • {r.rating}★
              </Text>
              <Text>{r.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

     
      <Modal visible={showMenuOptions} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowMenuOptions(false)}
        >
          <View style={styles.menuBox}>
            <MenuOpt label="Snacks" onPress={() => scrollTo(snacksRef)} />
            <MenuOpt label="Main Course" onPress={() => scrollTo(mainRef)} />
            <MenuOpt label="Desserts" onPress={() => scrollTo(dessertRef)} />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={!!dish} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{dish?.name}</Text>

            <PlatformBtn
              label={`Swiggy • ₹${dish?.swiggy}`}
              url={`https://www.swiggy.com/search?q=${restaurant.name} ${dish?.name}`}
            />

            <PlatformBtn
              label={`Zomato • ₹${dish?.zomato}`}
              url={`https://www.zomato.com/search?q=${restaurant.name} ${dish?.name}`}
            />

            <TouchableOpacity onPress={() => setDish(null)}>
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function ActionBtn({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.actionBtn}>
      <Text>{label}</Text>
    </TouchableOpacity>
  );
}

function DishCard({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.dish} onPress={() => onPress(item)}>
      <View>
        <Text style={styles.dishName}>{item.name}</Text>
        <Text>⭐ {item.rating} • ₹{item.swiggy}</Text>
      </View>
      <Text style={styles.view}>View</Text>
    </TouchableOpacity>
  );
}

function PlatformBtn({ label, url }) {
  return (
    <TouchableOpacity
      style={styles.platform}
      onPress={() => Linking.openURL(url)}
    >
      <Text style={{ color: "#fff", fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

function MenuOpt({ label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuOpt} onPress={onPress}>
      <Text style={{ fontWeight: "700" }}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  cover: { width: "100%", height: 220 },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: "800" },

  ratingBox: {
    marginTop: 8,
    backgroundColor: "green",
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },

  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f3f3f3",
  },

  section: { fontSize: 18, fontWeight: "800", padding: 16 },

  dish: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
  },

  dishName: { fontSize: 16, fontWeight: "700" },
  view: { color: "#2563EB", fontWeight: "700" },

  reviewCard: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
  },

  reviewUser: { fontWeight: "700", marginBottom: 4 },

  modal: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 16 },

  platform: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
  },

  close: { textAlign: "center", marginTop: 8, fontWeight: "600" },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  menuBox: {
    backgroundColor: "#fff",
    width: "70%",
    borderRadius: 16,
    padding: 12,
  },

  menuOpt: {
    paddingVertical: 14,
    alignItems: "center",
  },
});

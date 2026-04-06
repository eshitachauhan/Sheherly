import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

// only 3 transport collections
const collectionMap = {
  bus: "buses",
  rickshaw: "erickshaws",
  "bike-rentals": "bikeRentals",
};

// ✅ FETCH
export const fetchTransportData = async (type) => {
  try {
    const colName = collectionMap[type];
    if (!colName) return [];

    const snapshot = await getDocs(collection(db, colName));

    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.log("FIREBASE FETCH ERROR:", error);
    return [];
  }
};

// ✅ ADD
export const addTransportItem = async (type, item) => {
  try {
    const colName = collectionMap[type];
    if (!colName) throw new Error("Invalid transport type");

    const docRef = await addDoc(collection(db, colName), item);

    return { success: true, id: docRef.id };
  } catch (error) {
    console.log("FIREBASE ADD ERROR:", error);
    return { success: false, error };
  }
};

// ✅ DELETE
export const deleteTransportItem = async (type, id) => {
  try {
    const colName = collectionMap[type];
    if (!colName) throw new Error("Invalid transport type");

    await deleteDoc(doc(db, colName, id));

    return { success: true };
  } catch (error) {
    console.log("FIREBASE DELETE ERROR:", error);
    return { success: false, error };
  }
};
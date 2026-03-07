import fetch from "node-fetch";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false, 
});

export const searchPlace = async (place) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`;

    const res = await fetch(url, {
      agent,
      headers: {
        "User-Agent": "Sheherly-App/1.0",
      },
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      return { success: false, error: "Place not found" };
    }

    return {
      success: true,
      data: {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
        name: data[0].display_name,
      },
    };
  } catch (err) {
    console.error("GEOCODING ERROR", err);
    return { success: false, error: "Geocoding failed" };
  }
};

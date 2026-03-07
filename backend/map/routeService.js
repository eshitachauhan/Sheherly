
import fetch from "node-fetch";
import https from "https";
import dotenv from "dotenv";

dotenv.config();

const agent = new https.Agent({
  rejectUnauthorized: false, 
});

const ORS_API_KEY = process.env.ORS_API_KEY;
console.log("ORS KEY:", ORS_API_KEY);

const MODE_MAP = {
  car: "driving-car",
  walk: "foot-walking",
  bike: "cycling-regular",
};

export async function getRoute(source, destination, mode = "car") {
  try {
    const orsProfile = MODE_MAP[mode] || MODE_MAP.car;

    const body = {
      coordinates: [
        [source.longitude, source.latitude],
        [destination.longitude, destination.latitude],
      ],
    };

    const response = await fetch(
      `https://api.openrouteservice.org/v2/directions/${orsProfile}`,
      {
        method: "POST",
        agent, 
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      console.log("ORS STATUS:", response.status);
      const text = await response.text();
      console.log("ORS ERROR:", text);
      return { success: false, error: "ORS API error" };
    }

    const data = await response.json();

    const route = data.routes[0];
    return {
      success: true,
      data: {
        distance: route.summary.distance,
        duration: route.summary.duration,
        polyline: route.geometry,
      },
    };
  } catch (error) {
    console.error("ROUTE ERROR", error);
    return { success: false, error: "fetch failed" };
  }
}

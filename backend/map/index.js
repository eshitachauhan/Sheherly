import express from "express";
import { getRoute } from "./routeService.js";
import { searchPlace } from "./geocodingService.js";

const app = express();
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Map backend running");
});


app.get("/api/search", async (req, res) => {
  try {
    const { place } = req.query;

    if (!place) {
      return res.json({ success: false, error: "Place is required" });
    }

    const result = await searchPlace(place);
    res.json(result);
  } catch (err) {
    console.error("SEARCH API ERROR:", err.message);
    res.json({ success: false, error: "Unable to fetch coordinates" });
  }
});

app.post("/api/route", async (req, res) => {
  try {
    console.log("ROUTE HIT", req.body);   

    const { source, destination, mode } = req.body;

    if (!source || !destination) {
      return res.json({
        success: false,
        error: "Source and destination required",
      });
    }

    const result = await getRoute(source, destination, mode);
    res.json(result);
  } catch (err) {
    console.error("ROUTE API ERROR:", err.message);
    res.json({ success: false, error: "Unable to calculate route" });
  }
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

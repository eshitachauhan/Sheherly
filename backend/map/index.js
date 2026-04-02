import express from "express";
import cors from "cors";
import { getRoute } from "./routeService.js";
import { searchPlace } from "./geocodingService.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Map backend running");
});

app.get("/api/search", async (req, res) => {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({
        success: false,
        error: "Place is required",
      });
    }

    const result = await searchPlace(place);

    if (!result.success) {
      return res.status(404).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("SEARCH API ERROR:", err.message);
    res.status(500).json({
      success: false,
      error: "Unable to fetch coordinates",
    });
  }
});

app.post("/api/route", async (req, res) => {
  try {
    console.log("ROUTE HIT", req.body);

    const { source, destination, mode } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        error: "Source and destination required",
      });
    }

    const result = await getRoute(source, destination, mode);

    if (!result.success) {
      return res.status(500).json(result);
    }

    res.json(result);
  } catch (err) {
    console.error("ROUTE API ERROR:", err.message);
    res.status(500).json({
      success: false,
      error: "Unable to calculate route",
    });
  }
});

const PORT = 8000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
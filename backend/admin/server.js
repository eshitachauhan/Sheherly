import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRoutes from "./routes/dataRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ JSON data routes
app.use("/api/admin/data", dataRoutes);

app.get("/", (req, res) => {
  res.send("Admin Backend Running");
});

app.listen(9000, "0.0.0.0", () => {
  console.log("Admin server running on port 9000");
});
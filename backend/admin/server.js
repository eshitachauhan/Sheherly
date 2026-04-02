import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./db.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Admin Backend Running");
});

app.listen(9000, "0.0.0.0", () => {
  console.log("Admin server running on port 9000");
});
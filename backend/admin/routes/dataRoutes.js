import express from "express";
import {
  getCategoryData,
  deleteCategoryItem,
  addCategoryItem,
} from "../controllers/dataController.js";

const router = express.Router();

// 🔥 Flat category routes (for safety/police)
router.get("/:category", getCategoryData);
router.post("/:category", addCategoryItem);
router.delete("/:category/:id", deleteCategoryItem);

// 🔥 Nested category routes (food, medical, etc.)
router.get("/:category/:type", getCategoryData);
router.post("/:category/:type", addCategoryItem);
router.delete("/:category/:type/:id", deleteCategoryItem);

export default router;
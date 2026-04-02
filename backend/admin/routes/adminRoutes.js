import express from "express";
import { getAllUsers, deleteUser } from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", getAllUsers);
router.delete("/user/:id", deleteUser);

export default router;
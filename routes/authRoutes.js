// src/routes/auth.js
import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  UpdateRole,
  deleteAccount,
  getUsers,
  verifyToken,
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/uploadMiddleware.js"; // Asegúrate de tener el middleware de subida de archivos configurado

const router = express.Router();

// Rutas de autenticación
router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);
router.get("/verify", authMiddleware, verifyToken);

// Rutas protegidas con autenticación
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/profile",
  authMiddleware,
  upload.single("photo"),
  uploadToCloudinary,
  updateProfile
); // Cargar imagen con 'upload'
router.put("/profile/role", authMiddleware, UpdateRole);
router.delete("/profile/:userId", authMiddleware, deleteAccount);

// Exportar el router
export default router;

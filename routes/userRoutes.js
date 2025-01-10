// routes/userRoutes.js
import express from "express";
import {
  getUserByUsername,
  getUserProfile,
  addUserToGroup,
  getAllUsers,
  getUserById,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas de usuario
router.get("/", getAllUsers); // Obtener todos los usuarios
router.get("/search/:username", getUserByUsername); // Buscar usuario por nombre de usuario
router.get("/profile/:username", getUserProfile); // Obtener perfil de usuario por nombre de usuario
router.get("/:id", getUserById); // Obtener usuario por ID

// Rutas protegidas
router.post("/group/addUser", authMiddleware, addUserToGroup); // Añadir usuario a un grupo
router.post("/follow/:userId", authMiddleware, followUser); // Seguir a un usuario
router.post("/unfollow/:userId", authMiddleware, unfollowUser); // Dejar de seguir a un usuario

export default router;

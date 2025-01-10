// routes/postRoutes.js
import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  getPostsByUserId, // Asegúrate de que esta función esté definida en tu controlador
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  getRelatedPosts,
} from "../controllers/postController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", getPosts); // Obtener todas las publicaciones
router.get("/:id", getPostById); // Obtener una publicación por ID
router.get("/user/:userId", getPostsByUserId); // Obtener publicaciones por ID de usuario
router.get("/:id/related", getRelatedPosts);

// Rutas protegidas
router.post(
  "/",
  authMiddleware,
  upload.single("media"),
  uploadToCloudinary,
  createPost
); // Crear una nueva publicación
router.put(
  "/:id",
  authMiddleware,
  upload.single("media"),
  uploadToCloudinary,
  updatePost
); // Actualizar una publicación
router.delete("/:id", authMiddleware, deletePost); // Eliminar una publicación
router.post("/:id/like", authMiddleware, likePost); // Dar me gusta a una publicación
router.post("/:id/comment", authMiddleware, commentOnPost); // Comentar en una publicación

export default router;

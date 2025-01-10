import express from "express";
import {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvent,
  getEvents,
  getEventsByUser,
  joinEvent,
  leaveEvent,
  getEventsByDate,
  getEventsByLocation,
  getEventsByTitle,
  getEventsByDescription,
  likeEvent,
  commentOnEvent,
  getRelatedEvents,
} from "../controllers/eventController.js";
import authMiddleware from "../middleware/authMiddleware.js";

import upload, { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Definir las rutas
router
  .route("/")
  .post(authMiddleware, upload.single("image"), uploadToCloudinary, createEvent) // Middleware para cargar imagen en la creación
  .get(getEvents);

router.route("/user/:userId").get(authMiddleware, getEventsByUser);
router.route("/date").get(getEventsByDate);
router.route("/location").get(getEventsByLocation);
router.route("/title").get(getEventsByTitle);
router.route("/description").get(getEventsByDescription);
router.route("/:id/related").get(getRelatedEvents);

router
  .route("/:id")
  .get(getEvent)
  .put(authMiddleware, upload.single("image"), uploadToCloudinary, updateEvent) // Middleware para cargar imagen en la actualización
  .delete(authMiddleware, deleteEvent);

// Cambiar a POST para unirse y salir del evento
router.route("/:id/join").post(authMiddleware, joinEvent); // Middleware de autenticación + lógica para unirse

router.route("/:id/leave").post(authMiddleware, leaveEvent);

router.route("/:id/like").post(authMiddleware, likeEvent);
router.route("/:id/comment").post(authMiddleware, commentOnEvent);

// Exportar el router
export default router;

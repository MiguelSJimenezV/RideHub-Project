import Event from "../models/Event.js";
import cloudinary from "../config/cloudinary.js";

// Crear evento
export const createEvent = async (req, res) => {
  const { title, description, date, location, latitude, longitude, category } =
    req.body;
  const imagePath = req.file ? req.file.path : null; // Ruta de la imagen si se ha subido una
  const image = req.uploadedFile; // Obtiene la respuesta de Cloudinary

  try {
    const event = await Event.create({
      title,
      description,
      date,
      location,
      latitude,
      longitude,
      category,
      image: image ? image.secure_url : imagePath,
      creator: req.user.id, // Guardamos la ruta de la imagen en el campo "image"
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el evento" });
  }
};

// Actualizar evento
export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, location, latitude, longitude, category } =
    req.body;
  const imagePath = req.file ? req.file.path : null;
  const image = req.uploadedFile; // Obtiene la respuesta de Cloudinary

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;
    event.latitude = latitude || event.latitude;
    event.longitude = longitude || event.longitude;
    event.category = category || event.category;
    event.image = image ? image.secure_url : imagePath || event.image;

    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el evento" });
  }
};

// Eliminar evento
export const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    res.json({ message: "Evento eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el evento" });
  }
};

// Obtener un evento
export const getEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = await Event.findById(eventId)
      .populate("creator")
      .populate("comments.user", "-password"); // Suponiendo que tienes un modelo 'Event'
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener todos los eventos
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("participants", "name email")
      .populate("creator", "-password")
      .populate("comments.user", "username photo role");
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos" });
  }
};

// Obtener eventos por usuario
export const getEventsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const events = await Event.find({ creator: userId }).populate(
      "participants",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos del usuario" });
  }
};

// Unirse a un evento
// Controlador de evento
// Inscribirse en un evento
export const joinEvent = async (req, res) => {
  const { id } = req.params; // Obtén el ID del evento desde la URL
  const userId = req.user.id; // Obtén el ID del usuario autenticado

  try {
    // Busca el evento en la base de datos
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Verifica si el usuario ya está inscrito en el evento
    if (event.participants.includes(userId)) {
      return res
        .status(400)
        .json({ message: "Ya estás inscrito en este evento" });
    }

    // Asegúrate de que participants sea un array
    if (!Array.isArray(event.participants)) {
      event.participants = []; // Si no es un array, inicialízalo como un array vacío
    }

    // Agrega al usuario a la lista de participantes
    event.participants.push(userId);
    await event.save(); // Guarda los cambios en la base de datos

    // Responde con el evento actualizado y el mensaje de éxito
    res.status(200).json({ message: "Inscripción exitosa", event });
  } catch (err) {
    console.error("Error al inscribirse:", err);
    res.status(500).json({ message: "Error al inscribirse en el evento" });
  }
};

export const leaveEvent = async (req, res) => {
  const { id } = req.params; // Obtén el ID del evento desde la URL

  try {
    // Busca el evento en la base de datos
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Asegúrate de que el usuario esté autenticado y tenga un ID
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }

    // Verifica si el usuario está inscrito en el evento
    if (!event.participants.includes(req.user.id)) {
      return res
        .status(400)
        .json({ error: "No estás inscrito en este evento" });
    }

    // Elimina al usuario de la lista de participantes
    event.participants = event.participants.filter(
      (userId) => userId.toString() !== req.user.id
    );

    await event.save(); // Guarda los cambios en la base de datos

    // Responde con un mensaje de éxito y el evento actualizado
    res
      .status(200)
      .json({ message: "Has abandonado el evento exitosamente", event });
  } catch (error) {
    console.error("Error al abandonar el evento:", error);
    res.status(500).json({ error: "Error al abandonar el evento" });
  }
};

// Obtener eventos por fecha
export const getEventsByDate = async (req, res) => {
  const { date } = req.params;

  try {
    const events = await Event.find({ date }).populate(
      "participants",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos por fecha" });
  }
};

// Obtener eventos por ubicación
export const getEventsByLocation = async (req, res) => {
  const { location } = req.params;

  try {
    const events = await Event.find({ location }).populate(
      "participants",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los eventos por ubicación" });
  }
};

// Obtener eventos por título
export const getEventsByTitle = async (req, res) => {
  const { title } = req.params;

  try {
    const events = await Event.find({ title }).populate(
      "participants",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los eventos por título" });
  }
};

// Obtener eventos por descripción
export const getEventsByDescription = async (req, res) => {
  const { description } = req.params;

  try {
    const events = await Event.find({ description }).populate(
      "participants",
      "name email"
    );
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener los eventos por descripción" });
  }
};

export const likeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Verificar si el usuario ya ha dado like
    const userIndex = event.likes.indexOf(req.user.id);

    if (userIndex !== -1) {
      // Si el usuario ya ha dado like, lo quitamos
      event.likes.splice(userIndex, 1); // Quita el like
      await event.save();
      return res.status(200).json(event); // Devuelve el post actualizado
    } else {
      // Si el usuario no ha dado like, lo agregamos
      event.likes.push(req.user.id);
      await event.save();
      return res.status(200).json(event); // Devuelve el event actualizado
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al dar me gusta a la publicación",
      error: error.message,
    });
  }
};

export const commentOnEvent = async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "El contenido del comentario no puede estar vacío" });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    event.comments.push({ user: req.user.id, content });
    await event.save();
    await event.populate("comments.user", "username photo role"); // Poblamos el usuario del comentario

    // Devuelve el event actualizado, pero puedes ajustar esto según lo que necesites
    res.status(201).json({
      eventId: event._id,
      comments: event.comments,
    });
  } catch (error) {
    console.error("Error al comentar en la publicación:", error);
    res.status(500).json({
      message: "Error al comentar en la publicación",
      error: error.message,
    });
  }
};

export const getRelatedEvents = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const relatedEvents = await Event.find({
      _id: { $ne: event._id }, // Excluir la publicación actual
      category: event.category, // Buscar por la misma categoría
    })
      .limit(5) // Limitar el número de publicaciones relacionadas
      .populate("creator", "fullName username photo"); // Poblamos los datos del creador

    res.status(200).json(relatedEvents);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener publicaciones relacionadas",
      error: error.message,
    });
  }
};

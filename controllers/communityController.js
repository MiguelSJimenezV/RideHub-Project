import Community from "../models/Community.js";
import Chat from "../models/Chat.js";
import User from "../models/User.js";

// Crear una nueva comunidad
export const createCommunity = async (req, res) => {
  try {
    const { name, description, creator } = req.body;
    const media = req.file ? req.file.path : null;
    const image = req.uploadedFile; // Obtiene la respuesta de Cloudinary

    if (!name || !description || !creator)
      return res.status(400).json({ message: "Missing required fields" });

    if (media && !media.match(/\.(jpg|jpeg|png|gif)$/))
      return res.status(400).json({ message: "Invalid media file" });

    console.log(req.body);

    const newCommunity = new Community({
      name,
      description,
      media: image ? image.secure_url : media,
      creator,
      members: [creator],
    });

    // Crear el chat de la comunidad
    const newChat = new Chat({
      communityId: newCommunity._id,
      creator,
    });

    await newChat.save();
    newCommunity.chatId = newChat._id;
    await newCommunity.save();

    res.status(201).json(newCommunity);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating community", error: err.message });
  }
};

// Ver todas las comunidades
export const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find()
      .populate("creator", "-password")
      .populate("members", "name");
    res.status(200).json(communities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching communities", error: err.message });
  }
};

// Ver una comunidad
export const getCommunityById = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId)
      .populate("creator", "-password")
      .populate("members", "-password")
      .populate("chatId");
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    res.status(200).json(community);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching community", error: err.message });
  }
};

export const getCommunityByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const communities = await Community.find({ creator: userId });
    res.status(200).json(communities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching community", error: err.message });
  }
};

// Actualizar una comunidad

export const updateCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const { name, description } = req.body;
    const media = req.file ? req.file.path : null;
    const image = req.uploadedFile; // Obtiene la respuesta de Cloudinary

    console.log(req.body);

    if (!name || !description)
      return res
        .status(400)
        .json({ message: "Missing required fields", name, description });

    if (media && !media.match(/\.(jpg|jpeg|png|gif)$/))
      return res.status(400).json({ message: "Invalid media file" });

    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    community.name = name;
    community.description = description;
    if (image || media) {
      community.media = image ? image.secure_url : media;
    }

    await community.save();
    res.status(200).json(community);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating community", error: err.message });
  }
};

export const deleteCommunity = async (req, res) => {
  const { communityId } = req.params;
  try {
    const community = await Community.findByIdAndDelete(communityId);
    if (!community) {
      return res.status(404).send({ message: "Comunidad no encontrada" });
    }
    res.send({ message: "Comunidad eliminada exitosamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar la Comunidad", error });
  }
};

// Unirse a una comunidad
export const joinCommunity = async (req, res) => {
  try {
    const { communityId, userId } = req.body;

    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    // Verificar si el usuario ya es miembro
    if (community.members.includes(userId)) {
      return res
        .status(200)
        .json({ message: "User already a member", community });
    }

    // Agregar al usuario como miembro
    community.members.push(userId);
    await community.save();

    res.status(200).json({ message: "User joined successfully", community });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error joining community", error: err.message });
  }
};

// Dejar una comunidad
export const leaveCommunity = async (req, res) => {
  try {
    const { communityId, userId } = req.body;

    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    if (!community.members.includes(userId)) {
      return res.status(400).json({ message: "User not in the community" });
    }

    community.members = community.members.filter((member) => member != userId);
    await community.save();

    res.status(200).json(community);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error leaving community", error: err.message });
  }
};

// Enviar un mensaje en el chat de la comunidad
export const sendCommunityMessage = async (req, res) => {
  try {
    const { communityId, content, sender } = req.body;

    console.log(sender);
    if (!communityId || !content || !sender) {
      return res
        .status(400)
        .json({ message: "communityId, content, y sender son obligatorios" });
    }

    if (typeof sender !== "string") {
      return res.status(400).json({ message: "Sender debe ser un ID válido" });
    }

    const community = await Community.findById(communityId);
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    const chat = await Chat.findOne({ communityId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    const newMessage = {
      communityId,
      sender,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(200).json(newMessage);
  } catch (err) {
    console.error("Error enviando mensaje:", err);
    res
      .status(500)
      .json({ message: "Error sending message", error: err.message });
  }
};

// Obtener los mensajes del chat de la comunidad
export const getCommunityMessages = async (req, res) => {
  try {
    const { communityId } = req.params;
    const chat = await Chat.findOne({ communityId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat.messages);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
};

// Obtener el chatId de la comunidad
export const getChatId = async (req, res) => {
  try {
    const { communityId } = req.params;
    const chat = await Chat.findOne({ communityId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.status(200).json(chat._id);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching chatId", error: err.message });
  }
};

// Obtener las comunidades de un usuario
export const getUserCommunities = async (req, res) => {
  try {
    const userId = req.user.id;
    const communities = await Community.find({ members: userId });
    res.status(200).json(communities);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user communities", error: err.message });
  }
};

// Obtener los miembros de una comunidad
export const getCommunityMembers = async (req, res) => {
  try {
    const { communityId } = req.params;
    const community = await Community.findById(communityId).populate("members");
    if (!community)
      return res.status(404).json({ message: "Community not found" });

    res.status(200).json(community.members);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching community members",
      error: err.message,
    });
  }
};

// Obtener las comunidades creadas por un usuario
export const getUserCreatedCommunities = async (req, res) => {
  try {
    const userId = req.user.id;
    const communities = await Community.find({ creator: userId });
    res.status(200).json(communities);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching user created communities",
      error: err.message,
    });
  }
};

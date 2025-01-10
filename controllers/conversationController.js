import Conversation from "../models/Conversation.js";
// controllers/chatController.js
export const getOrCreateConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;

  console.log("senderId:", senderId);
  console.log("receiverId:", receiverId);

  try {
    // Ordenar los participantes para evitar diferencias en el orden
    const participants = [senderId, receiverId].sort();

    // Buscar si ya existe una conversación con los dos participantes
    let conversation = await Conversation.findOne({
      participants: { $all: participants, $size: 2 },
    });

    // Si no existe, crear una nueva
    if (!conversation) {
      console.log("Creando nueva conversación...");

      conversation = new Conversation({
        participants: participants,
      });

      await conversation.save();
      console.log("Conversación creada:", conversation);
    } else {
      console.log("Conversación existente encontrada:", conversation);
    }

    // Responder con la conversación
    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error al obtener o crear la conversación:", error);
    res.status(500).json({
      message: "Error al obtener o crear la conversación",
      error: error.message,
    });
  }
};

export const getConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    // Busca todas las conversaciones donde el usuario esté en el campo 'participants'
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    }).populate("participants", "-password");

    // Extrae todos los participantes de las conversaciones
    const participants = conversations.map((c) => c.participants).flat();

    // Filtra los participantes para eliminar el ID del usuario actual y asegurarte de que solo se muestren usuarios únicos
    const uniqueParticipants = [
      ...new Set(participants.filter((id) => id !== userId)),
    ];

    res.status(200).json(uniqueParticipants);
  } catch (error) {
    console.error("Error retrieving users with conversations:", error);
    res
      .status(500)
      .json({ message: "Error retrieving users with conversations", error });
  }
};

export const getConversationById = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error retrieving conversation:", error);
    res.status(500).json({ message: "Error retrieving conversation", error });
  }
};

export const getUsersWithConversations = async (req, res) => {
  const { userId } = req.params;

  try {
    const conversations = await Conversation.findById({
      participants: { $in: [userId] },
    });

    const participants = conversations.map((c) => c.participants).flat();

    const uniqueParticipants = [...new Set(participants)];

    res.status(200).json(uniqueParticipants);
  } catch (error) {
    console.error("Error retrieving users with conversations:", error);
    res
      .status(500)
      .json({ message: "Error retrieving users with conversations", error });
  }
};

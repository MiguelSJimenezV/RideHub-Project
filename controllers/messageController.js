import Message from "../models/Message.js";

export const getMessagesByConversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId }).sort({
      createdAt: 1,
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los mensajes" });
  }
};

export const sendMessage = async (req, res) => {
  const { conversationId, sender, receiver, content } = req.body;

  try {
    const message = new Message({ conversationId, sender, receiver, content });
    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Error al enviar el mensaje" });
  }
};

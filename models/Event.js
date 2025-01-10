import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: Object, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Asegúrate de que el modelo de usuario esté definido
      required: true,
    },
    image: { type: String }, // Cambiado para que no sea obligatorio
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Asegúrate de que el modelo de usuario esté definido
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User", // Asegúrate de que el modelo de usuario esté definido
        },
        content: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

export default mongoose.model("Event", eventSchema);

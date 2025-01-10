import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    location: { type: String },
    bio: { type: String, unique: false },
    bikeDetails: {
      brand: { type: String },
      model: { type: String },
      year: { type: String },
      licensePlate: { type: String },
    },
    role: { type: String, default: "user" },
    photo: { type: String },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }], // Referencia a las publicaciones del usuario
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }], // Referencia a los eventos del usuario
    communities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Community" }], // Referencia a las comunidades del usuario
    createdAt: { type: Date, default: Date.now }, // Fecha de creación
    updatedAt: { type: Date, default: Date.now }, // Fecha de última actualización
    token: {
      type: String,
    },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
  }
);

export default mongoose.model("User", userSchema);

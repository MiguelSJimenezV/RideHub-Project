import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    taggedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Asegúrate de que el modelo de usuario esté definido
      },
    ],
    media: {
      type: String,
      default: null,
    },
    category: {
      type: String,
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Asegúrate de que el modelo de usuario esté definido
      required: true,
    },
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
  { timestamps: true }
); // Agrega timestamps para createdAt y updatedAt

const Post = mongoose.model("Post", postSchema);
export default Post;

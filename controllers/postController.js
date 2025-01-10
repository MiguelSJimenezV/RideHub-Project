import Post from "../models/Post.js";

export const createPost = async (req, res) => {
  const { description, location, category, taggedUsers } = req.body; // Eliminar media de aquí
  const media = req.file ? req.file.path : null; // Obtener el archivo subido
  const image = req.uploadedFile; // Obtiene la respuesta de Cloudinary

  try {
    const newPost = new Post({
      description,
      location,
      category,
      taggedUsers: taggedUsers
        ? taggedUsers.split(",").map((user) => user.trim())
        : [],
      media: image ? image.secure_url : media, // Actualiza la media con la URL de Cloudinary
      creator: req.user.id, // Asegúrate de tener el ID del creador
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Publicación creada exitosamente", post: newPost });
  } catch (error) {
    console.error("Error al crear la publicación:", error); // Loguear el error
    res.status(500).json({ message: "Error al crear la publicación", error });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("creator", "fullName username photo role")
      .sort({ createdAt: -1 }); // Ordenamos por fecha de creación (más recientes primero)

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener publicaciones." });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("creator", "fullName username photo role")
      .populate("taggedUsers", "fullName username photo")
      .populate("comments.user", "fullName username photo role");

    if (!post) {
      console.log(`Publicación no encontrada para el ID: ${req.params.id}`);
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error al buscar la publicación:", error);
    res.status(500).json({ message: "Error al obtener la publicación." });
  }
};

export const getPostsByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const posts = await Post.find({ creator: userId });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { description, location, taggedUsers } = req.body;
    const image = req.uploadedFile;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        description,
        location,
        taggedUsers,
        category: req.body.category,
        media: image ? image.secure_url : req.body.media,
      },
      { new: true } // Devuelve el documento actualizado
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Publicación no encontrada." });
    }

    res.status(200).json({
      message: "Publicación actualizada exitosamente.",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        message: "Error al actualizar la publicación.",
        error: error.message,
      });
  }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).send({ message: "Publicación no encontrada" });
    }
    res.send({ message: "Publicación eliminada exitosamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al eliminar la publicación" });
  }
};

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    // Verificar si el usuario ya ha dado like
    const userIndex = post.likes.indexOf(req.user.id);

    if (userIndex !== -1) {
      // Si el usuario ya ha dado like, lo quitamos
      post.likes.splice(userIndex, 1); // Quita el like
      await post.save();
      return res.status(200).json(post); // Devuelve el post actualizado
    } else {
      // Si el usuario no ha dado like, lo agregamos
      post.likes.push(req.user.id);
      await post.save();
      return res.status(200).json(post); // Devuelve el post actualizado
    }
  } catch (error) {
    res.status(500).json({
      message: "Error al dar me gusta a la publicación",
      error: error.message,
    });
  }
};

export const commentOnPost = async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res
      .status(400)
      .json({ message: "El contenido del comentario no puede estar vacío" });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    post.comments.push({ user: req.user.id, content });
    await post.save();
    await post.populate("comments.user", "username photo role"); // Poblamos el usuario del comentario

    // Devuelve el post actualizado, pero puedes ajustar esto según lo que necesites
    res.status(201).json({
      postId: post._id,
      comments: post.comments,
    });
  } catch (error) {
    console.error("Error al comentar en la publicación:", error);
    res.status(500).json({
      message: "Error al comentar en la publicación",
      error: error.message,
    });
  }
};

export const getRelatedPosts = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Publicación no encontrada" });
    }

    const relatedPosts = await Post.find({
      _id: { $ne: post._id }, // Excluir la publicación actual
      category: post.category, // Buscar por la misma categoría
    })
      .limit(5) // Limitar el número de publicaciones relacionadas
      .populate("creator", "fullName username photo"); // Poblamos los datos del creador

    res.status(200).json(relatedPosts);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener publicaciones relacionadas",
      error: error.message,
    });
  }
};

// controllers/userController.js
import User from "../models/User.js";

// Obtener todos los usuarios|
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    // Excluye la contraseña

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .populate("posts") // Poblamos las publicaciones del usuario
      .populate("followers") // Poblamos los seguidores
      .populate("following")
      .populate("role"); // Poblamos los seguidos

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const userData = {
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      location: user.location,
      bikeDetails: user.bikeDetails,
      photo: user.photo,
      followers: user.followers,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
      role: user.role,
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error al obtener el usuario por ID:", error);
    res.status(500).json({ message: "Error al obtener el usuario" });
  }
};
export const getUserByUsername = async (req, res) => {
  const { username } = req.params; // Obtiene el término de búsqueda desde los parámetros de la ruta

  try {
    // Expresión regular para buscar coincidencias parciales e insensibles a mayúsculas
    const regex = new RegExp(username, "i");

    // Busca usuarios cuyos nombres de usuario coincidan parcialmente
    const users = await User.find({ username: regex }).select("-password");

    if (!users || users.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron usuarios relacionados" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error(
      "Error al buscar usuarios por coincidencia de nombre de usuario:",
      error
    );
    res.status(500).json({ message: "Error al buscar usuarios" });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.User.id; // ID del usuario autenticado

  try {
    const user = await User.findById(userId)
      .populate("posts") // Poblamos las publicaciones del usuario
      .populate("followers") // Poblamos los seguidores
      .populate("following")
      .populate("isFollowing"); // Poblamos los seguidos

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isFollowing = user.followers.includes(userId);

    const userProfile = {
      fullName: user.fullName,
      username: user.username,
      bio: user.bio,
      photo: user.photo,
      followers: user.followers,
      following: user.following,
      followersCount: user.followers.length,
      followingCount: user.following.length,
      posts: user.posts,
      isFollowing,
    };

    res.status(200).json(userProfile);
  } catch (error) {
    console.error("Error al obtener el perfil del usuario:", error);
    res.status(500).json({ message: "Error al obtener el perfil del usuario" });
  }
};

export const addUserToGroup = async (req, res) => {
  const { groupId, userId } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    if (group.members.includes(userId)) {
      return res
        .status(400)
        .json({ message: "El usuario ya está en el grupo" });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json({ message: "Usuario agregado al grupo exitosamente" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al agregar usuario al grupo", error });
  }
};

export const followUser = async (req, res) => {
  const { userId } = req.params; // ID del usuario que se quiere seguir
  const id = req.user.id; // ID del usuario autenticado (desde el token)

  console.log("userId", userId);
  console.log("id", id);
  try {
    // Buscar ambos usuarios en la base de datos
    const userToFollow = await User.findById(userId); // Usuario que se va a seguir
    const currentUser = await User.findById(id); // Usuario autenticado

    console.log("userToFollow", userToFollow);
    console.log("currentUser", currentUser);

    // Verificar que ambos usuarios existan
    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si ya se está siguiendo al usuario
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "Ya sigues a este usuario" });
    }

    // Agregar el ID del usuario a seguir a la lista de "following" del usuario autenticado
    currentUser.following.push(userId);

    // Agregar el ID del usuario autenticado a la lista de "followers" del usuario que se sigue
    userToFollow.followers.push(id);

    // Guardar los cambios en la base de datos
    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Has comenzado a seguir a este usuario" });
  } catch (error) {
    console.error("Error al seguir al usuario:", error);
    res.status(500).json({ message: "Error al seguir al usuario" });
  }
};

export const unfollowUser = async (req, res) => {
  const { userId } = req.params; // ID del usuario que se quiere dejar de seguir
  const id = req.user.id; // ID del usuario que deja de seguir

  try {
    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(id);

    console.log("userToUnfollow", userToUnfollow.username);
    console.log("currentUser", currentUser.username);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!currentUser.following.includes(userId)) {
      return res.status(400).json({ message: "No sigues a este usuario" });
    }

    currentUser.following.pull(userId);
    userToUnfollow.followers.pull(id);

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: "Has dejado de seguir a este usuario" });
  } catch (error) {
    console.error("Error al dejar de seguir al usuario:", error);
    res.status(500).json({ message: "Error al dejar de seguir al usuario" });
  }
};

import cloudinary from "../config/cloudinary.js";
import multer from "multer";

// Configuración de Multer para procesar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware para subir archivos a Cloudinary
export const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) {
    return next(); // Si no hay archivo, pasa al siguiente middleware
  }

  try {
    // Subir el archivo a Cloudinary usando el buffer
    cloudinary.uploader
      .upload_stream(
        {
          folder: "ridehub", // Carpeta en Cloudinary
        },
        (error, result) => {
          if (error) {
            return next(error); // Si ocurre un error, lo pasa al siguiente middleware
          }

          // Guarda la respuesta de Cloudinary en el objeto de solicitud
          req.uploadedFile = result;
          return next(); // Pasa al siguiente middleware
        }
      )
      .end(req.file.buffer); // Usa el buffer para subir el archivo
  } catch (error) {
    return next(error); // Si hay un error, lo pasa al siguiente middleware
  }
};

export default upload;

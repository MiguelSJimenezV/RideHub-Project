# Proyecto Backend

## Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías Usadas](#tecnologías-usadas)
- [Instalación](#instalación)
- [Uso](#uso)
- [Rutas de la API](#rutas-de-la-api)
- [Variables de Entorno](#variables-de-entorno)

## Descripción

Este proyecto es un servidor backend construido con Express.js para manejar solicitudes API y gestionar datos. Incluye autenticación de usuarios, gestión de eventos, funcionalidades de comunidad y mensajería en tiempo real.

## Características

- Autenticación de usuarios (basada en JWT)
- Operaciones CRUD para usuarios, publicaciones, eventos y comunidades
- Subida de archivos (usando Multer)
- Mensajería en tiempo real (Socket.IO)
- Integración con Cloudinary para almacenamiento de medios
- MongoDB como base de datos con Mongoose ORM

## Tecnologías Usadas

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **Socket.IO**
- **Cloudinary**
- **Multer**
- **bcryptjs**
- **jsonwebtoken**
- **dotenv**
- **CORS**

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository_url>
   cd backend
   ```
2. Instalar las dependencias:
   ```bash
   npm install
   ```
3. Crear un archivo `.env` en el directorio raíz con las variables de entorno necesarias (ver [Variables de Entorno](#variables-de-entorno)).

## Uso

### Modo Desarrollo

Ejecuta el servidor en modo desarrollo con recarga automática:

```bash
npm run dev
```

### Modo Producción

Inicia el servidor en producción:

```bash
npm start
```

## Rutas de la API

### Autenticación

- **POST** `/api/auth/register`: Registrar un nuevo usuario
- **POST** `/api/auth/login`: Iniciar sesión de un usuario existente
- **GET** `/api/auth/verify`: Verificar token de autenticación
- **GET** `/api/auth/profile`: Obtener perfil de usuario autenticado
- **PUT** `/api/auth/profile`: Actualizar perfil del usuario autenticado
- **DELETE** `/api/auth/profile/:userId`: Eliminar cuenta de usuario

### Usuarios

- **GET** `/api/users`: Obtener todos los usuarios
- **GET** `/api/users/:id`: Obtener un usuario específico por ID
- **GET** `/api/users/search/:username`: Buscar usuario por nombre de usuario
- **GET** `/api/users/profile/:username`: Obtener perfil de usuario por nombre de usuario
- **POST** `/api/users/group/addUser`: Añadir usuario a un grupo
- **POST** `/api/users/follow/:userId`: Seguir a un usuario
- **POST** `/api/users/unfollow/:userId`: Dejar de seguir a un usuario

### Publicaciones

- **GET** `/api/posts`: Obtener todas las publicaciones
- **GET** `/api/posts/:id`: Obtener una publicación por ID
- **GET** `/api/posts/user/:userId`: Obtener publicaciones por ID de usuario
- **GET** `/api/posts/:id/related`: Obtener publicaciones relacionadas
- **POST** `/api/posts`: Crear una nueva publicación
- **PUT** `/api/posts/:id`: Actualizar una publicación
- **DELETE** `/api/posts/:id`: Eliminar una publicación
- **POST** `/api/posts/:id/like`: Dar me gusta a una publicación
- **POST** `/api/posts/:id/comment`: Comentar en una publicación

### Eventos

- **GET** `/api/events`: Obtener todos los eventos
- **GET** `/api/events/user/:userId`: Obtener eventos por usuario
- **GET** `/api/events/date`: Obtener eventos por fecha
- **GET** `/api/events/location`: Obtener eventos por ubicación
- **GET** `/api/events/title`: Obtener eventos por título
- **GET** `/api/events/description`: Obtener eventos por descripción
- **GET** `/api/events/:id/related`: Obtener eventos relacionados
- **POST** `/api/events`: Crear un nuevo evento
- **PUT** `/api/events/:id`: Actualizar un evento
- **DELETE** `/api/events/:id`: Eliminar un evento
- **POST** `/api/events/:id/join`: Unirse a un evento
- **POST** `/api/events/:id/leave`: Salir de un evento
- **POST** `/api/events/:id/like`: Dar me gusta a un evento
- **POST** `/api/events/:id/comment`: Comentar en un evento

### Comunidades

- **GET** `/api/communities`: Obtener todas las comunidades
- **GET** `/api/communities/:communityId`: Obtener una comunidad por ID
- **GET** `/api/communities/user/:userId`: Obtener comunidades por usuario
- **POST** `/api/communities`: Crear una nueva comunidad
- **PUT** `/api/communities/:communityId`: Actualizar una comunidad
- **DELETE** `/api/communities/:communityId`: Eliminar una comunidad
- **POST** `/api/communities/join`: Unirse a una comunidad
- **POST** `/api/communities/leave`: Salir de una comunidad
- **POST** `/api/communities/messages`: Enviar un mensaje a la comunidad
- **GET** `/api/communities/:communityId/messages`: Obtener mensajes de la comunidad
- **GET** `/api/communities/:communityId/members`: Obtener miembros de la comunidad

### Mensajes

- **GET** `/api/messages/:conversationId`: Obtener mensajes por ID de conversación
- **POST** `/api/messages`: Enviar un nuevo mensaje

### Conversaciones

- **POST** `/api/conversations`: Crear o obtener una conversación
- **GET** `/api/conversations/:userId`: Obtener conversaciones por usuario
- **GET** `/api/conversations/:conversationId`: Obtener una conversación por ID

## Variables de Entorno

Las siguientes variables de entorno son necesarias para ejecutar este proyecto:

- `MONGO_URI`: Cadena de conexión a MongoDB
- `JWT_SECRET`: Clave secreta para JWT
- `CLOUDINARY_CLOUD_NAME`: Nombre de la cuenta de Cloudinary
- `CLOUDINARY_API_KEY`: Clave API de Cloudinary
- `CLOUDINARY_API_SECRET`: Secreto API de Cloudinary
- `PORT`: Número del puerto (por defecto: 5000)

## Estructura del Directorio

```plaintext
backend/
├── config/
│   └── db.js        # Configuración de la conexión a la base de datos
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── postRoutes.js
│   ├── eventRoutes.js
│   ├── messageRoutes.js
│   └── communityRoutes.js
├── uploads/          # Directorio para las subidas de archivos
├── .env              # Variables de entorno
├── server.js         # Archivo principal del servidor
└── package.json
```

## Contribución

¡Las contribuciones son bienvenidas! Si deseas colaborar, por favor:

1. Realiza un fork del repositorio.
2. Crea una rama para tu feature/bugfix:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza tus cambios y realiza un commit:
   ```bash
   git commit -m "Añadida nueva funcionalidad"
   ```
4. Envía un pull request.

---

**Desarrollado por Miguel Jiménez**

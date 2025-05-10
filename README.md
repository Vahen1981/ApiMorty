# ApiMorty

API RESTful para la gestión de usuarios y consumo de datos de personajes de Rick and Morty. Desarrollada con Node.js, Express y TypeScript, utilizando MongoDB como base de datos y desplegada en Render.

## 🚀 URL Base

```
https://apimorty.onrender.com
```

## 📦 Tecnologías Utilizadas

- Node.js
- Express
- TypeScript
- MongoDB (Mongoose)
- JWT para autenticación
- BcryptJS para hashing de contraseñas
- Axios para consumo de APIs externas
- Dotenv para manejo de variables de entorno

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── db.ts               # Configuración de la base de datos
├── controllers/
│   └── UserController.ts   # Lógica de negocio para usuarios
├── middleware/
│   └── Auth.ts             # Middleware de autenticación
├── models/
│   └── User.ts             # Modelo de usuario
├── routes/
│   └── UserRoutes.ts       # Rutas relacionadas a usuarios
└── server.ts               # Punto de entrada de la aplicación
```

## 📄 Endpoints

### Usuarios

- **POST** `/api/users/register-user`\
  Registra un nuevo usuario.

  **Body:**

  ```json
  {
    "name": "nombre_usuario",
    "lastName": "apellido",
    "email": "correo@example.com",
    "password": "contraseña"
  }
  ```

- **POST** `/api/users/login`\
  Inicia sesión y devuelve un token JWT.

  **Body:**

  ```json
  {
    "email": "correo@example.com",
    "password": "contraseña_segura"
  }
  ```

- **GET** `/api/users/verify`\
  Verifica usuario con el token JWT.

  **Headers:**
  ```
  Authorization: Bearer <token_jwt>
  ```


### Rick and Morty

La api sirve de proxy a la api publica de Rick And Morty, los endpoints son los mismos que allí se documentan, pero reemplazando la url base "https://rickandmortyapi.com/api" por "https://apimorty.onrender.com/api/rickandmorty/".
Documentación oficial de la api en: https://rickandmortyapi.com/documentation/#rest


## 🔐 Autenticación

Esta API utiliza JWT para proteger rutas. Para acceder a rutas protegidas, incluye el token en el encabezado de autorización:

```
Authorization: Bearer <token_jwt>
```

## 🛠️ Instalación y Uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Vahen1981/ApiMorty.git
   cd ApiMorty
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno en un archivo `.env`:

   ```
   MONGO_URI=tu_uri_de_mongodb
   JWT_SECRET=tu_secreto_jwt
   ```

4. Compila el proyecto:

   ```bash
   npm run build
   ```

5. Inicia el servidor:

   ```bash
   npm start
   ```

## 🧰 Pruebas

Para ejecutar el servidor en modo desarrollo con recarga automática:

```bash
nodemon
```


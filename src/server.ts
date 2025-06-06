import express, { Request, Response, Application } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userRouter from './routes/UserRoutes';
import cors from 'cors';
//En caso de que solo usuarios registrados puedan acceder a las rutas de la api original se puede importar el
//middleware aquí, y reemplazar la primera línea de la función que conecta a la api de Rick and Morty (señalada abajo)
//import Authorization from './middleware/Auth'; 

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


connectDB();

app.use('/api/users', userRouter);


//Función para conectar directamente con la base url de la api.
//Todas las solicitudes que se hagan serán las mismas que aparecen en la documentación de la api,
//pero la url base ya no será "https://rickandmortyapi.com/api", sino que será "http://localhost:8000/api/rickandmorty/",
//o bien cambiando el localhost:8000 por el sitio donde se despliegue.
//Si se quiere proteger todas las rutas que conectan a la api original (para testear los privilegio de usuario)
//se puede reemplazar la primera línea por:
//app.use('/api/rickandmorty', Authorization, async (req: Request, res: Response) => {
app.use('/api/rickandmorty', async (req: Request, res: Response) => {
  const apiPath = req.originalUrl.replace('/api/rickandmorty', '');
  const url = `https://rickandmortyapi.com/api${apiPath}`;
  
  try {
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error: any) {
    if (error.response) {
      res.status(error.response.status).json({
        success: false,
        error: error.response.data.error || 'Error en la API de Rick and Morty',
        status: error.response.status,
        url: url 
      });
    } else if (error.request) {
      res.status(503).json({ 
        success: false,
        error: 'El servicio no está disponible en este momento',
        message: 'No se recibió respuesta del servidor de Rick and Morty'
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor',
        message: 'Ocurrió un error inesperado al procesar tu solicitud'
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

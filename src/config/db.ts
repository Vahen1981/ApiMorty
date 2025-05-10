import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI no está definido en el archivo .env");
    }

    await mongoose.connect(process.env.MONGODB_URI, {});
    console.log('Conectado a la base de datos...');
  } catch (error: any) {
    console.error('Error al conectar a la base de datos', error.message);
    process.exit(1);
  }
}

export default connectDB;

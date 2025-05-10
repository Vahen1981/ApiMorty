import { Request, Response, RequestHandler } from 'express';
import User from '../models/User';
import bcryptjs from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';

// Interfaz para el cuerpo de la solicitud en los métodos
interface RegisterRequestBody {
  name: string;
  lastName: string;
  email: string;
  topic: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

interface AuthenticatedRequest extends Request {
    user: {
      id: string;
    };
  }

// Register User Admin
export const registerUser: RequestHandler = async (req: Request<{}, {}, RegisterRequestBody>, res: Response): Promise<void> => {
  const { name, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Este correo ya está registrado' });
      return;
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const createdUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
    });

    const accessToken = jsonwebtoken.sign(
      { user: { id: createdUser._id } },
      process.env.SECRET as string,
      { expiresIn: '4h' }
    );

    await createdUser.save();

    res.status(201).json({
      token: accessToken,
      id: createdUser._id,
      name: createdUser.name,
      lastName: createdUser.lastName,
      email: createdUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear usuario' });
  }
};

// Login User Admin
export const userLogin: RequestHandler = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      res.status(400).json({ message: 'El usuario o la contraseña no corresponde' });
      return;
    }

    const rightPassword = await bcryptjs.compare(password, registeredUser.password);
    if (!rightPassword) {
      res.status(400).json({ message: 'El usuario o la contraseña no corresponde' });
      return;
    }

    const payload = { user: { id: registeredUser._id } };
    const accessToken = jsonwebtoken.sign(payload, process.env.SECRET as string, { expiresIn: '4h' });

    await registeredUser.save();

    res.json({
      token: accessToken,
      id: registeredUser._id,
      name: registeredUser.name,
      lastName: registeredUser.lastName,
      email: registeredUser.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Verify User Admin
export const userVerify: RequestHandler = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    const { user } = req as Request & { user: { id: string } };
  
    try {
      const userVerified = await User.findById(user.id).select('-password');
      if (!userVerified) {
        res.status(404).json({ message: 'Usuario no encontrado' });
        return;
      }
      res.json({ userVerified });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al verificar el usuario' });
    }
  };


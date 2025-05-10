import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  user: {
    id: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: JwtPayload['user'];
}

const Authorization = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ message: 'Acceso no autorizado' });
    return;
  }

  try {
    const [type, token] = authorization.split(' ');
    if (type === 'Token' || type === 'Bearer') {
      const openToken = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
      req.user = openToken.user;
      next();
    } else {
      res.status(401).json({ message: 'Acceso no autorizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

export default Authorization;

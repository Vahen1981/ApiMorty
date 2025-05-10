import express, { Router } from 'express';
import { registerUser, userLogin, userVerify } from '../controllers/UserController';
import auth from '../middleware/Auth';

const userRouter: Router = express.Router();


userRouter.post('/register-user', registerUser);  // http://localhost:8000/api/users/register-user
userRouter.post('/login', userLogin);             // http://localhost:8000/api/users/login
userRouter.get('/verify', auth, userVerify);      // http://localhost:8000/api/users/verify

export default userRouter;

import express from 'express';
import { addTofavorite, getUserFov, deleteUserFocv } from '../controllers/FavoriteController.js';
import { authMiddleware } from "./middlewares/authMiddleWare.js";
const foviriteRouter = express.Router();

foviriteRouter.post('/favorites', addTofavorite);
foviriteRouter.get('/getFavorites',authMiddleware, getUserFov);
foviriteRouter.delete('/favorites/:id',authMiddleware, deleteUserFocv);

export default foviriteRouter;
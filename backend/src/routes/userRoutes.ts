import express from 'express';
import { registerUser, loginUser, verifyEmail, forgotPassword, resetPassword, protectedRoute, logout } from '../controllers/userControllers';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser );
router.get("/verify-email", verifyEmail );
router.post("/forgot-password", forgotPassword );
router.post("/reset-password", resetPassword );
router.get('/protected-route', authMiddleware, protectedRoute)
router.get('/logout',authMiddleware, logout)

export default router;

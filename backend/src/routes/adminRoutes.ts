import express from 'express';
import { getAllUsers, addUser, deleteUser, editUser, getUserById } from '../controllers/adminController';
import { adminAuth } from '../middleware/authMiddleware';


const router = express.Router();

// Apply admin authentication middleware
router.use(adminAuth);

router.get('/getAllUsers', getAllUsers);
router.post('/addUser', addUser);
router.delete('/deleteUser/:id', deleteUser);
router.put('/updateUser/:id', editUser);
router.get('/getUser/:id', getUserById);

export default router;
// http://localhost:5173/verify-email?token=11e7f8df469f71ea71cdc0ab3af2dbce645b10d0217aa9d5f7681d80c6186f31
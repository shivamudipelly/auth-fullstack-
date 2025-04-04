import express from 'express';
import { getAllUsers, addUser, deleteUser, editUser } from '../controllers/adminController';
import { adminAuth } from '../middleware/authMiddleware';
import { EditUserRequestBody } from '../controllers/adminController'; // make sure this is exported

const router = express.Router();

// Apply admin authentication middleware
router.use(adminAuth);

router.get('/get-all-persons', getAllUsers);
router.post('/add-person', addUser);
router.delete<{ id: string }>('/delete-person/:id', deleteUser);
router.put<{ id: string }, any, EditUserRequestBody>('/edit-person/:id', editUser);

export default router;

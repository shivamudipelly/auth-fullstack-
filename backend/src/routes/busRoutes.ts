import express from 'express';
import { createBus, updateBus, deleteBus, busRoutes, findBuses } from '../controllers/busController';
import { adminAuth } from '../middleware/authMiddleware';

const router = express.Router();


// Route to create a new bus
router.post('/addBus', adminAuth, createBus);

// Route to get all buses
router.get('/getAllBuses', findBuses);

// Route to update a bus
router.put('/editBus/:busId', adminAuth, updateBus);

// Route to delete a bus,
router.delete('/deleteBus/:busId', adminAuth, deleteBus);


router.get('/:busId', adminAuth, busRoutes);





export default router;

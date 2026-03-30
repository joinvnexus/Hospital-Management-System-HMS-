import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  deleteAppointment,
} from '../controllers/appointmentController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', authMiddleware, updateAppointment);
router.patch('/:id/cancel', authMiddleware, cancelAppointment);
router.delete('/:id', authMiddleware, deleteAppointment);

export default router;

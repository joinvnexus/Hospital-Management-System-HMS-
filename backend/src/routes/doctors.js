import express from 'express';
import {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  getDoctorSchedule,
} from '../controllers/doctorController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.get('/:id/schedule', getDoctorSchedule);
router.put('/:id', authMiddleware, updateDoctor);
router.delete('/:id', authMiddleware, deleteDoctor);

export default router;

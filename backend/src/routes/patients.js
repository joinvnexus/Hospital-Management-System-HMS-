import express from 'express';
import {
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientHistory,
} from '../controllers/patientController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/:id', getPatientById);
router.get('/:id/history', getPatientHistory);
router.put('/:id', authMiddleware, updatePatient);
router.delete('/:id', authMiddleware, deletePatient);

export default router;

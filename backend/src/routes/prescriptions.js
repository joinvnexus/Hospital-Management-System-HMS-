import express from 'express';
import {
  createPrescription,
  getPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatient,
  updatePrescription,
  deletePrescription,
} from '../controllers/prescriptionController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authMiddleware, createPrescription);
router.get('/', getPrescriptions);
router.get('/:id', getPrescriptionById);
router.get('/patient/:patientId', getPrescriptionsByPatient);
router.put('/:id', authMiddleware, updatePrescription);
router.delete('/:id', authMiddleware, deletePrescription);

export default router;

import express from 'express';
import {
  registerPatient,
  loginPatient,
  registerDoctor,
  loginDoctor,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register/patient', registerPatient);
router.post('/login/patient', loginPatient);
router.post('/register/doctor', registerDoctor);
router.post('/login/doctor', loginDoctor);

export default router;

import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import Patient from '../models/Patient.js';
import Doctor from '../models/Doctor.js';

export const registerPatient = async (req, res) => {
  try {
    const { firstName, lastName, email, password, age, gender, phone } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password || !age || !gender || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new patient
    const patient = new Patient({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      gender,
      phone,
      role: 'patient',
    });

    await patient.save();

    const token = generateToken(patient._id, patient.role);

    res.status(201).json({
      success: true,
      message: 'Patient registered successfully',
      token,
      patient: { id: patient._id, email: patient.email, role: patient.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, patient.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(patient._id, patient.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      patient: { id: patient._id, email: patient.email, role: patient.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const registerDoctor = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, speciality, license } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !speciality || !license) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await hashPassword(password);

    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      speciality,
      license,
      role: 'doctor',
    });

    await doctor.save();

    const token = generateToken(doctor._id, doctor.role);

    res.status(201).json({
      success: true,
      message: 'Doctor registered successfully',
      token,
      doctor: { id: doctor._id, email: doctor.email, role: doctor.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password required' });
    }

    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, doctor.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(doctor._id, doctor.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      doctor: { id: doctor._id, email: doctor.email, role: doctor.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

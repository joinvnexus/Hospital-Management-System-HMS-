import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    address: String,
    medicalHistory: {
      conditions: [String],
      allergies: [String],
      medications: [String],
    },
    role: {
      type: String,
      default: 'patient',
      enum: ['patient', 'admin', 'doctor'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Patient', patientSchema);

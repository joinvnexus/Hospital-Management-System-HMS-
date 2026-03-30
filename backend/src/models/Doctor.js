import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
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
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    speciality: {
      type: String,
      required: true,
    },
    license: {
      type: String,
      required: true,
    },
    experience: {
      type: Number,
      default: 0,
    },
    schedule: {
      Monday: { startTime: String, endTime: String, available: Boolean },
      Tuesday: { startTime: String, endTime: String, available: Boolean },
      Wednesday: { startTime: String, endTime: String, available: Boolean },
      Thursday: { startTime: String, endTime: String, available: Boolean },
      Friday: { startTime: String, endTime: String, available: Boolean },
      Saturday: { startTime: String, endTime: String, available: Boolean },
      Sunday: { startTime: String, endTime: String, available: Boolean },
    },
    bio: String,
    consultationFee: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: 'doctor',
      enum: ['patient', 'admin', 'doctor'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);

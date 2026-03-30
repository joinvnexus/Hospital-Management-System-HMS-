import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    medicines: [
      {
        name: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          enum: ['Once daily', 'Twice daily', 'Three times daily', 'Twice weekly', 'As needed'],
          required: true,
        },
        duration: {
          type: String,
          required: true,
        },
        instructions: String,
      },
    ],
    notes: String,
    diagnosisDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model('Prescription', prescriptionSchema);

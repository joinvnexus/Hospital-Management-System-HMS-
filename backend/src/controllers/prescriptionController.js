import Prescription from '../models/Prescription.js';

export const createPrescription = async (req, res) => {
  try {
    const { patientId, doctorId, medicines, notes } = req.body;

    if (!patientId || !doctorId || !medicines || medicines.length === 0) {
      return res.status(400).json({ success: false, message: 'Required fields missing' });
    }

    const prescription = new Prescription({
      patientId,
      doctorId,
      medicines,
      notes,
    });

    await prescription.save();
    res.status(201).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrescriptions = async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;
    const filter = {};

    if (patientId) filter.patientId = patientId;
    if (doctorId) filter.doctorId = doctorId;

    const prescriptions = await Prescription.find(filter)
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName speciality');

    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patientId')
      .populate('doctorId');

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPrescriptionsByPatient = async (req, res) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await Prescription.find({ patientId })
      .populate('doctorId', 'firstName lastName speciality')
      .sort({ diagnosisDate: -1 });

    res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ success: false, message: 'Prescription not found' });
    }

    res.status(200).json({ success: true, message: 'Prescription deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

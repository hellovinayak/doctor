const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: String,
  frequency: String,      // e.g. "3 times a day"
  timing: String,        // e.g. "After meal"
  duration: String,      // e.g. "7 days"
  instructions: String,
});

const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: String,
  doctorName: { type: String, required: true },
  date: { type: Date, default: Date.now },
  diagnosis: String,
  medicines: [medicineSchema],
  labTests: String,
  followUpDate: Date,
  notes: String,
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);

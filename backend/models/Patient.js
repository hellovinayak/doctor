const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: String,
  age: Number,
  gender: String,
  disease: String,
  phone: String,
  bloodType: String,
  allergies: String,
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  assignedNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Nurse"
  },
  admissionDate: Date,
  status: {
    type: String,
    enum: ["Admitted", "Discharged", "Under Treatment"],
    default: "Admitted"
  },
  roomNumber: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Patient", patientSchema);

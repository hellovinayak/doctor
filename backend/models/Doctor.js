const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  specialization: {
    type: String,
    required: true
  },
  phone: String,
  experience: Number,
  availability: {
    type: Boolean,
    default: true
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient"
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Doctor", doctorSchema);

const mongoose = require("mongoose");

const nurseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: String,
  qualification: String,
  shift: {
    type: String,
    enum: ["Morning", "Afternoon", "Night"],
    default: "Morning"
  },
  experience: Number,
  assignedDepartment: String,
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Nurse", nurseSchema);

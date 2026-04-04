const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/nurses", require("./routes/nurseRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));

// Root route
app.get("/", (req, res) => {
  res.send("ApexCare API is running!");
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { family: 4 })
  .then(() => console.log("MongoDB Connected"))
  .catch(err => { console.error("MongoDB connection error:", err.message || err); });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

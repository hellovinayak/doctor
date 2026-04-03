import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { patientAPI, prescriptionAPI } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './PublicPatientProfile.css';

export default function PublicPatientProfile() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientRes, rxRes] = await Promise.all([
          patientAPI.getOne(id),
          prescriptionAPI.getByPatient(id).catch(() => []) // Default empty if fails
        ]);
        setPatient(patientRes);
        setPrescriptions(rxRes);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Patient record not found. Please ensure the QR code is valid.');
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const downloadPDF = (rx) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 30, 46);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESCRIPTION', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ApexCare Hospital', 14, 26);
    doc.text('Generated from Public Portal', 14, 32);

    doc.setTextColor(30, 30, 46);
    doc.setFontSize(11);
    doc.text(`Patient: ${patient?.name || '—'}`, 14, 52);
    doc.text(`Doctor: ${rx.doctorName || '—'}`, 120, 52);
    doc.text(`Date: ${new Date(rx.createdAt).toLocaleDateString()}`, 14, 59);
    doc.text(`Diagnosis: ${rx.diagnosis || '—'}`, 120, 59);

    const rows = (rx.medicines || []).map((m, i) => [
      i + 1, m.name, m.dosage, m.frequency, m.timing, m.duration, m.instruction || 'None'
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['#', 'Medicine', 'Dosage', 'Freq', 'Timing', 'Duration', 'Notes']],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [99, 102, 241], fontStyle: 'bold' }
    });

    let y = doc.lastAutoTable.finalY + 15;
    if (rx.labTests) {
      doc.setFont('helvetica', 'bold');
      doc.text('Lab Tests Ordered:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(rx.labTests, 14, y + 7);
      y += 20;
    }
    if (rx.notes) {
      doc.setFont('helvetica', 'bold');
      doc.text('Notes:', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.text(rx.notes, 14, y + 7);
    }
    doc.save(`Prescription_${patient?.name || 'Patient'}_${new Date(rx.createdAt).toLocaleDateString()}.pdf`);
  };

  if (loading) return <div className="public-loading"><div className="spinner"></div>Loading Patient Record...</div>;

  if (error) return (
    <div className="public-error">
      <div className="error-card">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <h2>Record Not Found</h2>
        <p>{error}</p>
        <Link to="/" className="btn-home">Return to Homepage</Link>
      </div>
    </div>
  );

  return (
    <div className="public-profile-container">
      <div className="public-header">
        <div className="public-logo">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
          <h2>ApexCare Portal</h2>
        </div>
        <span className="verified-badge">✓ Verified Patient Record</span>
      </div>

      <div className="profile-card animate-fade-in-up">
        <div className="profile-header">
          <div className="profile-avatar">
            {patient.name.charAt(0)}
          </div>
          <div className="profile-title">
            <h1>{patient.name}</h1>
            <p>ID: {patient._id}</p>
          </div>
          <span className={`status-badge ${patient.status === 'Admitted' ? 'status-admitted' : 'status-discharged'}`}>
            {patient.status}
          </span>
        </div>

        <div className="info-grid">
          <div className="info-item">
            <label>Age / Gender</label>
            <p>{patient.age} • {patient.gender}</p>
          </div>
          <div className="info-item">
            <label>Blood Type</label>
            <p className="blood-type">{patient.bloodType || '—'}</p>
          </div>
          <div className="info-item">
            <label>Admission Date</label>
            <p>{new Date(patient.admissionDate).toLocaleDateString()}</p>
          </div>
          <div className="info-item">
            <label>Room</label>
            <p>{patient.roomNumber || '—'}</p>
          </div>
        </div>

        <div className="medical-summary">
          <div className="summary-box alert-box">
            <h4>Allergies</h4>
            <p>{patient.allergies || 'No known allergies'}</p>
          </div>
          <div className="summary-box">
            <h4>Current Diagnosis</h4>
            <p>{patient.disease || 'Pending evaluation'}</p>
          </div>
        </div>
      </div>

      <h3 className="section-title animate-fade-in-up" style={{ animationDelay: '0.1s' }}>Medical History & Prescriptions</h3>
      
      <div className="prescriptions-list animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {prescriptions.length === 0 ? (
          <div className="no-records">No prescriptions found for this patient.</div>
        ) : (
          prescriptions.map((rx) => (
            <div key={rx._id} className="rx-card">
              <div className="rx-card-header">
                <div>
                  <h4>{new Date(rx.createdAt).toLocaleDateString()}</h4>
                  <p>Dr. {rx.doctorName}</p>
                </div>
                <button className="btn-dl-pdf" onClick={() => downloadPDF(rx)}>⬇ PDF</button>
              </div>
              <div className="rx-diagnosis">
                <b>Diagnosis:</b> {rx.diagnosis}
              </div>
              <div className="rx-medicines">
                {rx.medicines.map((med, i) => (
                  <div key={i} className="med-item">
                    <div className="med-name">{med.name} <span className="med-dose">{med.dosage}</span></div>
                    <div className="med-rules">{med.frequency} • {med.timing} • {med.duration}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

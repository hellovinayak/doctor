import { useState, useEffect } from 'react';
import { prescriptionAPI, patientAPI } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const emptyMed = { name: '', dosage: '', frequency: '', timing: '', duration: '', instructions: '' };
const emptyForm = {
  patient: '', patientName: '', doctorName: '', diagnosis: '',
  medicines: [{ ...emptyMed }], labTests: '', followUpDate: '', notes: '',
};

export default function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      prescriptionAPI.getAll().catch(() => []),
      patientAPI.getAll().catch(() => []),
    ]).then(([p, pts]) => { setPrescriptions(p); setPatients(pts); setLoading(false); });
  }, []);

  const refresh = async () => {
    const data = await prescriptionAPI.getAll().catch(() => []);
    setPrescriptions(data);
  };

  const handleMedChange = (index, e) => {
    const meds = [...form.medicines];
    meds[index] = { ...meds[index], [e.target.name]: e.target.value };
    setForm({ ...form, medicines: meds });
  };

  const addMed = () => setForm({ ...form, medicines: [...form.medicines, { ...emptyMed }] });
  const removeMed = (i) => {
    if (form.medicines.length === 1) return;
    setForm({ ...form, medicines: form.medicines.filter((_, idx) => idx !== i) });
  };

  const handlePatientSelect = (e) => {
    const p = patients.find(pt => pt._id === e.target.value);
    setForm({ ...form, patient: e.target.value, patientName: p ? p.name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await prescriptionAPI.update(editId, form);
        toast.success('Prescription updated');
      } else {
        await prescriptionAPI.create(form);
        toast.success('Prescription saved');
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditMode(false);
      refresh();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (rx) => {
    setForm({
      patient: rx.patient || '',
      patientName: rx.patientName || '',
      doctorName: rx.doctorName || '',
      diagnosis: rx.diagnosis || '',
      medicines: rx.medicines?.length ? rx.medicines : [{ ...emptyMed }],
      labTests: rx.labTests || '',
      followUpDate: rx.followUpDate ? rx.followUpDate.split('T')[0] : '',
      notes: rx.notes || '',
    });
    setEditId(rx._id);
    setEditMode(true);
    setModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await prescriptionAPI.delete(deleteTarget._id);
      toast.success('Deleted');
      refresh();
    } catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const downloadPDF = (rx) => {
    const doc = new jsPDF();
    doc.setFillColor(30, 30, 46);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MEDICAL PRESCRIPTION', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ApexCare Hospital Management System', 14, 28);
    doc.text(`Date: ${new Date(rx.date || rx.createdAt).toLocaleDateString()}`, 150, 18);

    doc.setTextColor(30, 30, 46);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Information', 14, 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Patient Name: ${rx.patientName || '—'}`, 14, 60);
    doc.text(`Doctor: ${rx.doctorName || '—'}`, 14, 67);
    doc.text(`Diagnosis: ${rx.diagnosis || '—'}`, 14, 74);
    if (rx.followUpDate) doc.text(`Follow-up Date: ${new Date(rx.followUpDate).toLocaleDateString()}`, 120, 60);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Prescribed Medicines', 14, 86);

    const medRows = (rx.medicines || []).map((m, i) => [
      i + 1, m.name || '—', m.dosage || '—', m.frequency || '—', m.timing || '—', m.duration || '—', m.instructions || '—'
    ]);

    autoTable(doc, {
      startY: 90,
      head: [['#', 'Medicine', 'Dosage', 'Frequency', 'Timing', 'Duration', 'Instructions']],
      body: medRows,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 9 },
    });

    let y = doc.lastAutoTable.finalY + 10;
    if (rx.labTests) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Lab Tests Ordered', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(rx.labTests, 14, y + 7);
      y += 20;
    }
    if (rx.notes) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text('Doctor Notes', 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const lines = doc.splitTextToSize(rx.notes, 180);
      doc.text(lines, 14, y + 7);
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text('This prescription is digitally generated by ApexCare HMS. Please verify with your doctor.', 14, 280);

    doc.save(`Prescription_${rx.patientName || 'patient'}_${new Date(rx.date || rx.createdAt).toLocaleDateString('en-GB').replace(/\//g, '-')}.pdf`);
  };

  const filtered = prescriptions.filter(rx =>
    rx.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    rx.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
    rx.diagnosis?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in" id="prescriptions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Prescriptions</h1>
          <p className="page-subtitle">Full medical records & prescriptions per patient</p>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Prescriptions</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="Search by patient, doctor or diagnosis..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '13px', width: '280px', outline: 'none' }}
              />
            </div>
            <button className="btn-add" onClick={() => { setForm(emptyForm); setEditMode(false); setModalOpen(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Prescription
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No prescriptions found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Patient', 'Doctor', 'Diagnosis', 'Medicines', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(rx => (
                  <tr key={rx._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 16px', fontWeight: '500' }}>{rx.patientName || '—'}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{rx.doctorName || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>{rx.diagnosis || '—'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: 'var(--primary-dim)', color: 'var(--primary-color)', padding: '3px 10px', borderRadius: '99px', fontSize: '12px' }}>
                        {rx.medicines?.length || 0} medicine{rx.medicines?.length !== 1 ? 's' : ''}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {new Date(rx.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => { setViewData(rx); setViewOpen(true); }}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>
                          View
                        </button>
                        <button onClick={() => downloadPDF(rx)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                          ⬇ PDF
                        </button>
                        <button onClick={() => handleEdit(rx)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>
                          Edit
                        </button>
                        <button onClick={() => setDeleteTarget(rx)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Prescription' : 'New Prescription'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Patient *</label>
              <select className="form-select" value={form.patient} onChange={handlePatientSelect} required>
                <option value="">Select Patient</option>
                {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Doctor Name *</label>
              <input className="form-input" value={form.doctorName} onChange={e => setForm({ ...form, doctorName: e.target.value })} placeholder="Dr. Name" required />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">Diagnosis</label>
              <input className="form-input" value={form.diagnosis} onChange={e => setForm({ ...form, diagnosis: e.target.value })} placeholder="Primary diagnosis" />
            </div>
          </div>

          <div style={{ margin: '16px 0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>Medicines</label>
              <button type="button" onClick={addMed}
                style={{ padding: '4px 12px', borderRadius: '6px', border: '1px dashed var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '12px' }}>
                + Add Medicine
              </button>
            </div>
            {form.medicines.map((med, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Medicine #{i + 1}</span>
                  {form.medicines.length > 1 && (
                    <button type="button" onClick={() => removeMed(i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>✕ Remove</button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group"><label className="form-label">Medicine Name *</label><input className="form-input" name="name" value={med.name} onChange={e => handleMedChange(i, e)} placeholder="e.g. Paracetamol" required /></div>
                  <div className="form-group"><label className="form-label">Dosage</label><input className="form-input" name="dosage" value={med.dosage} onChange={e => handleMedChange(i, e)} placeholder="e.g. 500mg" /></div>
                  <div className="form-group"><label className="form-label">Frequency</label><input className="form-input" name="frequency" value={med.frequency} onChange={e => handleMedChange(i, e)} placeholder="e.g. 3 times a day" /></div>
                  <div className="form-group"><label className="form-label">Timing</label>
                    <select className="form-select" name="timing" value={med.timing} onChange={e => handleMedChange(i, e)}>
                      <option value="">Select</option>
                      <option>Before meal</option><option>After meal</option><option>With meal</option><option>Morning</option><option>Night</option><option>As needed</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Duration</label><input className="form-input" name="duration" value={med.duration} onChange={e => handleMedChange(i, e)} placeholder="e.g. 7 days" /></div>
                  <div className="form-group"><label className="form-label">Special Instructions</label><input className="form-input" name="instructions" value={med.instructions} onChange={e => handleMedChange(i, e)} placeholder="e.g. avoid alcohol" /></div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-grid">
            <div className="form-group"><label className="form-label">Lab Tests Ordered</label><input className="form-input" value={form.labTests} onChange={e => setForm({ ...form, labTests: e.target.value })} placeholder="e.g. CBC, Blood Sugar" /></div>
            <div className="form-group"><label className="form-label">Follow-up Date</label><input className="form-input" type="date" value={form.followUpDate} onChange={e => setForm({ ...form, followUpDate: e.target.value })} /></div>
            <div className="form-group form-grid-full"><label className="form-label">Doctor Notes</label><textarea className="form-textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Additional instructions..." /></div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">{editMode ? 'Update' : 'Save Prescription'}</button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      {viewData && (
        <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title="Prescription Details" size="lg">
          <div style={{ fontSize: '14px', lineHeight: '1.7' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 20px', marginBottom: '16px' }}>
              <div><b>Patient:</b> {viewData.patientName}</div>
              <div><b>Doctor:</b> {viewData.doctorName}</div>
              <div><b>Diagnosis:</b> {viewData.diagnosis || '—'}</div>
              <div><b>Date:</b> {new Date(viewData.createdAt).toLocaleDateString()}</div>
              {viewData.followUpDate && <div><b>Follow-up:</b> {new Date(viewData.followUpDate).toLocaleDateString()}</div>}
            </div>
            <h4 style={{ marginBottom: '8px', color: 'var(--primary-color)' }}>Medicines</h4>
            {viewData.medicines?.map((m, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px' }}>
                <b>{i + 1}. {m.name}</b> — {m.dosage} &nbsp;|&nbsp; {m.frequency} &nbsp;|&nbsp; {m.timing} &nbsp;|&nbsp; {m.duration}
                {m.instructions && <div style={{ color: 'var(--text-secondary)', fontSize: '12px', marginTop: '4px' }}>📝 {m.instructions}</div>}
              </div>
            ))}
            {viewData.labTests && <div style={{ marginTop: '12px' }}><b>Lab Tests:</b> {viewData.labTests}</div>}
            {viewData.notes && <div style={{ marginTop: '8px' }}><b>Notes:</b> {viewData.notes}</div>}
            <div className="form-actions" style={{ marginTop: '20px' }}>
              <button className="btn-cancel" onClick={() => setViewOpen(false)}>Close</button>
              <button className="btn-submit" style={{ background: '#000' }} onClick={() => downloadPDF(viewData)}>⬇ Download PDF</button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete}
        title="Delete Prescription" message={`Delete prescription for "${deleteTarget?.patientName}"?`} confirmText="Delete" cancelText="Cancel" type="danger" />
    </div>
  );
}

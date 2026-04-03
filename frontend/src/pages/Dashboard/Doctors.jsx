import { useState, useEffect } from 'react';
import { doctorAPI } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';

const emptyForm = { name: '', email: '', specialization: '', phone: '', experience: '', availability: true };

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchDoctors = async () => {
    try { setDoctors(await doctorAPI.getAll()); }
    catch { toast.error('Failed to load doctors'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const handleChange = (e) => {
    const val = e.target.name === 'availability' ? e.target.value === 'true' : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, experience: form.experience ? Number(form.experience) : undefined };
      if (editMode) { await doctorAPI.update(editId, payload); toast.success('Doctor updated'); }
      else { await doctorAPI.create(payload); toast.success('Doctor added'); }
      setModalOpen(false); setForm(emptyForm); setEditMode(false); fetchDoctors();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (doctor) => {
    setForm({
      name: doctor.name || '', email: doctor.email || '', specialization: doctor.specialization || '',
      phone: doctor.phone || '', experience: doctor.experience || '', availability: doctor.availability ?? true,
    });
    setEditId(doctor._id); setEditMode(true); setModalOpen(true);
  };

  const handleDelete = (doctor) => setDeleteTarget(doctor);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await doctorAPI.delete(deleteTarget._id); toast.success('Doctor deleted'); fetchDoctors(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'phone', label: 'Phone' },
    { key: 'experience', label: 'Experience', render: (val) => val ? `${val} yrs` : '—' },
    { key: 'availability', label: 'Status', render: (val) => <span className={`availability-badge ${val ? 'available' : 'unavailable'}`}>{val ? 'Available' : 'Unavailable'}</span> },
  ];

  return (
    <div className="animate-fade-in" id="doctors-page">
      <div className="page-header"><div><h1 className="page-title">Doctors</h1><p className="page-subtitle">Manage doctor profiles and assignments</p></div></div>
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Doctors</h3>
          <button className="btn-add" onClick={() => { setForm(emptyForm); setEditMode(false); setModalOpen(true); }} id="btn-add-doctor">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Doctor
          </button>
        </div>
        {loading ? (
          <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
        ) : (
          <DataTable columns={columns} data={doctors} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search doctors..." />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Doctor' : 'Add New Doctor'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="Dr. Name"/></div>
            <div className="form-group"><label className="form-label">Email *</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="doctor@email.com"/></div>
            <div className="form-group"><label className="form-label">Specialization *</label><input className="form-input" name="specialization" value={form.specialization} onChange={handleChange} required placeholder="Cardiology"/></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555..."/></div>
            <div className="form-group"><label className="form-label">Experience (Years)</label><input className="form-input" name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="5"/></div>
            <div className="form-group"><label className="form-label">Availability</label>
              <select className="form-select" name="availability" value={String(form.availability)} onChange={handleChange}><option value="true">Available</option><option value="false">Unavailable</option></select>
            </div>
          </div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn-submit">{editMode ? 'Update Doctor' : 'Add Doctor'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Doctor"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

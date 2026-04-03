import { useState, useEffect } from 'react';
import { nurseAPI } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';

const emptyForm = { name: '', email: '', phone: '', qualification: '', shift: 'Morning', experience: '', assignedDepartment: '', availability: true };

export default function Nurses() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchNurses = async () => {
    try { setNurses(await nurseAPI.getAll()); }
    catch { toast.error('Failed to load nurses'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchNurses(); }, []);

  const handleChange = (e) => {
    const val = e.target.name === 'availability' ? e.target.value === 'true' : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, experience: form.experience ? Number(form.experience) : undefined };
      if (editMode) { await nurseAPI.update(editId, payload); toast.success('Nurse updated'); }
      else { await nurseAPI.create(payload); toast.success('Nurse added'); }
      setModalOpen(false); setForm(emptyForm); setEditMode(false); fetchNurses();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (nurse) => {
    setForm({
      name: nurse.name || '', email: nurse.email || '', phone: nurse.phone || '',
      qualification: nurse.qualification || '', shift: nurse.shift || 'Morning',
      experience: nurse.experience || '', assignedDepartment: nurse.assignedDepartment || '',
      availability: nurse.availability ?? true,
    });
    setEditId(nurse._id); setEditMode(true); setModalOpen(true);
  };

  const handleDelete = (nurse) => setDeleteTarget(nurse);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await nurseAPI.delete(deleteTarget._id); toast.success('Nurse deleted'); fetchNurses(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const shiftBadge = (val) => {
    const colors = { Morning: 'status-admitted', Afternoon: 'status-treatment', Night: 'status-discharged' };
    return <span className={`status-badge ${colors[val] || 'status-admitted'}`}>{val || 'Morning'}</span>;
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'qualification', label: 'Qualification' },
    { key: 'shift', label: 'Shift', render: shiftBadge },
    { key: 'assignedDepartment', label: 'Department' },
    { key: 'experience', label: 'Experience', render: (val) => val ? `${val} yrs` : '—' },
    { key: 'availability', label: 'Status', render: (val) => <span className={`availability-badge ${val ? 'available' : 'unavailable'}`}>{val ? 'Available' : 'Unavailable'}</span> },
  ];

  return (
    <div className="animate-fade-in" id="nurses-page">
      <div className="page-header"><div><h1 className="page-title">Nurses</h1><p className="page-subtitle">Manage nursing staff and schedules</p></div></div>
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Nurses</h3>
          <button className="btn-add" onClick={() => { setForm(emptyForm); setEditMode(false); setModalOpen(true); }} id="btn-add-nurse">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Nurse
          </button>
        </div>
        {loading ? (
          <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
        ) : (
          <DataTable columns={columns} data={nurses} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search nurses..." />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Nurse' : 'Add New Nurse'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="Nurse Name"/></div>
            <div className="form-group"><label className="form-label">Email *</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="nurse@email.com"/></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555..."/></div>
            <div className="form-group"><label className="form-label">Qualification</label><input className="form-input" name="qualification" value={form.qualification} onChange={handleChange} placeholder="BSN, RN"/></div>
            <div className="form-group"><label className="form-label">Shift</label>
              <select className="form-select" name="shift" value={form.shift} onChange={handleChange}><option value="Morning">Morning</option><option value="Afternoon">Afternoon</option><option value="Night">Night</option></select>
            </div>
            <div className="form-group"><label className="form-label">Experience (Years)</label><input className="form-input" name="experience" type="number" value={form.experience} onChange={handleChange} placeholder="3"/></div>
            <div className="form-group"><label className="form-label">Department</label><input className="form-input" name="assignedDepartment" value={form.assignedDepartment} onChange={handleChange} placeholder="ICU"/></div>
            <div className="form-group"><label className="form-label">Availability</label>
              <select className="form-select" name="availability" value={String(form.availability)} onChange={handleChange}><option value="true">Available</option><option value="false">Unavailable</option></select>
            </div>
          </div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn-submit">{editMode ? 'Update Nurse' : 'Add Nurse'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Nurse"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

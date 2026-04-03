import { useState, useEffect } from 'react';
import { staffAPI } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';

const emptyForm = { name: '', email: '', phone: '', position: 'Assistant', department: '', salary: '', availability: true };

export default function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchStaff = async () => {
    try { setStaffList(await staffAPI.getAll()); }
    catch { toast.error('Failed to load staff'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const handleChange = (e) => {
    const val = e.target.name === 'availability' ? e.target.value === 'true' : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, salary: form.salary ? Number(form.salary) : undefined };
      if (editMode) { await staffAPI.update(editId, payload); toast.success('Staff updated'); }
      else { await staffAPI.create(payload); toast.success('Staff added'); }
      setModalOpen(false); setForm(emptyForm); setEditMode(false); fetchStaff();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (staff) => {
    setForm({
      name: staff.name || '', email: staff.email || '', phone: staff.phone || '',
      position: staff.position || 'Assistant', department: staff.department || '',
      salary: staff.salary || '', availability: staff.availability ?? true,
    });
    setEditId(staff._id); setEditMode(true); setModalOpen(true);
  };

  const handleDelete = (staff) => setDeleteTarget(staff);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try { await staffAPI.delete(deleteTarget._id); toast.success('Staff deleted'); fetchStaff(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const positionBadge = (val) => {
    const colors = {
      Receptionist: 'status-admitted', Technician: 'status-treatment',
      Assistant: 'status-discharged', Administrator: 'status-admitted',
    };
    return <span className={`status-badge ${colors[val] || 'status-admitted'}`}>{val || 'Assistant'}</span>;
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Position', render: positionBadge },
    { key: 'department', label: 'Department' },
    { key: 'phone', label: 'Phone' },
    { key: 'salary', label: 'Salary', render: (val) => val ? `$${val.toLocaleString()}` : '—' },
    { key: 'availability', label: 'Status', render: (val) => <span className={`availability-badge ${val ? 'available' : 'unavailable'}`}>{val ? 'Available' : 'Unavailable'}</span> },
  ];

  return (
    <div className="animate-fade-in" id="staff-page">
      <div className="page-header"><div><h1 className="page-title">Staff</h1><p className="page-subtitle">Manage hospital staff and operations</p></div></div>
      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Staff Members</h3>
          <button className="btn-add" onClick={() => { setForm(emptyForm); setEditMode(false); setModalOpen(true); }} id="btn-add-staff">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Staff
          </button>
        </div>
        {loading ? (
          <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
        ) : (
          <DataTable columns={columns} data={staffList} onEdit={handleEdit} onDelete={handleDelete} searchPlaceholder="Search staff..." />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Staff' : 'Add New Staff'}>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="Staff Name"/></div>
            <div className="form-group"><label className="form-label">Email *</label><input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="staff@email.com"/></div>
            <div className="form-group"><label className="form-label">Phone</label><input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555..."/></div>
            <div className="form-group"><label className="form-label">Position</label>
              <select className="form-select" name="position" value={form.position} onChange={handleChange}>
                <option value="Receptionist">Receptionist</option><option value="Technician">Technician</option>
                <option value="Assistant">Assistant</option><option value="Administrator">Administrator</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Department</label><input className="form-input" name="department" value={form.department} onChange={handleChange} placeholder="Admin"/></div>
            <div className="form-group"><label className="form-label">Salary</label><input className="form-input" name="salary" type="number" value={form.salary} onChange={handleChange} placeholder="50000"/></div>
            <div className="form-group form-grid-full"><label className="form-label">Availability</label>
              <select className="form-select" name="availability" value={String(form.availability)} onChange={handleChange}><option value="true">Available</option><option value="false">Unavailable</option></select>
            </div>
          </div>
          <div className="form-actions"><button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button><button type="submit" className="btn-submit">{editMode ? 'Update Staff' : 'Add Staff'}</button></div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Staff"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}

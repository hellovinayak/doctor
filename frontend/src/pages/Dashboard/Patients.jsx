import { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';

const emptyForm = {
  name: '', email: '', age: '', gender: '', disease: '', phone: '',
  bloodType: '', allergies: '', admissionDate: '', status: 'Admitted',
  roomNumber: '', notes: '',
};

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [qrPatient, setQrPatient] = useState(null);

  const fetchPatients = async () => {
    try {
      const data = await patientAPI.getAll();
      setPatients(data);
    } catch {
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : undefined };
      if (editMode) {
        await patientAPI.update(editId, payload);
        toast.success('Patient updated successfully');
      } else {
        await patientAPI.create(payload);
        toast.success('Patient added successfully');
      }
      setModalOpen(false);
      setForm(emptyForm);
      setEditMode(false);
      fetchPatients();
    } catch {
      toast.error('Operation failed');
    }
  };

  const handleEdit = (patient) => {
    setForm({
      name: patient.name || '',
      email: patient.email || '',
      age: patient.age || '',
      gender: patient.gender || '',
      disease: patient.disease || '',
      phone: patient.phone || '',
      bloodType: patient.bloodType || '',
      allergies: patient.allergies || '',
      admissionDate: patient.admissionDate ? patient.admissionDate.split('T')[0] : '',
      status: patient.status || 'Admitted',
      roomNumber: patient.roomNumber || '',
      notes: patient.notes || '',
    });
    setEditId(patient._id);
    setEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = (patient) => {
    setDeleteTarget(patient);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await patientAPI.delete(deleteTarget._id);
      toast.success('Patient deleted');
      fetchPatients();
    } catch {
      toast.error('Delete failed');
    } finally {
      setDeleteTarget(null);
    }
  };

  const openAdd = () => {
    setForm(emptyForm);
    setEditMode(false);
    setModalOpen(true);
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
    { key: 'gender', label: 'Gender' },
    { key: 'disease', label: 'Disease' },
    { key: 'bloodType', label: 'Blood Type' },
    { key: 'phone', label: 'Phone' },
    { key: 'roomNumber', label: 'Room' },
    {
      key: 'status', label: 'Status',
      render: (val) => {
        const cls = val === 'Discharged' ? 'status-discharged' : val === 'Under Treatment' ? 'status-treatment' : 'status-admitted';
        return <span className={`status-badge ${cls}`}>{val || 'Admitted'}</span>;
      }
    },
  ];

  return (
    <div className="animate-fade-in" id="patients-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Patients</h1>
          <p className="page-subtitle">Manage all patient records</p>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Patients</h3>
          <button className="btn-add" onClick={openAdd} id="btn-add-patient">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Patient
          </button>
        </div>
        {loading ? (
          <div className="loading-skeleton">
            {[1,2,3,4].map(i => <div key={i} className="skeleton-row"></div>)}
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={patients}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewQR={(pt) => setQrPatient(pt)}
            searchPlaceholder="Search patients..."
          />
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Patient' : 'Add New Patient'} size="lg">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@email.com" />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" name="age" type="number" value={form.age} onChange={handleChange} placeholder="30" />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-select" name="gender" value={form.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Disease</label>
              <input className="form-input" name="disease" value={form.disease} onChange={handleChange} placeholder="Diagnosis" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 555 123 4567" />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Type</label>
              <select className="form-select" name="bloodType" value={form.bloodType} onChange={handleChange}>
                <option value="">Select</option>
                {['A+','A-','B+','B-','O+','O-','AB+','AB-'].map(bt => <option key={bt} value={bt}>{bt}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Room Number</label>
              <input className="form-input" name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="101" />
            </div>
            <div className="form-group">
              <label className="form-label">Admission Date</label>
              <input className="form-input" name="admissionDate" type="date" value={form.admissionDate} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" name="status" value={form.status} onChange={handleChange}>
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
                <option value="Under Treatment">Under Treatment</option>
              </select>
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">Allergies</label>
              <input className="form-input" name="allergies" value={form.allergies} onChange={handleChange} placeholder="Known allergies" />
            </div>
            <div className="form-group form-grid-full">
              <label className="form-label">Notes</label>
              <textarea className="form-textarea" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes..." />
            </div>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">{editMode ? 'Update Patient' : 'Add Patient'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Delete Patient"
        message={`Are you sure you want to delete patient "${deleteTarget?.name}"?`}
        confirmText="Delete Patient"
        cancelText="Cancel"
        type="danger"
      />

      <Modal isOpen={!!qrPatient} onClose={() => setQrPatient(null)} title="Patient QR Profile" size="sm">
        {qrPatient && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <QRCodeSVG 
                value={`${window.location.origin}/share/patient/${qrPatient._id}`}
                size={220}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"Q"}
              />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--gray-900)', marginBottom: '4px' }}>{qrPatient.name}</h3>
            <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>Scan to view complete medical history</p>
            <div className="form-actions" style={{ justifyContent: 'center', borderTop: 'none', paddingTop: 0 }}>
              <button 
                className="btn-submit" 
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/share/patient/${qrPatient._id}`);
                  toast.success('Link copied to clipboard!');
                }}
              >
                Copy Public Link
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

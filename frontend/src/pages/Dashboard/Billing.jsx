import { useState, useEffect } from 'react';
import { invoiceAPI, patientAPI } from '../../services/api';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const emptyItem = { description: '', quantity: 1, unitPrice: '', total: 0 };
const emptyForm = {
  patient: '', patientName: '', patientPhone: '',
  items: [{ ...emptyItem }], taxRate: 0,
  status: 'Unpaid', paymentMethod: 'Cash', notes: '', dueDate: '',
};

export default function Billing() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      invoiceAPI.getAll().catch(() => []),
      patientAPI.getAll().catch(() => []),
    ]).then(([inv, pts]) => { setInvoices(inv); setPatients(pts); setLoading(false); });
  }, []);

  const refresh = async () => { setInvoices(await invoiceAPI.getAll().catch(() => [])); };

  const calcTotals = (items, taxRate) => {
    const subtotal = items.reduce((s, it) => s + (it.total || 0), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleItemChange = (index, e) => {
    const items = [...form.items];
    const it = { ...items[index], [e.target.name]: e.target.value };
    if (e.target.name === 'quantity' || e.target.name === 'unitPrice') {
      it.total = (parseFloat(it.quantity) || 0) * (parseFloat(it.unitPrice) || 0);
    }
    items[index] = it;
    setForm({ ...form, items });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { ...emptyItem }] });
  const removeItem = (i) => {
    if (form.items.length === 1) return;
    setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) });
  };

  const handlePatientSelect = (e) => {
    const p = patients.find(pt => pt._id === e.target.value);
    setForm({ ...form, patient: e.target.value, patientName: p ? p.name : '', patientPhone: p ? p.phone : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { subtotal, taxAmount, total } = calcTotals(form.items, form.taxRate);
    const payload = { ...form, subtotal, taxAmount, total };
    try {
      if (editMode) { await invoiceAPI.update(editId, payload); toast.success('Invoice updated'); }
      else { await invoiceAPI.create(payload); toast.success('Invoice created'); }
      setModalOpen(false); setForm(emptyForm); setEditMode(false); refresh();
    } catch { toast.error('Operation failed'); }
  };

  const handleEdit = (inv) => {
    setForm({
      patient: inv.patient || '', patientName: inv.patientName || '', patientPhone: inv.patientPhone || '',
      items: inv.items?.length ? inv.items : [{ ...emptyItem }],
      taxRate: inv.taxRate || 0, status: inv.status || 'Unpaid',
      paymentMethod: inv.paymentMethod || 'Cash', notes: inv.notes || '',
      dueDate: inv.dueDate ? inv.dueDate.split('T')[0] : '',
    });
    setEditId(inv._id); setEditMode(true); setModalOpen(true);
  };

  const confirmDelete = async () => {
    try { await invoiceAPI.delete(deleteTarget._id); toast.success('Deleted'); refresh(); }
    catch { toast.error('Delete failed'); }
    finally { setDeleteTarget(null); }
  };

  const downloadPDF = (inv) => {
    const doc = new jsPDF();
    // Header
    doc.setFillColor(30, 30, 46);
    doc.rect(0, 0, 210, 45, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('ApexCare Hospital Management System', 14, 26);
    doc.text(`Invoice #: ${inv.invoiceNumber || '—'}`, 14, 33);
    doc.text(`Date: ${new Date(inv.createdAt).toLocaleDateString()}`, 150, 18);
    if (inv.dueDate) doc.text(`Due: ${new Date(inv.dueDate).toLocaleDateString()}`, 150, 26);

    // Status badge
    const statusColors = { Paid: [34, 197, 94], Unpaid: [239, 68, 68], Partial: [234, 179, 8] };
    const sc = statusColors[inv.status] || [100, 100, 100];
    doc.setFillColor(...sc);
    doc.roundedRect(150, 30, 40, 9, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(inv.status || 'Unpaid', 170, 36, { align: 'center' });

    // Patient info
    doc.setTextColor(30, 30, 46);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Bill To', 14, 57);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(inv.patientName || '—', 14, 64);
    if (inv.patientPhone) doc.text(`Phone: ${inv.patientPhone}`, 14, 71);
    doc.text(`Payment Method: ${inv.paymentMethod || 'Cash'}`, 120, 64);

    // Items table
    const rows = (inv.items || []).map((it, i) => [
      i + 1, it.description, it.quantity, `₹ ${parseFloat(it.unitPrice || 0).toFixed(2)}`, `₹ ${parseFloat(it.total || 0).toFixed(2)}`
    ]);
    autoTable(doc, {
      startY: 80,
      head: [['#', 'Description', 'Qty', 'Unit Price', 'Total']],
      body: rows,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 18, halign: 'center' }, 3: { cellWidth: 30, halign: 'right' }, 4: { cellWidth: 30, halign: 'right' } }
    });

    let y = doc.lastAutoTable.finalY + 8;
    const summaryX = 130;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Subtotal:`, summaryX, y);
    doc.text(`₹ ${parseFloat(inv.subtotal || 0).toFixed(2)}`, 196, y, { align: 'right' });
    if (inv.taxRate > 0) {
      doc.text(`Tax (${inv.taxRate}%):`, summaryX, y + 7);
      doc.text(`₹ ${parseFloat(inv.taxAmount || 0).toFixed(2)}`, 196, y + 7, { align: 'right' });
      y += 7;
    }
    doc.setDrawColor(99, 102, 241);
    doc.line(summaryX, y + 5, 196, y + 5);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`TOTAL:`, summaryX, y + 13);
    doc.text(`₹ ${parseFloat(inv.total || 0).toFixed(2)}`, 196, y + 13, { align: 'right' });

    if (inv.notes) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text('Notes:', 14, y + 25);
      doc.text(inv.notes, 14, y + 32);
    }

    doc.setDrawColor(200, 200, 200);
    doc.line(14, 275, 196, 275);
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text('Thank you for choosing ApexCare. This is a computer-generated invoice.', 14, 280);

    doc.save(`Invoice_${inv.invoiceNumber || 'draft'}_${inv.patientName || 'patient'}.pdf`);
  };

  const filtered = invoices.filter(inv =>
    inv.patientName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (s) => ({
    padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: '600',
    background: s === 'Paid' ? '#14532d' : s === 'Partial' ? '#713f12' : '#450a0a',
    color: s === 'Paid' ? '#4ade80' : s === 'Partial' ? '#facc15' : '#f87171',
  });

  return (
    <div className="animate-fade-in" id="billing-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing & Invoices</h1>
          <p className="page-subtitle">Generate and manage patient invoices with PDF export</p>
        </div>
      </div>

      <div className="section-card">
        <div className="section-card-header">
          <h3 className="section-card-title">All Invoices</h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}
                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                type="text" placeholder="Search by patient or invoice number..."
                value={search} onChange={e => setSearch(e.target.value)}
                style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '13px', width: '280px', outline: 'none' }}
              />
            </div>
            <button className="btn-add" onClick={() => { setForm(emptyForm); setEditMode(false); setModalOpen(true); }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Invoice
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No invoices found.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  {['Invoice #', 'Patient', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-secondary)', fontWeight: '600', fontSize: '12px', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '10px 12px', fontWeight: '600', color: 'var(--primary-color)', whiteSpace: 'nowrap' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '500' }}>{inv.patientName}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '600', whiteSpace: 'nowrap' }}>₹ {parseFloat(inv.total || 0).toFixed(2)}</td>
                    <td style={{ padding: '10px 12px' }}><span style={statusStyle(inv.status)}>{inv.status}</span></td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', fontSize: '13px', whiteSpace: 'nowrap' }}>{new Date(inv.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => downloadPDF(inv)}
                          style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: '#000', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>⬇ PDF</button>
                        <button onClick={() => handleEdit(inv)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '12px' }}>Edit</button>
                        <button onClick={() => setDeleteTarget(inv)}
                          style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Del</button>
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
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editMode ? 'Edit Invoice' : 'New Invoice'} size="lg">
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
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option>Unpaid</option><option>Paid</option><option>Partial</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Payment Method</label>
              <select className="form-select" value={form.paymentMethod} onChange={e => setForm({ ...form, paymentMethod: e.target.value })}>
                <option>Cash</option><option>Card</option><option>Insurance</option><option>Online</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Tax Rate (%)</label>
              <input className="form-input" type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })} placeholder="0" min="0" max="100" />
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
            </div>
          </div>

          <div style={{ margin: '16px 0 8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label className="form-label" style={{ margin: 0 }}>Invoice Items</label>
              <button type="button" onClick={addItem}
                style={{ padding: '4px 12px', borderRadius: '6px', border: '1px dashed var(--primary-color)', background: 'transparent', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '12px' }}>
                + Add Item
              </button>
            </div>
            {form.items.map((it, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>Item #{i + 1}</span>
                  {form.items.length > 1 && (
                    <button type="button" onClick={() => removeItem(i)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '12px' }}>✕ Remove</button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group form-grid-full"><label className="form-label">Description *</label><input className="form-input" name="description" value={it.description} onChange={e => handleItemChange(i, e)} placeholder="e.g. Consultation fee" required /></div>
                  <div className="form-group"><label className="form-label">Quantity</label><input className="form-input" type="number" name="quantity" value={it.quantity} onChange={e => handleItemChange(i, e)} min="1" /></div>
                  <div className="form-group"><label className="form-label">Unit Price (₹)</label><input className="form-input" type="number" name="unitPrice" value={it.unitPrice} onChange={e => handleItemChange(i, e)} placeholder="0.00" /></div>
                  <div className="form-group"><label className="form-label">Total</label><input className="form-input" value={`₹ ${parseFloat(it.total || 0).toFixed(2)}`} readOnly style={{ opacity: 0.7 }} /></div>
                </div>
              </div>
            ))}

            {/* Totals summary */}
            {(() => { const { subtotal, taxAmount, total } = calcTotals(form.items, form.taxRate);
              return (
                <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '14px', textAlign: 'right', fontSize: '14px' }}>
                  <div>Subtotal: <b>₹ {subtotal.toFixed(2)}</b></div>
                  {form.taxRate > 0 && <div>Tax ({form.taxRate}%): <b>₹ {taxAmount.toFixed(2)}</b></div>}
                  <div style={{ fontSize: '16px', marginTop: '6px', color: 'var(--primary-color)' }}>Total: <b>₹ {total.toFixed(2)}</b></div>
                </div>
              );
            })()}
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-textarea" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Payment instructions or remarks..." />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-submit">{editMode ? 'Update Invoice' : 'Create Invoice'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={confirmDelete}
        title="Delete Invoice" message={`Delete invoice "${deleteTarget?.invoiceNumber}" for "${deleteTarget?.patientName}"?`} confirmText="Delete" cancelText="Cancel" type="danger" />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { attendanceAPI } from '../../services/api';
import DataTable from '../../components/DataTable/DataTable';

export default function Attendance() {
  const [records, setRecords] = useState([]);
  const [qrToken, setQrToken] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [qrRes, recordsRes] = await Promise.all([
        attendanceAPI.getQRToken().catch(() => ({ token: '' })),
        attendanceAPI.getAll().catch(() => [])
      ]);
      setQrToken(qrRes.token);
      setRecords(recordsRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role', render: (val) => <span className={`status-badge status-${val === 'doctor' ? 'under-treatment' : val === 'nurse' ? 'discharged' : 'admitted'}`}>{val.charAt(0).toUpperCase() + val.slice(1)}</span> },
    { key: 'date', label: 'Date' },
    { key: 'time', label: 'Scan Time' },
  ];

  return (
    <div className="animate-fade-in" id="attendance-page">
      <div className="page-header">
        <h1 className="page-title">Attendance Tracking</h1>
        <p className="page-subtitle">Generate daily QR codes and track staff attendance.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '24px' }}>
        <div className="section-card">
          <DataTable 
            columns={columns} 
            data={records} 
            searchPlaceholder="Search attendance records..." 
          />
        </div>
        
        <div className="section-card" style={{ height: 'max-content', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '16px' }}>
          <h3 className="section-card-title">Today's Attendance QR</h3>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Staff can scan this code from their dashboard to mark themselves present.</p>
          
          <div style={{ background: 'white', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'inline-block' }}>
            {qrToken ? (
              <QRCodeSVG 
                value={qrToken} 
                size={220} 
                level="H"
                includeMargin={true}
              />
            ) : (
              <div style={{ width: 220, height: 220, background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="spinner"></span>
              </div>
            )}
          </div>
          
          {qrToken && (
             <div style={{ padding: '8px 16px', background: 'var(--primary-50)', color: 'var(--primary-700)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', fontWeight: 600 }}>
               Active for: {new Date().toLocaleDateString()}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientAPI, doctorAPI, nurseAPI, staffAPI, userAPI } from '../../services/api';
import StatsCard from '../../components/StatsCard/StatsCard';
import './Overview.css';

export default function Overview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, nurses: 0, staff: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [patients, doctors, nurses, staffList] = await Promise.all([
          patientAPI.getAll().catch(() => []),
          doctorAPI.getAll().catch(() => []),
          nurseAPI.getAll().catch(() => []),
          staffAPI.getAll().catch(() => []),
        ]);
        setStats({
          patients: patients.length,
          doctors: doctors.length,
          nurses: nurses.length,
          staff: staffList.length,
        });
        setRecentPatients(patients.slice(-5).reverse());
        // Admin: load all registered users
        if (user?.role === 'admin') {
          const users = await userAPI.getAll().catch(() => []);
          setRegisteredUsers(users);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user?.role]);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="overview-page animate-fade-in" id="overview-page">
      <div className="page-header">
        <h1 className="page-title">{greeting()}, {user?.name} 👋</h1>
        <p className="page-subtitle">Here&apos;s what&apos;s happening in your hospital today.</p>
      </div>

      <div className="stats-grid stagger">
        <StatsCard
          title="Total Patients"
          value={loading ? '...' : stats.patients}
          color="primary"
          trend="up"
          trendValue="12% this month"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatsCard
          title="Active Doctors"
          value={loading ? '...' : stats.doctors}
          color="accent"
          trend="up"
          trendValue="3 new"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/>
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/>
            </svg>
          }
        />
        <StatsCard
          title="Nurses on Duty"
          value={loading ? '...' : stats.nurses}
          color="cyan"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
              <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>
            </svg>
          }
        />
        <StatsCard
          title="Staff Members"
          value={loading ? '...' : stats.staff}
          color="amber"
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          }
        />
      </div>

      {/* Recent Patients */}
      <div className="overview-grid">
        <div className="section-card">
          <div className="section-card-header">
            <h3 className="section-card-title">Recent Patients</h3>
          </div>
          <div className="recent-list">
            {loading ? (
              <div className="loading-skeleton">
                {[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}
              </div>
            ) : recentPatients.length === 0 ? (
              <p className="empty-text">No patients found. Add your first patient.</p>
            ) : (
              recentPatients.map((p) => (
                <div key={p._id} className="recent-item">
                  <div className="recent-avatar">{p.name?.charAt(0) || 'P'}</div>
                  <div className="recent-info">
                    <span className="recent-name">{p.name}</span>
                    <span className="recent-detail">{p.disease || 'No diagnosis'} • Room {p.roomNumber || '—'}</span>
                  </div>
                  <span className={`status-badge status-${p.status?.toLowerCase().replace(/\s+/g, '-') || 'admitted'}`}>
                    {p.status || 'Admitted'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Admin: Registered Users Panel */}
        {user?.role === 'admin' && (
          <div className="section-card" style={{ marginTop: '24px' }}>
            <div className="section-card-header">
              <h3 className="section-card-title">Registered Users</h3>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{registeredUsers.length} total accounts</span>
            </div>
            <div className="recent-list">
              {loading ? (
                <div className="loading-skeleton">{[1,2,3].map(i => <div key={i} className="skeleton-row"></div>)}</div>
              ) : registeredUsers.length === 0 ? (
                <p className="empty-text">No registered users yet.</p>
              ) : (
                registeredUsers.map((u) => (
                  <div key={u._id} className="recent-item">
                    <div className="recent-avatar" style={{ textTransform: 'uppercase' }}>{u.name?.charAt(0) || '?'}</div>
                    <div className="recent-info">
                      <span className="recent-name">{u.name}</span>
                      <span className="recent-detail">{u.email}</span>
                    </div>
                    <span className={`status-badge status-${u.role === 'admin' ? 'admitted' : u.role === 'doctor' ? 'treatment' : 'discharged'}`}>
                      {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

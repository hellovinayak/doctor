import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import './Sidebar.css';

const menuItems = {
  admin: [
    { path: '/dashboard', icon: 'grid', label: 'Overview', end: true },
    { path: '/dashboard/patients', icon: 'users', label: 'Patients' },
    { path: '/dashboard/doctors', icon: 'stethoscope', label: 'Doctors' },
    { path: '/dashboard/nurses', icon: 'heart-pulse', label: 'Nurses' },
    { path: '/dashboard/staff', icon: 'briefcase', label: 'Staff' },
    { path: '/dashboard/prescriptions', icon: 'rx', label: 'Prescriptions' },
    { path: '/dashboard/billing', icon: 'receipt', label: 'Billing' },
  ],
  doctor: [
    { path: '/dashboard', icon: 'grid', label: 'Overview', end: true },
    { path: '/dashboard/patients', icon: 'users', label: 'My Patients' },
    { path: '/dashboard/prescriptions', icon: 'rx', label: 'Prescriptions' },
    { path: '/dashboard/billing', icon: 'receipt', label: 'Billing' },
  ],
  nurse: [
    { path: '/dashboard', icon: 'grid', label: 'Overview', end: true },
    { path: '/dashboard/patients', icon: 'users', label: 'Patients' },
    { path: '/dashboard/prescriptions', icon: 'rx', label: 'Prescriptions' },
  ],
  staff: [
    { path: '/dashboard', icon: 'grid', label: 'Overview', end: true },
    { path: '/dashboard/patients', icon: 'users', label: 'Patients' },
    { path: '/dashboard/billing', icon: 'receipt', label: 'Billing' },
  ],
};

function SidebarIcon({ name }) {
  const icons = {
    grid: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    stethoscope: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
        <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
      </svg>
    ),
    'heart-pulse': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" />
      </svg>
    ),
    briefcase: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    'log-out': (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
    rx: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12h6"/><path d="M11 6h2a2 2 0 0 1 0 4h-2"/><path d="m13 10 2 4"/>
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    ),
    receipt: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/>
        <path d="M16 8H8"/><path d="M16 12H8"/><path d="M12 16H8"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = menuItems[user?.role] || menuItems.staff;
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-avatar">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div className="sidebar-user-info">
          <h4 className="sidebar-user-name">{user?.name}</h4>
          <span className="sidebar-user-role">{user?.role}</span>
        </div>
      </div>

      <div className="sidebar-divider"></div>

      <nav className="sidebar-nav" id="sidebar-nav">
        <span className="sidebar-label">Navigation</span>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            id={`sidebar-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <SidebarIcon name={item.icon} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogoutClick} className="sidebar-link logout-link" id="btn-sidebar-logout">
          <SidebarIcon name="log-out" />
          <span>Logout</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </aside>
  );
}

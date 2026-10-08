import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Building2, Send, Activity, Sliders, User } from 'lucide-react';

const NAV = [
  { label: 'Company',     to: '/settings/company',     icon: <Building2 size={15} /> },
  { label: 'Sending',     to: '/settings/sending',     icon: <Send size={15} /> },
  { label: 'Tracking',    to: '/settings/tracking',    icon: <Activity size={15} /> },
  { label: 'Preferences', to: '/settings/preferences', icon: <Sliders size={15} /> },
  { label: 'Profile',     to: '/settings/profile',     icon: <User size={15} /> },
];

export default function SettingsLayout() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your workspace preferences and configuration.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Settings Sidebar Nav */}
        <div className="card" style={{ padding: 8 }}>
          {NAV.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 14px', borderRadius: 8,
                fontSize: 13.5, fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--crimson)' : 'var(--text-secondary)',
                background: isActive ? 'var(--crimson-light)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.15s', marginBottom: 2,
              })}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Settings Content */}
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

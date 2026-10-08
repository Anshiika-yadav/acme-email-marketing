import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Mail, Users, FileText, Zap, BarChart2, FormInput,
  Settings, ChevronDown, ChevronRight, Plus, X, Menu,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Campaigns', icon: Mail, to: '/campaigns' },
  { label: 'Contacts', icon: Users, to: '/contacts' },
  { label: 'Templates', icon: FileText, to: '/templates' },
  { label: 'Automations', icon: Zap, to: '/automations' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
  { label: 'Forms', icon: FormInput, to: '/forms' },
];

const settingsItems = [
  { label: 'Company', to: '/settings/company' },
  { label: 'Sending', to: '/settings/sending' },
  { label: 'Tracking', to: '/settings/tracking' },
  { label: 'Preferences', to: '/settings/preferences' },
  { label: 'Profile', to: '/settings/profile' },
];

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(
    location.pathname.startsWith('/settings')
  );

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const isSettingsActive = location.pathname.startsWith('/settings');

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            zIndex: 199, display: 'none',
          }}
          className="sidebar-overlay"
        />
      )}

      <aside className="sidebar" style={{ transform: mobileOpen ? 'translateX(0)' : undefined }}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">A</div>
          <div>
            <div className="logo-name">Acme</div>
            <div className="logo-sub">Marketing Workspace</div>
          </div>
          <button className="sidebar-mobile-close" onClick={onMobileClose} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>

        {/* Create Campaign CTA */}
        <div style={{ padding: '12px 14px 4px' }}>
          <button
            className="create-campaign-btn"
            onClick={() => { navigate('/campaigns/new'); onMobileClose?.(); }}
          >
            <Plus size={15} />
            Create Campaign
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${isActive(item.to) ? 'active' : ''}`}
              onClick={onMobileClose}
              aria-current={isActive(item.to) ? 'page' : undefined}
            >
              <item.icon size={16} />
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Settings expandable */}
          <div>
            <button
              className={`sidebar-item sidebar-group-toggle ${isSettingsActive ? 'active' : ''}`}
              onClick={() => setSettingsOpen(o => !o)}
              aria-expanded={settingsOpen}
            >
              <Settings size={16} />
              <span style={{ flex: 1, textAlign: 'left' }}>Settings</span>
              {settingsOpen
                ? <ChevronDown size={13} style={{ opacity: 0.6 }} />
                : <ChevronRight size={13} style={{ opacity: 0.6 }} />
              }
            </button>
            {settingsOpen && (
              <div className="sidebar-subnav">
                {settingsItems.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`sidebar-subitem ${location.pathname === item.to ? 'active' : ''}`}
                    onClick={onMobileClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          left: 0; top: 0; bottom: 0;
          width: var(--sidebar-width);
          background: var(--navy);
          display: flex;
          flex-direction: column;
          z-index: 200;
          overflow-y: auto;
          overflow-x: hidden;
          transition: transform var(--transition);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 18px 16px 14px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .logo-mark {
          width: 32px; height: 32px;
          background: var(--crimson);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px; font-weight: 800; color: white;
          flex-shrink: 0;
        }

        .logo-name {
          font-size: 14px; font-weight: 700;
          color: white; line-height: 1.2;
        }

        .logo-sub {
          font-size: 10.5px; color: rgba(255,255,255,0.45);
          line-height: 1;
        }

        .sidebar-mobile-close {
          margin-left: auto;
          color: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          display: none;
        }

        .create-campaign-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          background: var(--crimson);
          color: white;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: background var(--transition);
          border: none;
          font-family: inherit;
        }

        .create-campaign-btn:hover { background: var(--crimson-hover); }

        .sidebar-nav {
          padding: 8px 0;
          flex: 1;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          color: rgba(255,255,255,0.6);
          font-size: 13.5px;
          font-weight: 400;
          cursor: pointer;
          transition: all var(--transition);
          border-left: 3px solid transparent;
          text-decoration: none;
          width: 100%;
          background: none;
          font-family: inherit;
        }

        .sidebar-item:hover { color: white; background: rgba(255,255,255,0.06); text-decoration: none; }
        .sidebar-item.active {
          color: white;
          background: rgba(255,255,255,0.1);
          border-left-color: var(--crimson);
          font-weight: 500;
        }

        .sidebar-group-toggle {
          border: none;
          width: 100%;
          text-align: left;
        }

        .sidebar-subnav {
          padding-left: 16px;
          border-left: none;
        }

        .sidebar-subitem {
          display: block;
          padding: 7px 16px 7px 34px;
          color: rgba(255,255,255,0.5);
          font-size: 13px;
          cursor: pointer;
          transition: all var(--transition);
          text-decoration: none;
          border-left: 3px solid transparent;
        }

        .sidebar-subitem:hover { color: rgba(255,255,255,0.85); text-decoration: none; background: rgba(255,255,255,0.04); }
        .sidebar-subitem.active { color: white; border-left-color: var(--crimson); background: rgba(255,255,255,0.06); }

        @media (max-width: 900px) {
          .sidebar { transform: translateX(-100%); }
          .sidebar.mobile-open { transform: translateX(0); }
          .sidebar-mobile-close { display: flex; }
          .sidebar-overlay { display: block !important; }
        }
      `}</style>
    </>
  );
}

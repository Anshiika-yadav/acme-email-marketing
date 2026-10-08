import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, HelpCircle, ChevronDown, User, Settings, LogOut, Menu, X, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { campaigns, contacts, templates } from '../../data/mockData';

export default function Topbar({ onMobileMenuToggle }) {
  const navigate = useNavigate();
  const { currentUser, setIsAuthenticated, notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (q) => {
    setSearchQuery(q);
    if (!q.trim()) { setSearchResults([]); setSearchOpen(false); return; }
    const lq = q.toLowerCase();
    const results = [
      ...campaigns.filter(c => c.name.toLowerCase().includes(lq) || c.subject.toLowerCase().includes(lq))
        .slice(0, 3).map(c => ({ type: 'Campaign', label: c.name, to: `/campaigns` })),
      ...contacts.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(lq) || c.email.toLowerCase().includes(lq))
        .slice(0, 3).map(c => ({ type: 'Contact', label: `${c.firstName} ${c.lastName}`, sub: c.email, to: `/contacts/${c.id}` })),
      ...templates.filter(t => t.name.toLowerCase().includes(lq))
        .slice(0, 2).map(t => ({ type: 'Template', label: t.name, to: `/templates/${t.id}` })),
    ];
    setSearchResults(results);
    setSearchOpen(results.length > 0);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };

  const typeColors = { Campaign: 'var(--crimson)', Contact: 'var(--info)', Template: 'var(--success)' };

  return (
    <header className="topbar">
      {/* Mobile menu toggle */}
      <button className="topbar-mobile-menu" onClick={onMobileMenuToggle} aria-label="Toggle menu">
        <Menu size={20} />
      </button>

      {/* Search */}
      <div ref={searchRef} style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
        <div style={{ position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search campaigns, contacts, templates..."
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            onFocus={() => searchResults.length && setSearchOpen(true)}
            className="search-input"
            style={{ paddingLeft: 34, width: '100%' }}
            aria-label="Global search"
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(''); setSearchResults([]); setSearchOpen(false); }}
              style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
              <X size={13} />
            </button>
          )}
        </div>
        {searchOpen && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((r, i) => (
              <button key={i} className="search-result-item" onClick={() => { navigate(r.to); setSearchOpen(false); setSearchQuery(''); }}>
                <span className="search-result-type" style={{ background: typeColors[r.type] + '18', color: typeColors[r.type] }}>{r.type}</span>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 13.5, color: 'var(--text-primary)', fontWeight: 500 }}>{r.label}</div>
                  {r.sub && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{r.sub}</div>}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
        {/* Help */}
        <button className="topbar-icon-btn" aria-label="Help" data-tooltip="Help & docs">
          <HelpCircle size={18} />
        </button>

        {/* Notifications */}
        <div ref={notifRef} style={{ position: 'relative' }}>
          <button
            className="topbar-icon-btn"
            onClick={() => { setNotifOpen(o => !o); setProfileOpen(false); }}
            aria-label="Notifications"
            data-tooltip="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>
          {notifOpen && (
            <div className="notif-panel">
              <div className="notif-header">
                <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                {unreadCount > 0 && (
                  <button className="notif-mark-all" onClick={markAllNotificationsRead}>
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
              </div>
              <div className="notif-list">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    className={`notif-item ${n.read ? 'read' : ''}`}
                    onClick={() => markNotificationRead(n.id)}
                  >
                    <div className={`notif-dot notif-dot-${n.type}`} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: n.read ? 400 : 600, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-xsmall)', marginTop: 3 }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div ref={profileRef} style={{ position: 'relative' }}>
          <button
            className="topbar-profile-btn"
            onClick={() => { setProfileOpen(o => !o); setNotifOpen(false); }}
            aria-label="Profile menu"
          >
            <div className="topbar-avatar">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <span className="topbar-username">{currentUser.name}</span>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </button>
          {profileOpen && (
            <div className="dropdown-menu" style={{ minWidth: 190 }}>
              <div style={{ padding: '10px 14px 8px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{currentUser.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{currentUser.email}</div>
              </div>
              <button className="dropdown-item" onClick={() => { navigate('/settings/profile'); setProfileOpen(false); }}>
                <User size={14} /> Profile
              </button>
              <button className="dropdown-item" onClick={() => { navigate('/settings/preferences'); setProfileOpen(false); }}>
                <Settings size={14} /> Preferences
              </button>
              <div className="dropdown-separator" />
              <button className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .topbar {
          position: fixed;
          top: 0; left: var(--sidebar-width); right: 0;
          height: var(--topbar-height);
          background: var(--surface);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          padding: 0 24px;
          gap: 12px;
          z-index: 150;
          box-shadow: var(--shadow-sm);
        }

        .topbar-mobile-menu {
          display: none;
          cursor: pointer;
          color: var(--text-secondary);
          padding: 6px;
          border-radius: var(--radius-sm);
        }
        .topbar-mobile-menu:hover { background: var(--bg); }

        .topbar-icon-btn {
          position: relative;
          width: 34px; height: 34px;
          display: flex; align-items: center; justify-content: center;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition);
          background: none;
        }
        .topbar-icon-btn:hover { background: var(--bg); color: var(--text-primary); }

        .notif-badge {
          position: absolute;
          top: 4px; right: 4px;
          width: 16px; height: 16px;
          background: var(--crimson);
          color: white;
          font-size: 9.5px;
          font-weight: 700;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid var(--surface);
        }

        .topbar-profile-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 5px 10px;
          border-radius: var(--radius-md);
          cursor: pointer;
          background: none;
          transition: background var(--transition);
        }
        .topbar-profile-btn:hover { background: var(--bg); }

        .topbar-avatar {
          width: 30px; height: 30px;
          background: var(--crimson);
          color: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 11.5px; font-weight: 700;
          flex-shrink: 0;
        }

        .topbar-username {
          font-size: 13px; font-weight: 500;
          color: var(--text-primary);
          max-width: 120px;
          overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }

        .search-dropdown {
          position: absolute;
          top: calc(100% + 6px); left: 0; right: 0;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          overflow: hidden;
          z-index: 300;
          animation: slideUp 150ms ease;
        }

        .search-result-item {
          display: flex; align-items: center; gap: 10px;
          width: 100%; padding: 9px 12px;
          background: none; border: none; cursor: pointer;
          transition: background var(--transition);
        }
        .search-result-item:hover { background: var(--bg); }

        .search-result-type {
          font-size: 11px; font-weight: 600;
          padding: 2px 7px; border-radius: 20px;
          white-space: nowrap;
        }

        .notif-panel {
          position: absolute;
          top: calc(100% + 8px); right: -60px;
          width: 340px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          z-index: 300;
          overflow: hidden;
          animation: slideUp 150ms ease;
        }

        .notif-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
        }

        .notif-mark-all {
          display: flex; align-items: center; gap: 4px;
          font-size: 12px; color: var(--crimson);
          cursor: pointer; background: none;
          transition: opacity var(--transition);
        }
        .notif-mark-all:hover { opacity: 0.7; }

        .notif-list { max-height: 360px; overflow-y: auto; }

        .notif-item {
          display: flex; align-items: flex-start; gap: 10px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          cursor: pointer;
          transition: background var(--transition);
          background: #fdfeff;
        }
        .notif-item:hover { background: var(--bg); }
        .notif-item.read { background: var(--surface); }
        .notif-item:last-child { border-bottom: none; }

        .notif-dot {
          width: 8px; height: 8px; border-radius: 50%;
          flex-shrink: 0; margin-top: 4px;
        }
        .notif-dot-success { background: var(--success); }
        .notif-dot-info    { background: var(--info); }
        .notif-dot-warning { background: var(--warning); }
        .notif-dot-error   { background: var(--error); }

        @media (max-width: 900px) {
          .topbar { left: 0; padding: 0 16px; }
          .topbar-mobile-menu { display: flex; }
          .topbar-username { display: none; }
          .notif-panel { right: -20px; width: 300px; }
        }

        @media (max-width: 600px) {
          .topbar { padding: 0 12px; gap: 6px; }
        }
      `}</style>
    </header>
  );
}

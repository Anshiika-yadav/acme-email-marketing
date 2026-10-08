import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Toggle from '../../components/common/Toggle';
import { Camera, Lock } from 'lucide-react';

export default function ProfileSettings() {
  const { currentUser, showToast } = useApp();
  const [form, setForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    jobTitle: 'Marketing Manager',
    phone: '+1 415-555-0100',
    bio: 'Leading email marketing strategy at Acme Technologies.',
  });
  const [notifs, setNotifs] = useState({ email: true, desktop: true, digest: false });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [showPwSection, setShowPwSection] = useState(false);

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Profile Info */}
      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Profile Information</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>Update your personal account details.</p>

        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--crimson)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 700 }}>
              {form.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <button style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: '50%', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid white' }} aria-label="Change avatar">
              <Camera size={12} />
            </button>
          </div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 600 }}>{form.name}</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{form.jobTitle}</p>
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }}>Change Photo</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name</label>
            <input className="form-input" value={form.name} onChange={e => update('name', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Job Title</label>
            <input className="form-input" value={form.jobTitle} onChange={e => update('jobTitle', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={form.email} onChange={e => update('email', e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Phone</label>
            <input type="tel" className="form-input" value={form.phone} onChange={e => update('phone', e.target.value)} />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea className="form-textarea" value={form.bio} onChange={e => update('bio', e.target.value)} style={{ minHeight: 70 }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary" onClick={() => showToast('Profile saved')}>Save Profile</button>
        </div>
      </div>

      {/* Password */}
      <div className="card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showPwSection ? 20 : 0 }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 3 }}>Password</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)' }}>Last changed 3 months ago</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowPwSection(s => !s)}>
            <Lock size={13} /> {showPwSection ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        {showPwSection && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['Current Password', 'current'], ['New Password', 'newPw'], ['Confirm New Password', 'confirm']].map(([label, field]) => (
              <div key={field} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{label}</label>
                <input type="password" className="form-input" value={pwForm[field]} onChange={e => setPwForm(p => ({ ...p, [field]: e.target.value }))} />
              </div>
            ))}
            <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: 'var(--text-muted)' }}>
              This is a UI placeholder. No real password change is performed (demo mode).
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className="btn btn-secondary" onClick={() => setShowPwSection(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { setShowPwSection(false); showToast('Password updated (Demo)', 'success'); }}>Update Password</button>
            </div>
          </div>
        )}
      </div>

      {/* Notification Preferences */}
      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Notification Preferences</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20 }}>Choose how you receive alerts and updates.</p>
        {[
          { key: 'email', label: 'Email notifications', desc: 'Receive important updates via email.' },
          { key: 'desktop', label: 'In-app notifications', desc: 'Show alerts within the application.' },
          { key: 'digest', label: 'Weekly digest email', desc: 'A weekly summary of performance metrics.' },
        ].map(item => (
          <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</p>
            </div>
            <Toggle checked={notifs[item.key]} onChange={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <button className="btn btn-primary" onClick={() => showToast('Notification preferences saved')}>Save Preferences</button>
        </div>
      </div>
    </div>
  );
}

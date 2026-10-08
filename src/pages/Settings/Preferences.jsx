import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Toggle from '../../components/common/Toggle';

export default function PreferencesSettings() {
  const { showToast } = useApp();
  const [prefs, setPrefs] = useState({
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    tableCompact: false,
    showPreviewText: true,
    defaultView: 'table',
    emailDigest: true,
    campaignAlerts: true,
    bounceAlerts: true,
    weeklyReport: false,
    theme: 'light',
  });

  const update = (key, val) => setPrefs(p => ({ ...p, [key]: val }));
  const toggle = (key) => setPrefs(p => ({ ...p, [key]: !p[key] }));

  return (
    <div className="card" style={{ padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Workspace Preferences</h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28 }}>Customize how the application behaves for your account.</p>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>Display Settings</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Default Timezone</label>
          <select className="form-select" value={prefs.timezone} onChange={e => update('timezone', e.target.value)}>
            {['America/Los_Angeles', 'America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Berlin'].map(z => <option key={z}>{z}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Date Format</label>
          <select className="form-select" value={prefs.dateFormat} onChange={e => update('dateFormat', e.target.value)}>
            {['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'].map(f => <option key={f}>{f}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Default Campaign View</label>
          <select className="form-select" value={prefs.defaultView} onChange={e => update('defaultView', e.target.value)}>
            <option value="table">Table</option>
            <option value="card">Card Grid</option>
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Theme</label>
          <select className="form-select" value={prefs.theme} onChange={e => update('theme', e.target.value)}>
            <option value="light">Light</option>
            <option value="dark">Dark (Coming soon)</option>
          </select>
        </div>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-secondary)' }}>Dashboard Preferences</h3>
      {[
        { key: 'tableCompact', label: 'Compact table density', desc: 'Use a denser row height in data tables.' },
        { key: 'showPreviewText', label: 'Show preview text in campaign list', desc: 'Display email preview text below the subject line.' },
      ].map(item => (
        <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</p>
          </div>
          <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
        </div>
      ))}

      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 14px', color: 'var(--text-secondary)' }}>Notification Preferences</h3>
      {[
        { key: 'emailDigest', label: 'Daily email digest', desc: 'Receive a daily summary of campaign performance.' },
        { key: 'campaignAlerts', label: 'Campaign alerts', desc: 'Get notified when a campaign is sent or scheduled.' },
        { key: 'bounceAlerts', label: 'Bounce rate alerts', desc: 'Alert when a campaign bounce rate exceeds 2%.' },
        { key: 'weeklyReport', label: 'Weekly performance report', desc: 'Receive a weekly analytics summary every Monday.' },
      ].map(item => (
        <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</p>
            <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</p>
          </div>
          <Toggle checked={prefs[item.key]} onChange={() => toggle(item.key)} />
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
        <button className="btn btn-secondary">Reset Defaults</button>
        <button className="btn btn-primary" onClick={() => showToast('Preferences saved')}>Save Preferences</button>
      </div>
    </div>
  );
}

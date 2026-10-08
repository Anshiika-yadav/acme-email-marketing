import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Toggle from '../../components/common/Toggle';

export default function TrackingSettings() {
  const { showToast } = useApp();
  const [settings, setSettings] = useState({
    openTracking: true,
    clickTracking: true,
    utmTracking: true,
    campaignAttribution: true,
    utmSource: 'newsletter',
    utmMedium: 'email',
    utmCampaign: '{{campaign_name}}',
  });

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));
  const update = (key, val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => showToast('Tracking settings saved');

  const rows = [
    {
      key: 'openTracking',
      title: 'Open Tracking',
      desc: 'Track when contacts open your emails using a 1×1 invisible pixel. Required for open rate metrics.',
    },
    {
      key: 'clickTracking',
      title: 'Click Tracking',
      desc: 'Wrap links in your emails to track when contacts click them. Required for click rate metrics.',
    },
    {
      key: 'utmTracking',
      title: 'UTM Parameter Tracking',
      desc: 'Automatically append UTM parameters to all links for Google Analytics attribution.',
    },
    {
      key: 'campaignAttribution',
      title: 'Campaign Attribution',
      desc: 'Associate contact actions (clicks, sign-ups) with the campaign that drove them.',
    },
  ];

  return (
    <div className="card" style={{ padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Tracking & Attribution</h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 28 }}>
        Control how your email engagement is tracked. Changes apply to all future campaigns.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {rows.map((row, i) => (
          <div key={row.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '18px 0', borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : 'none', gap: 20 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>{row.title}</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{row.desc}</p>
            </div>
            <div style={{ flexShrink: 0, paddingTop: 2 }}>
              <Toggle checked={settings[row.key]} onChange={() => toggle(row.key)} />
            </div>
          </div>
        ))}
      </div>

      {settings.utmTracking && (
        <>
          <h3 style={{ fontSize: 14, fontWeight: 600, margin: '24px 0 14px', color: 'var(--text-secondary)' }}>UTM Parameters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 20 }}>
            {[
              { label: 'UTM Source', key: 'utmSource', hint: 'e.g. newsletter, acme' },
              { label: 'UTM Medium', key: 'utmMedium', hint: 'e.g. email, cpc' },
              { label: 'UTM Campaign', key: 'utmCampaign', hint: '{{campaign_name}} for dynamic' },
            ].map(({ label, key, hint }) => (
              <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">{label}</label>
                <input className="form-input" value={settings[key]} onChange={e => update(key, e.target.value)} />
                <span className="form-hint">{hint}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              Preview: ?utm_source={settings.utmSource}&utm_medium={settings.utmMedium}&utm_campaign={settings.utmCampaign}
            </p>
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

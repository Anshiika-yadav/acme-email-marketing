import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Info } from 'lucide-react';

export default function SendingSettings() {
  const { showToast } = useApp();
  const [form, setForm] = useState({
    defaultFromName: 'Acme Technologies',
    defaultFromEmail: 'marketing@acmetechnologies.com',
    replyTo: 'support@acmetechnologies.com',
    footerText: 'Acme Technologies · 100 Innovation Drive, San Francisco, CA 94105',
    unsubscribeText: 'If you no longer wish to receive these emails, you can unsubscribe at any time.',
  });

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  return (
    <div>
      {/* Notice Banner */}
      <div style={{ background: 'var(--info-bg)', border: '1px solid #bde0fb', borderRadius: 10, padding: '14px 18px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
        <Info size={16} color="var(--info)" style={{ flexShrink: 0, marginTop: 1 }} />
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--info)', marginBottom: 3 }}>Sending Infrastructure</p>
          <p style={{ fontSize: 13, color: '#1a5c8a', lineHeight: 1.6 }}>
            Sending configuration (SMTP, delivery infrastructure, IP warm-up, and domain authentication) is managed by your company administrator. Contact your IT team to update these settings.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Default Sender Settings</h2>
        <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>These defaults apply to new campaigns unless overridden per campaign.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Default From Name</label>
            <input className="form-input" value={form.defaultFromName} onChange={e => update('defaultFromName', e.target.value)} />
            <span className="form-hint">Shown as the sender name in recipients' inboxes</span>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Default From Email</label>
            <input type="email" className="form-input" value={form.defaultFromEmail} onChange={e => update('defaultFromEmail', e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Reply-to Address</label>
          <input type="email" className="form-input" value={form.replyTo} onChange={e => update('replyTo', e.target.value)} />
          <span className="form-hint">Where replies from subscribers will be directed</span>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 14px', color: 'var(--text-secondary)' }}>Email Footer</h3>

        <div className="form-group">
          <label className="form-label">Company Address (Footer)</label>
          <input className="form-input" value={form.footerText} onChange={e => update('footerText', e.target.value)} />
          <span className="form-hint">Required by CAN-SPAM and GDPR. Must include your physical address.</span>
        </div>

        <div className="form-group">
          <label className="form-label">Unsubscribe Text</label>
          <textarea className="form-textarea" value={form.unsubscribeText} onChange={e => update('unsubscribeText', e.target.value)} style={{ minHeight: 70 }} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 14px', color: 'var(--text-secondary)' }}>Sending Identity</h3>
        <div style={{ background: 'var(--bg)', borderRadius: 10, padding: '16px 18px' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)', flexShrink: 0 }} />
            <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>marketing@acmetechnologies.com</span>
            <span style={{ fontSize: 12, padding: '2px 8px', background: 'var(--success-bg)', color: 'var(--success)', borderRadius: 20, fontWeight: 500 }}>Verified</span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>Domain <strong>acmetechnologies.com</strong> — DKIM and SPF authenticated by your IT administrator.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary" onClick={() => showToast('Sending settings saved')}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

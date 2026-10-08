import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Upload } from 'lucide-react';

export default function CompanySettings() {
  const { showToast } = useApp();
  const [form, setForm] = useState({
    companyName: 'Acme Technologies',
    website: 'https://acmetechnologies.com',
    addressLine1: '100 Innovation Drive',
    addressLine2: 'Suite 400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    industry: 'Software & Technology',
    language: 'English (US)',
    timezone: 'America/Los_Angeles',
  });

  const update = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const handleSave = () => showToast('Company settings saved successfully');

  return (
    <div className="card" style={{ padding: 28 }}>
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Company Information</h2>
      <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>This information appears in your email footers and sender details.</p>

      {/* Logo */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div style={{ width: 80, height: 80, background: 'var(--crimson)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', flexShrink: 0 }}>A</div>
        <div>
          <p style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 6 }}>Company Logo</p>
          <p style={{ fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 10 }}>PNG, JPG or SVG. Max 2MB.</p>
          <button className="btn btn-secondary btn-sm"><Upload size={13} /> Upload Logo</button>
        </div>
      </div>

      <hr className="divider" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Company Name <span className="required">*</span></label>
          <input className="form-input" value={form.companyName} onChange={e => update('companyName', e.target.value)} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Website</label>
          <input type="url" className="form-input" value={form.website} onChange={e => update('website', e.target.value)} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Industry</label>
        <select className="form-select" value={form.industry} onChange={e => update('industry', e.target.value)}>
          {['Software & Technology', 'Financial Services', 'Healthcare', 'Retail & E-commerce', 'Manufacturing', 'Education', 'Marketing & Advertising', 'Other'].map(i => <option key={i}>{i}</option>)}
        </select>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 14px', color: 'var(--text-secondary)' }}>Office Address</h3>
      <div className="form-group">
        <label className="form-label">Address Line 1</label>
        <input className="form-input" value={form.addressLine1} onChange={e => update('addressLine1', e.target.value)} />
      </div>
      <div className="form-group">
        <label className="form-label">Address Line 2</label>
        <input className="form-input" value={form.addressLine2} onChange={e => update('addressLine2', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        {[['City', 'city'], ['State', 'state'], ['ZIP Code', 'zip']].map(([label, field]) => (
          <div key={field} className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">{label}</label>
            <input className="form-input" value={form[field]} onChange={e => update(field, e.target.value)} />
          </div>
        ))}
      </div>
      <div className="form-group">
        <label className="form-label">Country</label>
        <select className="form-select" value={form.country} onChange={e => update('country', e.target.value)}>
          {['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Other'].map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <h3 style={{ fontSize: 14, fontWeight: 600, margin: '20px 0 14px', color: 'var(--text-secondary)' }}>Locale</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Default Language</label>
          <select className="form-select" value={form.language} onChange={e => update('language', e.target.value)}>
            {['English (US)', 'English (UK)', 'Spanish', 'French', 'German', 'Portuguese'].map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Default Timezone</label>
          <select className="form-select" value={form.timezone} onChange={e => update('timezone', e.target.value)}>
            {['America/Los_Angeles', 'America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Berlin', 'Asia/Tokyo'].map(z => <option key={z}>{z}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button className="btn btn-secondary">Cancel</button>
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

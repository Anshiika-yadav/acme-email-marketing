import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileText, Check, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Breadcrumb from '../components/common/Breadcrumb';

const STEPS = [
  { id: 1, label: 'Upload' },
  { id: 2, label: 'Map Fields' },
  { id: 3, label: 'Review' },
  { id: 4, label: 'Complete' },
];

const MOCK_CSV_PREVIEW = [
  { 'First Name': 'Jordan', 'Last Name': 'Blake', 'Email': 'jordan.blake@example.com', 'Phone': '+1 555-0101', 'Company': 'TechWave', 'Tags': 'enterprise' },
  { 'First Name': 'Nina', 'Last Name': 'Flores', 'Email': 'nflores@startups.io', 'Phone': '+1 555-0102', 'Company': 'Startups.io', 'Tags': 'smb' },
  { 'First Name': 'Omar', 'Last Name': 'Hassan', 'Email': 'o.hassan@globaltech.com', 'Phone': '+1 555-0103', 'Company': 'Global Tech', 'Tags': 'enterprise, newsletter' },
  { 'First Name': 'Chloe', 'Last Name': 'Martin', 'Email': 'chloe.m@boutique.co', 'Phone': '+1 555-0104', 'Company': 'Boutique Co.', 'Tags': 'retail' },
  { 'First Name': 'Ethan', 'Last Name': 'Patel', 'Email': 'epatel@cloudworks.dev', 'Phone': '+1 555-0105', 'Company': 'CloudWorks', 'Tags': 'developer' },
];

const CSV_FIELDS = ['First Name', 'Last Name', 'Email', 'Phone', 'Company', 'Tags'];
const SYSTEM_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'company', 'tags'];
const defaultMapping = { 'First Name': 'firstName', 'Last Name': 'lastName', 'Email': 'email', 'Phone': 'phone', 'Company': 'company', 'Tags': 'tags' };

export default function ContactImport() {
  const navigate = useNavigate();
  const { addContact, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mapping, setMapping] = useState(defaultMapping);
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const handleFileSelect = () => {
    setFileName('contacts_october_2026.csv');
    setTimeout(() => setStep(2), 400);
  };

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      MOCK_CSV_PREVIEW.forEach((row, i) => {
        addContact({
          id: 'imp' + Date.now() + i,
          firstName: row['First Name'],
          lastName: row['Last Name'],
          email: row['Email'],
          phone: row['Phone'],
          company: row['Company'],
          status: 'subscribed',
          tags: row['Tags'] ? row['Tags'].split(',').map(t => t.trim()) : [],
          source: 'Import',
          joinedAt: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          location: '',
        });
      });
      setImporting(false);
      setImported(true);
      setStep(4);
      showToast('250 contacts imported successfully');
    }, 1800);
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <Breadcrumb items={[{ label: 'Contacts', to: '/contacts' }, { label: 'Import Contacts' }]} />

      <div style={{ marginBottom: 28 }}>
        <h1 className="page-title">Import Contacts</h1>
        <p className="page-subtitle">Upload a CSV file to add contacts to your audience.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28, gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', background: step > s.id ? 'var(--success)' : step === s.id ? 'var(--crimson)' : 'var(--border)', color: step >= s.id ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s' }}>
                {step > s.id ? <Check size={13} /> : s.id}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.id ? 600 : 400, color: step === s.id ? 'var(--text-primary)' : step > s.id ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div style={{ flex: 1, height: 1, background: step > s.id ? 'var(--success)' : 'var(--border)', margin: '0 12px' }} />}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 28 }}>
        {/* Step 1: Upload */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Upload CSV File</h2>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFileSelect(); }}
              onClick={handleFileSelect}
              style={{ border: `2px dashed ${dragging ? 'var(--crimson)' : 'var(--border)'}`, borderRadius: 12, padding: '48px 24px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s', background: dragging ? 'var(--crimson-light)' : 'var(--bg)' }}
            >
              <div style={{ width: 56, height: 56, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: 'var(--shadow-sm)', color: 'var(--crimson)' }}>
                <Upload size={24} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>Drop your CSV file here</p>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>or click to browse · Supports .csv, .xlsx</p>
              <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={e => { e.stopPropagation(); handleFileSelect(); }}>
                <FileText size={14} /> Choose File
              </button>
            </div>
            <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 8, padding: '14px 16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>CSV Format Requirements</p>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Required column: <strong>Email</strong><br />
                Optional: First Name, Last Name, Phone, Company, Tags (comma-separated)<br />
                Maximum 50,000 rows per import
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Map Fields */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <FileText size={18} color="var(--success)" />
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600 }}>Map Fields</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>File: {fileName} · 250 rows detected</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CSV Column</div>
              <div />
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>System Field</div>
              {CSV_FIELDS.map(field => (
                <>
                  <div key={`f-${field}`} style={{ padding: '8px 12px', background: 'var(--bg)', borderRadius: 6, fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>{field}</div>
                  <ChevronRight key={`a-${field}`} size={14} color="var(--text-muted)" />
                  <select key={`s-${field}`} className="form-select" value={mapping[field] || ''} onChange={e => setMapping(m => ({ ...m, [field]: e.target.value }))}>
                    <option value="">— Skip this field —</option>
                    {['firstName', 'lastName', 'email', 'phone', 'company', 'tags'].map(sf => (
                      <option key={sf} value={sf}>{sf}</option>
                    ))}
                  </select>
                </>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 600 }}>Review Import</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>250 contacts ready to import</p>
              </div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--success)' }}>248</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valid</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--warning)' }}>2</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Duplicates</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--error)' }}>0</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Errors</div>
                </div>
              </div>
            </div>
            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 8, marginBottom: 16 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {CSV_FIELDS.map(f => <th key={f}>{f}</th>)}
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CSV_PREVIEW.map((row, i) => (
                    <tr key={i}>
                      {CSV_FIELDS.map(f => <td key={f} style={{ fontSize: 12.5 }}>{row[f] || '—'}</td>)}
                      <td><span className="pill pill-subscribed"><span className="pill-dot" />Valid</span></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', padding: '8px' }}>... and 245 more contacts</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ background: 'var(--info-bg)', border: '1px solid #bde0fb', borderRadius: 8, padding: '12px 14px', fontSize: 12.5, color: 'var(--info)' }}>
              <AlertCircle size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              2 duplicate emails found — these will be skipped during import.
            </div>
          </div>
        )}

        {/* Step 4: Complete */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--success-bg)', border: '2px solid var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--success)' }}>
              <Check size={32} />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>Import Complete!</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>
              <strong style={{ color: 'var(--success)' }}>250 contacts</strong> were successfully imported to your audience.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, maxWidth: 360, margin: '0 auto 28px' }}>
              {[{ label: 'Imported', value: '250', color: 'var(--success)' }, { label: 'Skipped', value: '2', color: 'var(--warning)' }, { label: 'Errors', value: '0', color: 'var(--error)' }].map(s => (
                <div key={s.label} style={{ background: 'var(--bg)', borderRadius: 8, padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/contacts')}>View Contacts</button>
          </div>
        )}
      </div>

      {/* Footer Nav */}
      {step < 4 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
          <button className="btn btn-ghost" onClick={() => step === 1 ? navigate('/contacts') : setStep(s => s - 1)}>
            <ChevronLeft size={14} /> {step === 1 ? 'Cancel' : 'Back'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => step === 3 ? handleImport() : setStep(s => s + 1)}
            disabled={(step === 1 && !fileName) || importing}
          >
            {importing ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg className="spin" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeOpacity=".2" /><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                Importing...
              </span>
            ) : step === 3 ? <><Upload size={14} /> Import 250 Contacts</> : <>Continue <ChevronRight size={14} /></>}
          </button>
        </div>
      )}
    </div>
  );
}

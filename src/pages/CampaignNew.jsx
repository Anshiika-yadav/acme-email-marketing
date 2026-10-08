import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Check, Users, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { segments } from '../data/mockData';

const STEPS = [
  { id: 1, label: 'Details' },
  { id: 2, label: 'Audience' },
  { id: 3, label: 'Design' },
  { id: 4, label: 'Review' },
  { id: 5, label: 'Schedule' },
];

const defaultForm = {
  name: '',
  description: '',
  subject: '',
  previewText: '',
  fromName: 'Acme Technologies',
  fromEmail: 'marketing@acmetechnologies.com',
  replyTo: 'support@acmetechnologies.com',
  audienceType: 'all',
  segmentId: '',
};

export default function CampaignNew() {
  const navigate = useNavigate();
  const { addCampaign, showToast } = useApp();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(defaultForm);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    setErrors(e => ({ ...e, [field]: '' }));
    setSaved(false);
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Campaign name is required';
    if (!form.subject.trim()) e.subject = 'Subject line is required';
    if (!form.fromName.trim()) e.fromName = 'From name is required';
    if (!form.fromEmail.trim()) e.fromEmail = 'From email is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveDraft = () => {
    const id = 'c' + Date.now();
    const seg = segments.find(s => s.id === form.segmentId);
    const campaign = {
      id,
      name: form.name || 'Untitled Campaign',
      subject: form.subject || '(No subject)',
      previewText: form.previewText,
      status: 'draft',
      audience: form.audienceType === 'all' ? 'All Contacts' : seg?.name || 'Custom',
      audienceCount: form.audienceType === 'all' ? 15620 : seg?.contactCount || 0,
      fromName: form.fromName,
      fromEmail: form.fromEmail,
      replyTo: form.replyTo,
      sent: 0, delivered: 0, opens: 0, uniqueOpens: 0,
      clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0,
      openRate: 0, clickRate: 0, bounceRate: 0, unsubscribeRate: 0,
      scheduledAt: null, sentAt: null,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      tags: [],
    };
    addCampaign(campaign);
    showToast('Draft saved successfully');
    setSaved(true);
    return id;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step < 5) setStep(s => s + 1);
    if (step === 3) {
      const id = handleSaveDraft();
      navigate(`/campaigns/${id}/design`);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else navigate('/campaigns');
  };

  const audienceCount = form.audienceType === 'all'
    ? 15620
    : segments.find(s => s.id === form.segmentId)?.contactCount || 0;

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')} style={{ marginBottom: 12, paddingLeft: 0 }}>
          ← Back to Campaigns
        </button>
        <h1 className="page-title">Create Campaign</h1>
        <p className="page-subtitle">Fill in the details to create your email campaign.</p>
      </div>

      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step > s.id ? 'var(--success)' : step === s.id ? 'var(--crimson)' : 'var(--border)',
                color: step >= s.id ? 'white' : 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, flexShrink: 0, transition: 'all 0.2s',
              }}>
                {step > s.id ? <Check size={13} /> : s.id}
              </div>
              <span style={{ fontSize: 13, fontWeight: step === s.id ? 600 : 400, color: step === s.id ? 'var(--text-primary)' : step > s.id ? 'var(--success)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ flex: 1, height: 1, background: step > s.id ? 'var(--success)' : 'var(--border)', margin: '0 12px' }} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="card" style={{ padding: 28 }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Campaign Details</h2>
            <div className="form-group">
              <label className="form-label">Campaign Name <span className="required">*</span></label>
              <input className="form-input" placeholder="e.g. October Product Update" value={form.name} onChange={e => update('name', e.target.value)} />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Internal Description</label>
              <textarea className="form-textarea" placeholder="Add internal notes about this campaign..." value={form.description} onChange={e => update('description', e.target.value)} style={{ minHeight: 72 }} />
            </div>
            <hr className="divider" />
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: 'var(--text-secondary)' }}>Email Settings</h3>
            <div className="form-group">
              <label className="form-label">Subject Line <span className="required">*</span></label>
              <input className="form-input" placeholder="e.g. Exciting new features in Acme Suite 4.2" value={form.subject} onChange={e => update('subject', e.target.value)} />
              {errors.subject && <span className="form-error">{errors.subject}</span>}
              <span className="form-hint">{form.subject.length}/150 characters</span>
            </div>
            <div className="form-group">
              <label className="form-label">Preview Text</label>
              <input className="form-input" placeholder="Short preview shown in inbox..." value={form.previewText} onChange={e => update('previewText', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">From Name <span className="required">*</span></label>
                <input className="form-input" value={form.fromName} onChange={e => update('fromName', e.target.value)} />
                {errors.fromName && <span className="form-error">{errors.fromName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">From Email <span className="required">*</span></label>
                <input className="form-input" type="email" value={form.fromEmail} onChange={e => update('fromEmail', e.target.value)} />
                {errors.fromEmail && <span className="form-error">{errors.fromEmail}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reply-to Email</label>
              <input className="form-input" type="email" value={form.replyTo} onChange={e => update('replyTo', e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>Select Audience</h2>
            <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 24 }}>Choose who will receive this campaign.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { value: 'all', label: 'All Contacts', desc: '15,620 subscribed contacts', icon: <Users size={18} /> },
                { value: 'segment', label: 'Segment', desc: 'Choose a specific audience segment', icon: <FileText size={18} /> },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: `2px solid ${form.audienceType === opt.value ? 'var(--crimson)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', background: form.audienceType === opt.value ? 'var(--crimson-light)' : 'white', transition: 'all 0.15s' }}>
                  <input type="radio" name="audience" value={opt.value} checked={form.audienceType === opt.value} onChange={() => update('audienceType', opt.value)} style={{ accentColor: 'var(--crimson)' }} />
                  <div style={{ color: 'var(--text-muted)' }}>{opt.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
            {form.audienceType === 'segment' && (
              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Select Segment</label>
                <select className="form-select" value={form.segmentId} onChange={e => update('segmentId', e.target.value)}>
                  <option value="">— Choose a segment —</option>
                  {segments.map(s => <option key={s.id} value={s.id}>{s.name} ({s.contactCount.toLocaleString()} contacts)</option>)}
                </select>
              </div>
            )}
            <div style={{ marginTop: 20, background: 'var(--bg)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                <strong>Estimated recipients:</strong>{' '}
                <span style={{ color: 'var(--crimson)', fontWeight: 700 }}>{audienceCount.toLocaleString()}</span>
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ width: 64, height: 64, background: 'var(--crimson-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--crimson)' }}>
              <FileText size={28} />
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Design Your Email</h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 24px' }}>
              You'll be taken to the visual email designer where you can build your email using blocks.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click <strong>"Continue"</strong> to open the email designer.</p>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Review Campaign</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Campaign Name', value: form.name || '—' },
                { label: 'Subject Line', value: form.subject || '—' },
                { label: 'From', value: `${form.fromName} <${form.fromEmail}>` },
                { label: 'Reply-to', value: form.replyTo },
                { label: 'Audience', value: form.audienceType === 'all' ? 'All Contacts (15,620)' : segments.find(s => s.id === form.segmentId)?.name || '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 140, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)', flexShrink: 0 }}>{row.label}</span>
                  <span style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Schedule Campaign</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { value: 'now', label: 'Send Now', desc: 'Send immediately after confirmation' },
                { value: 'schedule', label: 'Schedule for Later', desc: 'Choose a specific date and time' },
              ].map(opt => (
                <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: `2px solid ${form.sendWhen === opt.value ? 'var(--crimson)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  <input type="radio" name="sendWhen" value={opt.value} checked={form.sendWhen === opt.value} onChange={() => update('sendWhen', opt.value)} style={{ accentColor: 'var(--crimson)' }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{opt.label}</div>
                    <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
              {form.sendWhen === 'schedule' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 4 }}>
                  <div className="form-group"><label className="form-label">Date</label><input type="date" className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Time</label><input type="time" className="form-input" /></div>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16, padding: '14px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-md)' }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                This is a <strong>demo action</strong>. No real emails will be sent.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, alignItems: 'center' }}>
        <button className="btn btn-ghost" onClick={handleBack}>
          <ChevronLeft size={15} /> {step === 1 ? 'Cancel' : 'Back'}
        </button>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={handleSaveDraft}>Save Draft</button>
          <button className="btn btn-primary" onClick={handleNext}>
            {step === 5 ? 'Finish' : step === 3 ? 'Open Designer' : 'Continue'} <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

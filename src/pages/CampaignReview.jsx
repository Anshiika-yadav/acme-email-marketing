import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, ChevronLeft, Monitor, Smartphone, Send, Calendar, Edit, TestTube } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Breadcrumb from '../components/common/Breadcrumb';

export default function CampaignReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, updateCampaign, showToast } = useApp();

  const campaign = campaigns.find(c => c.id === id) || {
    name: 'October Product Update', subject: 'Exciting new features in Acme Suite 4.2',
    fromName: 'Acme Technologies', fromEmail: 'marketing@acmetechnologies.com',
    replyTo: 'support@acmetechnologies.com', audience: 'All Subscribers', audienceCount: 12480,
  };

  const [preview, setPreview] = useState('desktop');
  const [sendModal, setSendModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);
  const [testModal, setTestModal] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('09:00');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const checks = [
    { label: 'Subject line added', pass: !!campaign.subject },
    { label: 'Sender information complete', pass: !!campaign.fromName && !!campaign.fromEmail },
    { label: 'Audience selected', pass: !!campaign.audience },
    { label: 'Email content ready', pass: true },
    { label: 'Unsubscribe link included', pass: true },
    { label: 'Preview text set', pass: !!campaign.previewText },
  ];

  const allPassed = checks.every(c => c.pass);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSendModal(false);
      setSent(true);
      updateCampaign(id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sent: campaign.audienceCount || 12480,
        delivered: Math.round((campaign.audienceCount || 12480) * 0.985),
        opens: Math.round((campaign.audienceCount || 12480) * 0.334),
        openRate: 33.4, clickRate: 8.9,
      });
      showToast('Campaign sent successfully (Demo — no real emails sent)', 'success');
      setTimeout(() => navigate(`/campaigns/${id}/report`), 1500);
    }, 1800);
  };

  const handleSchedule = () => {
    updateCampaign(id, {
      status: 'scheduled',
      scheduledAt: `${scheduleDate}T${scheduleTime}:00Z`,
      updatedAt: new Date().toISOString(),
    });
    setScheduleModal(false);
    showToast('Campaign scheduled successfully');
    navigate('/campaigns');
  };

  const handleTestEmail = () => {
    setTestModal(false);
    showToast(`Test email sent to ${testEmail} (Demo)`);
    setTestEmail('');
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Breadcrumb items={[{ label: 'Campaigns', to: '/campaigns' }, { label: campaign.name || 'Campaign' }]} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Review Campaign</h1>
          <p className="page-subtitle">{campaign.name}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/campaigns/${id}/design`)}>
            <Edit size={14} /> Edit Design
          </button>
          <button className="btn btn-secondary btn-sm" onClick={() => setTestModal(true)}>
            <TestTube size={14} /> Send Test
          </button>
          <button className="btn btn-secondary" onClick={() => setScheduleModal(true)}>
            <Calendar size={14} /> Schedule
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setSendModal(true)}
            disabled={!allPassed}
            style={{ opacity: allPassed ? 1 : 0.6 }}
          >
            <Send size={14} /> Send Campaign
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Campaign Summary */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>Campaign Summary</h2>
            {[
              { label: 'Campaign', value: campaign.name },
              { label: 'Subject', value: campaign.subject },
              { label: 'From', value: `${campaign.fromName}` },
              { label: 'Email', value: campaign.fromEmail },
              { label: 'Reply-to', value: campaign.replyTo },
              { label: 'Audience', value: campaign.audience },
              { label: 'Recipients', value: (campaign.audienceCount || 12480).toLocaleString() },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', flexDirection: 'column', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{row.label}</span>
                <span style={{ fontSize: 13.5, color: 'var(--text-primary)', marginTop: 2, wordBreak: 'break-all' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {/* Pre-send Checklist */}
          <div className="card" style={{ padding: 20 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--text-primary)' }}>Pre-send Checklist</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {checks.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: item.pass ? 'var(--success-bg)' : 'var(--error-bg)', border: `1.5px solid ${item.pass ? 'var(--success)' : 'var(--error)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {item.pass ? <Check size={11} color="var(--success)" /> : <X size={11} color="var(--error)" />}
                  </div>
                  <span style={{ fontSize: 13, color: item.pass ? 'var(--text-secondary)' : 'var(--error)' }}>{item.label}</span>
                </div>
              ))}
            </div>
            {!allPassed && (
              <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--warning-bg)', border: '1px solid #fde68a', borderRadius: 6, fontSize: 12.5, color: 'var(--warning)' }}>
                ⚠ Please fix the issues above before sending.
              </div>
            )}
          </div>
        </div>

        {/* Right: Email Preview */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600 }}>Email Preview</h2>
            <div style={{ display: 'flex', gap: 4, background: 'var(--bg)', borderRadius: 8, padding: 2 }}>
              <button className={`btn btn-sm ${preview === 'desktop' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('desktop')}><Monitor size={13} /> Desktop</button>
              <button className={`btn btn-sm ${preview === 'mobile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('mobile')}><Smartphone size={13} /> Mobile</button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)', borderRadius: 8, padding: 20 }}>
            <div style={{ width: preview === 'mobile' ? 320 : 520, background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', transition: 'width 0.3s' }}>
              <div style={{ background: '#f8f9fa', padding: '8px 14px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)' }}>
                <strong>From:</strong> {campaign.fromName} &lt;{campaign.fromEmail}&gt; &nbsp;·&nbsp; <strong>Subject:</strong> {campaign.subject}
              </div>
              <div style={{ padding: 24 }}>
                <div style={{ textAlign: 'center', padding: '12px 0 16px' }}>
                  <div style={{ width: 120, height: 32, background: 'var(--crimson)', borderRadius: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 14, fontWeight: 700 }}>ACME</div>
                </div>
                <h1 style={{ fontSize: preview === 'mobile' ? 20 : 24, fontWeight: 700, color: '#1e2a3a', marginBottom: 14, lineHeight: 1.3 }}>{campaign.subject}</h1>
                <p style={{ fontSize: 14, color: '#4a5568', lineHeight: 1.7, marginBottom: 20 }}>We have exciting updates for you this month. Our team has been working hard to deliver improvements across the entire Acme Suite platform including a redesigned analytics dashboard, faster bulk imports, and enhanced automation capabilities.</p>
                <div style={{ textAlign: 'center', marginBottom: 20 }}>
                  <span style={{ display: 'inline-block', background: '#c0392b', color: 'white', padding: '10px 24px', borderRadius: 6, fontSize: 14, fontWeight: 600 }}>View Full Release Notes</span>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '16px 0' }} />
                <p style={{ fontSize: 12, color: '#718096' }}>Thank you,<br /><strong>The Acme Technologies Team</strong></p>
                <p style={{ fontSize: 11, color: '#a0aec0', textAlign: 'center', marginTop: 16 }}>
                  Acme Technologies · 100 Innovation Drive, San Francisco, CA 94105<br />
                  <a href="#" style={{ color: '#c0392b' }}>Unsubscribe</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Send Confirmation Modal */}
      <Modal
        open={sendModal}
        onClose={() => !sending && setSendModal(false)}
        title="Send Campaign?"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setSendModal(false)} disabled={sending}>Cancel</Button>
            <Button variant="primary" onClick={handleSend} loading={sending}>Confirm Mock Send</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: 'var(--warning-bg)', border: '1px solid #fde68a', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: 'var(--warning)' }}>
            ⚠ <strong>Demo action.</strong> No real emails will be sent.
          </div>
          <p style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            You are about to send <strong>"{campaign.name}"</strong> to <strong>{(campaign.audienceCount || 12480).toLocaleString()} contacts</strong>. This is a demo — all metrics will be simulated.
          </p>
        </div>
      </Modal>

      {/* Schedule Modal */}
      <Modal open={scheduleModal} onClose={() => setScheduleModal(false)} title="Schedule Campaign"
        footer={
          <>
            <Button variant="secondary" onClick={() => setScheduleModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSchedule} disabled={!scheduleDate}>Schedule</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Send Date</label>
            <input type="date" className="form-input" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Send Time</label>
            <input type="time" className="form-input" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Timezone: America/New_York (EST)</p>
        </div>
      </Modal>

      {/* Test Email Modal */}
      <Modal open={testModal} onClose={() => setTestModal(false)} title="Send Test Email"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTestModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleTestEmail} disabled={!testEmail}>Send Test</Button>
          </>
        }
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ padding: '10px 12px', background: 'var(--bg)', borderRadius: 8, marginBottom: 14, fontSize: 12.5, color: 'var(--text-muted)' }}>
            Demo action — no real email will be sent.
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Recipient Email</label>
            <input type="email" className="form-input" placeholder="test@example.com" value={testEmail} onChange={e => setTestEmail(e.target.value)} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

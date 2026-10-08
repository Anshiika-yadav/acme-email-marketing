import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Tag, X, Plus, Mail, Phone, Building, MapPin, Calendar, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusPill from '../components/common/StatusPill';
import Tabs from '../components/common/Tabs';
import { campaigns } from '../data/mockData';

const TABS = [
  { label: 'Overview', value: 'overview' },
  { label: 'Activity', value: 'activity' },
  { label: 'Campaigns', value: 'campaigns' },
  { label: 'Notes', value: 'notes' },
];

const mockActivity = [
  { id: 1, type: 'opened', text: 'Opened "October Product Update"', time: '2026-10-01 10:23 AM' },
  { id: 2, type: 'clicked', text: 'Clicked "View Full Release Notes" in October Update', time: '2026-10-01 10:24 AM' },
  { id: 3, type: 'opened', text: 'Opened "Welcome Series — Day 1"', time: '2026-10-03 09:15 AM' },
  { id: 4, type: 'subscribed', text: 'Subscribed via Website Form', time: '2026-03-12 02:00 PM' },
];

const statusColors = { opened: 'var(--success)', clicked: 'var(--info)', subscribed: 'var(--crimson)', unsubscribed: 'var(--error)' };

export default function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contacts, updateContact, showToast } = useApp();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [addingTag, setAddingTag] = useState(false);
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([{ id: 1, text: 'Key enterprise contact — met at Q3 conference.', time: '2026-09-20', author: 'Sarah Mitchell' }]);
  const [editForm, setEditForm] = useState(null);

  const contact = contacts.find(c => c.id === id);
  if (!contact) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>Contact not found.</p>
      <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => navigate('/contacts')}>Back to Contacts</button>
    </div>
  );

  const openEdit = () => { setEditForm({ ...contact }); setEditing(true); };
  const saveEdit = () => {
    updateContact(id, editForm);
    setEditing(false);
    showToast('Contact updated successfully');
  };

  const addTag = () => {
    if (!newTag.trim() || contact.tags.includes(newTag.trim())) return;
    updateContact(id, { tags: [...contact.tags, newTag.trim()] });
    setNewTag('');
    setAddingTag(false);
    showToast(`Tag "${newTag}" added`);
  };

  const removeTag = (tag) => {
    updateContact(id, { tags: contact.tags.filter(t => t !== tag) });
    showToast(`Tag "${tag}" removed`);
  };

  const addNote = () => {
    if (!note.trim()) return;
    setNotes(n => [{ id: Date.now(), text: note, time: new Date().toISOString().split('T')[0], author: 'Sarah Mitchell' }, ...n]);
    setNote('');
    showToast('Note added');
  };

  const contactCampaigns = campaigns.filter(c => c.status === 'sent').slice(0, 4);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/contacts')} style={{ marginBottom: 16 }}>
        <ArrowLeft size={14} /> Back to Contacts
      </button>

      {/* Header Card */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--crimson)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{contact.firstName} {contact.lastName}</h1>
              <StatusPill status={contact.status} />
            </div>
            <div style={{ display: 'flex', gap: 20, marginTop: 10, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                <Mail size={13} color="var(--text-muted)" /> {contact.email}
              </span>
              {contact.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <Phone size={13} color="var(--text-muted)" /> {contact.phone}
                </span>
              )}
              {contact.company && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <Building size={13} color="var(--text-muted)" /> {contact.company}
                </span>
              )}
              {contact.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                  <MapPin size={13} color="var(--text-muted)" /> {contact.location}
                </span>
              )}
            </div>
            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {contact.tags.map(tag => (
                <span key={tag} className="tag-chip" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {tag}
                  <button onClick={() => removeTag(tag)} style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', marginLeft: 2 }} aria-label={`Remove ${tag}`}><X size={11} /></button>
                </span>
              ))}
              {addingTag ? (
                <div style={{ display: 'flex', gap: 4 }}>
                  <input
                    className="form-input"
                    style={{ width: 120, padding: '3px 8px', fontSize: 12 }}
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addTag(); if (e.key === 'Escape') { setAddingTag(false); setNewTag(''); } }}
                    placeholder="tag name"
                    autoFocus
                  />
                  <button className="btn btn-primary btn-sm" onClick={addTag}>Add</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setAddingTag(false); setNewTag(''); }}>✕</button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingTag(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer', padding: '2px 8px', border: '1px dashed var(--border)', borderRadius: 20, background: 'none' }}
                >
                  <Plus size={11} /> Add tag
                </button>
              )}
            </div>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={openEdit}><Edit2 size={13} /> Edit</button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Contact Information</h3>
            {[
              { label: 'Email', value: contact.email },
              { label: 'Phone', value: contact.phone || '—' },
              { label: 'Company', value: contact.company || '—' },
              { label: 'Location', value: contact.location || '—' },
              { label: 'Source', value: contact.source },
              { label: 'Status', value: <StatusPill status={contact.status} /> },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', gap: 12, paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                <span style={{ width: 90, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>{row.label}</span>
                <span style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Engagement Stats</h3>
            {[
              { label: 'Joined', value: new Date(contact.joinedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Last Activity', value: new Date(contact.lastActivity).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
              { label: 'Campaigns Received', value: '4' },
              { label: 'Total Opens', value: '9' },
              { label: 'Total Clicks', value: '4' },
              { label: 'Avg Open Rate', value: '75%' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, marginBottom: 10, borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Activity Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {mockActivity.map((act, i) => (
              <div key={act.id} style={{ display: 'flex', gap: 12, paddingBottom: 16, marginBottom: 16, borderBottom: i < mockActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: statusColors[act.type] + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Activity size={13} color={statusColors[act.type]} />
                </div>
                <div>
                  <p style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>{act.text}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'campaigns' && (
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 14, fontWeight: 600 }}>Campaign Engagement</h3>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Sent</th>
                <th>Opened</th>
                <th>Clicked</th>
              </tr>
            </thead>
            <tbody>
              {contactCampaigns.map(c => (
                <tr key={c.id}>
                  <td style={{ fontSize: 13.5, fontWeight: 500 }}>{c.name}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(c.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td><span className="pill pill-sent" style={{ fontSize: 11 }}><span className="pill-dot" />Yes</span></td>
                  <td><span className="pill pill-sent" style={{ fontSize: 11 }}><span className="pill-dot" />Yes</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'notes' && (
        <div>
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add Note</h3>
            <textarea
              className="form-textarea"
              placeholder="Write a note about this contact..."
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ minHeight: 80, marginBottom: 10 }}
            />
            <button className="btn btn-primary btn-sm" onClick={addNote} disabled={!note.trim()}>Save Note</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notes.map(n => (
              <div key={n.id} className="card" style={{ padding: 16 }}>
                <p style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.6 }}>{n.text}</p>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>{n.author} · {n.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Modal inline */}
      {editing && editForm && (
        <div className="modal-overlay" onClick={() => setEditing(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div className="modal-header"><h2 className="modal-title">Edit Contact</h2><button onClick={() => setEditing(false)} style={{ color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 4 }}><X size={18} /></button></div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
                </div>
              </div>
              {[['Email', 'email', 'email'], ['Phone', 'phone', 'tel'], ['Company', 'company', 'text']].map(([label, field, type]) => (
                <div key={field} className="form-group" style={{ marginBottom: 0, marginTop: 12 }}>
                  <label className="form-label">{label}</label>
                  <input type={type} className="form-input" value={editForm[field] || ''} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} />
                </div>
              ))}
              <div className="form-group" style={{ marginBottom: 0, marginTop: 12 }}>
                <label className="form-label">Status</label>
                <select className="form-select" value={editForm.status} onChange={e => setEditForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveEdit}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

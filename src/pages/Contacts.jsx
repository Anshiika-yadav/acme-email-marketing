import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Tag, Trash2, Download, Filter, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import StatusPill from '../components/common/StatusPill';
import Tabs from '../components/common/Tabs';
import SearchInput from '../components/common/SearchInput';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/Modal';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Subscribed', value: 'subscribed' },
  { label: 'Unsubscribed', value: 'unsubscribed' },
  { label: 'Bounced', value: 'bounced' },
];

export default function Contacts() {
  const navigate = useNavigate();
  const { contacts, deleteContact, updateContact, addContact, showToast } = useApp();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [tagModal, setTagModal] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [newContact, setNewContact] = useState({ firstName: '', lastName: '', email: '', phone: '', company: '', status: 'subscribed' });

  const filtered = contacts.filter(c => {
    if (tab !== 'all' && c.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      return `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q);
    }
    return true;
  });

  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.value === 'all' ? contacts.length : contacts.filter(c => c.status === t.value).length,
  }));

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(s => s.length === filtered.length ? [] : filtered.map(c => c.id));
  const allSelected = filtered.length > 0 && selected.length === filtered.length;

  const handleDelete = () => {
    if (deleteId === 'bulk') {
      selected.forEach(id => deleteContact(id));
      setSelected([]);
      showToast(`${selected.length} contacts deleted`);
    } else {
      deleteContact(deleteId);
      showToast('Contact deleted');
    }
    setDeleteId(null);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    selected.forEach(id => {
      const c = contacts.find(x => x.id === id);
      if (c && !c.tags.includes(tagInput.trim())) {
        updateContact(id, { tags: [...c.tags, tagInput.trim()] });
      }
    });
    setTagModal(false);
    setTagInput('');
    showToast(`Tag "${tagInput}" added to ${selected.length} contact(s)`);
  };

  const handleAddContact = () => {
    if (!newContact.email || !newContact.firstName) return;
    addContact({
      id: 'con' + Date.now(),
      ...newContact,
      tags: [],
      source: 'Manual',
      joinedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      location: '',
    });
    setAddModal(false);
    setNewContact({ firstName: '', lastName: '', email: '', phone: '', company: '', status: 'subscribed' });
    showToast('Contact added successfully');
  };

  return (
    <div>
      <PageHeader
        title="Contacts"
        subtitle="Manage your marketing audience."
        actions={
          <>
            <button className="btn btn-secondary" onClick={() => navigate('/contacts/import')}>
              <Upload size={14} /> Import Contacts
            </button>
            <button className="btn btn-primary" onClick={() => setAddModal(true)}>
              <UserPlus size={14} /> Add Contact
            </button>
          </>
        }
      />

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <Tabs tabs={tabsWithCount} active={tab} onChange={t => { setTab(t); setSelected([]); }} />
        </div>

        <div style={{ padding: '0 20px 12px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search contacts..." width={280} />
          <select className="form-select" style={{ width: 'auto', fontSize: 13 }}>
            <option>All sources</option>
            <option>Import</option>
            <option>Website Form</option>
            <option>API</option>
            <option>Manual</option>
          </select>
          {selected.length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginLeft: 8, padding: '4px 10px', background: 'var(--crimson-light)', borderRadius: 20, alignItems: 'center' }}>
              <span style={{ fontSize: 12.5, color: 'var(--crimson)', fontWeight: 600 }}>{selected.length} selected</span>
              <button className="btn btn-sm" style={{ background: 'none', color: 'var(--crimson)', padding: '2px 8px', fontSize: 12 }} onClick={() => setTagModal(true)}>
                <Tag size={12} /> Add Tag
              </button>
              <button className="btn btn-sm" style={{ background: 'none', color: 'var(--crimson)', padding: '2px 8px', fontSize: 12 }} onClick={() => showToast('Export started (Demo)')}>
                <Download size={12} /> Export
              </button>
              <button className="btn btn-sm" style={{ background: 'none', color: 'var(--error)', padding: '2px 8px', fontSize: 12 }} onClick={() => setDeleteId('bulk')}>
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<UserPlus size={24} />}
            title="No contacts found"
            description={search ? `No results for "${search}"` : 'Import or add contacts to get started.'}
            action={() => setAddModal(true)}
            actionLabel="Add Contact"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Select all" />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Tags</th>
                  <th>Company</th>
                  <th>Source</th>
                  <th>Joined</th>
                  <th>Last Activity</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} /></td>
                    <td>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}
                        onClick={() => navigate(`/contacts/${c.id}`)}
                      >
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--crimson)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <span style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text-primary)' }}>{c.firstName} {c.lastName}</span>
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.email}</td>
                    <td><StatusPill status={c.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {c.tags.slice(0, 2).map(t => (
                          <span key={t} className="tag-chip">{t}</span>
                        ))}
                        {c.tags.length > 2 && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>+{c.tags.length - 2}</span>}
                      </div>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.company || '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.source}</td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(c.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(c.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      <Dropdown items={[
                        { label: 'View Profile', onClick: () => navigate(`/contacts/${c.id}`) },
                        { label: 'Edit', onClick: () => navigate(`/contacts/${c.id}`) },
                        { separator: true },
                        { label: 'Unsubscribe', onClick: () => { updateContact(c.id, { status: 'unsubscribed' }); showToast('Contact unsubscribed'); } },
                        { label: 'Delete', danger: true, onClick: () => setDeleteId(c.id) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: 12.5, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Showing {filtered.length} of {contacts.length} contacts</span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-secondary btn-sm" disabled>← Prev</button>
              <button className="btn btn-secondary btn-sm" disabled>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Contact"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddContact} disabled={!newContact.email || !newContact.firstName}>Add Contact</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">First Name <span className="required">*</span></label>
            <input className="form-input" value={newContact.firstName} onChange={e => setNewContact(f => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Last Name</label>
            <input className="form-input" value={newContact.lastName} onChange={e => setNewContact(f => ({ ...f, lastName: e.target.value }))} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 0, marginTop: 12 }}>
          <label className="form-label">Email Address <span className="required">*</span></label>
          <input type="email" className="form-input" value={newContact.email} onChange={e => setNewContact(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Phone</label>
            <input className="form-input" value={newContact.phone} onChange={e => setNewContact(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Company</label>
            <input className="form-input" value={newContact.company} onChange={e => setNewContact(f => ({ ...f, company: e.target.value }))} />
          </div>
        </div>
        <div className="form-group" style={{ marginBottom: 0, marginTop: 12 }}>
          <label className="form-label">Status</label>
          <select className="form-select" value={newContact.status} onChange={e => setNewContact(f => ({ ...f, status: e.target.value }))}>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </Modal>

      {/* Add Tag Modal */}
      <Modal open={tagModal} onClose={() => setTagModal(false)} title="Add Tag to Selected Contacts"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTagModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleAddTag} disabled={!tagInput.trim()}>Add Tag</Button>
          </>
        }
      >
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Tag Name</label>
          <input className="form-input" placeholder="e.g. enterprise, newsletter, vip" value={tagInput} onChange={e => setTagInput(e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && handleAddTag()} />
          <span className="form-hint">Adding to {selected.length} contact(s)</span>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={deleteId === 'bulk' ? `Delete ${selected.length} Contacts?` : 'Delete Contact?'}
        message={deleteId === 'bulk' ? `This will permanently delete ${selected.length} contacts. This action cannot be undone.` : 'This will permanently delete this contact. This action cannot be undone.'}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

import { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Users, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { ConfirmModal } from '../components/common/Modal';
import SearchInput from '../components/common/SearchInput';

const CONDITION_FIELDS = [
  { value: 'status', label: 'Subscription Status' },
  { value: 'tag', label: 'Tag' },
  { value: 'email', label: 'Email contains' },
  { value: 'opened', label: 'Opened campaign' },
  { value: 'clicked', label: 'Clicked campaign' },
  { value: 'location', label: 'Location' },
  { value: 'last_activity', label: 'Last activity' },
  { value: 'joined', label: 'Joined' },
  { value: 'opens', label: 'Total opens' },
];

const OPERATORS = {
  status: ['is', 'is not'],
  tag: ['is', 'is not', 'contains'],
  email: ['contains', 'does not contain'],
  opened: ['yes', 'no'],
  clicked: ['yes', 'no'],
  location: ['is', 'is not', 'contains'],
  last_activity: ['within', 'more_than', 'greater_than'],
  joined: ['within', 'before', 'after'],
  opens: ['greater_than', 'less_than', 'equals'],
};

const defaultCondition = () => ({ id: Date.now(), field: 'status', operator: 'is', value: 'subscribed' });

export default function Segments() {
  const { segments, addSegment, updateSegment, deleteSegment, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [createModal, setCreateModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [conditions, setConditions] = useState([defaultCondition()]);

  const filtered = segments.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setFormName(''); setFormDesc(''); setConditions([defaultCondition()]);
    setEditId(null); setCreateModal(true);
  };

  const openEdit = (seg) => {
    setFormName(seg.name); setFormDesc(seg.description);
    setConditions(seg.conditions.map((c, i) => ({ ...c, id: i })));
    setEditId(seg.id); setCreateModal(true);
  };

  const addCondition = () => setConditions(c => [...c, defaultCondition()]);
  const removeCondition = (id) => setConditions(c => c.filter(x => x.id !== id));
  const updateCondition = (id, updates) => setConditions(c => c.map(x => x.id === id ? { ...x, ...updates } : x));

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editId) {
      updateSegment(editId, { name: formName, description: formDesc, conditions: conditions.map(({ id, ...c }) => c), updatedAt: new Date().toISOString() });
      showToast('Segment updated');
    } else {
      addSegment({
        id: 'seg' + Date.now(),
        name: formName,
        description: formDesc,
        contactCount: Math.floor(Math.random() * 3000 + 100),
        conditions: conditions.map(({ id, ...c }) => c),
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });
      showToast('Segment created');
    }
    setCreateModal(false);
  };

  const handleDelete = () => {
    deleteSegment(deleteId);
    setDeleteId(null);
    showToast('Segment deleted');
  };

  return (
    <div>
      <PageHeader
        title="Segments"
        subtitle="Organize your contacts into targeted groups."
        actions={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search segments..." width={220} />
            <button className="btn btn-primary" onClick={openCreate}><Plus size={14} /> Create Segment</button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Users size={24} />} title="No segments found" description="Create segments to target specific groups of contacts." action={openCreate} actionLabel="Create Segment" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Segment Name</th>
                <th>Description</th>
                <th>Contacts</th>
                <th>Conditions</th>
                <th>Updated</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(seg => (
                <tr key={seg.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => openEdit(seg)}>{seg.name}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 260 }}>{seg.description}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Users size={13} color="var(--text-muted)" />
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{seg.contactCount.toLocaleString()}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 260 }}>
                      {seg.conditions.slice(0, 2).map((cond, i) => (
                        <span key={i} style={{ fontSize: 11.5, padding: '2px 8px', background: 'var(--info-bg)', color: 'var(--info)', borderRadius: 20, whiteSpace: 'nowrap' }}>
                          {cond.field} {cond.operator} "{cond.value}"
                        </span>
                      ))}
                      {seg.conditions.length > 2 && <span style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>+{seg.conditions.length - 2} more</span>}
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {new Date(seg.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <Dropdown items={[
                      { label: 'Edit', icon: <Edit size={13} />, onClick: () => openEdit(seg) },
                      { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => { addSegment({ ...seg, id: 'seg' + Date.now(), name: seg.name + ' (Copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }); showToast('Segment duplicated'); } },
                      { separator: true },
                      { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(seg.id) },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title={editId ? 'Edit Segment' : 'Create Segment'}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={!formName.trim()}>
              {editId ? 'Save Changes' : 'Create Segment'}
            </Button>
          </>
        }
      >
        <div className="form-group">
          <label className="form-label">Segment Name <span className="required">*</span></label>
          <input className="form-input" placeholder="e.g. High Engagement Users" value={formName} onChange={e => setFormName(e.target.value)} autoFocus />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="Brief description of this segment" value={formDesc} onChange={e => setFormDesc(e.target.value)} />
        </div>
        <div style={{ marginTop: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>Conditions</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Contact must match <strong>ALL</strong> conditions</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {conditions.map((cond, i) => (
              <div key={cond.id} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', width: 28, flexShrink: 0, textAlign: 'right' }}>{i === 0 ? 'IF' : 'AND'}</span>
                <select className="form-select" value={cond.field} onChange={e => updateCondition(cond.id, { field: e.target.value, operator: OPERATORS[e.target.value]?.[0] || 'is', value: '' })} style={{ flex: 1.2 }}>
                  {CONDITION_FIELDS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
                <select className="form-select" value={cond.operator} onChange={e => updateCondition(cond.id, { operator: e.target.value })} style={{ flex: 1 }}>
                  {(OPERATORS[cond.field] || ['is', 'is not']).map(op => <option key={op} value={op}>{op}</option>)}
                </select>
                <input className="form-input" value={cond.value} onChange={e => updateCondition(cond.id, { value: e.target.value })} placeholder="value" style={{ flex: 1 }} />
                {conditions.length > 1 && (
                  <button onClick={() => removeCondition(cond.id)} style={{ color: 'var(--text-muted)', cursor: 'pointer', flexShrink: 0, display: 'flex', padding: 4, border: '1px solid var(--border)', borderRadius: 4 }} aria-label="Remove condition">
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={addCondition} style={{ marginTop: 10 }}>
            <Plus size={13} /> Add Condition
          </button>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Segment?"
        message="This will delete the segment. Contacts will not be affected."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

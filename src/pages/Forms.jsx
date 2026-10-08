import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Copy, Trash2, FormInput } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import StatusPill from '../components/common/StatusPill';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import SearchInput from '../components/common/SearchInput';
import { ConfirmModal } from '../components/common/Modal';

export default function Forms() {
  const navigate = useNavigate();
  const { forms, updateForm, deleteForm, addForm, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = forms.filter(f =>
    !search || f.name.toLowerCase().includes(search.toLowerCase())
  );

  const handlePublish = (f) => {
    updateForm(f.id, { status: 'published', updatedAt: new Date().toISOString() });
    showToast(`"${f.name}" published`);
  };

  const handlePause = (f) => {
    updateForm(f.id, { status: 'paused', updatedAt: new Date().toISOString() });
    showToast(`"${f.name}" paused`);
  };

  const handleDuplicate = (f) => {
    addForm({ ...f, id: 'f' + Date.now(), name: f.name + ' (Copy)', status: 'draft', submissions: 0, conversionRate: 0, updatedAt: new Date().toISOString() });
    showToast('Form duplicated');
  };

  const handleDelete = () => {
    deleteForm(deleteId);
    setDeleteId(null);
    showToast('Form deleted');
  };

  const statusColor = { published: 'var(--success)', draft: 'var(--text-muted)', paused: 'var(--warning)' };
  const typeColors = { Inline: '#eaf3fb', Popup: '#fef3e8', Embedded: '#f5f0fb' };

  return (
    <div>
      <PageHeader
        title="Forms"
        subtitle="Capture leads and grow your audience with signup forms."
        actions={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search forms..." width={220} />
            <button className="btn btn-primary" onClick={() => navigate('/forms/new')}>
              <Plus size={14} /> Create Form
            </button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<FormInput size={24} />} title="No forms found" description="Create signup forms to grow your contact list." action={() => navigate('/forms/new')} actionLabel="Create Form" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Form Name</th>
                <th>Type</th>
                <th>Status</th>
                <th>Submissions</th>
                <th>Conversion Rate</th>
                <th>Updated</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => (
                <tr key={f.id}>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => navigate('/forms/new')}>
                      {f.name}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{f.fields.length} fields</div>
                  </td>
                  <td>
                    <span style={{ fontSize: 12.5, padding: '2px 9px', borderRadius: 20, background: typeColors[f.type] || 'var(--bg)', color: 'var(--text-secondary)', fontWeight: 500 }}>{f.type}</span>
                  </td>
                  <td><StatusPill status={f.status} /></td>
                  <td>
                    <span style={{ fontWeight: 600, fontSize: 13.5 }}>{f.submissions.toLocaleString()}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 5, background: 'var(--bg)', borderRadius: 3, maxWidth: 80, overflow: 'hidden' }}>
                        <div style={{ width: `${Math.min(f.conversionRate * 4, 100)}%`, height: '100%', background: f.conversionRate > 10 ? 'var(--success)' : 'var(--info)', borderRadius: 3 }} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{f.conversionRate}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(f.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td>
                    <Dropdown items={[
                      { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate('/forms/new') },
                      { label: 'Preview', icon: <Eye size={13} />, onClick: () => showToast('Form preview (Demo)') },
                      { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => handleDuplicate(f) },
                      f.status !== 'published'
                        ? { label: 'Publish', onClick: () => handlePublish(f) }
                        : { label: 'Pause', onClick: () => handlePause(f) },
                      { separator: true },
                      { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(f.id) },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Form?"
        message="This will permanently delete the form and all submission data."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

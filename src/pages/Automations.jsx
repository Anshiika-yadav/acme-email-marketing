import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Copy, Trash2, Play, Pause, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import StatusPill from '../components/common/StatusPill';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import SearchInput from '../components/common/SearchInput';
import { ConfirmModal } from '../components/common/Modal';

export default function Automations() {
  const navigate = useNavigate();
  const { automations, updateAutomation, deleteAutomation, addAutomation, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [activateId, setActivateId] = useState(null);

  const filtered = automations.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.trigger.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggle = (auto) => {
    if (auto.status === 'active') {
      updateAutomation(auto.id, { status: 'paused', updatedAt: new Date().toISOString() });
      showToast(`"${auto.name}" paused`);
    } else {
      setActivateId(auto.id);
    }
  };

  const handleActivate = () => {
    updateAutomation(activateId, { status: 'active', updatedAt: new Date().toISOString() });
    setActivateId(null);
    showToast('Automation activated', 'success');
  };

  const handleDelete = () => {
    deleteAutomation(deleteId);
    setDeleteId(null);
    showToast('Automation deleted');
  };

  const handleDuplicate = (auto) => {
    addAutomation({ ...auto, id: 'auto' + Date.now(), name: auto.name + ' (Copy)', status: 'draft', contactsEnrolled: 0, lastActivity: null, updatedAt: new Date().toISOString() });
    showToast('Automation duplicated');
  };

  const statusInfo = { active: { color: 'var(--success)', bg: 'var(--success-bg)' }, paused: { color: 'var(--warning)', bg: 'var(--warning-bg)' }, draft: { color: 'var(--text-muted)', bg: 'var(--bg)' } };

  return (
    <div>
      <PageHeader
        title="Automations"
        subtitle="Set up automated email workflows triggered by contact behavior."
        actions={
          <>
            <SearchInput value={search} onChange={setSearch} placeholder="Search automations..." width={220} />
            <button className="btn btn-primary" onClick={() => navigate('/automations/new')}><Plus size={14} /> Create Automation</button>
          </>
        }
      />

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<Zap size={24} />} title="No automations found" description="Create automated workflows to engage contacts." action={() => navigate('/automations/new')} actionLabel="Create Automation" />
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Automation</th>
                <th>Trigger</th>
                <th>Status</th>
                <th>Contacts Enrolled</th>
                <th>Last Activity</th>
                <th>Updated</th>
                <th>Active</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(auto => {
                const si = statusInfo[auto.status] || statusInfo.draft;
                return (
                  <tr key={auto.id}>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer' }} onClick={() => navigate('/automations/new')}>
                        {auto.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{auto.nodes.length} steps</div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{auto.trigger}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{auto.triggerDetail}</div>
                    </td>
                    <td><StatusPill status={auto.status} /></td>
                    <td>
                      <span style={{ fontWeight: 600, fontSize: 13.5 }}>{auto.contactsEnrolled.toLocaleString()}</span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {auto.lastActivity ? new Date(auto.lastActivity).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(auto.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td>
                      {/* Toggle */}
                      <label className="toggle" style={{ width: 36, height: 20 }}>
                        <input
                          type="checkbox"
                          checked={auto.status === 'active'}
                          onChange={() => handleToggle(auto)}
                        />
                        <span className="toggle-slider" />
                      </label>
                    </td>
                    <td>
                      <Dropdown items={[
                        { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate('/automations/new') },
                        { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => handleDuplicate(auto) },
                        auto.status === 'active'
                          ? { label: 'Pause', icon: <Pause size={13} />, onClick: () => handleToggle(auto) }
                          : { label: 'Activate', icon: <Play size={13} />, onClick: () => setActivateId(auto.id) },
                        { separator: true },
                        { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(auto.id) },
                      ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        open={!!activateId}
        onClose={() => setActivateId(null)}
        onConfirm={handleActivate}
        title="Activate Automation?"
        message="This automation will start enrolling contacts immediately. You can pause it at any time."
        confirmLabel="Activate"
        confirmVariant="primary"
      />
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Automation?"
        message="This will permanently delete the automation. Active enrollments will be stopped."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

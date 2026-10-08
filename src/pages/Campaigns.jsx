import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Copy, BarChart2, Calendar, Archive, Trash2, Send, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import StatusPill from '../components/common/StatusPill';
import Tabs from '../components/common/Tabs';
import SearchInput from '../components/common/SearchInput';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/Modal';

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Drafts', value: 'draft' },
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Sent', value: 'sent' },
  { label: 'Archived', value: 'archived' },
];

export default function Campaigns() {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, updateCampaign, showToast } = useApp();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = campaigns.filter(c => {
    if (tab !== 'all' && c.status !== tab) return false;
    if (search) {
      const q = search.toLowerCase();
      return c.name.toLowerCase().includes(q) || c.subject.toLowerCase().includes(q) || c.audience.toLowerCase().includes(q);
    }
    return true;
  });

  const tabsWithCount = TABS.map(t => ({
    ...t,
    count: t.value === 'all' ? campaigns.length : campaigns.filter(c => c.status === t.value).length,
  }));

  const handleDuplicate = (c) => {
    showToast(`Campaign "${c.name}" duplicated`);
  };

  const handleArchive = (c) => {
    updateCampaign(c.id, { status: 'archived', updatedAt: new Date().toISOString() });
    showToast(`Campaign archived`);
  };

  const handleDelete = () => {
    deleteCampaign(deleteId);
    setDeleteId(null);
    showToast('Campaign deleted', 'success');
  };

  return (
    <div>
      <PageHeader
        title="Campaigns"
        subtitle="Create, manage and monitor your email campaigns."
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
            <Plus size={15} /> Create Campaign
          </button>
        }
      />

      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 0' }}>
          <Tabs tabs={tabsWithCount} active={tab} onChange={setTab} />
        </div>
        <div style={{ padding: '0 20px 14px', display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <SearchInput value={search} onChange={setSearch} placeholder="Search campaigns..." width={280} />
          <select className="form-select" style={{ width: 'auto', fontSize: 13 }}>
            <option>All statuses</option>
            <option>Draft</option>
            <option>Scheduled</option>
            <option>Sent</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Send size={24} />}
            title="No campaigns found"
            description={search ? `No results for "${search}"` : 'Create your first campaign to get started.'}
            action={() => navigate('/campaigns/new')}
            actionLabel="Create Campaign"
          />
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}><input type="checkbox" aria-label="Select all" /></th>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Audience</th>
                  <th>Open Rate</th>
                  <th>Click Rate</th>
                  <th>Updated</th>
                  <th style={{ width: 48 }}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><input type="checkbox" aria-label={`Select ${c.name}`} /></td>
                    <td>
                      <div
                        style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text-primary)', cursor: 'pointer' }}
                        onClick={() => navigate(c.status === 'sent' ? `/campaigns/${c.id}/report` : `/campaigns/${c.id}/design`)}
                      >
                        {c.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.subject}
                      </div>
                    </td>
                    <td><StatusPill status={c.status} /></td>
                    <td>
                      <div style={{ fontSize: 13 }}>{c.audience}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{c.audienceCount.toLocaleString()} contacts</div>
                    </td>
                    <td>
                      {c.openRate > 0
                        ? <span style={{ fontWeight: 600, color: c.openRate > 30 ? 'var(--success)' : 'var(--text-primary)' }}>{c.openRate}%</span>
                        : <span style={{ color: 'var(--text-xsmall)' }}>—</span>}
                    </td>
                    <td>
                      {c.clickRate > 0
                        ? <span style={{ fontWeight: 600 }}>{c.clickRate}%</span>
                        : <span style={{ color: 'var(--text-xsmall)' }}>—</span>}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(c.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td>
                      <Dropdown items={[
                        { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate(`/campaigns/${c.id}/design`) },
                        { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => showToast(`"${c.name}" duplicated`) },
                        ...(c.status === 'sent' ? [{ label: 'View Report', icon: <BarChart2 size={13} />, onClick: () => navigate(`/campaigns/${c.id}/report`) }] : []),
                        ...(c.status === 'draft' ? [{ label: 'Review & Send', icon: <Send size={13} />, onClick: () => navigate(`/campaigns/${c.id}/review`) }] : []),
                        ...(c.status === 'scheduled' ? [{ label: 'Pause', icon: <Pause size={13} />, onClick: () => { updateCampaign(c.id, { status: 'paused' }); showToast('Campaign paused'); } }] : []),
                        { label: 'Schedule', icon: <Calendar size={13} />, onClick: () => navigate(`/campaigns/${c.id}/review`) },
                        { separator: true },
                        { label: 'Archive', icon: <Archive size={13} />, onClick: () => handleArchive(c) },
                        { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(c.id) },
                      ]} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message="Are you sure you want to delete this campaign? This action cannot be undone."
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  );
}

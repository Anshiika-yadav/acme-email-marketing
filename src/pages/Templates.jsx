import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Copy, Trash2, Eye, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/common/PageHeader';
import SearchInput from '../components/common/SearchInput';
import Dropdown from '../components/common/Dropdown';
import EmptyState from '../components/common/EmptyState';
import { ConfirmModal } from '../components/common/Modal';

const CATEGORIES = ['All', 'Onboarding', 'Product', 'Newsletter', 'Promotional', 'Event', 'Transactional'];

const CATEGORY_COLORS = {
  Onboarding: { bg: '#e8f8f1', color: '#1a7a45' },
  Product: { bg: '#eaf3fb', color: '#1a5c8a' },
  Newsletter: { bg: '#f5f0fb', color: '#5c3f8a' },
  Promotional: { bg: 'var(--crimson-light)', color: 'var(--crimson)' },
  Event: { bg: '#fef3e8', color: '#8a4500' },
  Transactional: { bg: '#f5f6f8', color: '#4a5568' },
};

export default function Templates() {
  const navigate = useNavigate();
  const { templates, addTemplate, deleteTemplate, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [deleteId, setDeleteId] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  const filtered = templates.filter(t => {
    if (category !== 'All' && t.category !== category) return false;
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDuplicate = (t) => {
    addTemplate({
      ...t,
      id: 't' + Date.now(),
      name: t.name + ' (Copy)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    showToast(`Template "${t.name}" duplicated`);
  };

  const handleDelete = () => {
    deleteTemplate(deleteId);
    setDeleteId(null);
    showToast('Template deleted');
  };

  const handleUseTemplate = (t) => {
    showToast(`Template "${t.name}" applied — redirecting to campaign...`);
    setTimeout(() => navigate('/campaigns/new'), 1000);
  };

  return (
    <div>
      <PageHeader
        title="Templates"
        subtitle="Reusable email templates for your campaigns."
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/templates/new')}>
            <Plus size={14} /> Create Template
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchInput value={search} onChange={setSearch} placeholder="Search templates..." width={240} />
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`btn btn-sm ${category === cat ? 'btn-primary' : 'btn-secondary'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 8, padding: 2 }}>
          <button className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('grid')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="0" width="7" height="7" rx="1"/><rect x="9" y="0" width="7" height="7" rx="1"/><rect x="0" y="9" width="7" height="7" rx="1"/><rect x="9" y="9" width="7" height="7" rx="1"/></svg>
          </button>
          <button className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setViewMode('list')}>
            <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor"><rect x="0" y="1" width="16" height="2" rx="1"/><rect x="0" y="7" width="16" height="2" rx="1"/><rect x="0" y="13" width="16" height="2" rx="1"/></svg>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState icon={<FileText size={24} />} title="No templates found" description={search ? `No results for "${search}"` : 'Create your first email template.'} />
        </div>
      ) : viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(t => {
            const catStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Transactional;
            return (
              <div key={t.id} className="card" style={{ overflow: 'hidden', transition: 'box-shadow 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
              >
                {/* Template preview area */}
                <div style={{ height: 160, background: 'linear-gradient(135deg, #f5f6f8 0%, #eef0f4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }} onClick={() => navigate(`/templates/${t.id}`)}>
                  <div style={{ width: '80%', background: 'white', borderRadius: 6, padding: '10px 12px', boxShadow: 'var(--shadow-sm)', fontSize: 10, lineHeight: 1.5 }}>
                    <div style={{ width: 40, height: 8, background: 'var(--crimson)', borderRadius: 3, marginBottom: 6 }} />
                    <div style={{ height: 6, background: '#e2e8f0', borderRadius: 2, marginBottom: 4, width: '90%' }} />
                    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 2, marginBottom: 4, width: '75%' }} />
                    <div style={{ height: 5, background: '#e2e8f0', borderRadius: 2, marginBottom: 8, width: '85%' }} />
                    <div style={{ width: 56, height: 14, background: 'var(--crimson)', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 32, height: 5, background: 'rgba(255,255,255,0.8)', borderRadius: 2 }} />
                    </div>
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'all 0.15s', gap: 8 }}
                    onMouseEnter={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.background = 'rgba(0,0,0,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.opacity = 0; e.currentTarget.style.background = 'rgba(0,0,0,0)'; }}>
                    <button className="btn btn-secondary btn-sm" onClick={e => { e.stopPropagation(); navigate(`/templates/${t.id}`); }}><Eye size={13} /> Preview</button>
                  </div>
                </div>
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)', marginBottom: 3 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.description}</div>
                    </div>
                    <Dropdown items={[
                      { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate(`/templates/${t.id}`) },
                      { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => handleDuplicate(t) },
                      { label: 'Use Template', onClick: () => handleUseTemplate(t) },
                      { separator: true },
                      { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(t.id) },
                    ]} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 20, background: catStyle.bg, color: catStyle.color, fontWeight: 500 }}>{t.category}</span>
                    <span style={{ fontSize: 11.5, color: 'var(--text-xsmall)' }}>{new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={() => handleUseTemplate(t)}>
                    Use Template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead><tr><th>Template</th><th>Category</th><th>Updated</th><th style={{ width: 48 }}></th></tr></thead>
            <tbody>
              {filtered.map(t => {
                const catStyle = CATEGORY_COLORS[t.category] || CATEGORY_COLORS.Transactional;
                return (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: 13.5, cursor: 'pointer', color: 'var(--text-primary)' }} onClick={() => navigate(`/templates/${t.id}`)}>{t.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{t.description}</div>
                    </td>
                    <td><span style={{ fontSize: 11.5, padding: '2px 8px', borderRadius: 20, background: catStyle.bg, color: catStyle.color, fontWeight: 500 }}>{t.category}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td>
                      <Dropdown items={[
                        { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate(`/templates/${t.id}`) },
                        { label: 'Use Template', onClick: () => handleUseTemplate(t) },
                        { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => handleDuplicate(t) },
                        { separator: true },
                        { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => setDeleteId(t.id) },
                      ]} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Delete Template?" message="This will permanently delete the template." confirmLabel="Delete" confirmVariant="danger" />
    </div>
  );
}

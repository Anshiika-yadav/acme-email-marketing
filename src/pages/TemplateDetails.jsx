import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Copy, Monitor, Smartphone, Edit2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

function renderBlock(block) {
  switch (block.type) {
    case 'text':
      return <div dangerouslySetInnerHTML={{ __html: block.content.html || '' }} />;
    case 'image':
      return (
        <div style={{ textAlign: block.content.align || 'center', padding: '8px 0' }}>
          <div style={{ display: 'inline-flex', width: block.content.width || 160, height: 50, background: '#f0f2f5', border: '2px dashed #c5cdd8', borderRadius: 6, alignItems: 'center', justifyContent: 'center', color: '#a0aec0', fontSize: 12 }}>
            {block.content.alt || 'Image'}
          </div>
        </div>
      );
    case 'button':
      return (
        <div style={{ textAlign: block.content.align || 'center', padding: '8px 0' }}>
          <span style={{ display: 'inline-block', background: block.content.bgColor || '#c0392b', color: block.content.textColor || '#fff', padding: '9px 22px', borderRadius: block.content.borderRadius || 6, fontSize: 13.5, fontWeight: 600 }}>
            {block.content.label || 'Button'}
          </span>
        </div>
      );
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '6px 0' }} />;
    case 'social':
      return (
        <div style={{ textAlign: 'center', padding: '6px 0' }}>
          {['LI', 'TW', 'FB'].map(p => (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 28, background: '#e2e8f0', borderRadius: '50%', margin: '0 3px', fontSize: 10, fontWeight: 700, color: '#4a5568' }}>{p}</span>
          ))}
        </div>
      );
    default: return null;
  }
}

export default function TemplateDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { templates, updateTemplate, addTemplate, showToast } = useApp();
  const [preview, setPreview] = useState('desktop');
  const [editing, setEditing] = useState(false);

  const template = templates.find(t => t.id === id);

  if (!template) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Template not found.</p>
      <button className="btn btn-primary" onClick={() => navigate('/templates')}>Back to Templates</button>
    </div>
  );

  const handleSave = () => {
    updateTemplate(id, { updatedAt: new Date().toISOString() });
    setEditing(false);
    showToast('Template saved successfully');
  };

  const handleDuplicate = () => {
    addTemplate({ ...template, id: 't' + Date.now(), name: template.name + ' (Copy)', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    showToast('Template duplicated');
  };

  const handleUseTemplate = () => {
    showToast(`Template "${template.name}" applied to new campaign`);
    setTimeout(() => navigate('/campaigns/new'), 800);
  };

  return (
    <div>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/templates')} style={{ paddingLeft: 0 }}>
          <ArrowLeft size={14} /> Templates
        </button>
        <span style={{ color: 'var(--text-muted)' }}>/</span>
        <span style={{ fontSize: 14, fontWeight: 600 }}>{template.name}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 8, padding: 2 }}>
            <button className={`btn btn-sm ${preview === 'desktop' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('desktop')}><Monitor size={13} /></button>
            <button className={`btn btn-sm ${preview === 'mobile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('mobile')}><Smartphone size={13} /></button>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleDuplicate}><Copy size={13} /> Duplicate</button>
          <button className="btn btn-secondary btn-sm" onClick={handleSave}><Save size={13} /> Save</button>
          <button className="btn btn-primary btn-sm" onClick={handleUseTemplate}>Use Template</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Left Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ padding: 18 }}>
            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Template Info</h3>
            {[
              { label: 'Name', value: template.name },
              { label: 'Category', value: template.category },
              { label: 'Blocks', value: template.blocks.length + ' blocks' },
              { label: 'Updated', value: new Date(template.updatedAt).toLocaleDateString() },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>{row.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{row.value}</div>
              </div>
            ))}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 2 }}>Description</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{template.description}</div>
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleUseTemplate}>
            Use This Template
          </button>
          <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate(`/campaigns/new`)}>
            <Edit2 size={13} /> Edit in Designer
          </button>
        </div>

        {/* Email Preview */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)', borderRadius: 8, padding: 20 }}>
            <div style={{ width: preview === 'mobile' ? 340 : 560, background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', transition: 'width 0.3s' }}>
              <div style={{ background: '#f8f9fa', padding: '8px 14px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fc5c65', marginTop: 1 }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f7b731', marginTop: 1 }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#26de81', marginTop: 1 }} />
                <span style={{ marginLeft: 4 }}>Template Preview</span>
              </div>
              <div style={{ padding: '20px 28px' }}>
                {template.blocks.map(block => (
                  <div key={block.id} style={{ marginBottom: 4 }}>{renderBlock(block)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

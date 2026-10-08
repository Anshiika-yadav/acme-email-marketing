import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Globe, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/common/Modal';

const FIELD_TYPES = [
  { type: 'text',     label: 'Text' },
  { type: 'email',    label: 'Email' },
  { type: 'tel',      label: 'Phone' },
  { type: 'textarea', label: 'Text Area' },
  { type: 'select',   label: 'Dropdown' },
  { type: 'checkbox', label: 'Checkbox' },
];

const defaultFields = [
  { id: 'ff1', type: 'text',  label: 'First Name', placeholder: 'Enter first name', required: true },
  { id: 'ff2', type: 'text',  label: 'Last Name',  placeholder: 'Enter last name',  required: false },
  { id: 'ff3', type: 'email', label: 'Email Address', placeholder: 'your@email.com', required: true },
];

export default function FormNew() {
  const navigate = useNavigate();
  const { addForm, showToast } = useApp();
  const [formName, setFormName] = useState('New Signup Form');
  const [formType, setFormType] = useState('Inline');
  const [fields, setFields] = useState(defaultFields);
  const [selectedField, setSelectedField] = useState('ff1');
  const [publishModal, setPublishModal] = useState(false);
  const [unsaved, setUnsaved] = useState(false);

  const selected = fields.find(f => f.id === selectedField);

  const addField = (type) => {
    const newField = { id: 'ff' + Date.now(), type, label: FIELD_TYPES.find(t => t.type === type)?.label || 'Field', placeholder: '', required: false };
    setFields(f => [...f, newField]);
    setSelectedField(newField.id);
    setUnsaved(true);
  };

  const removeField = (id) => {
    const newFields = fields.filter(f => f.id !== id);
    setFields(newFields);
    setSelectedField(newFields[0]?.id);
    setUnsaved(true);
  };

  const updateField = (id, updates) => {
    setFields(f => f.map(x => x.id === id ? { ...x, ...updates } : x));
    setUnsaved(true);
  };

  const moveField = (id, dir) => {
    const idx = fields.findIndex(f => f.id === id);
    const newIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= fields.length) return;
    const newFields = [...fields];
    [newFields[idx], newFields[newIdx]] = [newFields[newIdx], newFields[idx]];
    setFields(newFields);
    setUnsaved(true);
  };

  const handleSave = () => {
    setUnsaved(false);
    showToast('Form saved successfully');
  };

  const handlePublish = () => {
    addForm({
      id: 'f' + Date.now(),
      name: formName,
      type: formType,
      status: 'published',
      submissions: 0,
      conversionRate: 0,
      updatedAt: new Date().toISOString(),
      fields,
    });
    setPublishModal(false);
    showToast('Form published successfully', 'success');
    navigate('/forms');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', height: 52, background: 'white', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/forms')}><ArrowLeft size={14} /> Back</button>
        <input
          className="form-input"
          value={formName}
          onChange={e => { setFormName(e.target.value); setUnsaved(true); }}
          style={{ width: 220, fontSize: 14, fontWeight: 600 }}
        />
        {unsaved && <span style={{ fontSize: 11, color: 'var(--warning)' }}>● Unsaved</span>}
        <select className="form-select" value={formType} onChange={e => setFormType(e.target.value)} style={{ width: 120, fontSize: 13 }}>
          <option>Inline</option>
          <option>Popup</option>
          <option>Embedded</option>
        </select>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleSave}><Save size={14} /> Save</button>
          <button className="btn btn-primary btn-sm" onClick={() => setPublishModal(true)}><Globe size={14} /> Publish</button>
        </div>
      </div>

      {/* 3-column layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '200px 1fr 240px', overflow: 'hidden' }}>
        {/* Left: Field Palette */}
        <div style={{ background: 'white', borderRight: '1px solid var(--border)', padding: 16, overflowY: 'auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>Add Fields</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FIELD_TYPES.map(ft => (
              <button key={ft.type} onClick={() => addField(ft.type)} style={{ padding: '9px 12px', border: '1px solid var(--border)', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 13, color: 'var(--text-secondary)', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--crimson)'; e.currentTarget.style.color = 'var(--crimson)'; e.currentTarget.style.background = 'var(--crimson-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'white'; }}>
                <Plus size={13} /> {ft.label}
              </button>
            ))}
          </div>
        </div>

        {/* Center: Form Editor */}
        <div style={{ background: 'var(--bg)', overflowY: 'auto', padding: 28, display: 'flex', gap: 28, alignItems: 'flex-start' }}>
          {/* Form canvas */}
          <div style={{ flex: 1 }}>
            <div style={{ background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-md)', padding: 28, maxWidth: 480 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{formName}</h2>
              <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginBottom: 20 }}>Fill in the form below to subscribe.</p>
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  onClick={() => setSelectedField(field.id)}
                  style={{ marginBottom: 14, padding: '10px 12px', border: `2px solid ${selectedField === field.id ? 'var(--crimson)' : 'transparent'}`, borderRadius: 8, cursor: 'pointer', position: 'relative', transition: 'border-color 0.15s' }}
                >
                  {selectedField === field.id && (
                    <div style={{ position: 'absolute', top: 4, right: 4, display: 'flex', gap: 2 }}>
                      <button onClick={e => { e.stopPropagation(); moveField(field.id, 'up'); }} style={{ padding: '2px 5px', background: 'var(--bg)', borderRadius: 3, cursor: 'pointer', fontSize: 10 }} aria-label="Move up">↑</button>
                      <button onClick={e => { e.stopPropagation(); moveField(field.id, 'down'); }} style={{ padding: '2px 5px', background: 'var(--bg)', borderRadius: 3, cursor: 'pointer', fontSize: 10 }} aria-label="Move down">↓</button>
                      {fields.length > 1 && <button onClick={e => { e.stopPropagation(); removeField(field.id); }} style={{ padding: '2px 5px', background: 'var(--error-bg)', borderRadius: 3, cursor: 'pointer', fontSize: 10, color: 'var(--error)' }} aria-label="Remove">✕</button>}
                    </div>
                  )}
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 5 }}>
                    {field.label}
                    {field.required && <span style={{ color: 'var(--crimson)', marginLeft: 2 }}>*</span>}
                  </label>
                  {field.type === 'checkbox' ? (
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input type="checkbox" style={{ accentColor: 'var(--crimson)' }} readOnly /> {field.label}
                    </label>
                  ) : field.type === 'textarea' ? (
                    <textarea className="form-textarea" placeholder={field.placeholder || ''} readOnly style={{ minHeight: 60, pointerEvents: 'none' }} />
                  ) : field.type === 'select' ? (
                    <select className="form-select" style={{ pointerEvents: 'none' }}><option>{field.placeholder || 'Select...'}</option></select>
                  ) : (
                    <input type={field.type} className="form-input" placeholder={field.placeholder || ''} readOnly style={{ pointerEvents: 'none' }} />
                  )}
                </div>
              ))}
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Subscribe</button>
              <p style={{ fontSize: 11.5, color: 'var(--text-xsmall)', textAlign: 'center', marginTop: 10 }}>
                By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Field Properties */}
        <div style={{ background: 'white', borderLeft: '1px solid var(--border)', padding: 16, overflowY: 'auto' }}>
          {selected ? (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>Field Settings</p>
              <div className="form-group">
                <label className="form-label">Label</label>
                <input className="form-input" value={selected.label} onChange={e => updateField(selected.id, { label: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Placeholder</label>
                <input className="form-input" value={selected.placeholder || ''} onChange={e => updateField(selected.id, { placeholder: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Field Type</label>
                <select className="form-select" value={selected.type} onChange={e => updateField(selected.id, { type: e.target.value })}>
                  {FIELD_TYPES.map(ft => <option key={ft.type} value={ft.type}>{ft.label}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input type="checkbox" id="required-toggle" checked={selected.required} onChange={e => updateField(selected.id, { required: e.target.checked })} style={{ accentColor: 'var(--crimson)' }} />
                <label htmlFor="required-toggle" style={{ fontSize: 13.5, color: 'var(--text-secondary)', cursor: 'pointer' }}>Required field</label>
              </div>
              {fields.length > 1 && (
                <button className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }} onClick={() => removeField(selected.id)}>
                  <Trash2 size={13} /> Remove Field
                </button>
              )}
            </>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 40 }}>Select a field to edit</p>
          )}
        </div>
      </div>

      <ConfirmModal
        open={publishModal}
        onClose={() => setPublishModal(false)}
        onConfirm={handlePublish}
        title="Publish Form?"
        message={`"${formName}" will be live and available to embed. You can pause it at any time.`}
        confirmLabel="Publish"
        confirmVariant="primary"
      />
    </div>
  );
}

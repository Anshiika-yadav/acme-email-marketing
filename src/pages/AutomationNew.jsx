import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, ChevronDown, Save, Play, Zap, Mail, Clock, GitBranch, Tag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ConfirmModal } from '../components/common/Modal';

const NODE_TYPES = [
  { type: 'trigger', label: 'Trigger', icon: <Zap size={15} />, color: '#c0392b', bg: 'var(--crimson-light)' },
  { type: 'email',   label: 'Send Email', icon: <Mail size={15} />, color: '#2980b9', bg: '#eaf3fb' },
  { type: 'wait',    label: 'Wait', icon: <Clock size={15} />, color: '#e67e22', bg: '#fef3e8' },
  { type: 'condition', label: 'Condition', icon: <GitBranch size={15} />, color: '#8e44ad', bg: '#f5f0fb' },
  { type: 'tag',     label: 'Add Tag', icon: <Tag size={15} />, color: '#27ae60', bg: '#e8f8f1' },
];

const defaultNodes = [
  { id: 'n1', type: 'trigger', label: 'Trigger', config: { event: 'Contact joins segment', segment: '' } },
  { id: 'n2', type: 'email',   label: 'Send Email', config: { subject: 'Welcome!', fromName: 'Acme Technologies', fromEmail: 'marketing@acmetechnologies.com' } },
  { id: 'n3', type: 'wait',    label: 'Wait', config: { amount: 3, unit: 'days' } },
  { id: 'n4', type: 'condition', label: 'Condition', config: { field: 'opened_email', operator: 'is', value: 'true' } },
  { id: 'n5', type: 'tag',     label: 'Add Tag', config: { tag: 'engaged' } },
];

const NODE_META = {
  trigger:   { color: '#c0392b', bg: 'var(--crimson-light)' },
  email:     { color: '#2980b9', bg: '#eaf3fb' },
  wait:      { color: '#e67e22', bg: '#fef3e8' },
  condition: { color: '#8e44ad', bg: '#f5f0fb' },
  tag:       { color: '#27ae60', bg: '#e8f8f1' },
};

const TRIGGER_EVENTS = ['Contact joins segment', 'Form submitted', 'Tag added', 'Contact created', 'Link clicked'];
const CONDITION_FIELDS = ['opened_email', 'clicked_link', 'has_tag', 'email_bounced'];

export default function AutomationNew() {
  const navigate = useNavigate();
  const { addAutomation, showToast } = useApp();
  const [name, setName] = useState('New Automation');
  const [editingName, setEditingName] = useState(false);
  const [nodes, setNodes] = useState(defaultNodes);
  const [selectedNode, setSelectedNode] = useState('n1');
  const [unsaved, setUnsaved] = useState(false);
  const [activateModal, setActivateModal] = useState(false);
  const [addTypeMenu, setAddTypeMenu] = useState(false);

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  const updateNodeConfig = (id, updates) => {
    setNodes(ns => ns.map(n => n.id === id ? { ...n, config: { ...n.config, ...updates } } : n));
    setUnsaved(true);
  };

  const deleteNode = (id) => {
    if (nodes.length <= 1) return;
    const newNodes = nodes.filter(n => n.id !== id);
    setNodes(newNodes);
    setSelectedNode(newNodes[0]?.id);
    setUnsaved(true);
  };

  const addNode = (type) => {
    const meta = NODE_TYPES.find(n => n.type === type);
    const newNode = {
      id: 'n' + Date.now(),
      type,
      label: meta.label,
      config: type === 'trigger' ? { event: TRIGGER_EVENTS[0] }
        : type === 'email' ? { subject: '', fromName: 'Acme Technologies', fromEmail: 'marketing@acmetechnologies.com' }
        : type === 'wait' ? { amount: 1, unit: 'days' }
        : type === 'condition' ? { field: 'opened_email', operator: 'is', value: 'true' }
        : { tag: '' },
    };
    setNodes(ns => [...ns, newNode]);
    setSelectedNode(newNode.id);
    setAddTypeMenu(false);
    setUnsaved(true);
  };

  const handleSave = () => {
    setUnsaved(false);
    showToast('Automation saved');
  };

  const handleActivate = () => {
    const id = 'auto' + Date.now();
    addAutomation({
      id,
      name,
      trigger: nodes[0]?.config?.event || 'Contact joins segment',
      triggerDetail: nodes[0]?.config?.segment || nodes[0]?.config?.tag || '',
      status: 'active',
      contactsEnrolled: 0,
      lastActivity: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      nodes,
    });
    setActivateModal(false);
    showToast('Automation activated successfully', 'success');
    navigate('/automations');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', height: 52, background: 'white', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/automations')}><ArrowLeft size={14} /> Back</button>
        {editingName ? (
          <input
            className="form-input"
            value={name}
            onChange={e => setName(e.target.value)}
            onBlur={() => setEditingName(false)}
            onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
            style={{ width: 240, fontSize: 14, fontWeight: 600 }}
            autoFocus
          />
        ) : (
          <span
            style={{ fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '4px 8px', borderRadius: 4, transition: 'background 0.15s' }}
            onClick={() => setEditingName(true)}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >
            {name}
            {unsaved && <span style={{ fontSize: 11, color: 'var(--warning)', marginLeft: 8, fontWeight: 400 }}>● Unsaved</span>}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={handleSave}><Save size={14} /> Save</button>
          <button className="btn btn-primary btn-sm" onClick={() => setActivateModal(true)}><Play size={14} /> Activate</button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 260px', overflow: 'hidden' }}>
        {/* Center: Node Flow */}
        <div style={{ background: 'var(--bg)', overflowY: 'auto', padding: '32px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {nodes.map((node, idx) => {
            const meta = NODE_META[node.type] || NODE_META.trigger;
            const isSelected = selectedNode === node.id;
            const NodeIcon = NODE_TYPES.find(n => n.type === node.type)?.icon;
            return (
              <div key={node.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
                {/* Connector */}
                {idx > 0 && (
                  <div style={{ width: 2, height: 28, background: isSelected ? meta.color : '#c5cdd8', transition: 'background 0.15s' }} />
                )}
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNode(node.id)}
                  style={{ width: '100%', background: 'white', border: `2px solid ${isSelected ? meta.color : 'var(--border)'}`, borderRadius: 10, padding: '14px 18px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: isSelected ? `0 0 0 3px ${meta.color}22` : 'var(--shadow-sm)', position: 'relative' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                      {NodeIcon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: meta.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{node.label}</div>
                      <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 500 }}>
                        {node.type === 'trigger' && (node.config.event || 'Select trigger...')}
                        {node.type === 'email' && (node.config.subject || 'Select email...')}
                        {node.type === 'wait' && `Wait ${node.config.amount} ${node.config.unit}`}
                        {node.type === 'condition' && `If ${node.config.field} ${node.config.operator} "${node.config.value}"`}
                        {node.type === 'tag' && (node.config.tag ? `Add tag: "${node.config.tag}"` : 'Set tag...')}
                      </div>
                    </div>
                    {nodes.length > 1 && (
                      <button
                        onClick={e => { e.stopPropagation(); deleteNode(node.id); }}
                        style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: 4, borderRadius: 4, display: 'flex', background: 'none' }}
                        aria-label="Delete node"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Node Button */}
          <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <div style={{ width: 2, height: 20, background: '#c5cdd8' }} />
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setAddTypeMenu(m => !m)}
              style={{ gap: 6, borderRadius: 20 }}
            >
              <Plus size={13} /> Add Step
            </button>
            {addTypeMenu && (
              <div style={{ position: 'absolute', top: '100%', marginTop: 8, background: 'white', border: '1px solid var(--border)', borderRadius: 10, boxShadow: 'var(--shadow-md)', padding: 10, display: 'flex', flexDirection: 'column', gap: 4, minWidth: 180, zIndex: 20, animation: 'slideUp 150ms ease' }}>
                {NODE_TYPES.map(nt => (
                  <button key={nt.type} onClick={() => addNode(nt.type)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 6, background: 'none', border: 'none', cursor: 'pointer', color: nt.color, fontFamily: 'inherit', fontSize: 13, fontWeight: 500, transition: 'background 0.1s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                    {nt.icon} {nt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Properties Panel */}
        <div style={{ background: 'white', borderLeft: '1px solid var(--border)', padding: 18, overflowY: 'auto' }}>
          {selectedNodeData ? (
            <>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                {selectedNodeData.label} Settings
              </p>
              <NodePropertiesPanel node={selectedNodeData} onChange={(updates) => updateNodeConfig(selectedNodeData.id, updates)} />
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 12px', color: 'var(--text-muted)' }}>
              <Zap size={28} style={{ opacity: 0.2, marginBottom: 8 }} />
              <p style={{ fontSize: 13 }}>Select a node to configure it</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={activateModal}
        onClose={() => setActivateModal(false)}
        onConfirm={handleActivate}
        title="Activate Automation?"
        message={`"${name}" will start running immediately and enroll contacts as they match the trigger. You can pause it at any time.`}
        confirmLabel="Activate"
        confirmVariant="primary"
      />
    </div>
  );
}

function NodePropertiesPanel({ node, onChange }) {
  if (node.type === 'trigger') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Trigger Event</label>
        <select className="form-select" value={node.config.event || ''} onChange={e => onChange({ event: e.target.value })}>
          {['Contact joins segment', 'Form submitted', 'Tag added', 'Contact created', 'Link clicked'].map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>
      {node.config.event === 'Contact joins segment' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Segment</label>
          <input className="form-input" placeholder="Segment name or ID" value={node.config.segment || ''} onChange={e => onChange({ segment: e.target.value })} />
        </div>
      )}
      {node.config.event === 'Tag added' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Tag</label>
          <input className="form-input" placeholder="e.g. new-customer" value={node.config.tag || ''} onChange={e => onChange({ tag: e.target.value })} />
        </div>
      )}
      {node.config.event === 'Form submitted' && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Form</label>
          <select className="form-select" value={node.config.form || ''} onChange={e => onChange({ form: e.target.value })}>
            <option value="">— Select form —</option>
            <option>Newsletter Signup</option>
            <option>Webinar Registration</option>
            <option>Product Demo Request</option>
          </select>
        </div>
      )}
    </div>
  );

  if (node.type === 'email') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Subject Line</label>
        <input className="form-input" placeholder="Email subject" value={node.config.subject || ''} onChange={e => onChange({ subject: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">From Name</label>
        <input className="form-input" value={node.config.fromName || ''} onChange={e => onChange({ fromName: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">From Email</label>
        <input type="email" className="form-input" value={node.config.fromEmail || ''} onChange={e => onChange({ fromEmail: e.target.value })} />
      </div>
    </div>
  );

  if (node.type === 'wait') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Wait Duration</label>
        <div style={{ display: 'flex', gap: 8 }}>
          <input type="number" className="form-input" min={1} max={365} value={node.config.amount || 1} onChange={e => onChange({ amount: +e.target.value })} style={{ width: 80 }} />
          <select className="form-select" value={node.config.unit || 'days'} onChange={e => onChange({ unit: e.target.value })} style={{ flex: 1 }}>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
            <option value="weeks">Weeks</option>
          </select>
        </div>
      </div>
    </div>
  );

  if (node.type === 'condition') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">If contact…</label>
        <select className="form-select" value={node.config.field || ''} onChange={e => onChange({ field: e.target.value })}>
          <option value="opened_email">Opened email</option>
          <option value="clicked_link">Clicked link</option>
          <option value="has_tag">Has tag</option>
          <option value="email_bounced">Email bounced</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Operator</label>
        <select className="form-select" value={node.config.operator || 'is'} onChange={e => onChange({ operator: e.target.value })}>
          <option value="is">is</option>
          <option value="is not">is not</option>
        </select>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Value</label>
        <select className="form-select" value={node.config.value || 'true'} onChange={e => onChange({ value: e.target.value })}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      <div style={{ background: 'var(--bg)', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: 'var(--text-muted)' }}>
        Two branches will be created: <strong>Yes</strong> and <strong>No</strong> paths.
      </div>
    </div>
  );

  if (node.type === 'tag') return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">Tag to Add</label>
      <input className="form-input" placeholder="e.g. onboarded, engaged, churned" value={node.config.tag || ''} onChange={e => onChange({ tag: e.target.value })} />
      <span className="form-hint">Tag will be added to the contact's profile</span>
    </div>
  );

  return null;
}

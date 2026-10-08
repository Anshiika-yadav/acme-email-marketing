import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Type, Image, MousePointer, Minus, Square, Columns, Share2, Code,
  ChevronLeft, Undo2, Redo2, Monitor, Smartphone, Save, Eye, ArrowRight,
  Trash2, Copy, ChevronUp, ChevronDown, AlignLeft, AlignCenter, AlignRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { templates } from '../data/mockData';

const BLOCK_TYPES = [
  { type: 'text',    icon: <Type size={16} />,         label: 'Text' },
  { type: 'image',   icon: <Image size={16} />,         label: 'Image' },
  { type: 'button',  icon: <MousePointer size={16} />,  label: 'Button' },
  { type: 'divider', icon: <Minus size={16} />,         label: 'Divider' },
  { type: 'spacer',  icon: <Square size={16} />,        label: 'Spacer' },
  { type: 'columns', icon: <Columns size={16} />,       label: 'Columns' },
  { type: 'social',  icon: <Share2 size={16} />,        label: 'Social' },
  { type: 'html',    icon: <Code size={16} />,          label: 'HTML' },
];

const defaultBlocks = [
  { id: 'b1', type: 'image',   content: { src: '', alt: 'Acme Technologies Logo', width: 160, align: 'center' } },
  { id: 'b2', type: 'text',    content: { html: '<h1 style="color:#1e2a3a;font-size:26px;font-weight:700;text-align:center;">October Product Update</h1>', fontSize: 26, align: 'center', color: '#1e2a3a' } },
  { id: 'b3', type: 'text',    content: { html: '<p style="color:#4a5568;font-size:15px;line-height:1.7;">We have exciting updates for you this month. Our team has been working hard to deliver improvements across the entire Acme Suite platform.</p>', fontSize: 15, align: 'left', color: '#4a5568' } },
  { id: 'b4', type: 'button',  content: { label: 'Learn More', url: '#', align: 'center', bgColor: '#c0392b', textColor: '#ffffff', borderRadius: 6 } },
  { id: 'b5', type: 'divider', content: {} },
  { id: 'b6', type: 'text',    content: { html: '<p style="color:#718096;font-size:13px;">Thank you,<br><strong>The Acme Technologies Team</strong></p>', fontSize: 13, align: 'left', color: '#718096' } },
  { id: 'b7', type: 'social',  content: { platforms: ['linkedin', 'twitter', 'facebook'], align: 'center' } },
  { id: 'b8', type: 'text',    content: { html: '<p style="color:#a0aec0;font-size:11px;text-align:center;">Acme Technologies · 100 Innovation Drive, San Francisco, CA 94105<br><a href="#" style="color:#c0392b;">Unsubscribe</a> · <a href="#" style="color:#c0392b;">Privacy Policy</a></p>', fontSize: 11, align: 'center', color: '#a0aec0' } },
];

function renderBlock(block, preview) {
  switch (block.type) {
    case 'text':
      return <div dangerouslySetInnerHTML={{ __html: block.content.html || '<p style="color:#4a5568">Click to edit text...</p>' }} style={{ padding: '4px 0' }} />;
    case 'image':
      return (
        <div style={{ textAlign: block.content.align || 'center', padding: '8px 0' }}>
          <div style={{ display: 'inline-flex', width: block.content.width || 200, height: 80, background: '#f0f2f5', border: '2px dashed #c5cdd8', borderRadius: 6, alignItems: 'center', justifyContent: 'center', color: '#a0aec0', fontSize: 13 }}>
            <Image size={20} style={{ marginRight: 6 }} /> {block.content.alt || 'Image'}
          </div>
        </div>
      );
    case 'button':
      return (
        <div style={{ textAlign: block.content.align || 'center', padding: '10px 0' }}>
          <span style={{ display: 'inline-block', background: block.content.bgColor || '#c0392b', color: block.content.textColor || '#fff', padding: '10px 24px', borderRadius: block.content.borderRadius || 6, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            {block.content.label || 'Button'}
          </span>
        </div>
      );
    case 'divider':
      return <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '8px 0' }} />;
    case 'spacer':
      return <div style={{ height: block.content.height || 24 }} />;
    case 'social':
      return (
        <div style={{ textAlign: block.content.align || 'center', padding: '8px 0' }}>
          {['LinkedIn', 'Twitter', 'Facebook'].map(p => (
            <span key={p} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: '#e2e8f0', borderRadius: '50%', margin: '0 4px', fontSize: 11, fontWeight: 700, color: '#4a5568' }}>
              {p[0]}
            </span>
          ))}
        </div>
      );
    case 'columns':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '8px 0' }}>
          {[0, 1].map(i => (
            <div key={i} style={{ background: '#f5f6f8', borderRadius: 6, padding: 12, minHeight: 60, border: '1px dashed #c5cdd8', fontSize: 12, color: '#a0aec0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Column {i + 1}
            </div>
          ))}
        </div>
      );
    case 'html':
      return (
        <div style={{ background: '#f9fafb', border: '1px dashed #c5cdd8', borderRadius: 6, padding: 12, fontSize: 12, color: '#718096', fontFamily: 'monospace' }}>
          {'<html><!-- Custom HTML block --></html>'}
        </div>
      );
    default: return null;
  }
}

export default function CampaignDesign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns, updateCampaign, showToast } = useApp();

  const campaign = campaigns.find(c => c.id === id);
  const tmpl = campaign?.templateId ? templates.find(t => t.id === campaign.templateId) : null;

  const [blocks, setBlocks] = useState(tmpl?.blocks ? [...tmpl.blocks] : defaultBlocks);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState('desktop');
  const [unsaved, setUnsaved] = useState(false);
  const [history, setHistory] = useState([defaultBlocks]);
  const [histIdx, setHistIdx] = useState(0);

  const pushHistory = (newBlocks) => {
    const h = history.slice(0, histIdx + 1);
    setHistory([...h, newBlocks]);
    setHistIdx(h.length);
  };

  const undo = () => {
    if (histIdx > 0) { setHistIdx(i => i - 1); setBlocks(history[histIdx - 1]); setUnsaved(true); }
  };
  const redo = () => {
    if (histIdx < history.length - 1) { setHistIdx(i => i + 1); setBlocks(history[histIdx + 1]); setUnsaved(true); }
  };

  const addBlock = (type) => {
    const newBlock = { id: 'b' + Date.now(), type, content: type === 'button' ? { label: 'Click Here', url: '#', align: 'center', bgColor: '#c0392b', textColor: '#ffffff', borderRadius: 6 } : type === 'text' ? { html: '<p style="color:#4a5568;font-size:15px;">New text block</p>', fontSize: 15, align: 'left', color: '#4a5568' } : type === 'image' ? { src: '', alt: 'Image', width: 200, align: 'center' } : type === 'spacer' ? { height: 24 } : {} };
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSelected(newBlock.id);
    setUnsaved(true);
  };

  const deleteBlock = (bid) => {
    const newBlocks = blocks.filter(b => b.id !== bid);
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSelected(null);
    setUnsaved(true);
  };

  const duplicateBlock = (bid) => {
    const idx = blocks.findIndex(b => b.id === bid);
    const copy = { ...blocks[idx], id: 'b' + Date.now(), content: { ...blocks[idx].content } };
    const newBlocks = [...blocks.slice(0, idx + 1), copy, ...blocks.slice(idx + 1)];
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setSelected(copy.id);
    setUnsaved(true);
  };

  const moveBlock = (bid, dir) => {
    const idx = blocks.findIndex(b => b.id === bid);
    const newIdx = dir === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= blocks.length) return;
    const newBlocks = [...blocks];
    [newBlocks[idx], newBlocks[newIdx]] = [newBlocks[newIdx], newBlocks[idx]];
    setBlocks(newBlocks);
    pushHistory(newBlocks);
    setUnsaved(true);
  };

  const updateBlock = (bid, contentUpdate) => {
    const newBlocks = blocks.map(b => b.id === bid ? { ...b, content: { ...b.content, ...contentUpdate } } : b);
    setBlocks(newBlocks);
    setUnsaved(true);
  };

  const handleSave = () => {
    updateCampaign(id, { updatedAt: new Date().toISOString() });
    setUnsaved(false);
    showToast('Campaign saved successfully');
  };

  const selectedBlock = blocks.find(b => b.id === selected);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--topbar-height))', marginTop: 0, padding: 0 }}>
      {/* Designer Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px', height: 52, background: 'white', borderBottom: '1px solid var(--border)', flexShrink: 0, zIndex: 10, flexWrap: 'wrap' }}>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')} style={{ gap: 5 }}>
          <ChevronLeft size={14} /> Back
        </button>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
          {campaign?.name || 'Email Designer'}
          {unsaved && <span style={{ fontSize: 11, color: 'var(--warning)', marginLeft: 8, fontWeight: 400 }}>● Unsaved changes</span>}
        </span>
        <div style={{ display: 'flex', gap: 2 }}>
          <button className="btn btn-ghost btn-icon" onClick={undo} disabled={histIdx === 0} data-tooltip="Undo" aria-label="Undo"><Undo2 size={15} /></button>
          <button className="btn btn-ghost btn-icon" onClick={redo} disabled={histIdx >= history.length - 1} data-tooltip="Redo" aria-label="Redo"><Redo2 size={15} /></button>
        </div>
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg)', borderRadius: 8, padding: 2 }}>
          <button className={`btn btn-sm ${preview === 'desktop' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('desktop')} aria-label="Desktop preview"><Monitor size={14} /></button>
          <button className={`btn btn-sm ${preview === 'mobile' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setPreview('mobile')} aria-label="Mobile preview"><Smartphone size={14} /></button>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={handleSave}><Save size={14} /> Save</button>
        <button className="btn btn-primary btn-sm" onClick={() => { handleSave(); navigate(`/campaigns/${id}/review`); }}>
          Continue to Review <ArrowRight size={14} />
        </button>
      </div>

      {/* 3-Column Layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* LEFT: Block Palette */}
        <div style={{ width: 180, background: 'white', borderRight: '1px solid var(--border)', padding: 14, overflowY: 'auto', flexShrink: 0 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Blocks</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {BLOCK_TYPES.map(bt => (
              <button key={bt.type} onClick={() => addBlock(bt.type)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px', border: '1px solid var(--border)', borderRadius: 8, background: 'white', cursor: 'pointer', fontSize: 11.5, color: 'var(--text-secondary)', transition: 'all 0.15s', fontFamily: 'inherit' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--crimson)'; e.currentTarget.style.background = 'var(--crimson-light)'; e.currentTarget.style.color = 'var(--crimson)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'white'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
                {bt.icon}{bt.label}
              </button>
            ))}
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div style={{ flex: 1, background: 'var(--bg)', overflowY: 'auto', display: 'flex', justifyContent: 'center', padding: '24px 20px' }}>
          <div style={{ width: preview === 'mobile' ? 375 : 600, background: 'white', borderRadius: 8, boxShadow: 'var(--shadow-md)', overflow: 'hidden', transition: 'width 0.3s' }}>
            {/* Email header bar */}
            <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border)', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fc5c65' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f7b731' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#26de81' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>Email Preview — 600px</span>
            </div>
            <div style={{ padding: '20px 28px' }}>
              {blocks.map((block, idx) => (
                <div
                  key={block.id}
                  onClick={() => setSelected(block.id)}
                  style={{ position: 'relative', border: selected === block.id ? '2px solid var(--crimson)' : '2px solid transparent', borderRadius: 6, cursor: 'pointer', transition: 'border-color 0.15s', marginBottom: 4 }}
                >
                  {/* Block actions */}
                  {selected === block.id && (
                    <div style={{ position: 'absolute', top: -1, right: -1, display: 'flex', gap: 1, background: 'var(--crimson)', borderRadius: '0 4px 0 4px', zIndex: 5 }}>
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }} style={{ padding: '3px 5px', color: 'white', cursor: 'pointer', background: 'none' }} aria-label="Move up"><ChevronUp size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }} style={{ padding: '3px 5px', color: 'white', cursor: 'pointer', background: 'none' }} aria-label="Move down"><ChevronDown size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }} style={{ padding: '3px 5px', color: 'white', cursor: 'pointer', background: 'none' }} aria-label="Duplicate"><Copy size={12} /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }} style={{ padding: '3px 5px', color: 'white', cursor: 'pointer', background: 'none' }} aria-label="Delete"><Trash2 size={12} /></button>
                    </div>
                  )}
                  <div style={{ padding: '6px 8px' }}>
                    {renderBlock(block, preview)}
                  </div>
                </div>
              ))}
              {blocks.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: 8 }}>
                  <Type size={32} style={{ opacity: 0.3, marginBottom: 10 }} />
                  <p style={{ fontSize: 14 }}>Click blocks on the left to add them here</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: Properties Panel */}
        <div style={{ width: 240, background: 'white', borderLeft: '1px solid var(--border)', padding: 16, overflowY: 'auto', flexShrink: 0 }}>
          {selectedBlock ? (
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
                {selectedBlock.type.charAt(0).toUpperCase() + selectedBlock.type.slice(1)} Properties
              </p>
              <PropertiesPanel block={selectedBlock} onChange={(c) => updateBlock(selectedBlock.id, c)} />
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 12px', color: 'var(--text-muted)' }}>
              <Square size={28} style={{ opacity: 0.25, marginBottom: 10 }} />
              <p style={{ fontSize: 13 }}>Select a block to edit its properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PropertiesPanel({ block, onChange }) {
  if (block.type === 'text') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Content</label>
        <textarea className="form-textarea" style={{ minHeight: 100, fontSize: 12 }} value={block.content.html?.replace(/<[^>]+>/g, '') || ''} onChange={e => onChange({ html: `<p style="color:${block.content.color || '#4a5568'};font-size:${block.content.fontSize || 15}px;text-align:${block.content.align || 'left'}">${e.target.value}</p>` })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Font Size</label>
        <input type="number" className="form-input" value={block.content.fontSize || 15} min={10} max={48} onChange={e => onChange({ fontSize: +e.target.value, html: block.content.html?.replace(/font-size:\d+px/, `font-size:${e.target.value}px`) })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Text Color</label>
        <input type="color" className="form-input" style={{ height: 36, padding: 4 }} value={block.content.color || '#4a5568'} onChange={e => onChange({ color: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Alignment</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {['left', 'center', 'right'].map(a => (
            <button key={a} onClick={() => onChange({ align: a, html: block.content.html?.replace(/text-align:\w+/, `text-align:${a}`) })} style={{ flex: 1, padding: '6px 0', border: `1px solid ${block.content.align === a ? 'var(--crimson)' : 'var(--border)'}`, borderRadius: 6, background: block.content.align === a ? 'var(--crimson-light)' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: block.content.align === a ? 'var(--crimson)' : 'var(--text-muted)' }}>
              {a === 'left' ? <AlignLeft size={13} /> : a === 'center' ? <AlignCenter size={13} /> : <AlignRight size={13} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (block.type === 'button') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Label</label>
        <input className="form-input" value={block.content.label || ''} onChange={e => onChange({ label: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">URL</label>
        <input className="form-input" value={block.content.url || ''} onChange={e => onChange({ url: e.target.value })} placeholder="https://" />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Button Color</label>
        <input type="color" className="form-input" style={{ height: 36, padding: 4 }} value={block.content.bgColor || '#c0392b'} onChange={e => onChange({ bgColor: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Text Color</label>
        <input type="color" className="form-input" style={{ height: 36, padding: 4 }} value={block.content.textColor || '#ffffff'} onChange={e => onChange({ textColor: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Corner Radius</label>
        <input type="range" min={0} max={24} value={block.content.borderRadius || 6} onChange={e => onChange({ borderRadius: +e.target.value })} style={{ width: '100%', accentColor: 'var(--crimson)' }} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{block.content.borderRadius || 6}px</span>
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Alignment</label>
        <div style={{ display: 'flex', gap: 4 }}>
          {['left', 'center', 'right'].map(a => (
            <button key={a} onClick={() => onChange({ align: a })} style={{ flex: 1, padding: '6px 0', border: `1px solid ${block.content.align === a ? 'var(--crimson)' : 'var(--border)'}`, borderRadius: 6, background: block.content.align === a ? 'var(--crimson-light)' : 'white', cursor: 'pointer', display: 'flex', justifyContent: 'center', color: block.content.align === a ? 'var(--crimson)' : 'var(--text-muted)' }}>
              {a === 'left' ? <AlignLeft size={13} /> : a === 'center' ? <AlignCenter size={13} /> : <AlignRight size={13} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  if (block.type === 'image') return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Image URL</label>
        <input className="form-input" value={block.content.src || ''} onChange={e => onChange({ src: e.target.value })} placeholder="https://..." />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Alt Text</label>
        <input className="form-input" value={block.content.alt || ''} onChange={e => onChange({ alt: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Width (px)</label>
        <input type="number" className="form-input" value={block.content.width || 200} min={50} max={600} onChange={e => onChange({ width: +e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Alignment</label>
        <select className="form-select" value={block.content.align || 'center'} onChange={e => onChange({ align: e.target.value })}>
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  );

  if (block.type === 'spacer') return (
    <div className="form-group" style={{ marginBottom: 0 }}>
      <label className="form-label">Height (px)</label>
      <input type="number" className="form-input" value={block.content.height || 24} min={8} max={120} step={4} onChange={e => onChange({ height: +e.target.value })} />
    </div>
  );

  return (
    <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>
      No editable properties for this block type.
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export default function Dropdown({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="dropdown-wrap" ref={ref}>
      <div onClick={() => setOpen(o => !o)} style={{ cursor: 'pointer' }}>
        {trigger || (
          <button className="btn btn-ghost btn-icon" aria-label="Actions">
            <MoreHorizontal size={16} />
          </button>
        )}
      </div>
      {open && (
        <div className="dropdown-menu" style={{ [align === 'left' ? 'left' : 'right']: 0 }}>
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} className="dropdown-separator" />
            ) : (
              <button
                key={i}
                className={`dropdown-item ${item.danger ? 'danger' : ''}`}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                disabled={item.disabled}
              >
                {item.icon && <span style={{ display: 'flex' }}>{item.icon}</span>}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

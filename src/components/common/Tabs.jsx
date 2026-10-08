export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.value}
          role="tab"
          aria-selected={active === tab.value}
          className={`tab-btn ${active === tab.value ? 'active' : ''}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{
              marginLeft: 6,
              background: active === tab.value ? 'var(--crimson-light)' : 'var(--bg)',
              color: active === tab.value ? 'var(--crimson)' : 'var(--text-muted)',
              fontSize: 11,
              fontWeight: 600,
              padding: '1px 6px',
              borderRadius: 10,
            }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

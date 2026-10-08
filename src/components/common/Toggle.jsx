export default function Toggle({ checked, onChange, label, id }) {
  const toggleId = id || `toggle-${Math.random().toString(36).slice(2)}`;
  return (
    <div className="toggle-wrap">
      <label className="toggle" htmlFor={toggleId}>
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          onChange={e => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
      {label && (
        <label htmlFor={toggleId} style={{ fontSize: 13.5, color: 'var(--text-secondary)', cursor: 'pointer' }}>
          {label}
        </label>
      )}
    </div>
  );
}

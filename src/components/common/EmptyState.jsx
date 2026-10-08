import Button from './Button';

export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div className="empty-state">
      {icon && (
        <div className="empty-state-icon">{icon}</div>
      )}
      <p className="empty-state-title">{title}</p>
      {description && <p className="empty-state-desc">{description}</p>}
      {action && actionLabel && (
        <Button variant="primary" size="sm" onClick={action} style={{ marginTop: 8 }}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ rows = 5 }) {
  return (
    <div style={{ padding: '20px 0' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div className="skeleton" style={{ width: 20, height: 20, borderRadius: 4 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div className="skeleton" style={{ height: 14, width: '45%' }} />
            <div className="skeleton" style={{ height: 11, width: '30%' }} />
          </div>
          <div className="skeleton" style={{ width: 70, height: 22, borderRadius: 20 }} />
          <div className="skeleton" style={{ width: 60, height: 14 }} />
        </div>
      ))}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: 'var(--error-bg)' }}>
        <svg width="24" height="24" fill="none" stroke="var(--error)" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <p className="empty-state-title" style={{ color: 'var(--error)' }}>{message}</p>
      {onRetry && <Button variant="secondary" size="sm" onClick={onRetry} style={{ marginTop: 8 }}>Try again</Button>}
    </div>
  );
}

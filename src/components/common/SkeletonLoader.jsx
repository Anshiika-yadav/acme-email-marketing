export default function SkeletonLoader({ width = '100%', height = 14, borderRadius = 6, style = {} }) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius, ...style }}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <SkeletonLoader height={12} width="40%" />
      <SkeletonLoader height={28} width="60%" />
      <SkeletonLoader height={11} width="30%" />
    </div>
  );
}

export function SkeletonTable({ rows = 5, cols = 5 }) {
  return (
    <div style={{ padding: '0' }}>
      <div style={{ display: 'flex', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--border)', background: '#fafbfc' }}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonLoader key={i} height={10} width={`${80 / cols}%`} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 16px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
          <SkeletonLoader height={14} width={14} borderRadius={3} style={{ flexShrink: 0 }} />
          {Array.from({ length: cols - 1 }).map((_, j) => (
            <SkeletonLoader key={j} height={12} width={`${70 / (cols - 1)}%`} />
          ))}
          <SkeletonLoader height={22} width={60} borderRadius={20} style={{ marginLeft: 'auto' }} />
        </div>
      ))}
    </div>
  );
}

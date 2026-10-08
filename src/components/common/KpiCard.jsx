export default function KpiCard({ label, value, sub, trend, trendDir, icon, accent }) {
  return (
    <div className="kpi-card" style={accent ? { borderTop: `3px solid ${accent}` } : {}}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <p className="kpi-label">{label}</p>
        {icon && <span style={{ color: 'var(--text-muted)', opacity: 0.7 }}>{icon}</span>}
      </div>
      <p className="kpi-value">{value}</p>
      {sub && <p className="kpi-sub">{sub}</p>}
      {trend && (
        <p className={`kpi-trend ${trendDir}`}>
          {trendDir === 'up' ? '↑' : '↓'} {trend}
        </p>
      )}
    </div>
  );
}

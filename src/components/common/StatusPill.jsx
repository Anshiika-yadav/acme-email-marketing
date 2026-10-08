export default function StatusPill({ status }) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '-');
  const labels = {
    sent: 'Sent', scheduled: 'Scheduled', draft: 'Draft',
    sending: 'Sending', paused: 'Paused', archived: 'Archived',
    active: 'Active', subscribed: 'Subscribed', unsubscribed: 'Unsubscribed',
    bounced: 'Bounced', published: 'Published', 'in-progress': 'In Progress',
  };
  const label = labels[normalized] || status;
  return (
    <span className={`pill pill-${normalized}`}>
      <span className="pill-dot" />
      {label}
    </span>
  );
}

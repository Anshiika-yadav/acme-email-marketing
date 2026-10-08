import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const icons = {
  success: <CheckCircle size={16} color="#27ae60" />,
  error:   <XCircle size={16} color="#c0392b" />,
  warning: <AlertTriangle size={16} color="#e67e22" />,
  info:    <Info size={16} color="#2980b9" />,
};

function ToastItem({ id, message, type = 'success' }) {
  const { removeToast } = useApp();
  return (
    <div className={`toast toast-${type}`} role="alert">
      <span style={{ flexShrink: 0 }}>{icons[type]}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button className="toast-close" onClick={() => removeToast(id)} aria-label="Dismiss">
        <X size={14} />
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} {...t} />)}
    </div>
  );
}

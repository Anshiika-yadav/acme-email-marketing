import { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ToastContainer from '../common/Toast';

export default function AppShell({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="app-shell">
      <Sidebar
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="main-content">
        <Topbar onMobileMenuToggle={() => setMobileOpen(o => !o)} />
        <main className="page-body">
          {children}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

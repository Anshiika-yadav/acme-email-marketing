import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import AppShell from './components/layout/AppShell';

// Pages
import Login             from './pages/Login';
import Dashboard         from './pages/Dashboard';
import Campaigns         from './pages/Campaigns';
import CampaignNew       from './pages/CampaignNew';
import CampaignDesign    from './pages/CampaignDesign';
import CampaignReview    from './pages/CampaignReview';
import CampaignReport    from './pages/CampaignReport';
import Contacts          from './pages/Contacts';
import ContactImport     from './pages/ContactImport';
import ContactDetails    from './pages/ContactDetails';
import Segments          from './pages/Segments';
import Templates         from './pages/Templates';
import TemplateDetails   from './pages/TemplateDetails';
import Automations       from './pages/Automations';
import AutomationNew     from './pages/AutomationNew';
import Analytics         from './pages/Analytics';
import Forms             from './pages/Forms';
import FormNew           from './pages/FormNew';
import SettingsLayout    from './pages/Settings/index';
import CompanySettings   from './pages/Settings/Company';
import SendingSettings   from './pages/Settings/Sending';
import TrackingSettings  from './pages/Settings/Tracking';
import PreferencesSettings from './pages/Settings/Preferences';
import ProfileSettings   from './pages/Settings/Profile';

// Pages that use the full-bleed designer layout (no inner page-body padding)
const FULL_BLEED_ROUTES = ['/design', '/automations/new', '/forms/new'];

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp();
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Full-bleed pages (designer, automation builder, form builder) render without AppShell padding
  const isFullBleed = FULL_BLEED_ROUTES.some(r => location.pathname.includes(r));
  if (isFullBleed) {
    return (
      <AppShell>
        <div style={{ margin: '-28px -32px', minHeight: 'calc(100vh - var(--topbar-height))' }}>
          {children}
        </div>
      </AppShell>
    );
  }
  return <AppShell>{children}</AppShell>;
}

function AppRoutes() {
  const { isAuthenticated } = useApp();
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
      <Route path="/campaigns/new" element={<ProtectedRoute><CampaignNew /></ProtectedRoute>} />
      <Route path="/campaigns/:id/design" element={<ProtectedRoute><CampaignDesign /></ProtectedRoute>} />
      <Route path="/campaigns/:id/review" element={<ProtectedRoute><CampaignReview /></ProtectedRoute>} />
      <Route path="/campaigns/:id/report" element={<ProtectedRoute><CampaignReport /></ProtectedRoute>} />

      <Route path="/contacts" element={<ProtectedRoute><Contacts /></ProtectedRoute>} />
      <Route path="/contacts/import" element={<ProtectedRoute><ContactImport /></ProtectedRoute>} />
      <Route path="/contacts/:id" element={<ProtectedRoute><ContactDetails /></ProtectedRoute>} />

      <Route path="/segments" element={<ProtectedRoute><Segments /></ProtectedRoute>} />

      <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
      <Route path="/templates/new" element={<ProtectedRoute><TemplateDetails /></ProtectedRoute>} />
      <Route path="/templates/:id" element={<ProtectedRoute><TemplateDetails /></ProtectedRoute>} />

      <Route path="/automations" element={<ProtectedRoute><Automations /></ProtectedRoute>} />
      <Route path="/automations/new" element={<ProtectedRoute><AutomationNew /></ProtectedRoute>} />

      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />

      <Route path="/forms" element={<ProtectedRoute><Forms /></ProtectedRoute>} />
      <Route path="/forms/new" element={<ProtectedRoute><FormNew /></ProtectedRoute>} />

      {/* Settings */}
      <Route path="/settings" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/settings/company" replace />} />
        <Route path="company"     element={<CompanySettings />} />
        <Route path="sending"     element={<SendingSettings />} />
        <Route path="tracking"    element={<TrackingSettings />} />
        <Route path="preferences" element={<PreferencesSettings />} />
        <Route path="profile"     element={<ProfileSettings />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

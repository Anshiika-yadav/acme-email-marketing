import { createContext, useContext, useState, useCallback } from 'react';
import {
  campaigns as initialCampaigns,
  contacts as initialContacts,
  segments as initialSegments,
  templates as initialTemplates,
  automations as initialAutomations,
  forms as initialForms,
  notifications as initialNotifications,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser] = useState({
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@acmetechnologies.com',
    role: 'Marketing Manager',
    avatar: null,
  });

  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [contacts, setContacts] = useState(initialContacts);
  const [segments, setSegments] = useState(initialSegments);
  const [templates, setTemplates] = useState(initialTemplates);
  const [automations, setAutomations] = useState(initialAutomations);
  const [forms, setForms] = useState(initialForms);
  const [notifications, setNotifications] = useState(initialNotifications);

  // Toast state
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Campaign CRUD
  const addCampaign = useCallback((campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  }, []);

  const updateCampaign = useCallback((id, updates) => {
    setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCampaign = useCallback((id) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  }, []);

  // Contact CRUD
  const addContact = useCallback((contact) => {
    setContacts(prev => [contact, ...prev]);
  }, []);

  const updateContact = useCallback((id, updates) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteContact = useCallback((id) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  }, []);

  // Segment CRUD
  const addSegment = useCallback((segment) => {
    setSegments(prev => [segment, ...prev]);
  }, []);

  const updateSegment = useCallback((id, updates) => {
    setSegments(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteSegment = useCallback((id) => {
    setSegments(prev => prev.filter(s => s.id !== id));
  }, []);

  // Template CRUD
  const addTemplate = useCallback((template) => {
    setTemplates(prev => [template, ...prev]);
  }, []);

  const updateTemplate = useCallback((id, updates) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTemplate = useCallback((id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  }, []);

  // Automation CRUD
  const addAutomation = useCallback((auto) => {
    setAutomations(prev => [auto, ...prev]);
  }, []);

  const updateAutomation = useCallback((id, updates) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  }, []);

  const deleteAutomation = useCallback((id) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  }, []);

  // Form CRUD
  const addForm = useCallback((form) => {
    setForms(prev => [form, ...prev]);
  }, []);

  const updateForm = useCallback((id, updates) => {
    setForms(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  }, []);

  const deleteForm = useCallback((id) => {
    setForms(prev => prev.filter(f => f.id !== id));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      currentUser,
      campaigns, addCampaign, updateCampaign, deleteCampaign,
      contacts, addContact, updateContact, deleteContact,
      segments, addSegment, updateSegment, deleteSegment,
      templates, addTemplate, updateTemplate, deleteTemplate,
      automations, addAutomation, updateAutomation, deleteAutomation,
      forms, addForm, updateForm, deleteForm,
      notifications, markNotificationRead, markAllNotificationsRead, unreadCount,
      toasts, showToast, removeToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

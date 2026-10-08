import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Plus, Send, Eye, MousePointer, UserMinus, Users, Mail, Activity, Edit, Copy, BarChart2, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData, kpiSummary, recentActivities } from '../data/mockData';
import KpiCard from '../components/common/KpiCard';
import StatusPill from '../components/common/StatusPill';
import Dropdown from '../components/common/Dropdown';

const DATE_FILTERS = ['7 Days', '30 Days', '90 Days'];
const filterKey = { '7 Days': '7d', '30 Days': '30d', '90 Days': '90d' };

const activityIcons = {
  send: <Send size={14} />, calendar: <Activity size={14} />,
  users: <Users size={14} />, zap: <Activity size={14} />,
  'file-text': <Mail size={14} />, 'bar-chart': <BarChart2 size={14} />,
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { campaigns, deleteCampaign, showToast } = useApp();
  const [dateFilter, setDateFilter] = useState('30 Days');
  const chartData = analyticsData[filterKey[dateFilter]];

  const recentCampaigns = [...campaigns]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>{greeting}, Marketing Team</h1>
          <p style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 3 }}>Monitor your email performance and campaigns.</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/campaigns/new')}>
          <Plus size={15} /> Create Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <KpiCard label="Total Contacts" value={kpiSummary.totalContacts.toLocaleString()} sub="Active audience" trend="↑ 412 this month" trendDir="up" accent="var(--info)" icon={<Users size={16} />} />
        <KpiCard label="Active Campaigns" value={kpiSummary.activeCampaigns} sub="Scheduled or sending" accent="var(--warning)" icon={<Mail size={16} />} />
        <KpiCard label="Emails Sent" value={kpiSummary.emailsSent.toLocaleString()} sub="Last 90 days" trend="↑ 8.3% vs last period" trendDir="up" accent="var(--navy)" icon={<Send size={16} />} />
        <KpiCard label="Avg Open Rate" value={`${kpiSummary.avgOpenRate}%`} sub="Industry avg: 21.5%" trend="↑ 2.1% vs last month" trendDir="up" accent="var(--success)" icon={<Eye size={16} />} />
        <KpiCard label="Click Rate" value={`${kpiSummary.clickRate}%`} sub="Industry avg: 2.6%" trend="↑ 0.4%" trendDir="up" accent="var(--crimson)" icon={<MousePointer size={16} />} />
        <KpiCard label="Unsubscribe Rate" value={`${kpiSummary.unsubscribeRate}%`} sub="Industry avg: 0.5%" trend="↓ 0.02%" trendDir="up" accent="#8e44ad" icon={<UserMinus size={16} />} />
      </div>

      {/* Chart + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20, marginBottom: 20 }}>
        {/* Performance Chart */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Email Performance</h2>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Sends, opens, and clicks over time</p>
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              {DATE_FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`btn btn-sm ${dateFilter === f ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ minWidth: 72 }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-wrap" style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false}
                  interval={dateFilter === '90 Days' ? 13 : dateFilter === '30 Days' ? 5 : 0} />
                <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="sends" stroke="#2980b9" strokeWidth={2} dot={false} name="Sends" />
                <Line type="monotone" dataKey="opens" stroke="#27ae60" strokeWidth={2} dot={false} name="Opens" />
                <Line type="monotone" dataKey="clicks" stroke="#c0392b" strokeWidth={2} dot={false} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 20, overflow: 'hidden' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Recent Activity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivities.map((act, i) => (
              <div key={act.id} style={{ display: 'flex', gap: 10, paddingBottom: 13, marginBottom: i < recentActivities.length - 1 ? 13 : 0, borderBottom: i < recentActivities.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                  {activityIcons[act.icon] || <Activity size={14} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.4 }}>{act.text}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-xsmall)', marginTop: 3 }}>{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px' }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Recent Campaigns</h2>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/campaigns')}>View all →</button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Campaign</th>
                <th>Status</th>
                <th>Audience</th>
                <th>Open Rate</th>
                <th>Click Rate</th>
                <th>Date</th>
                <th style={{ width: 48 }}></th>
              </tr>
            </thead>
            <tbody>
              {recentCampaigns.map(c => (
                <tr key={c.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/campaigns`)}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: 13.5, color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{c.subject}</div>
                  </td>
                  <td><StatusPill status={c.status} /></td>
                  <td><span style={{ fontSize: 13 }}>{c.audience}</span></td>
                  <td>
                    {c.openRate > 0
                      ? <span style={{ fontWeight: 600, color: c.openRate > 30 ? 'var(--success)' : 'var(--text-primary)' }}>{c.openRate}%</span>
                      : <span style={{ color: 'var(--text-xsmall)' }}>—</span>
                    }
                  </td>
                  <td>
                    {c.clickRate > 0
                      ? <span style={{ fontWeight: 600 }}>{c.clickRate}%</span>
                      : <span style={{ color: 'var(--text-xsmall)' }}>—</span>
                    }
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                    {c.sentAt ? new Date(c.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : c.scheduledAt ? `Sch. ${new Date(c.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'Draft'}
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <Dropdown items={[
                      { label: 'Edit', icon: <Edit size={13} />, onClick: () => navigate('/campaigns') },
                      { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => showToast('Campaign duplicated') },
                      { label: 'View Report', icon: <BarChart2 size={13} />, onClick: () => navigate(`/campaigns/${c.id}/report`) },
                      { separator: true },
                      { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => deleteCampaign(c.id) },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        @media (max-width: 1100px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

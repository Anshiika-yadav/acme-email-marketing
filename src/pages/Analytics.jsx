import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Download, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData, deviceData, audienceGrowthData, kpiSummary } from '../data/mockData';
import PageHeader from '../components/common/PageHeader';
import KpiCard from '../components/common/KpiCard';

const DATE_FILTERS = ['7 Days', '30 Days', '90 Days', 'Custom'];
const filterKey = { '7 Days': '7d', '30 Days': '30d', '90 Days': '90d', 'Custom': '30d' };
const DEVICE_COLORS = ['#2980b9', '#c0392b', '#27ae60'];

export default function Analytics() {
  const { campaigns } = useApp();
  const [dateFilter, setDateFilter] = useState('30 Days');
  const [campaignFilter, setCampaignFilter] = useState('all');

  const chartData = analyticsData[filterKey[dateFilter]];
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');

  const avgDelivery = 98.5;
  const avgOpen = kpiSummary.avgOpenRate;
  const avgClick = kpiSummary.clickRate;
  const avgBounce = 1.4;
  const avgUnsub = kpiSummary.unsubscribeRate;

  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="Detailed performance metrics across all campaigns."
        actions={
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export Report</button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 4 }}>
          {DATE_FILTERS.map(f => (
            <button key={f} onClick={() => setDateFilter(f)} className={`btn btn-sm ${dateFilter === f ? 'btn-primary' : 'btn-secondary'}`}>{f}</button>
          ))}
        </div>
        <select className="form-select" style={{ width: 220, fontSize: 13 }} value={campaignFilter} onChange={e => setCampaignFilter(e.target.value)}>
          <option value="all">All Campaigns</option>
          {sentCampaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
        <KpiCard label="Total Sent" value={kpiSummary.emailsSent.toLocaleString()} sub="Last 90 days" trend="↑ 8.3%" trendDir="up" accent="var(--navy)" />
        <KpiCard label="Delivery Rate" value={`${avgDelivery}%`} sub="Industry avg: 97%" trend="↑ 0.5%" trendDir="up" accent="var(--success)" />
        <KpiCard label="Open Rate" value={`${avgOpen}%`} sub="Industry avg: 21.5%" trend="↑ 2.1%" trendDir="up" accent="var(--info)" />
        <KpiCard label="Click Rate" value={`${avgClick}%`} sub="Industry avg: 2.6%" trend="↑ 0.4%" trendDir="up" accent="var(--crimson)" />
        <KpiCard label="Bounce Rate" value={`${avgBounce}%`} sub="Industry avg: 2%" trend="↓ 0.1%" trendDir="up" accent="var(--warning)" />
        <KpiCard label="Unsubscribe" value={`${avgUnsub}%`} sub="Industry avg: 0.5%" trend="↓ 0.02%" trendDir="up" accent="#8e44ad" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Performance over time */}
        <div className="card" style={{ padding: 22 }}>
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>Email Performance Over Time</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Sends, opens, and clicks</p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSends" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2980b9" stopOpacity={0.12}/><stop offset="95%" stopColor="#2980b9" stopOpacity={0}/></linearGradient>
                <linearGradient id="gradOpens" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#27ae60" stopOpacity={0.12}/><stop offset="95%" stopColor="#27ae60" stopOpacity={0}/></linearGradient>
                <linearGradient id="gradClicks" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c0392b" stopOpacity={0.12}/><stop offset="95%" stopColor="#c0392b" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false}
                interval={dateFilter === '90 Days' ? 13 : dateFilter === '30 Days' ? 4 : 0} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="sends" stroke="#2980b9" fill="url(#gradSends)" strokeWidth={2} dot={false} name="Sends" />
              <Area type="monotone" dataKey="opens" stroke="#27ae60" fill="url(#gradOpens)" strokeWidth={2} dot={false} name="Opens" />
              <Area type="monotone" dataKey="clicks" stroke="#c0392b" fill="url(#gradClicks)" strokeWidth={2} dot={false} name="Clicks" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Opens by Device</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>How contacts open emails</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={deviceData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} dataKey="value" paddingAngle={4}>
                {deviceData.map((entry, i) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
            {deviceData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: DEVICE_COLORS[i], flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Campaign performance comparison */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Campaign Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={sentCampaigns.slice(0, 5).map(c => ({ name: c.name.substring(0, 16) + (c.name.length > 16 ? '…' : ''), openRate: c.openRate, clickRate: c.clickRate }))}
              margin={{ left: -20, right: 8, top: 4, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#718096' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="openRate" fill="#27ae60" radius={[4, 4, 0, 0]} name="Open Rate %" />
              <Bar dataKey="clickRate" fill="#c0392b" radius={[4, 4, 0, 0]} name="Click Rate %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Growth */}
        <div className="card" style={{ padding: 22 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Audience Growth</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Total contacts over time</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={audienceGrowthData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <defs>
                <linearGradient id="gradGrowth" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2980b9" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2980b9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Area type="monotone" dataKey="contacts" stroke="#2980b9" fill="url(#gradGrowth)" strokeWidth={2.5} dot={{ r: 3, fill: '#2980b9' }} name="Total Contacts" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom: Opens vs Clicks line */}
      <div className="card" style={{ padding: 22 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Opens vs Clicks Trend</h3>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Daily comparison of email engagement</p>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData.slice(-14)} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="opens" stroke="#27ae60" strokeWidth={2.5} dot={{ r: 3 }} name="Opens" />
            <Line type="monotone" dataKey="clicks" stroke="#c0392b" strokeWidth={2.5} dot={{ r: 3 }} name="Clicks" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

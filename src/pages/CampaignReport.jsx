import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { ArrowLeft, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyticsData, campaignReportLinks, topEngagedContacts, deviceData } from '../data/mockData';
import Breadcrumb from '../components/common/Breadcrumb';
import KpiCard from '../components/common/KpiCard';

const DEVICE_COLORS = ['#2980b9', '#c0392b', '#27ae60'];
const DATE_FILTERS = ['7 Days', '30 Days', '90 Days'];
const filterKey = { '7 Days': '7d', '30 Days': '30d', '90 Days': '90d' };

export default function CampaignReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { campaigns } = useApp();
  const [dateFilter, setDateFilter] = useState('30 Days');

  const campaign = campaigns.find(c => c.id === id) || {
    id, name: 'October Product Update', subject: 'Exciting new features in Acme Suite 4.2',
    fromName: 'Acme Technologies', fromEmail: 'marketing@acmetechnologies.com',
    audience: 'All Subscribers', audienceCount: 12480,
    sent: 12480, delivered: 12301, opens: 4823, uniqueOpens: 4102,
    clicks: 1237, uniqueClicks: 1089, bounces: 179, unsubscribes: 34,
    openRate: 33.4, clickRate: 8.9, bounceRate: 1.4, unsubscribeRate: 0.27,
    sentAt: '2026-10-01T10:00:00Z',
  };

  const chartData = analyticsData[filterKey[dateFilter]].slice(0, 14);
  const deliveryRate = campaign.sent > 0 ? ((campaign.delivered / campaign.sent) * 100).toFixed(1) : 0;

  return (
    <div>
      <Breadcrumb items={[{ label: 'Campaigns', to: '/campaigns' }, { label: 'Report' }]} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">Campaign Report</h1>
          <p className="page-subtitle">{campaign.name}</p>
          {campaign.sentAt && (
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Sent {new Date(campaign.sentAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {DATE_FILTERS.map(f => (
              <button key={f} onClick={() => setDateFilter(f)} className={`btn btn-sm ${dateFilter === f ? 'btn-primary' : 'btn-secondary'}`}>{f}</button>
            ))}
          </div>
          <button className="btn btn-secondary btn-sm"><Download size={14} /> Export</button>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 12, marginBottom: 20 }}>
        <KpiCard label="Delivered" value={campaign.delivered?.toLocaleString() || '—'} sub={`${deliveryRate}% rate`} accent="var(--navy)" />
        <KpiCard label="Opens" value={campaign.opens?.toLocaleString() || '—'} sub={`${campaign.openRate}% rate`} accent="var(--success)" />
        <KpiCard label="Unique Opens" value={campaign.uniqueOpens?.toLocaleString() || '—'} sub="unique" accent="var(--info)" />
        <KpiCard label="Clicks" value={campaign.clicks?.toLocaleString() || '—'} sub={`${campaign.clickRate}% rate`} accent="var(--crimson)" />
        <KpiCard label="Unique Clicks" value={campaign.uniqueClicks?.toLocaleString() || '—'} sub="unique" accent="#8e44ad" />
        <KpiCard label="Bounces" value={campaign.bounces?.toLocaleString() || '—'} sub={`${campaign.bounceRate}% rate`} accent="var(--warning)" />
        <KpiCard label="Unsubscribes" value={campaign.unsubscribes?.toLocaleString() || '—'} sub={`${campaign.unsubscribeRate}% rate`} accent="var(--error)" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Open Rate Over Time */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Open Rate Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Line type="monotone" dataKey="opens" stroke="#27ae60" strokeWidth={2} dot={false} name="Opens" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Click Rate Over Time */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Clicks Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} interval={2} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid var(--border)' }} />
              <Line type="monotone" dataKey="clicks" stroke="#c0392b" strokeWidth={2} dot={false} name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Device Breakdown */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Device Breakdown</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                  {deviceData.map((entry, i) => <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {deviceData.map((d, i) => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: DEVICE_COLORS[i], flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, marginLeft: 'auto' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Engagement Breakdown</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={[
              { name: 'Delivered', value: campaign.delivered || 12301 },
              { name: 'Opened', value: campaign.uniqueOpens || 4102 },
              { name: 'Clicked', value: campaign.uniqueClicks || 1089 },
              { name: 'Unsubscribed', value: campaign.unsubscribes || 34 },
            ]} margin={{ left: -20, right: 8, top: 4, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f5" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#718096' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="value" fill="#2980b9" radius={[4, 4, 0, 0]} name="Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Links + Top Contacts + Delivery Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        {/* Top Links */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Top Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {campaignReportLinks.map((link, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: i < campaignReportLinks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ fontSize: 12.5, color: 'var(--info)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: 8 }}>{link.url}</span>
                <span style={{ fontSize: 13, fontWeight: 600, flexShrink: 0 }}>{link.clicks}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Engaged Contacts */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Top Engaged Contacts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {topEngagedContacts.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderBottom: i < topEngagedContacts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--crimson)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
                  {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.opens} opens · {c.clicks} clicks</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Summary */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Delivery Summary</h3>
          {[
            { label: 'Total Sent', value: campaign.sent?.toLocaleString(), color: 'var(--navy)' },
            { label: 'Delivered', value: `${campaign.delivered?.toLocaleString()} (${deliveryRate}%)`, color: 'var(--success)' },
            { label: 'Soft Bounces', value: Math.round((campaign.bounces || 179) * 0.6).toLocaleString(), color: 'var(--warning)' },
            { label: 'Hard Bounces', value: Math.round((campaign.bounces || 179) * 0.4).toLocaleString(), color: 'var(--error)' },
            { label: 'Unsubscribes', value: campaign.unsubscribes?.toLocaleString(), color: 'var(--error)' },
            { label: 'Spam Reports', value: '3', color: 'var(--warning)' },
          ].map(row => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

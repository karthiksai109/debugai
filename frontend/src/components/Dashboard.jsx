import React, { useState, useEffect } from 'react';
import { fetchStats } from '../api.js';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SEVERITY_COLORS = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#6b7280'
};

const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

export default function Dashboard({ onViewDetail }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10000);
    return () => clearInterval(interval);
  }, []);

  async function loadStats() {
    try {
      const data = await fetchStats();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading dashboard...</div>;
  if (error) return <div className="text-red-400 py-12 text-center">{error}</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Analyses" value={stats.total} color="text-gray-100" />
        <StatCard label="Completed" value={stats.completed} color="text-emerald-400" />
        <StatCard label="Failed" value={stats.failed} color="text-red-400" />
        <StatCard label="Avg Confidence" value={`${Math.round(stats.avgConfidence * 100)}%`} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.bySeverity.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4">By Severity</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={stats.bySeverity}>
                <XAxis dataKey="severity" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#f3f4f6' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {stats.bySeverity.map((entry) => (
                    <Cell key={entry.severity} fill={SEVERITY_COLORS[entry.severity] || '#6b7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {stats.byCategory.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-4">By Category</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={stats.byCategory} dataKey="count" nameKey="category" cx="50%" cy="50%" outerRadius={80} label={({ category, count }) => `${category} (${count})`}>
                  {stats.byCategory.map((_, i) => (
                    <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid #374151', borderRadius: 8, color: '#f3f4f6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {stats.recent.length > 0 && (
        <div className="bg-gray-900 rounded-xl border border-gray-800">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="text-sm font-medium text-gray-400">Recent Analyses</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {stats.recent.map((a) => (
              <button
                key={a.id}
                onClick={() => onViewDetail(a.id)}
                className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SeverityDot severity={a.severity} />
                  <span className="text-sm text-gray-200 truncate">{a.input_text.slice(0, 80)}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-xs text-gray-500">{a.category || 'pending'}</span>
                  <StatusBadge status={a.status} />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {stats.total === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No analyses yet</p>
          <p className="text-sm">Send a message to the Slack bot or use the Submit tab to get started</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
    </div>
  );
}

function SeverityDot({ severity }) {
  const colors = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
    info: 'bg-gray-500'
  };
  return <div className={`w-2 h-2 rounded-full shrink-0 ${colors[severity] || 'bg-gray-600'}`} />;
}

function StatusBadge({ status }) {
  const styles = {
    completed: 'bg-emerald-500/20 text-emerald-400',
    failed: 'bg-red-500/20 text-red-400',
    pending: 'bg-yellow-500/20 text-yellow-400'
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status] || styles.pending}`}>
      {status}
    </span>
  );
}

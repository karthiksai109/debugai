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

const DEMO_STATS = {
  total: 47,
  completed: 42,
  failed: 3,
  pending: 2,
  avgConfidence: 0.87,
  bySeverity: [
    { severity: 'critical', count: 5 },
    { severity: 'high', count: 12 },
    { severity: 'medium', count: 18 },
    { severity: 'low', count: 9 },
    { severity: 'info', count: 3 }
  ],
  byCategory: [
    { category: 'runtime_error', count: 11 },
    { category: 'performance', count: 9 },
    { category: 'database', count: 8 },
    { category: 'memory_leak', count: 6 },
    { category: 'network', count: 5 },
    { category: 'security', count: 4 },
    { category: 'configuration', count: 4 }
  ],
  recent: [
    { id: 'demo-1', input_text: 'java.lang.OutOfMemoryError: Java heap space at com.app.cache.InMemoryCache.put', severity: 'critical', category: 'memory_leak', status: 'completed', created_at: new Date().toISOString() },
    { id: 'demo-2', input_text: 'Connection pool exhausted: HikariPool-1 - Connection is not available, request timed out after 30000ms', severity: 'high', category: 'database', status: 'completed', created_at: new Date().toISOString() },
    { id: 'demo-3', input_text: 'upstream timed out (110: Connection timed out) while reading response header from upstream, p99: 12.4s', severity: 'high', category: 'performance', status: 'completed', created_at: new Date().toISOString() },
    { id: 'demo-4', input_text: 'WARN: SQL injection attempt detected in parameter user_id, input: "1 OR 1=1; DROP TABLE users"', severity: 'critical', category: 'security', status: 'completed', created_at: new Date().toISOString() },
    { id: 'demo-5', input_text: 'TypeError: Cannot read properties of undefined (reading "map") at UserService.getAll', severity: 'medium', category: 'runtime_error', status: 'completed', created_at: new Date().toISOString() },
    { id: 'demo-6', input_text: 'Redis ETIMEDOUT: connection timed out to 10.0.2.50:6379 after 5000ms', severity: 'medium', category: 'network', status: 'completed', created_at: new Date().toISOString() }
  ]
};

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

  if (error || !stats) {
    return (
      <div className="text-center py-16">
        <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-lg mx-auto p-8">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-400 text-xl">!</span>
          </div>
          <h2 className="text-lg text-gray-200 mb-2">Backend not connected</h2>
          <p className="text-sm text-gray-500 mb-4">
            The API server is not reachable. To see live data, start the backend locally or deploy it to Render.
          </p>
          <code className="text-xs text-gray-600 bg-gray-950 px-3 py-1.5 rounded">cd backend && npm run dev</code>
          <div className="mt-6 pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-600 mb-3">Preview with demo data:</p>
            <button
              onClick={() => { setStats(DEMO_STATS); setError(null); }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Load Demo Data
            </button>
          </div>
        </div>
      </div>
    );
  }

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

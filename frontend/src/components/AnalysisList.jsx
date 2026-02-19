import React, { useState, useEffect } from 'react';
import { fetchAnalyses } from '../api.js';

export default function AnalysisList({ onViewDetail }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyses(100, 0)
      .then(setAnalyses)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;

  if (analyses.length === 0) {
    return <div className="text-gray-500 py-12 text-center">No analyses found</div>;
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 text-gray-500 text-xs">
            <th className="text-left px-5 py-3 font-medium">Input</th>
            <th className="text-left px-5 py-3 font-medium">Severity</th>
            <th className="text-left px-5 py-3 font-medium">Category</th>
            <th className="text-left px-5 py-3 font-medium">Source</th>
            <th className="text-left px-5 py-3 font-medium">Status</th>
            <th className="text-left px-5 py-3 font-medium">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {analyses.map((a) => (
            <tr
              key={a.id}
              onClick={() => onViewDetail(a.id)}
              className="hover:bg-gray-800/50 cursor-pointer transition-colors"
            >
              <td className="px-5 py-3 text-gray-200 max-w-xs truncate">{a.input_text.slice(0, 60)}</td>
              <td className="px-5 py-3">
                <SeverityBadge severity={a.severity} />
              </td>
              <td className="px-5 py-3 text-gray-400">{a.category || '-'}</td>
              <td className="px-5 py-3 text-gray-500">{a.source}</td>
              <td className="px-5 py-3">
                <StatusBadge status={a.status} />
              </td>
              <td className="px-5 py-3 text-gray-500 text-xs">{formatTime(a.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SeverityBadge({ severity }) {
  if (!severity) return <span className="text-gray-600">-</span>;
  const colors = {
    critical: 'bg-red-500/20 text-red-400',
    high: 'bg-orange-500/20 text-orange-400',
    medium: 'bg-yellow-500/20 text-yellow-400',
    low: 'bg-blue-500/20 text-blue-400',
    info: 'bg-gray-500/20 text-gray-400'
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${colors[severity] || colors.info}`}>
      {severity}
    </span>
  );
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

function formatTime(iso) {
  if (!iso) return '-';
  const d = new Date(iso);
  return d.toLocaleString();
}

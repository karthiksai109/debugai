import React, { useState, useEffect } from 'react';
import { fetchAnalysis } from '../api.js';

export default function AnalysisDetail({ id, onBack }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis(id)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-gray-400 py-12 text-center">Loading...</div>;
  if (!data) return <div className="text-red-400 py-12 text-center">Analysis not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
        &larr; Back
      </button>

      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SeverityBadge severity={data.severity} />
            <span className="text-sm text-gray-400">{data.category}</span>
          </div>
          <StatusBadge status={data.status} />
        </div>

        <div className="p-6 space-y-6">
          <Section title="Input">
            <pre className="text-sm text-gray-300 bg-gray-950 rounded-lg p-4 overflow-x-auto">{data.input_text}</pre>
          </Section>

          {data.root_cause && (
            <Section title="Root Cause">
              <p className="text-sm text-gray-200 leading-relaxed">{data.root_cause}</p>
            </Section>
          )}

          {data.suggestion && (
            <Section title="Suggestion">
              <p className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{data.suggestion}</p>
            </Section>
          )}

          {data.code_fix && (
            <Section title="Suggested Fix">
              <pre className="text-sm text-emerald-300 bg-gray-950 rounded-lg p-4 overflow-x-auto">{data.code_fix}</pre>
            </Section>
          )}

          <div className="flex items-center gap-6 text-xs text-gray-500 pt-2 border-t border-gray-800">
            {data.confidence != null && <span>Confidence: {Math.round(data.confidence * 100)}%</span>}
            <span>Source: {data.source}</span>
            <span>Created: {new Date(data.created_at).toLocaleString()}</span>
            {data.completed_at && <span>Completed: {new Date(data.completed_at).toLocaleString()}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</h3>
      {children}
    </div>
  );
}

function SeverityBadge({ severity }) {
  if (!severity) return null;
  const colors = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    info: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${colors[severity] || colors.info}`}>
      {severity.toUpperCase()}
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

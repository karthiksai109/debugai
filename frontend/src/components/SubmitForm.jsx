import React, { useState } from 'react';
import { submitAnalysis } from '../api.js';

const EXAMPLES = [
  `ERROR 2024-01-15 14:23:01 [pool-3-thread-7] com.app.service.PaymentService - Connection pool exhausted
javax.persistence.PersistenceException: org.hibernate.exception.JDBCConnectionException
  at com.app.service.PaymentService.processPayment(PaymentService.java:142)
  at com.app.controller.PaymentController.charge(PaymentController.java:67)
Caused by: com.zaxxer.hikari.pool.HikariPool$PoolInitializationException: Failed to initialize pool: Connection is not available, request timed out after 30000ms`,

  `WARN  [2024-01-15T10:05:33Z] Memory usage at 94% (7.52GB / 8GB)
WARN  [2024-01-15T10:05:34Z] GC pause: 1.2s (Full GC)
ERROR [2024-01-15T10:05:35Z] OutOfMemoryError: Java heap space
  at java.util.Arrays.copyOf(Arrays.java:3236)
  at com.app.cache.InMemoryCache.put(InMemoryCache.java:89)`,

  `[nginx] 2024/01/15 09:12:44 [error] 1234#0: *5678 upstream timed out (110: Connection timed out) while reading response header from upstream
client: 10.0.1.50, server: api.example.com, request: "POST /api/v2/search HTTP/1.1", upstream: "http://10.0.2.100:8080/api/v2/search"
Response times p99: 12.4s (threshold: 2s), p95: 8.1s, p50: 3.2s`
];

export default function SubmitForm({ onDone }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await submitAnalysis(input);
      onDone(result.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Paste your error log, stack trace, or describe a performance issue</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={12}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 font-mono focus:outline-none focus:border-emerald-500 resize-y"
            placeholder="Paste logs here..."
          />
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      <div>
        <h3 className="text-sm text-gray-500 mb-3">Try an example</h3>
        <div className="space-y-2">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="w-full text-left bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-xs text-gray-400 font-mono hover:border-gray-600 transition-colors truncate"
            >
              {ex.split('\n')[0].slice(0, 100)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

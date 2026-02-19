const BASE = (import.meta.env.VITE_API_URL || '') + '/api';

export async function fetchStats() {
  const res = await fetch(`${BASE}/analyses/stats`);
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}

export async function fetchAnalyses(limit = 50, offset = 0) {
  const res = await fetch(`${BASE}/analyses?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch analyses');
  return res.json();
}

export async function fetchAnalysis(id) {
  const res = await fetch(`${BASE}/analyses/${id}`);
  if (!res.ok) throw new Error('Failed to fetch analysis');
  return res.json();
}

export async function submitAnalysis(input_text) {
  const res = await fetch(`${BASE}/analyses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input_text })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error);
  }
  return res.json();
}

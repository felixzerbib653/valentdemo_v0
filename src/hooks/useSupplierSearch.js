import { useMemo } from 'react';
import { SUPPLIERS } from '../data/suppliers.js';

// useSupplierSearch — turns a free-text query into a ranked match list.
// Per docs/40-build-order.md §3C. Matches against supplier name, subtitle,
// and notes (which in the seeded roster contain FEI mentions and active
// ingredient names). Case-insensitive. Returns at most `limit` results.
//
// Scoring:
//   +100 — name prefix match
//   +60  — name substring match
//   +30  — subtitle substring match
//   +15  — notes substring match
//   +10  — id (supplier slug) substring match
// Suppliers below a minimum score are filtered out.

const MIN_SCORE = 10;

export function scoreSupplier(s, q) {
  if (!q) return 0;
  const qLower = q.toLowerCase();
  const name = (s.name || '').toLowerCase();
  const subtitle = (s.subtitle || '').toLowerCase();
  const notes = (s.notes || '').toLowerCase();
  const id = (s.id || '').toLowerCase();
  let score = 0;
  if (name.startsWith(qLower)) score += 100;
  else if (name.includes(qLower)) score += 60;
  if (subtitle.includes(qLower)) score += 30;
  if (notes.includes(qLower)) score += 15;
  if (id.includes(qLower)) score += 10;
  return score;
}

function extractMatch(s, q) {
  if (!q) return null;
  const qLower = q.toLowerCase();
  const notes = s.notes || '';
  const idx = notes.toLowerCase().indexOf(qLower);
  if (idx === -1) return null;
  const start = Math.max(0, idx - 20);
  const end = Math.min(notes.length, idx + q.length + 40);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < notes.length ? '…' : '';
  return prefix + notes.slice(start, end) + suffix;
}

export default function useSupplierSearch(query, options = {}) {
  const { limit = 6, suppliers = SUPPLIERS } = options;
  return useMemo(() => {
    const q = (query || '').trim();
    if (!q) return { results: [], total: 0, capped: false };
    const ranked = suppliers
      .map((s) => {
        const score = scoreSupplier(s, q);
        if (score < MIN_SCORE) return null;
        return {
          supplier: s,
          score,
          snippet: extractMatch(s, q),
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return (a.supplier.name || '').localeCompare(b.supplier.name || '');
      });
    const results = ranked.slice(0, limit);
    return {
      results,
      total: ranked.length,
      capped: ranked.length > results.length,
    };
  }, [query, limit, suppliers]);
}

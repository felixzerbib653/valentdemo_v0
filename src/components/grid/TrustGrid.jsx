import React, { useMemo, useState } from 'react';
import { Search, Filter as FilterIcon, ChevronDown, Clock } from 'lucide-react';
import { SUPPLIERS } from '../../data/suppliers.js';
import { DOCUMENTS } from '../../data/documents.js';
import { STATUS_ORDER } from '../../data/trustPillars.js';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import PortfolioSummaryBand from './PortfolioSummaryBand.jsx';
import SupplierRow from './SupplierRow.jsx';
import TodaysWorkCard from './TodaysWorkCard.jsx';

// MoCRA deadline ribbon — per docs/82-feature-mocra-deadline-surface.md
// (collapsed scope). Computed from existing document.validityEndsAt fields
// on §606 / §607 / §609 docs. §604 is the brand's Responsible-Person
// obligation under MoCRA, not the CMO's — intentionally excluded.
const MOCRA_DEADLINE_PILLARS = {
  fei: { anchor: '\u00a7606', label: 'FEI registration' },
  cosmeticListing: { anchor: '\u00a7607', label: 'product listing' },
  safety: { anchor: '\u00a7609', label: 'safety substantiation' },
};

function computeNextMocraDeadline(nowMs) {
  let winner = null;
  for (const doc of DOCUMENTS) {
    const meta = MOCRA_DEADLINE_PILLARS[doc.pillarKey];
    if (!meta || !doc.validityEndsAt) continue;
    const endsMs = new Date(doc.validityEndsAt).getTime();
    if (!Number.isFinite(endsMs) || endsMs <= nowMs) continue;
    if (!winner || endsMs < winner.endsMs) {
      winner = { doc, meta, endsMs };
    }
  }
  if (!winner) return null;
  const supplier = SUPPLIERS.find((s) => s.id === winner.doc.supplierId);
  const daysUntil = Math.max(
    0,
    Math.round((winner.endsMs - nowMs) / (1000 * 60 * 60 * 24))
  );
  return {
    anchor: winner.meta.anchor,
    label: winner.meta.label,
    supplierName: supplier ? supplier.name : winner.doc.supplierId,
    dateStr: winner.doc.validityEndsAt.slice(0, 10),
    daysUntil,
  };
}

// TrustGrid — the landing screen for Sarah's morning triage.
// Per docs/01-screen-trust-grid.md.
//
// Three regions stacked: header strip (title + search + filter), portfolio
// summary band, sorted supplier rows.
//
// Default sort: STATUS_ORDER (blocked → watch → onboarding → ready) then
// trust score ascending within each bucket (worst floats to the top).

const FILTERS = [
  { key: 'all', label: 'All suppliers' },
  { key: 'blocked', label: 'Blocked' },
  { key: 'watch', label: 'Watch' },
  { key: 'ready', label: 'Ready' },
  { key: 'onboarding', label: 'Onboarding' },
];

function applyFilter(list, filter, query) {
  let out = list;
  if (filter !== 'all') {
    out = out.filter((s) => s.status === filter);
  }
  if (query) {
    const q = query.trim().toLowerCase();
    if (q) {
      out = out.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.subtitle || '').toLowerCase().includes(q)
      );
    }
  }
  return out;
}

function sortSuppliers(list) {
  return [...list].sort((a, b) => {
    const orderA = STATUS_ORDER[a.status] ?? 99;
    const orderB = STATUS_ORDER[b.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.trustScore ?? 0) - (b.trustScore ?? 0);
  });
}

export default function TrustGrid() {
  const { lastScanAt, now } = useTrust();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const countsByStatus = useMemo(() => {
    const c = { all: SUPPLIERS.length, blocked: 0, watch: 0, ready: 0, onboarding: 0 };
    for (const s of SUPPLIERS) c[s.status] = (c[s.status] || 0) + 1;
    return c;
  }, []);

  const visible = useMemo(
    () => sortSuppliers(applyFilter(SUPPLIERS, filter, query)),
    [filter, query]
  );

  const nextDeadline = useMemo(
    () => computeNextMocraDeadline(now ? new Date(now).getTime() : Date.now()),
    [now]
  );

  return (
    <section className="mx-auto w-full max-w-[1280px] py-8 pl-12 pr-16">
      {/* 0. MoCRA deadline banner — amber warn tone, pinned above the header. */}
      {nextDeadline ? (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-warn-100 bg-warn-50 px-4 py-2.5 text-sm text-warn-700">
          <Clock size={14} strokeWidth={2.25} className="shrink-0" />
          <span>
            <span className="font-semibold">Next MoCRA deadline:</span>{' '}
            {nextDeadline.anchor} {nextDeadline.label}
            <span className="mx-1.5 text-warn-700/60">·</span>
            {nextDeadline.supplierName}
            <span className="mx-1.5 text-warn-700/60">·</span>
            <span className="font-mono tabular-nums">{nextDeadline.dateStr}</span>
            <span className="ml-1.5 text-warn-700/70">
              ({nextDeadline.daysUntil} day{nextDeadline.daysUntil === 1 ? '' : 's'})
            </span>
          </span>
        </div>
      ) : null}

      {/* 1. Header strip — title + subtitle only. Search/filter moved to a
           toolbar directly above the supplier grid (below Today's work) so
           the operator's eye lands on hero content first and the controls
           sit adjacent to the list they act on. */}
      <header className="mb-6">
        <h2 className="text-xl font-semibold text-ink-900">
          Valent <span className="text-accent">TrustGrid</span>
        </h2>
        <p className="mt-1 text-sm text-ink-500">
          Continuously monitored across 7 compliance pillars
          <span className="mx-1.5 text-ink-400">·</span>
          {SUPPLIERS.length} suppliers
          <span className="mx-1.5 text-ink-400">·</span>
          last scan {formatRelative(lastScanAt, now)}
        </p>
      </header>

      {/* 2. Portfolio summary band */}
      <PortfolioSummaryBand />

      {/* 3. Today's work — agentic hero surface. Surface #7 per docs/70-agentic-surfaces.md. */}
      <div className="mt-4">
        <TodaysWorkCard />
      </div>

      {/* 4. Supplier-list toolbar — section label + search + filter. */}
      <div className="mt-6 mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ink-500">
          Supplier list
        </h3>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-ink-500 focus-within:border-accent focus-within:shadow-focus">
            <Search size={14} strokeWidth={2} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search suppliers…"
              className="w-48 bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </label>
          <FilterDropdown
            value={filter}
            onChange={setFilter}
            counts={countsByStatus}
          />
        </div>
      </div>

      {/* 5. Supplier grid */}
      <div className="overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-paper-200 bg-paper-50 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          <span>{visible.length} of {SUPPLIERS.length} suppliers</span>
          <span>Sorted: status · trust score ascending</span>
        </div>

        {visible.length === 0 ? (
          <EmptyState onClear={() => { setFilter('all'); setQuery(''); }} />
        ) : (
          <div role="list">
            {visible.map((supplier) => (
              <SupplierRow key={supplier.id} supplier={supplier} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FilterDropdown({ value, onChange, counts }) {
  const [open, setOpen] = useState(false);
  const activeOption = FILTERS.find((f) => f.key === value) || FILTERS[0];
  const activeCount = counts[value] ?? 0;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-2 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
      >
        <FilterIcon size={14} strokeWidth={2} className="text-ink-500" />
        <span>{activeOption.label}</span>
        <span className="font-mono text-xs tabular-nums text-ink-500">
          · {activeCount}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-label="Close filter"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div className="absolute right-0 top-[calc(100%+4px)] z-20 w-56 overflow-hidden rounded-lg border border-paper-300 bg-paper-0 shadow-md">
            {FILTERS.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-4 px-3 py-2 text-left text-sm transition-colors hover:bg-paper-50 ${
                  opt.key === value ? 'text-ink-900' : 'text-ink-700'
                }`}
              >
                <span className={opt.key === value ? 'font-semibold' : 'font-medium'}>
                  {opt.label}
                </span>
                <span className="font-mono text-xs tabular-nums text-ink-500">
                  {counts[opt.key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState({ onClear }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <p className="text-sm text-ink-700">No suppliers match this filter.</p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
      >
        Clear filter
      </button>
    </div>
  );
}

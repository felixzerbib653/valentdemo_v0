import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { getPortfolioSummary } from '../../data/suppliers.js';
import { getEvidenceFreshness } from '../../data/documents.js';
import { useTrust } from '../../context/TrustContext.jsx';

// PortfolioSummaryBand — single horizontal band above the Trust Grid.
// Per docs/01-screen-trust-grid.md §2 Portfolio summary band.
//
// Two slots, separated by a vertical divider:
//   1. Portfolio trust score — 36px mono number + label + delta chip
//   2. Evidence freshness — N on file / oldest / expiring soon + ingest link
//
// (The middle status-distribution slot was removed; that information is
// already carried by the StatusPill on each supplier row and by the red
// left-bar on blocked rows. One visual unit, ~120px tall.)

export default function PortfolioSummaryBand({ suppliers }) {
  const { navigate, lastScanAt } = useTrust();
  const summary = getPortfolioSummary(suppliers);
  const freshness = getEvidenceFreshness(lastScanAt);
  const { portfolioScore, portfolioDeltaWeek } = summary;

  return (
    <section className="grid grid-cols-[minmax(320px,1fr)_minmax(420px,1.3fr)] items-stretch rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
      {/* Slot 1 — portfolio trust score */}
      <div className="flex flex-col justify-center px-6 py-5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-4xl font-semibold tabular-nums text-ink-900">
            {portfolioScore}
          </span>
          <DeltaChip delta={portfolioDeltaWeek} />
        </div>
        <p className="mt-1 whitespace-nowrap text-xs text-ink-500">
          Portfolio trust score
        </p>
      </div>

      {/* Slot 2 — evidence freshness */}
      <div className="relative flex flex-col justify-center px-6 py-5">
        <span className="pointer-events-none absolute left-0 top-4 bottom-4 w-px bg-paper-200" />
        <div className="whitespace-nowrap text-sm text-ink-700">
          <span className="font-mono font-semibold tabular-nums text-ink-900">
            {freshness.onFile}
          </span>{' '}
          documents on file
        </div>
        <div className="mt-1 whitespace-nowrap text-xs text-ink-500">
          oldest{' '}
          <span className="font-mono tabular-nums text-ink-700">
            {freshness.oldestAgeDays}
          </span>{' '}
          days
          <span className="mx-1.5 text-ink-400">·</span>
          <span className="font-mono tabular-nums text-ink-700">
            {freshness.expiringSoon}
          </span>{' '}
          expiring this week
        </div>
        <button
          type="button"
          onClick={() => navigate('ingest')}
          className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-medium text-ink-700 hover:text-ink-900 focus:outline-none focus-visible:shadow-focus"
        >
          Open ingest inbox
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}

function DeltaChip({ delta }) {
  if (delta == null || Number.isNaN(delta)) return null;
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-50 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
        <Minus size={12} strokeWidth={2.25} />
        <span>flat this week</span>
      </span>
    );
  }
  const up = delta > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  const tone = up
    ? 'border-ok-100 bg-ok-50 text-ok-700'
    : 'border-block-100 bg-block-50 text-block-700';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${tone}`}
    >
      <Icon size={12} strokeWidth={2.25} />
      <span>
        {up ? '+' : ''}
        {delta} this week
      </span>
    </span>
  );
}

import React from 'react';
import {
  CheckCircle,
  Clock,
  XCircle,
  CircleDashed,
  ChevronRight,
} from 'lucide-react';
import { PILLAR_LIST } from '../../data/trustPillars.js';
import { useTrust } from '../../context/TrustContext.jsx';

// PillarList — left-column pillar navigation on Supplier Detail.
// Per docs/02-screen-supplier-detail.md §Left column.
//
// Sort: fail → pending → pass → missing (the operator's attention order).
// Clicking a row sets activePillarKey in context; the center column reacts.

const STATUS_TONE = {
  fail: {
    word: 'Blocked',
    Icon: XCircle,
    iconClass: 'text-block',
    rowTint: '',
    chipTint: 'text-block-700',
  },
  pending: {
    word: 'Watch',
    Icon: Clock,
    iconClass: 'text-warn',
    rowTint: '',
    chipTint: 'text-warn-700',
  },
  pass: {
    word: 'Pass',
    Icon: CheckCircle,
    iconClass: 'text-ok',
    rowTint: '',
    chipTint: 'text-ok-700',
  },
  missing: {
    word: 'Missing',
    Icon: CircleDashed,
    iconClass: 'text-block',
    rowTint: '',
    chipTint: 'text-block-700',
  },
};

// Operator-attention order per docs/02-screen-supplier-detail.md §Left column:
// fail first (must-fix), then pending (in-flight), then pass (reference), then
// missing (often onboarding tail — low-attention).
const STATUS_ORDER = { fail: 0, pending: 1, pass: 2, missing: 3 };

export default function PillarList({ supplier }) {
  const { activePillarKey, navigate } = useTrust();

  const ordered = [...PILLAR_LIST].sort((a, b) => {
    const sa = supplier.pillars[a.key] || 'missing';
    const sb = supplier.pillars[b.key] || 'missing';
    const da = STATUS_ORDER[sa] ?? 99;
    const db = STATUS_ORDER[sb] ?? 99;
    if (da !== db) return da - db;
    return b.weight - a.weight;
  });

  const setPillar = (key) => {
    navigate('supplier-detail', {
      supplierId: supplier.id,
      pillarKey: activePillarKey === key ? null : key,
    });
  };

  const openInReview = (key, evt) => {
    // Deep-link into Review Queue scoped to this supplier + pre-filtered to
    // the pillar. Per docs/02-screen-supplier-detail.md §Interaction — the
    // short-circuit route from pillar to flag.
    evt.stopPropagation();
    navigate('review', { supplierId: supplier.id, pillarKey: key });
  };

  return (
    <aside className="flex flex-col">
      <div className="rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          <span>Trust pillars</span>
          <span>{ordered.length}</span>
        </div>
        <div role="list">
          {ordered.map((p) => {
            const status = supplier.pillars[p.key] || 'missing';
            const tone = STATUS_TONE[status] || STATUS_TONE.missing;
            const active = activePillarKey === p.key;
            const Icon = tone.Icon;
            const canOpenInReview = status === 'fail' || status === 'pending';
            return (
              <div
                key={p.key}
                className={`group relative border-b border-paper-200 transition-colors last:border-b-0 ${
                  active ? 'bg-paper-100' : 'hover:bg-paper-50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setPillar(p.key)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left focus:outline-none focus-visible:shadow-focus"
                >
                  {active && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-md bg-ok" />
                  )}
                  <Icon
                    size={16}
                    strokeWidth={2.25}
                    className={tone.iconClass}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink-900">
                      {p.label}
                    </div>
                    <div className="mt-0.5 text-[11px] text-ink-500">
                      {p.anchor ? (
                        <>
                          <span>{p.anchor}</span>
                          <span className="mx-1 text-ink-400">·</span>
                        </>
                      ) : null}
                      <span className={`font-semibold uppercase tracking-[0.08em] ${tone.chipTint}`}>
                        {p.key === 'fei' && status === 'fail' ? 'Expired' : tone.word}
                      </span>
                    </div>
                  </div>
                  <ChevronRight
                    size={14}
                    strokeWidth={2}
                    className={`text-ink-400 transition-opacity ${
                      active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
                {canOpenInReview && (
                  <div className="flex justify-end px-4 pb-2">
                    <button
                      type="button"
                      onClick={(e) => openInReview(p.key, e)}
                      title={`Open ${p.label} flag in Review Queue`}
                      className="inline-flex items-center text-[11px] font-medium text-ink-500 transition-colors hover:text-ink-700 focus:outline-none focus-visible:shadow-focus"
                    >
                      Open in Review Queue
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {activePillarKey ? (
        <button
          type="button"
          onClick={() => setPillar(activePillarKey)}
          className="mt-3 inline-flex w-fit items-center gap-1 self-start text-xs font-medium text-ink-500 transition-colors hover:text-ink-700 focus:outline-none focus-visible:shadow-focus"
        >
          Clear pillar filter
        </button>
      ) : null}
    </aside>
  );
}

// Re-export for consumers that need the same status-word mapping.
export { STATUS_TONE };

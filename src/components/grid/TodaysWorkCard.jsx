import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertOctagon,
  Clock,
  Info,
  ChevronRight,
  Mail,
  FileText,
  ArrowUpRight,
  CircleDashed,
  CheckCircle,
} from 'lucide-react';
import { TODAYS_WORK } from '../../data/todaysWork.js';
import { SUPPLIERS_BY_ID } from '../../data/suppliers.js';
import { useTrust } from '../../context/TrustContext.jsx';
import ChaseSendStatus from '../shared/ChaseSendStatus.jsx';
import ProvenanceChip from '../shared/ProvenanceChip.jsx';

// TodaysWorkCard — Trust Grid hero.
// Per docs/70-agentic-surfaces.md §Surface #7.
//
// This is the one surface where the agent ranks — not extracts, not computes,
// not drafts. It sits above the PortfolioSummaryBand so it's the first thing
// Sarah reads at 9am.
//
// Click behavior:
//   - row body → openSupplier(supplierId). Sarah lands on the supplier she
//     needs to work on.
//   - CTA button → action-keyed router.
//       - draft-email + flagId  → openChaseDraft(flagId). Surface #4 entry.
//       - request-renewal + flagId → openChaseDraft(flagId). Same reviewed-send path.
//       - reconcile             → navigate('review', { supplierId }).
//       - open-supplier         → openSupplier(supplierId).
//     This mirrors FlagRow.handleRemediationCta so the same action label
//     resolves to the same UI no matter which screen it launches from.
//
// Ranking is baked into the hand-written list — not re-computed at runtime.
// That's the honest shape for a demo; the production app would rank live
// against the flag set + deadlines + supplier business value.

const SEVERITY_META = {
  blocker: {
    Icon: AlertOctagon,
    ring: 'border-block-100 bg-block-50',
    text: 'text-block-700',
    label: 'Blocker',
  },
  watch: {
    Icon: Clock,
    ring: 'border-warn-100 bg-warn-50',
    text: 'text-warn-700',
    label: 'Watch',
  },
  informational: {
    Icon: Info,
    ring: 'border-paper-300 bg-paper-100',
    text: 'text-ink-700',
    label: 'Info',
  },
};

const ACTION_LABELS = {
  'draft-email': {
    toneClass:
      'bg-ink-900 text-paper-0 hover:bg-ink-700 focus-visible:shadow-focus',
    Icon: Mail,
    toastTitle: 'Chase email drafted',
    toastBody: (supplier) => `Draft prepared for ${supplier.name}.`,
  },
  'request-renewal': {
    toneClass:
      'bg-ink-900 text-paper-0 hover:bg-ink-700 focus-visible:shadow-focus',
    Icon: FileText,
    toastTitle: 'Renewal request queued',
    toastBody: (supplier) =>
      `Request prepared for ${supplier.name}.`,
  },
  'open-supplier': {
    toneClass:
      'border border-paper-300 bg-paper-0 text-ink-700 hover:bg-paper-50 focus-visible:shadow-focus',
    Icon: ArrowUpRight,
    toastTitle: null, // no toast — just navigates
    toastBody: null,
  },
  reconcile: {
    toneClass:
      'border border-paper-300 bg-paper-0 text-ink-700 hover:bg-paper-50 focus-visible:shadow-focus',
    Icon: CircleDashed,
    toastTitle: 'Review queue opened',
    toastBody: (supplier) =>
      `Scoped to ${supplier.name} for reconciliation.`,
  },
};

export default function TodaysWorkCard() {
  const {
    openSupplier,
    navigate,
    emitToast,
    openChaseDraft,
    todaysWorkCompletions,
    completeTodaysWorkItem,
    chaseSendEvents,
    now,
  } = useTrust();
  const items = TODAYS_WORK; // already authored in rank order
  const completedIds = useMemo(
    () => new Set(todaysWorkCompletions?.keys?.() || []),
    [todaysWorkCompletions]
  );
  const [dismissedIds, setDismissedIds] = useState(() => new Set(completedIds));

  useEffect(() => {
    const timers = [];
    completedIds.forEach((id) => {
      if (dismissedIds.has(id)) return;
      timers.push(
        window.setTimeout(() => {
          setDismissedIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
          });
        }, 900)
      );
    });
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [completedIds, dismissedIds]);

  const activeItems = items.filter((item) => !completedIds.has(item.id));
  const visibleItems = items.filter((item) => !dismissedIds.has(item.id));

  const counts = activeItems.reduce(
    (acc, it) => {
      acc[it.severity] = (acc[it.severity] || 0) + 1;
      return acc;
    },
    { blocker: 0, watch: 0, informational: 0 }
  );

  function handleRowOpen(item) {
    if (completedIds.has(item.id)) return;
    if (item.supplierId) openSupplier(item.supplierId);
  }

  function handleCta(item, evt) {
    evt.stopPropagation();
    if (completedIds.has(item.id)) return;
    const actionKey = item.cta?.action || 'open-supplier';
    const supplier = SUPPLIERS_BY_ID[item.supplierId];
    if (!supplier) return;

    if (actionKey === 'open-supplier') {
      openSupplier(item.supplierId);
      return;
    }
    if (actionKey === 'reconcile') {
      navigate('review', { supplierId: item.supplierId });
      const meta = ACTION_LABELS[actionKey];
      emitToast({
        tone: 'info',
        title: meta.toastTitle,
        body: meta.toastBody(supplier),
        supplierId: item.supplierId,
      });
      return;
    }
    if (
      (actionKey === 'draft-email' || actionKey === 'request-renewal') &&
      item.flagId
    ) {
      // Surface #4 entry point — route through ChaseDraftModal, do not toast.
      openChaseDraft(item.flagId);
      return;
    }

    const meta = ACTION_LABELS[actionKey];
    if (meta?.toastTitle) {
      emitToast({
        tone: 'ok',
        title: meta.toastTitle,
        body: meta.toastBody(supplier),
        supplierId: item.supplierId,
      });
    }
    if (actionKey === 'request-renewal') {
      completeTodaysWorkItem(item.id, 'request-renewal');
    }
  }

  return (
    <section
      className="mb-4 overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm"
      aria-label="Today's work"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-200 bg-paper-50 px-6 py-3">
        <div className="flex items-baseline gap-3">
          <h3 className="text-sm font-semibold text-ink-900">Today's work</h3>
          <span className="text-xs text-ink-500">
            <span className="font-mono tabular-nums text-ink-700">
              {activeItems.length}
            </span>{' '}
            actions left
            {counts.blocker > 0 && (
              <>
                <span className="mx-1.5 text-ink-400">·</span>
                <span className="font-mono tabular-nums text-block-700">
                  {counts.blocker}
                </span>{' '}
                blocker{counts.blocker === 1 ? '' : 's'}
              </>
            )}
            {counts.watch > 0 && (
              <>
                <span className="mx-1.5 text-ink-400">·</span>
                <span className="font-mono tabular-nums text-warn-700">
                  {counts.watch}
                </span>{' '}
                watch
              </>
            )}
            {counts.informational > 0 && (
              <>
                <span className="mx-1.5 text-ink-400">·</span>
                <span className="font-mono tabular-nums text-ink-700">
                  {counts.informational}
                </span>{' '}
                info
              </>
            )}
          </span>
        </div>
        <ProvenanceChip
          variant="ranked"
          timestamp={items[0]?.rankedAt}
          nowMs={now}
          title="Ranked by Valent from deadlines, blockers, and supplier impact"
        />
      </header>

      <ul role="list" className="divide-y divide-paper-200">
        {visibleItems.map((item) => (
          <WorkRow
            key={item.id}
            item={item}
            completed={completedIds.has(item.id)}
            chaseSendEvent={
              item.flagId ? chaseSendEvents?.get(item.flagId) || null : null
            }
            onOpen={() => handleRowOpen(item)}
            onCta={(evt) => handleCta(item, evt)}
          />
        ))}
      </ul>
    </section>
  );
}

function WorkRow({ item, completed, chaseSendEvent, onOpen, onCta }) {
  const sevMeta = SEVERITY_META[item.severity] || SEVERITY_META.informational;
  const supplier = SUPPLIERS_BY_ID[item.supplierId];
  const actionKey = item.cta?.action || 'open-supplier';
  const actionMeta = ACTION_LABELS[actionKey] || ACTION_LABELS['open-supplier'];
  const CtaIcon = actionMeta.Icon;

  return (
    <li
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      aria-disabled={completed ? 'true' : undefined}
      className={`group relative flex cursor-pointer items-center gap-4 px-6 py-3 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:bg-paper-50 focus-visible:shadow-focus ${
        completed
          ? 'todays-work-row-complete pointer-events-none border-ok-100 bg-ok-50 text-ok-700 hover:bg-ok-50'
          : ''
      }`}
    >
      {/* Rank badge */}
      <span
        aria-hidden="true"
        className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-[11px] font-semibold tabular-nums ${
          completed ? 'todays-work-check-pop bg-ok text-paper-0' : 'bg-paper-100 text-ink-700'
        }`}
      >
        {completed ? <CheckCircle size={14} strokeWidth={2.5} /> : item.rank}
      </span>

      {/* Severity pill */}
      <span
        className={`inline-flex shrink-0 items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] ${sevMeta.ring} ${sevMeta.text}`}
      >
        <sevMeta.Icon size={11} strokeWidth={2.25} />
        <span>{sevMeta.label}</span>
      </span>

      {/* Title + reason */}
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <p
            className={`truncate text-sm font-medium ${
              completed ? 'text-ok-700' : 'text-ink-900'
            }`}
          >
            {item.title}
          </p>
          {supplier && (
            <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-500">
              · {supplier.name}
            </span>
          )}
        </div>
        <p className={`mt-0.5 truncate text-xs ${completed ? 'text-ok-700/75' : 'text-ink-500'}`}>
          {completed ? "Completed - updating today's work" : item.reason}
        </p>
      </div>

      {/* Due hint */}
      {item.dueHint && (
        <span
          className={`shrink-0 rounded-md border px-2 py-0.5 font-mono text-[11px] tabular-nums ${
            item.severity === 'blocker'
              ? 'border-block-100 bg-block-50 text-block-700'
              : 'border-paper-300 bg-paper-50 text-ink-700'
          }`}
        >
          {item.dueHint}
        </span>
      )}

      <ChaseSendStatus event={chaseSendEvent} />

      {/* CTA */}
      {!chaseSendEvent ? (
        <button
          type="button"
          onClick={onCta}
          disabled={completed}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none ${actionMeta.toneClass}`}
        >
          {CtaIcon && <CtaIcon size={12} strokeWidth={2.25} />}
          <span>{completed ? 'Completed' : item.cta?.label || 'Open'}</span>
        </button>
      ) : null}

      {/* Row chevron — hint that the row body is clickable. */}
      <ChevronRight
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className="shrink-0 text-ink-400 transition-colors group-hover:text-ink-700"
      />
    </li>
  );
}

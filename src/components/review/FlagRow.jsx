import React, { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  Info,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  UserCircle2,
  RotateCcw,
  Mail,
  FileText,
  CircleDashed,
  Sparkles,
} from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import { getSupplier } from '../../data/suppliers.js';
import { PILLARS } from '../../data/trustPillars.js';
import ResolvePopover from './ResolvePopover.jsx';
import ChaseSendStatus from '../shared/ChaseSendStatus.jsx';

// FlagRow — a single flag in the Review Queue. Handles both open and resolved
// states. Resolve opens a popover that captures a note; blockers require the
// note (audit trail teeth), watch/informational accept an optional note.
// Reopen is a single-click revert on resolved rows.
//
// Per docs/05-screen-review-queue.md §Queue list + the resolve-with-note
// pattern added to prevent trivial click-through.
//
// Surface #3 retrofit (docs/70-agentic-surfaces.md):
// Every auto-generated flag renders a "Suggested:" remediation band below
// its metadata line. The suggestion is followed by a CTA button whose action
// key drives the primary response (draft-email / request-renewal
// / reconcile). Action 'none' (pending flags) renders the text but no CTA.
//
// Task #52 update: the per-row drafted ProvenanceChip is removed. Attribution
// to Valent moves onto the Draft-email CTA itself — that button gets a 1px
// brand-cyan border and a Sparkles glyph, making the agent authorship part of
// the action. Renewal and Reconcile keep their neutral chrome because the
// operator executes those directly; no artifact is agent-authored.

const REMEDIATION_ACTION = {
  'draft-email': {
    Icon: Mail,
    toastTitle: 'Chase email drafted',
    toastBody: (supplier) => `Draft prepared for ${supplier.name}.`,
    toastTone: 'ok',
  },
  'request-renewal': {
    Icon: FileText,
    toastTitle: 'Renewal request queued',
    toastBody: (supplier) =>
      `Request prepared for ${supplier.name}.`,
    toastTone: 'ok',
  },
  reconcile: {
    Icon: CircleDashed,
    toastTitle: 'Reconcile flagged',
    toastBody: () =>
      'Visit Ingest Inbox to match the source document.',
    toastTone: 'info',
  },
};

const SEVERITY_VISUAL = {
  blocker: {
    Icon: AlertOctagon,
    iconBg: 'bg-block-50',
    iconText: 'text-block-700',
    label: 'Blocker',
    leftBar: 'before:bg-block',
  },
  watch: {
    Icon: Clock,
    iconBg: 'bg-warn-50',
    iconText: 'text-warn-700',
    label: 'Watch',
    leftBar: 'before:bg-warn',
  },
  informational: {
    Icon: Info,
    iconBg: 'bg-paper-100',
    iconText: 'text-ink-700',
    label: 'Info',
    leftBar: '',
  },
};

const ROUTE_OPTIONS = [
  { key: 'procurement', label: 'Route to Procurement' },
  { key: 'quality', label: 'Route to Quality' },
  { key: 'legal', label: 'Route to Legal' },
];

export default function FlagRow({ flag, onRoute }) {
  const {
    navigate,
    emitToast,
    now,
    resolutions,
    resolveFlag,
    reopenFlag,
    openChaseDraft,
    chaseSendEvents,
  } = useTrust();
  const [routeOpen, setRouteOpen] = useState(false);
  const [resolveOpen, setResolveOpen] = useState(false);
  const visual = SEVERITY_VISUAL[flag.severity] || SEVERITY_VISUAL.informational;
  const Icon = visual.Icon;
  const supplier = flag.supplierId ? getSupplier(flag.supplierId) : null;
  const pillar = flag.pillarKey ? PILLARS[flag.pillarKey] : null;
  const resolution = resolutions?.get(flag.id) || null;
  const isResolved = Boolean(resolution);
  const chaseSendEvent = chaseSendEvents?.get(flag.id) || null;

  const handleOpenSupplier = (e) => {
    e?.stopPropagation();
    if (!supplier) return;
    navigate('supplier-detail', {
      supplierId: supplier.id,
      pillarKey: flag.pillarKey || null,
    });
  };

  const handleResolveSubmit = (note) => {
    resolveFlag(flag.id, note);
    setResolveOpen(false);
    emitToast({
      tone: 'ok',
      title: 'Flag resolved',
      body: `${flag.title} · ${supplier ? supplier.name : 'unlinked document'}`,
      supplierId: flag.supplierId,
    });
  };

  const handleReopen = (e) => {
    e.stopPropagation();
    reopenFlag(flag.id);
    emitToast({
      tone: 'info',
      title: 'Flag reopened',
      body: `${flag.title} · ${supplier ? supplier.name : 'unlinked document'}`,
      supplierId: flag.supplierId,
    });
  };

  const handleRoute = (option) => {
    if (onRoute) onRoute(flag, option.key);
    setRouteOpen(false);
    emitToast({
      tone: 'info',
      title: option.label.replace('Route to ', 'Routed to '),
      body: `${flag.title} · ${supplier ? supplier.name : 'unlinked document'}`,
      supplierId: flag.supplierId,
    });
  };

  const remediation = flag.suggestedRemediation || null;
  const remediationActionKey = remediation?.action || null;
  const remediationMeta = remediationActionKey
    ? REMEDIATION_ACTION[remediationActionKey] || null
    : null;
  const ctaLabel =
    remediationActionKey === 'draft-email'
      ? 'Draft email'
      : remediationActionKey === 'request-renewal'
        ? 'Request renewal'
        : remediationActionKey === 'reconcile'
          ? 'Reconcile'
          : null;

  const handleRemediationCta = (e) => {
    e.stopPropagation();
    if (!remediationMeta) return;
    // Surface #4 — "Draft email" opens the chase-draft modal. The other two
    // actions keep their toast-only response because they don't have a full
    // authored artifact to review.
    if (
      (remediationActionKey === 'draft-email' ||
        remediationActionKey === 'request-renewal') &&
      flag.supplierId
    ) {
      openChaseDraft(flag.id);
      return;
    }
    emitToast({
      tone: remediationMeta.toastTone,
      title: remediationMeta.toastTitle,
      body: remediationMeta.toastBody(supplier || { name: 'this supplier' }),
      supplierId: flag.supplierId,
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpenSupplier}
      onKeyDown={(e) => {
        // Only act on keys that landed directly on the row. Otherwise Enter
        // and Space bubble from nested inputs (e.g. the Resolve popover
        // textarea) and trigger navigation mid-keystroke.
        if (e.target !== e.currentTarget) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleOpenSupplier(e);
        }
      }}
      className={`group relative flex w-full items-center gap-3 border-b border-paper-200 px-6 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus ${isResolved ? 'bg-paper-50/60' : ''} ${visual.leftBar && !isResolved ? `before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-[''] ${visual.leftBar}` : ''}`}
    >
      <span
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${isResolved ? 'bg-ok-50 text-ok-700' : `${visual.iconBg} ${visual.iconText}`}`}
      >
        {isResolved ? (
          <CheckCircle size={14} strokeWidth={2.25} />
        ) : (
          <Icon size={14} strokeWidth={2.25} />
        )}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span
            className={`truncate text-sm font-medium ${
              isResolved ? 'text-ink-500 line-through' : 'text-ink-900'
            }`}
          >
            {flag.title}
          </span>
          {supplier ? (
            <button
              type="button"
              onClick={handleOpenSupplier}
              className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-1.5 py-0.5 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
            >
              {supplier.name}
              <span className="font-mono tabular-nums text-ink-500">
                · {supplier.trustScore}
              </span>
            </button>
          ) : (
            <span className="inline-flex items-center rounded-md border border-block-100 bg-block-50 px-1.5 py-0.5 text-[11px] font-medium text-block-700">
              No supplier linked
            </span>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-500">
          {pillar ? <span>{pillar.label}</span> : <span>Ingest</span>}
          <span className="text-ink-400">·</span>
          {isResolved ? (
            <>
              <span className="inline-flex items-center gap-1 text-ok-700">
                <CheckCircle size={10} strokeWidth={2.25} />
                resolved{' '}
                <span className="font-mono tabular-nums">
                  {formatRelative(resolution.resolvedAt, now)}
                </span>
              </span>
              <span className="text-ink-400">·</span>
              <span>{resolution.resolvedBy}</span>
              {resolution.note ? (
                <>
                  <span className="text-ink-400">·</span>
                  <span
                    className="truncate italic text-ink-500"
                    title={resolution.note}
                  >
                    "{resolution.note}"
                  </span>
                </>
              ) : null}
            </>
          ) : (
            <>
              <span>
                opened{' '}
                <span className="font-mono tabular-nums">
                  {formatRelative(flag.openedAt, now)}
                </span>
              </span>
              <span className="text-ink-400">·</span>
              <span className="inline-flex items-center gap-1">
                <UserCircle2 size={11} strokeWidth={2} />
                {flag.assignee ? flag.assignee.name : 'Unassigned'}
              </span>
            </>
          )}
        </div>

        {/* Suggested remediation band — surface #3. */}
        {!isResolved && remediation && flag.createdBy === 'valent' && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-ink-700">
              <span className="font-medium text-ink-500">Suggested: </span>
              {remediation.text}
            </span>
            {remediationMeta && ctaLabel && !chaseSendEvent && (
              remediationActionKey === 'draft-email' ? (
                <button
                  type="button"
                  onClick={handleRemediationCta}
                  title="Drafted by Valent · click to review"
                  className="inline-flex items-center gap-1 rounded-md border border-accent bg-paper-0 px-2 py-0.5 text-[11px] font-semibold text-ink-900 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
                >
                  <Sparkles size={11} strokeWidth={2.25} className="text-accent" />
                  {ctaLabel}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRemediationCta}
                  className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
                >
                  <remediationMeta.Icon size={11} strokeWidth={2.25} />
                  {ctaLabel}
                </button>
              )
            )}
          </div>
        )}
      </div>

      <ChaseSendStatus event={chaseSendEvent} />

      <div className="hidden shrink-0 items-center gap-2 md:flex md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
        {isResolved ? (
          <button
            type="button"
            onClick={handleReopen}
            className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
          >
            <RotateCcw size={11} strokeWidth={2.25} />
            Reopen
          </button>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setResolveOpen((o) => !o);
                setRouteOpen(false);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-ok-100 bg-ok-50 px-2 py-1 text-[11px] font-medium text-ok-700 transition-colors hover:bg-ok-100 focus:outline-none focus-visible:shadow-focus"
            >
              <CheckCircle size={11} strokeWidth={2.25} />
              Resolve
            </button>
            {resolveOpen ? (
              <ResolvePopover
                flag={flag}
                onSubmit={handleResolveSubmit}
                onClose={() => setResolveOpen(false)}
              />
            ) : null}
          </div>
        )}
        {!isResolved ? (
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRouteOpen((o) => !o);
                setResolveOpen(false);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
            >
              Route
              <ChevronRight
                size={11}
                strokeWidth={2}
                className={`transition-transform ${routeOpen ? 'rotate-90' : ''}`}
              />
            </button>
            {routeOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close route menu"
                  onClick={(e) => {
                    e.stopPropagation();
                    setRouteOpen(false);
                  }}
                  className="fixed inset-0 z-10 cursor-default bg-transparent"
                />
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-[calc(100%+4px)] z-20 w-48 overflow-hidden rounded-lg border border-paper-300 bg-paper-0 shadow-md"
                >
                  {ROUTE_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleRoute(opt)}
                      className="block w-full px-3 py-2 text-left text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        ) : null}
        <button
          type="button"
          onClick={handleOpenSupplier}
          disabled={!supplier}
          className="inline-flex items-center gap-1 rounded-md bg-ink-900 px-2 py-1 text-[11px] font-semibold text-paper-0 transition-colors hover:bg-ink-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ExternalLink size={11} strokeWidth={2.25} />
          Open supplier
        </button>
      </div>
    </div>
  );
}

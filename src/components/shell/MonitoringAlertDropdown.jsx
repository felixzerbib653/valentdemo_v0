import React, { useEffect, useMemo } from 'react';
import {
  CalendarClock,
  Clock,
  Inbox,
  CheckCircle2,
  ChevronRight,
  X,
} from 'lucide-react';
import { useTrust } from '../../context/TrustContext.jsx';
import { getMonitoringAlerts } from '../../data/documents.js';
import { PILLARS } from '../../data/trustPillars.js';
import { getSupplier } from '../../data/suppliers.js';

// MonitoringAlertDropdown — Surface #5 per docs/70-agentic-surfaces.md.
//
// Anchored to the "last scan · Nm ago" pulse in the TopBar. Shows three
// categories of forward-looking work — Expiring soon, Aging, New awaiting
// review — each line routing to a supplier (for linked docs) or to the
// Ingest Inbox (for unlinked records).
//
// Copy rule: numbers lead. "3 fields expiring within 30 days," not "some
// items need attention." Empty case collapses to a single healthy line.
//
// This component handles Escape locally. The parent (TopBar) owns click-
// outside detection because it wraps both the anchor button and this panel
// — bundling the outside-click handler here would close on anchor click
// before the anchor's own onClick could toggle state.

const CATEGORY_TONE = {
  expiring: {
    Icon: CalendarClock,
    tone: 'text-block-700',
    dotTone: 'bg-block',
    label: 'Expiring soon',
  },
  aging: {
    Icon: Clock,
    tone: 'text-warn-700',
    dotTone: 'bg-warn',
    label: 'Aging past freshness',
  },
  newAwaitingReview: {
    Icon: Inbox,
    tone: 'text-ink-700',
    dotTone: 'bg-ink-500',
    label: 'New · awaiting review',
  },
};

export default function MonitoringAlertDropdown({ onClose }) {
  const { lastScanAt, openSupplier, navigate } = useTrust();

  const alerts = useMemo(() => getMonitoringAlerts(lastScanAt), [lastScanAt]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const totalItems =
    alerts.expiring.total + alerts.aging.total + alerts.newAwaitingReview.total;
  const isHealthy = totalItems === 0;

  const goSupplier = (id) => {
    openSupplier(id);
    onClose();
  };
  const goIngest = () => {
    navigate('ingest');
    onClose();
  };
  // "+ N more" on expiring and aging routes to the Review Queue filtered by
  // the freshness pillar — both categories are freshness-drift in disguise,
  // so this is the honest destination for "show me the rest."
  const goFreshnessQueue = () => {
    navigate('review', { pillarKey: 'freshness', supplierId: null });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-label="Monitoring alerts"
      className="absolute right-0 top-[calc(100%+6px)] z-40 w-[380px] overflow-hidden rounded-lg border border-paper-300 bg-paper-0 shadow-md"
    >
      <header className="flex items-center justify-between border-b border-paper-200 bg-paper-50 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="relative flex h-2 w-2 items-center justify-center"
          >
            <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="text-xs font-semibold text-ink-900">
            Monitoring
          </span>
          <span className="text-[11px] text-ink-500">· latest scan</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close monitoring alerts"
          className="inline-flex h-6 w-6 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </header>

      <div className="max-h-[460px] overflow-y-auto">
        {isHealthy ? (
          <HealthyEmpty />
        ) : (
          <>
            {alerts.expiring.total > 0 && (
              <Section
                category="expiring"
                total={alerts.expiring.total}
                headline={`${alerts.expiring.total} field${alerts.expiring.total === 1 ? '' : 's'} expiring within ${alerts.expiring.windowDays} days`}
              >
                {alerts.expiring.items.map(({ doc, daysToExpiry }) => (
                  <ExpiringRow
                    key={doc.id}
                    doc={doc}
                    daysToExpiry={daysToExpiry}
                    onClick={() => goSupplier(doc.supplierId)}
                  />
                ))}
                <MoreLink
                  total={alerts.expiring.total}
                  shown={alerts.expiring.items.length}
                  onClick={goFreshnessQueue}
                  label="View all in Review Queue"
                />
              </Section>
            )}

            {alerts.aging.total > 0 && (
              <Section
                category="aging"
                total={alerts.aging.total}
                headline={`${alerts.aging.total} field${alerts.aging.total === 1 ? '' : 's'} past ${Math.round(alerts.aging.thresholdDays / 30)}-month freshness`}
              >
                {alerts.aging.items.map(({ doc, ageDays }) => (
                  <AgingRow
                    key={doc.id}
                    doc={doc}
                    ageDays={ageDays}
                    onClick={() => goSupplier(doc.supplierId)}
                  />
                ))}
                <MoreLink
                  total={alerts.aging.total}
                  shown={alerts.aging.items.length}
                  onClick={goFreshnessQueue}
                  label="View all in Review Queue"
                />
              </Section>
            )}

            {alerts.newAwaitingReview.total > 0 && (
              <Section
                category="newAwaitingReview"
                total={alerts.newAwaitingReview.total}
                headline={`${alerts.newAwaitingReview.total} new document${alerts.newAwaitingReview.total === 1 ? '' : 's'} awaiting review`}
              >
                {alerts.newAwaitingReview.items.map((doc) => (
                  <NewDocRow key={doc.id} doc={doc} onClick={goIngest} />
                ))}
                <MoreLink
                  total={alerts.newAwaitingReview.total}
                  shown={alerts.newAwaitingReview.items.length}
                  onClick={goIngest}
                  label="View all in Ingest Inbox"
                />
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ category, headline, children }) {
  const meta = CATEGORY_TONE[category];
  const Icon = meta.Icon;
  return (
    <section className="border-b border-paper-200 last:border-b-0">
      <div className="flex items-center gap-2 bg-paper-50 px-4 py-2">
        <Icon size={13} strokeWidth={2.25} className={meta.tone} />
        <span className={`text-[11px] font-semibold ${meta.tone}`}>
          {headline}
        </span>
      </div>
      <ul className="bg-paper-0">{children}</ul>
    </section>
  );
}

function ExpiringRow({ doc, daysToExpiry, onClick }) {
  const supplier = getSupplier(doc.supplierId);
  const pillar = PILLARS[doc.pillarKey];
  if (!supplier) return null;
  return (
    <AlertRow
      onClick={onClick}
      primary={supplier.name}
      secondary={
        <>
          <span>{pillar?.label || doc.pillarKey}</span>
          <span className="mx-1.5 text-ink-400">·</span>
          <span className="font-mono tabular-nums text-block-700">
            expires in {daysToExpiry}d
          </span>
        </>
      }
    />
  );
}

function AgingRow({ doc, ageDays, onClick }) {
  const supplier = getSupplier(doc.supplierId);
  const pillar = PILLARS[doc.pillarKey];
  if (!supplier) return null;
  return (
    <AlertRow
      onClick={onClick}
      primary={supplier.name}
      secondary={
        <>
          <span>{pillar?.label || doc.pillarKey}</span>
          <span className="mx-1.5 text-ink-400">·</span>
          <span className="font-mono tabular-nums text-warn-700">
            last refreshed {ageDays}d ago
          </span>
        </>
      }
    />
  );
}

function NewDocRow({ doc, onClick }) {
  const label = doc.linkStatus === 'failed' ? 'failed to parse' : 'needs review';
  return (
    <AlertRow
      onClick={onClick}
      primary={doc.title}
      secondary={
        <>
          <span className="font-medium">{label}</span>
          <span className="mx-1.5 text-ink-400">·</span>
          <span>Ingest Inbox</span>
        </>
      }
    />
  );
}

function AlertRow({ primary, secondary, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="group flex w-full items-center gap-2 border-b border-paper-100 px-4 py-2 text-left transition-colors last:border-b-0 hover:bg-paper-50 focus:outline-none focus-visible:bg-paper-50 focus-visible:shadow-focus"
      >
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm text-ink-900">{primary}</div>
          <div className="mt-0.5 flex flex-wrap items-center text-[11px] text-ink-500">
            {secondary}
          </div>
        </div>
        <ChevronRight
          size={14}
          strokeWidth={2}
          className="shrink-0 text-ink-400 transition-colors group-hover:text-ink-700"
        />
      </button>
    </li>
  );
}

function MoreLink({ total, shown, onClick, label }) {
  if (total <= shown) return null;
  const remainder = total - shown;
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center justify-between px-4 py-1.5 text-left text-[11px] font-medium text-ink-500 transition-colors hover:bg-paper-50 hover:text-ink-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-default"
        disabled={!onClick}
      >
        <span>+ {remainder} more</span>
        {label ? (
          <span className="inline-flex items-center gap-0.5 text-ink-500">
            {label}
            <ChevronRight size={11} strokeWidth={2} />
          </span>
        ) : null}
      </button>
    </li>
  );
}

function HealthyEmpty() {
  return (
    <div className="flex items-start gap-3 px-4 py-5">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ok-50 text-ok-700">
        <CheckCircle2 size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-ink-900">
          All pillars healthy
        </div>
        <p className="mt-0.5 text-[11px] text-ink-500">
          No alerts from the latest scan.
        </p>
      </div>
    </div>
  );
}

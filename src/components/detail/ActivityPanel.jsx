import React, { useMemo, useState } from 'react';
import {
  ChevronDown,
  FileCheck,
  Activity,
  Radio,
  Mail,
  AlertOctagon,
  FileWarning,
  FileText,
  ExternalLink,
  CheckCircle,
  Users,
  RotateCw,
  Ban,
} from 'lucide-react';
import { getEventsForSupplier } from '../../data/events.js';
import { getFlagsForSupplier } from '../../data/flags.js';
import { getBrandsForSupplier } from '../../data/brands.js';
import { getDocumentsForSupplier } from '../../data/documents.js';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';

// ActivityPanel — right column on Supplier Detail.
// Per docs/02-screen-supplier-detail.md §Right column.
//
// Three collapsible sub-panels: recent activity (open), supplier contact,
// notes. Notes read-only by design. Events feed filtered to this supplier.

const EVENT_VISUAL = {
  'evidence-ingested': { Icon: FileText, tone: 'info' },
  'pillar-flipped': { Icon: AlertOctagon, tone: 'block' },
  'pillar-resolved': { Icon: FileCheck, tone: 'ok' },
  'bundle-generated': { Icon: FileCheck, tone: 'ok' },
  'evidence-expiring': { Icon: FileWarning, tone: 'warn' },
  'supplier-contacted': { Icon: Mail, tone: 'info' },
  'evidence-received': { Icon: FileCheck, tone: 'ok' },
  'scan-summary': { Icon: Radio, tone: 'info' },
  'flag-resolved': { Icon: CheckCircle, tone: 'ok' },
  'document-approved': { Icon: CheckCircle, tone: 'ok' },
  'document-rejected': { Icon: Ban, tone: 'block' },
  'document-reextraction': { Icon: RotateCw, tone: 'warn' },
};

const REVIEW_EVENT_META = {
  'approve-link': { type: 'document-approved', verb: 'approved' },
  reject: { type: 'document-rejected', verb: 'rejected' },
  'request-reextraction': {
    type: 'document-reextraction',
    verb: 'routed for re-extraction',
  },
};

const TONE_CLASS = {
  ok: 'bg-ok-50 text-ok-700',
  warn: 'bg-warn-50 text-warn-700',
  block: 'bg-block-50 text-block-700',
  info: 'bg-paper-100 text-ink-700',
};

function formatMonitoringSince(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export default function ActivityPanel({ supplier }) {
  const { resolutions, documentReviews, chaseSendEvents, basfDemoInboundEvidence } = useTrust();

  // Merge seeded events with live flag-resolution and document-review events
  // for this supplier. Session-state on TrustContext projects into the
  // Activity timeline so it remains the single audit-trail surface per
  // supplier. Newest first, capped at 10.
  const events = useMemo(() => {
    const base = getEventsForSupplier(supplier.id);
    const supplierFlags = getFlagsForSupplier(supplier.id);
    const resolutionEvents = [];
    for (const f of supplierFlags) {
      const r = resolutions?.get(f.id);
      if (!r) continue;
      resolutionEvents.push({
        id: `resolution-${f.id}`,
        supplierId: supplier.id,
        type: 'flag-resolved',
        title: `${f.title} · resolved`,
        body: r.note
          ? `${r.resolvedBy} — "${r.note}"`
          : `${r.resolvedBy} — no note`,
        at: r.resolvedAt,
      });
    }
    const reviewEvents = [];
    if (documentReviews && documentReviews.size > 0) {
      const supplierDocs = getDocumentsForSupplier(supplier.id);
      for (const d of supplierDocs) {
        const r = documentReviews.get(d.id);
        if (!r) continue;
        const meta = REVIEW_EVENT_META[r.action];
        if (!meta) continue;
        reviewEvents.push({
          id: `doc-review-${d.id}`,
          supplierId: supplier.id,
          type: meta.type,
          title: `${d.title} · ${meta.verb}`,
          body: r.note
            ? `${r.reviewedBy} — "${r.note}"`
            : `${r.reviewedBy} — feedback sent to Valent`,
          at: r.reviewedAt,
        });
      }
    }
    const chaseEvents = [];
    if (chaseSendEvents && chaseSendEvents.size > 0) {
      for (const [flagId, event] of chaseSendEvents.entries()) {
        if (event.supplierId !== supplier.id || !event.sentAt) continue;
        chaseEvents.push({
          id: `chase-${flagId}`,
          supplierId: supplier.id,
          type: 'supplier-contacted',
          title: 'Chase email sent',
          body: event.to ? `Sent to ${event.to}` : 'Supplier follow-up sent',
          at: event.sentAt,
        });
      }
    }
    const inboundEvents = [];
    if (supplier.id === 'sup-basf') {
      if (basfDemoInboundEvidence?.allergen) {
        inboundEvents.push({
          id: 'basf-inbound-allergen',
          supplierId: supplier.id,
          type: 'evidence-received',
          title: 'Refreshed allergen declaration received',
          body: 'Updated evidence linked to Allergen declaration. Pillar moved to pass.',
          at:
            typeof basfDemoInboundEvidence.allergen === 'string'
              ? basfDemoInboundEvidence.allergen
              : supplier.lastScanAt,
        });
      }
      if (basfDemoInboundEvidence?.fei) {
        inboundEvents.push({
          id: 'basf-inbound-fei',
          supplierId: supplier.id,
          type: 'evidence-received',
          title: 'Renewed FEI confirmation received',
          body: 'Updated Houston Site FEI evidence linked. Pillar moved to pass.',
          at:
            typeof basfDemoInboundEvidence.fei === 'string'
              ? basfDemoInboundEvidence.fei
              : supplier.lastScanAt,
        });
      }
    }
    const merged = [
      ...base,
      ...resolutionEvents,
      ...reviewEvents,
      ...chaseEvents,
      ...inboundEvents,
    ];
    merged.sort(
      (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
    );
    return merged.slice(0, 10);
  }, [
    supplier.id,
    supplier.lastScanAt,
    resolutions,
    documentReviews,
    chaseSendEvents,
    basfDemoInboundEvidence,
  ]);

  const monitoringSince = formatMonitoringSince(supplier.addedAt);
  const activityTitle = monitoringSince
    ? `Continuous monitoring since ${monitoringSince}`
    : 'Continuous monitoring';
  return (
    <aside className="flex flex-col gap-3">
      <CollapsibleSection
        title={activityTitle}
        icon={<Activity size={14} strokeWidth={2} />}
        defaultOpen
        badge={events.length > 0 ? events.length : null}
      >
        {events.length === 0 ? (
          <p className="px-4 py-4 text-xs text-ink-500">
            No activity yet for this supplier.
          </p>
        ) : (
          <ul className="divide-y divide-paper-200">
            {events.map((evt) => (
              <EventItem key={evt.id} evt={evt} />
            ))}
          </ul>
        )}
      </CollapsibleSection>

      <BrandsSharingCard supplier={supplier} />

      <CollapsibleSection
        title="Supplier contact"
        icon={<Mail size={14} strokeWidth={2} />}
      >
        <ContactBlock supplier={supplier} />
      </CollapsibleSection>

      <CollapsibleSection
        title="Notes"
        icon={<FileText size={14} strokeWidth={2} />}
        rightHint="read-only in preview"
      >
        <div className="px-4 py-3">
          <p className="text-xs text-ink-700">
            {supplier.notes || 'No notes on file.'}
          </p>
        </div>
      </CollapsibleSection>
    </aside>
  );
}

function BrandsSharingCard({ supplier }) {
  const { emitToast } = useTrust();
  const brandEntries = getBrandsForSupplier(supplier.id);
  if (brandEntries.length === 0) return null;
  const title =
    brandEntries.length === 1
      ? 'Brands using this supplier · 1'
      : `Brands sharing this supplier · ${brandEntries.length}`;
  return (
    <CollapsibleSection
      title={title}
      icon={<Users size={14} strokeWidth={2} />}
      defaultOpen
      rightHint={brandEntries.length > 1 ? 'shared pool' : null}
    >
      <ul className="divide-y divide-paper-200">
        {brandEntries.map(({ brand, skuCount }) => (
          <li key={brand.id}>
            <button
              type="button"
              onClick={() =>
                emitToast({
                  tone: 'info',
                  title: `${brand.name}`,
                  body: `${brand.diligenceContact} · ${skuCount} SKU${skuCount === 1 ? '' : 's'} touch ${supplier.name}.`,
                  supplierId: supplier.id,
                })
              }
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink-900">
                  {brand.name}
                </div>
                <div className="truncate text-[11px] text-ink-500">
                  {brand.segment}
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-500">
                {skuCount} SKU{skuCount === 1 ? '' : 's'}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </CollapsibleSection>
  );
}

function EventItem({ evt }) {
  const { now } = useTrust();
  const visual = EVENT_VISUAL[evt.type] || EVENT_VISUAL['scan-summary'];
  const tone = evt.tone || visual.tone;
  const Icon = visual.Icon;
  return (
    <li className="flex items-start gap-3 px-4 py-3">
      <span
        className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${TONE_CLASS[tone] || TONE_CLASS.info}`}
      >
        <Icon size={12} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <span className="truncate text-xs font-medium text-ink-900">{evt.title}</span>
          <span className="shrink-0 font-mono text-[11px] tabular-nums text-ink-500">
            {formatRelative(evt.at, now)}
          </span>
        </div>
        {evt.body && (
          <p className="mt-0.5 line-clamp-2 text-[11px] text-ink-500">{evt.body}</p>
        )}
      </div>
    </li>
  );
}

function ContactBlock({ supplier }) {
  const { emitToast, now, chaseSendEvents } = useTrust();
  const contact = supplier.primaryContact;
  if (!contact) {
    return <p className="px-4 py-3 text-xs text-ink-500">No contact on file.</p>;
  }
  let lastContactedAt = contact.lastContactedAt;
  if (chaseSendEvents && chaseSendEvents.size > 0) {
    for (const event of chaseSendEvents.values()) {
      if (event.supplierId !== supplier.id || !event.sentAt) continue;
      if (
        !lastContactedAt ||
        new Date(event.sentAt).getTime() > new Date(lastContactedAt).getTime()
      ) {
        lastContactedAt = event.sentAt;
      }
    }
  }
  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <div>
        <div className="text-sm font-medium text-ink-900">{contact.name}</div>
        <div className="truncate font-mono text-[11px] text-ink-500">{contact.email}</div>
        {lastContactedAt ? (
          <div className="mt-0.5 text-[11px] text-ink-500">
            Last contacted{' '}
            <span className="font-mono tabular-nums">
              {formatRelative(lastContactedAt, now)}
            </span>
          </div>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            emitToast({
              tone: 'info',
              title: 'Compose window opened in Outlook',
              body: `To: ${contact.email}`,
              supplierId: supplier.id,
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          <Mail size={12} strokeWidth={2} />
          Compose email
        </button>
        <button
          type="button"
          onClick={() =>
            emitToast({
              tone: 'info',
              title: 'Open in CRM',
              body: `CRM record for ${supplier.name}`,
              supplierId: supplier.id,
            })
          }
          className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          <ExternalLink size={12} strokeWidth={2} />
          Open in CRM
        </button>
      </div>
    </div>
  );
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  badge,
  rightHint,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 border-b border-paper-200 px-4 py-2.5 text-left transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2 text-ink-700">
          <span className="text-ink-500">{icon}</span>
          <span className="text-xs font-semibold uppercase tracking-[0.08em]">
            {title}
          </span>
          {badge != null && (
            <span className="font-mono text-[11px] tabular-nums text-ink-500">
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {rightHint ? (
            <span className="text-[10px] italic text-ink-400">{rightHint}</span>
          ) : null}
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={`text-ink-500 transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </div>
      </button>
      {open ? <div>{children}</div> : null}
    </div>
  );
}

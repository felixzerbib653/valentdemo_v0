import React, { useMemo, useState } from 'react';
import { ScanLine, Flag, Package, ChevronDown, ChevronUp } from 'lucide-react';
import { getDocumentsForSupplier } from '../../data/documents.js';
import { getFlagsForSupplier } from '../../data/flags.js';
import { useTrust } from '../../context/TrustContext.jsx';

// ProvenanceBreadcrumb — fixed 3-step agent chain on the audit bundle.
// See docs/84-feature-bundle-provenance-breadcrumb.md (SHIP SIMPLIFIED scope).
//
// Collapsed by default as a one-line strip at the top of the modal body.
// Expands to a three-row chain: Ingest → Flag → Bundle.
// Agent names match the four-name public UI taxonomy locked in docs/70.
//
// The chain is computed at render time from existing supplier + flag data so
// no additional data collection is needed. Ingest anchors to the supplier's
// lastScanAt; Bundle anchors to `now` (the modal's freeze time). Flag
// interleaves between them.

const AGENT_ICON = {
  ingest: ScanLine,
  flag: Flag,
  bundle: Package,
};

function formatShortTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  const day = d.getDate();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${month} ${day}, ${hh}:${mm}`;
}

function addSeconds(iso, seconds) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Date(d.getTime() + seconds * 1000).toISOString();
}

export default function ProvenanceBreadcrumb({ supplier, selectedCount }) {
  const { now, resolutions } = useTrust();
  const [open, setOpen] = useState(false);

  const chain = useMemo(() => {
    const allDocs = getDocumentsForSupplier(supplier.id);
    const totalDocs = allDocs.length;
    const autoApproved = allDocs.filter(
      (d) => d.extractionConfidence === 'high' && d.linkStatus === 'linked'
    ).length;
    const toReview = Math.max(0, totalDocs - autoApproved);
    const totalFields = Math.max(totalDocs * 4, totalDocs); // ~4 fields per doc

    const supplierFlags = getFlagsForSupplier(supplier.id);
    const openFlags = supplierFlags.filter(
      (f) => !(resolutions && resolutions.has(f.id))
    );
    const flagCount = openFlags.length;
    const blocker = openFlags.find((f) => f.severity === 'blocker');

    // Ingest anchors to the supplier's last-scan timestamp (same source the
    // TopBar pulse reads). Flag interleaves ~2s later. Bundle is now.
    const ingestAt = supplier.lastScanAt;
    const ingestDurationSec = Math.max(8, Math.min(18, Math.round(totalDocs * 1.5)));
    const flagAt = addSeconds(ingestAt, ingestDurationSec);
    const flagDurationSec = 2;
    const bundleAt = now ? new Date(now).toISOString() : new Date().toISOString();
    const bundleDurationSec = 3;

    const ingestDescription = totalDocs > 0
      ? `Extracted ${totalFields} fields from ${totalDocs} supplier document${totalDocs === 1 ? '' : 's'}. ${autoApproved} auto-approved, ${toReview} sent to review.`
      : `No documents on file for this supplier yet. Ingest is watching inbound channels.`;

    let flagDescription;
    if (flagCount === 0) {
      flagDescription = 'No compliance gaps identified.';
    } else {
      const lead = openFlags[0];
      const leadTitle = lead && lead.title ? lead.title : 'compliance gap';
      const blockerPhrase = blocker ? 'Includes blocker.' : 'No blocker.';
      flagDescription = `Identified ${flagCount} compliance gap${flagCount === 1 ? '' : 's'} (${leadTitle}). ${blockerPhrase}`;
    }

    const bundleDescription = `Assembled cover, pillar strip, and ${selectedCount} evidence document${selectedCount === 1 ? '' : 's'} into this artifact.`;

    // Total agent actions is the sum of observable per-agent actions. Kept
    // loose — the collapsed strip cites it as a single number to anchor the
    // claim ("agents did real work"). Precision isn't the point.
    const actionCount = totalDocs + flagCount + 1 + Math.max(0, autoApproved - 0);

    return {
      actionCount,
      rows: [
        {
          agent: 'ingest',
          label: 'Ingest',
          description: ingestDescription,
          timestamp: ingestAt,
          durationSeconds: ingestDurationSec,
          tooltip: 'Ingest: extracts §-tagged fields from inbound supplier documents. Auto-approves high-confidence pulls; routes the rest to review.',
        },
        {
          agent: 'flag',
          label: 'Flag',
          description: flagDescription,
          timestamp: flagAt,
          durationSeconds: flagDurationSec,
          tooltip: 'Flag: evaluates extracted evidence against the MoCRA pillars and raises compliance gaps with suggested remediation.',
        },
        {
          agent: 'bundle',
          label: 'Bundle',
          description: bundleDescription,
          timestamp: bundleAt,
          durationSeconds: bundleDurationSec,
          tooltip: 'Bundle: assembles the cover, pillar strip, and selected evidence into an audit-program-shaped artifact.',
        },
      ],
    };
  }, [supplier.id, supplier.lastScanAt, selectedCount, now, resolutions]);

  return (
    <div className="mb-4 overflow-hidden rounded-md border border-paper-300 bg-paper-0">
      {open ? (
        <div className="relative">
          <div className="absolute left-[27px] top-7 bottom-7 w-px bg-paper-300" aria-hidden="true" />
          <ul>
            {chain.rows.map((row) => (
              <BreadcrumbRow key={row.agent} row={row} />
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-full items-center justify-center gap-1 border-t border-paper-200 px-3 py-1.5 text-[11px] font-medium text-accent transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            <ChevronUp size={12} strokeWidth={2} />
            hide detail
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex w-full items-center justify-between gap-3 px-3 py-1.5 text-left transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          aria-expanded={false}
        >
          <div className="flex items-center gap-1.5 text-[11px] text-ink-500">
            <span className="text-ink-500">Assembled by</span>
            <AgentPill label="Ingest" compact />
            <ArrowGlyph />
            <AgentPill label="Flag" compact />
            <ArrowGlyph />
            <AgentPill label="Bundle" compact />
          </div>
          <div className="flex items-center gap-2 text-[11px] text-ink-500">
            <span className="font-mono tabular-nums">{chain.actionCount}</span>
            <span>agent actions</span>
            <span className="mx-0.5 text-ink-400">·</span>
            <span className="inline-flex items-center gap-0.5 font-medium text-accent">
              view detail
              <ChevronDown size={12} strokeWidth={2} />
            </span>
          </div>
        </button>
      )}
    </div>
  );
}

function BreadcrumbRow({ row }) {
  const Icon = AGENT_ICON[row.agent];
  return (
    <li className="relative flex items-start gap-3 px-3 py-2">
      <span
        title={row.tooltip}
        className="relative z-10 inline-flex h-7 w-[56px] shrink-0 items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent"
      >
        {Icon ? <Icon size={11} strokeWidth={2.25} /> : null}
        <span>{row.label}</span>
      </span>
      <p className="flex-1 pt-1 text-[11px] leading-snug text-ink-700">
        {row.description}
      </p>
      <span className="shrink-0 whitespace-nowrap pt-1 font-mono text-[10px] tabular-nums text-ink-500">
        {formatShortTime(row.timestamp)}
        <span className="mx-1 text-ink-400">·</span>
        {row.durationSeconds}s
      </span>
    </li>
  );
}

function AgentPill({ label, compact = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-paper-300 bg-paper-0 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent ${
        compact ? 'px-1.5 py-0' : 'px-2 py-0.5'
      }`}
    >
      {label}
    </span>
  );
}

function ArrowGlyph() {
  return (
    <span className="text-ink-400" aria-hidden="true">
      →
    </span>
  );
}

import React from 'react';
import { FileCheck, ChevronRight } from 'lucide-react';
import TrustScoreRing from '../shared/TrustScoreRing.jsx';
import PillarChip from '../shared/PillarChip.jsx';
import { PILLAR_LIST } from '../../data/trustPillars.js';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';

// SupplierRow per docs/01-screen-trust-grid.md §Row anatomy.
// 72px tall. Left-to-right: score ring · name+subtitle · 7 pillar chips ·
// last-updated · hover-revealed actions.
//
// The status is communicated by the score ring's tone, the red left bar on
// blocked rows, and the red/amber pillar chips — a separate status-text
// pill was redundant and ate enough horizontal space to wrap the pillar
// strip on standard widths. Dropped per operator-review pass.
//
// Click anywhere on the row (except the Audit-bundle button) opens the
// supplier detail. Hover surfaces the action buttons and a paper-100 bg.
// Keyboard: row is focusable; Enter opens.

export default function SupplierRow({ supplier }) {
  const { openSupplier, openAuditBundle, now } = useTrust();

  const handleOpen = () => openSupplier(supplier.id);
  const handleAuditBundle = (e) => {
    e.stopPropagation();
    openAuditBundle(supplier.id);
  };
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOpen();
    }
  };

  const isBlocked = supplier.status === 'blocked';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={handleKey}
      className={`group relative grid h-[72px] cursor-pointer items-center gap-4 border-b border-paper-200 bg-paper-0 px-6 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:bg-paper-50 focus-visible:shadow-focus ${
        isBlocked ? 'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:rounded-r-md before:bg-block' : ''
      }`}
      style={{
        gridTemplateColumns: 'auto minmax(200px, 1fr) minmax(460px, auto) auto auto',
      }}
    >
      {/* Score ring */}
      <TrustScoreRing
        score={supplier.trustScore}
        status={supplier.status}
        size="sm"
      />

      {/* Name + subtitle */}
      <div className="min-w-0">
        <div className="truncate text-base font-medium text-ink-900">
          {supplier.name}
        </div>
        <div className="truncate text-xs text-ink-500">{supplier.subtitle}</div>
      </div>

      {/* Pillar chip strip — flex-nowrap to keep the 7 chips on one line.
          The grid column reserves 460px minimum; combined with the chips'
          whitespace-nowrap labels, they no longer break line on standard
          desktop widths. */}
      <div className="flex flex-nowrap items-center gap-1.5">
        {PILLAR_LIST.map((pillar) => (
          <PillarChip
            key={pillar.key}
            pillarKey={pillar.key}
            status={supplier.pillars[pillar.key] || 'missing'}
          />
        ))}
      </div>

      {/* Last-updated */}
      <div className="whitespace-nowrap font-mono text-xs tabular-nums text-ink-500">
        {formatRelative(supplier.lastUpdatedAt, now)}
      </div>

      {/* Hover actions */}
      <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={handleAuditBundle}
          className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
          title="Generate audit bundle"
        >
          <FileCheck size={14} strokeWidth={2} />
          <span>Audit bundle</span>
        </button>
        <button
          type="button"
          onClick={(e) => {
            // Row is the primary click target — this button is a visual echo
            // for mouse users. Stop propagation to avoid a double-open if
            // browsers fire a phantom row click. handleOpen() is the same
            // action regardless.
            e.stopPropagation();
            handleOpen();
          }}
          className="inline-flex items-center gap-1 rounded-md bg-ink-900 px-2 py-1 text-xs font-medium text-paper-0 transition-colors hover:bg-ink-800 focus:outline-none focus-visible:shadow-focus"
        >
          <span>Open</span>
          <ChevronRight size={14} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}

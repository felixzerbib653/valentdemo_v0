import React from 'react';
import { ChevronLeft, FileCheck, Mail, MoreHorizontal } from 'lucide-react';
import TrustScoreRing from '../shared/TrustScoreRing.jsx';
import StatusPill from '../shared/StatusPill.jsx';
import PillarChip from '../shared/PillarChip.jsx';
import ProvenanceChip from '../shared/ProvenanceChip.jsx';
import { PILLAR_LIST } from '../../data/trustPillars.js';
import { useTrust } from '../../context/TrustContext.jsx';

// SupplierHeader — page header for Supplier Detail.
// Per docs/02-screen-supplier-detail.md §Page header.
//
// Left: back link + name + subtitle + delta chip.
// Center: lg TrustScoreRing (96px) with status word + provenance chip.
// Right: Generate audit bundle (primary) + Request update (ghost) + More menu.
//
// Surface #6 retrofit (docs/70-agentic-surfaces.md): the trust score is a
// computed value — weighted from the seven pillar statuses on every scan —
// so a <ProvenanceChip variant="computed" /> tucks beneath the status pill
// to attribute the number and carry the last-computed timestamp.

export default function SupplierHeader({ supplier }) {
  const { navigate, openAuditBundle, emitToast, now } = useTrust();
  if (!supplier) return null;

  const isOnboarding = supplier.status === 'onboarding';

  const handleBack = () => navigate('trust-grid');
  const handleBundle = () => openAuditBundle(supplier.id);
  const handleRequestUpdate = () =>
    emitToast({
      tone: 'info',
      title: 'Compose window opened in Outlook',
      body: `Template drafted for ${supplier.primaryContact?.name || 'supplier contact'}.`,
      supplierId: supplier.id,
    });

  return (
    <section className="mx-auto w-full max-w-[1280px] px-12 pt-8">
      <div className="flex items-start justify-between gap-8 rounded-xl border border-paper-300 bg-paper-0 px-6 py-5 shadow-sm">
        {/* Left — back link + identity */}
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1 text-xs font-medium text-ink-500 transition-colors hover:text-ink-700 focus:outline-none focus-visible:shadow-focus"
          >
            <ChevronLeft size={14} strokeWidth={2} />
            Supplier Trust
          </button>
          <h2 className="mt-1 truncate text-2xl font-semibold text-ink-900">
            {supplier.name}
          </h2>
          <p className="mt-0.5 text-sm text-ink-500">
            {supplier.subtitle}
            {supplier.addedAt ? (
              <>
                <span className="mx-1.5 text-ink-400">·</span>
                <span className="font-mono tabular-nums">
                  added {supplier.addedAt.slice(0, 10)}
                </span>
              </>
            ) : null}
          </p>

          {/* Pillar chip strip — small, for continuity with the grid */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {PILLAR_LIST.map((p) => (
              <PillarChip
                key={p.key}
                pillarKey={p.key}
                status={supplier.pillars[p.key] || 'missing'}
              />
            ))}
          </div>
        </div>

        {/* Center — score ring */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <TrustScoreRing
            score={supplier.trustScore}
            status={supplier.status}
            size="lg"
          />
          <StatusPill status={supplier.status} size="md" />
          {!isOnboarding && supplier.trustScoreComputedAt && (
            <ProvenanceChip
              variant="computed"
              timestamp={supplier.trustScoreComputedAt}
              nowMs={now}
              title="Trust score computed by Valent from the seven weighted pillar statuses on the most recent scan."
            />
          )}
          <DeltaChip delta={supplier.deltaWeek} />
        </div>

        {/* Right — action cluster */}
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleBundle}
            className="inline-flex items-center gap-1.5 rounded-md bg-ok px-3 py-2 text-sm font-semibold text-paper-0 shadow-sm transition-colors hover:bg-ok-700 focus:outline-none focus-visible:shadow-focus"
          >
            <FileCheck size={14} strokeWidth={2.25} />
            Generate audit bundle
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRequestUpdate}
              className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
            >
              <Mail size={14} strokeWidth={2} />
              Request update
            </button>
            <button
              type="button"
              aria-label="More actions"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-paper-300 bg-paper-0 text-ink-500 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
              onClick={() =>
                emitToast({
                  tone: 'info',
                  title: 'More actions menu',
                  body: 'Archive, export CSV, suspend scanning',
                  supplierId: supplier.id,
                })
              }
            >
              <MoreHorizontal size={16} strokeWidth={2} />
            </button>
          </div>
          {supplier.primaryContact ? (
            <div className="mt-1 text-right text-xs text-ink-500">
              Primary contact{' '}
              <span className="text-ink-700">{supplier.primaryContact.name}</span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DeltaChip({ delta }) {
  if (delta == null) return null;
  if (delta === 0) {
    return (
      <span className="inline-flex items-center rounded-md border border-paper-300 bg-paper-50 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
        flat this week
      </span>
    );
  }
  const up = delta > 0;
  const tone = up
    ? 'border-ok-100 bg-ok-50 text-ok-700'
    : 'border-block-100 bg-block-50 text-block-700';
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${tone}`}
    >
      {up ? '+' : ''}
      {delta} this week
    </span>
  );
}

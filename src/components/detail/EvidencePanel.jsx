import React, { useMemo, useState } from 'react';
import { Upload, Mail, Inbox, CheckCircle, Clock, FileClock } from 'lucide-react';
import EvidenceRow from '../shared/EvidenceRow.jsx';
import DocumentPreview from './DocumentPreview.jsx';
import { PILLARS } from '../../data/trustPillars.js';
import {
  getDocumentsForSupplier,
  getDocumentsForPillar,
  applyBasfDemoDocumentOverrides,
} from '../../data/documents.js';
import { useTrust } from '../../context/TrustContext.jsx';

function chaseSendEventForPillar(supplierId, pillarKey, chaseSendEvents) {
  if (!supplierId || !pillarKey || !chaseSendEvents) return null;
  const realId = `flag-${supplierId}-${pillarKey}`;
  const ephemeralId = `ephemeral-${supplierId}-${pillarKey}`;
  return (
    chaseSendEvents.get(realId) ||
    chaseSendEvents.get(ephemeralId) ||
    null
  );
}

// EvidencePanel — center column on Supplier Detail.
// Per docs/02-screen-supplier-detail.md §Center column.
//
// Header: "Evidence for FEI registration · 3 docs · 1 needs review."
// Body: EvidenceRow list. Click opens DocumentPreview.
// Footer: Upload new document (ghost) + Request from supplier (ghost).
// Empty states: missing pillar → request-from-supplier primary CTA.
//              all-pass supplier with no filter → calm all-clear state.

const MISSING_PILLAR_COPY = {
  fei: 'No FEI registration on file. This supplier has not provided an FDA facility registration number or a copy of the registration certificate.',
  cosmeticListing:
    'No §607 cosmetic product listing acknowledgment on file. The listing receipt from the FDA portal is missing.',
  safety:
    'No §609 safety substantiation on file. Ingredient safety study citations have not been provided.',
  allergen:
    'No allergen declaration on file. Supplier has not provided a current allergen statement.',
  origin:
    'No origin or chain-of-custody documentation on file. Country-of-origin letter is missing.',
  purity:
    'No recent Certificate of Analysis on file. The most recent CoA has not been received.',
  freshness:
    'Documentation freshness cannot be evaluated because no primary evidence is on file.',
};

export default function EvidencePanel({ supplier }) {
  const { activePillarKey, emitToast, basfDemoInboundEvidence, chaseSendEvents } =
    useTrust();
  const [preview, setPreview] = useState(null);

  const docs = useMemo(() => {
    let list;
    if (activePillarKey) {
      list = getDocumentsForPillar(supplier.id, activePillarKey);
    } else {
      list = getDocumentsForSupplier(supplier.id);
    }
    if (supplier.id !== 'sup-basf') return list;
    return applyBasfDemoDocumentOverrides(list, basfDemoInboundEvidence);
  }, [supplier.id, activePillarKey, basfDemoInboundEvidence]);

  const pillar = activePillarKey ? PILLARS[activePillarKey] : null;
  const pillarStatus = activePillarKey
    ? supplier.pillars[activePillarKey] || 'missing'
    : null;

  const needsReviewCount = docs.filter((d) => (d.flags?.length || 0) > 0).length;

  const handleRequest = () =>
    emitToast({
      tone: 'info',
      title: 'Compose window opened in Outlook',
      body: pillar
        ? `Template drafted for ${pillar.label.toLowerCase()} from ${supplier.primaryContact?.name || 'supplier contact'}.`
        : `Template drafted for ${supplier.primaryContact?.name || 'supplier contact'}.`,
      supplierId: supplier.id,
    });

  const handleUpload = () =>
    emitToast({
      tone: 'info',
      title: 'Upload window opened',
      body: 'Select a PDF or image to attach to this supplier.',
      supplierId: supplier.id,
    });

  const header = pillar
    ? `Evidence for ${pillar.label}`
    : 'All evidence on file';

  return (
    <section className="flex min-w-0 flex-col">
      <div className="flex-1 overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        {/* Header */}
        <header className="flex items-center justify-between gap-4 border-b border-paper-200 px-5 py-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-ink-900">{header}</h3>
            <p className="mt-0.5 text-xs text-ink-500">
              {docs.length === 0 ? (
                <>No documents on file</>
              ) : (
                <>
                  <span className="font-mono tabular-nums text-ink-700">
                    {docs.length}
                  </span>{' '}
                  {docs.length === 1 ? 'document' : 'documents'} on file
                  {needsReviewCount > 0 && (
                    <>
                      <span className="mx-1.5 text-ink-400">·</span>
                      <span className="font-mono tabular-nums text-block-700">
                        {needsReviewCount}
                      </span>{' '}
                      <span className="text-block-700">needs review</span>
                    </>
                  )}
                </>
              )}
            </p>
          </div>
          {pillar ? (
            <span className="rounded-md border border-paper-300 bg-paper-50 px-2 py-1 text-[11px] font-medium text-ink-500">
              Filter · {pillar.shortLabel}
            </span>
          ) : null}
        </header>

        {/* Body */}
        {docs.length === 0 ? (
          renderEmptyState({
            pillarStatus,
            pillarKey: activePillarKey,
            supplier,
            onRequest: handleRequest,
          })
        ) : (
          <div role="list">
            {docs.map((doc) => (
              <EvidenceRow
                key={doc.id}
                doc={doc}
                onOpen={(d) => setPreview(d)}
                showPillarTag={!activePillarKey}
                demoEvidenceVerified={
                  (doc.id === 'doc-basf-003' &&
                    basfDemoInboundEvidence.allergen) ||
                  (doc.id === 'doc-basf-006' && basfDemoInboundEvidence.fei)
                }
                chaseSendEvent={
                  doc.pillarKey
                    ? chaseSendEventForPillar(
                        supplier.id,
                        doc.pillarKey,
                        chaseSendEvents
                      )
                    : null
                }
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="flex items-center gap-2 border-t border-paper-200 px-5 py-3">
          <button
            type="button"
            onClick={handleUpload}
            className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            <Upload size={14} strokeWidth={2} />
            Upload new document
          </button>
          <button
            type="button"
            onClick={handleRequest}
            className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            <Mail size={14} strokeWidth={2} />
            Request from supplier
          </button>
        </footer>
      </div>

      {preview ? (
        <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      ) : null}
    </section>
  );
}

function MissingPillarEmpty({ pillarKey, onRequest }) {
  const pillar = PILLARS[pillarKey];
  const copy = MISSING_PILLAR_COPY[pillarKey] || 'No evidence on file for this pillar.';
  return (
    <div className="flex flex-col items-start gap-4 px-5 py-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-block-50 text-block">
        <Inbox size={18} strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink-900">
          {pillar ? pillar.label : 'Pillar'} · evidence missing
        </div>
        <p className="mt-1 max-w-[520px] text-sm text-ink-700">{copy}</p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-3 py-2 text-sm font-semibold text-paper-0 transition-colors hover:bg-ink-800 focus:outline-none focus-visible:shadow-focus"
      >
        <Mail size={14} strokeWidth={2.25} />
        Request from supplier
      </button>
    </div>
  );
}

function AllClearEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 px-5 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ok-50 text-ok">
        <CheckCircle size={18} strokeWidth={2.25} />
      </span>
      <div className="text-sm font-semibold text-ink-900">
        All pillars pass — nothing needs attention today
      </div>
      <p className="max-w-[360px] text-xs text-ink-500">
        Select a specific pillar on the left to see the evidence tied to it.
      </p>
    </div>
  );
}

// Pending pillar with no document on file — supplier has acknowledged but
// hasn't delivered. Different from missing (no acknowledgement at all).
function PendingPillarEmpty({ pillarKey, onRequest }) {
  const pillar = PILLARS[pillarKey];
  return (
    <div className="flex flex-col items-start gap-4 px-5 py-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warn-50 text-warn">
        <Clock size={18} strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink-900">
          {pillar ? pillar.label : 'Pillar'} · awaiting response
        </div>
        <p className="mt-1 max-w-[520px] text-sm text-ink-700">
          Supplier has acknowledged the request but the evidence hasn't landed
          yet. Nothing to review in this pillar until they send the file.
        </p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
      >
        <Mail size={14} strokeWidth={2} />
        Nudge supplier
      </button>
    </div>
  );
}

// Supplier-level empty state — zero docs on file, no pillar selected. Most
// often an onboarding supplier mid-intake.
function OnboardingEmpty({ supplier, onRequest }) {
  return (
    <div className="flex flex-col items-start gap-4 px-5 py-10">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-100 text-ink-700">
        <FileClock size={18} strokeWidth={2} />
      </div>
      <div>
        <div className="text-sm font-semibold text-ink-900">
          {supplier.name} · onboarding in progress
        </div>
        <p className="mt-1 max-w-[520px] text-sm text-ink-700">
          No evidence on file yet. Request the intake packet — FEI registration,
          §607 listing, safety substantiation, allergen statement, origin
          letter, and the most recent Certificate of Analysis — and they'll
          appear here as they land.
        </p>
      </div>
      <button
        type="button"
        onClick={onRequest}
        className="inline-flex items-center gap-1.5 rounded-md bg-ink-900 px-3 py-2 text-sm font-semibold text-paper-0 transition-colors hover:bg-ink-800 focus:outline-none focus-visible:shadow-focus"
      >
        <Mail size={14} strokeWidth={2.25} />
        Request intake packet
      </button>
    </div>
  );
}

// Empty-state router. Branches on pillar status first (pillar selected) then
// falls through to the supplier-level case (no pillar selected, no docs).
function renderEmptyState({ pillarStatus, pillarKey, supplier, onRequest }) {
  if (pillarKey) {
    if (pillarStatus === 'missing' || pillarStatus === 'fail') {
      return <MissingPillarEmpty pillarKey={pillarKey} onRequest={onRequest} />;
    }
    if (pillarStatus === 'pending') {
      return <PendingPillarEmpty pillarKey={pillarKey} onRequest={onRequest} />;
    }
    // pass + zero docs is an edge we don't expect, but fall through cleanly.
    return <AllClearEmpty />;
  }
  // No pillar selected, supplier has zero evidence on file — onboarding tail.
  return <OnboardingEmpty supplier={supplier} onRequest={onRequest} />;
}

import React, { useEffect, useMemo, useState } from 'react';
import {
  X,
  Download,
  Mail,
  Check,
  Eye,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  Inbox,
  FileText,
} from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import { getSupplier, applyBasfDemoInboundEvidence } from '../../data/suppliers.js';
import {
  getDocumentsForSupplier,
  getDocumentsForPillar,
} from '../../data/documents.js';
import { PILLAR_LIST, PILLARS } from '../../data/trustPillars.js';
import {
  RETAILER_PROFILES,
  DEFAULT_RETAILER_PROFILE_ID,
  getRetailerProfile,
  retailerFilenameSlug,
} from '../../data/retailerProfiles.js';
import { getBrandsForSupplier } from '../../data/brands.js';
import DocumentPreview from '../detail/DocumentPreview.jsx';
import ProvenanceChip from '../shared/ProvenanceChip.jsx';
import ProvenanceBreadcrumb from './ProvenanceBreadcrumb.jsx';

// AuditBundleModal — the hero artifact.
// Per docs/03-screen-audit-bundle.md.
//
// Opened when TrustContext.auditBundle is set. Renders a full-viewport overlay
// with a stylized printed-paper cover page preview, a checkable evidence list,
// an expandable note-to-recipient field, and a three-action footer.
//
// Download emits an ok toast, flashes a check on the button,
// keeps the modal open (operator starts the next bundle without re-mounting).

const PILLAR_DOT = {
  pass: 'bg-ok',
  pending: 'bg-warn',
  fail: 'bg-block',
  missing: 'border border-block bg-paper-0',
};

export default function AuditBundleModal() {
  const {
    auditBundle,
    closeAuditBundle,
    emitToast,
    lastScanAt,
    now,
    basfDemoInboundEvidence,
  } = useTrust();

  const supplier = useMemo(() => {
    if (!auditBundle?.supplierId) return null;
    const raw = getSupplier(auditBundle.supplierId);
    if (!raw) return null;
    if (raw.id !== 'sup-basf') return raw;
    return applyBasfDemoInboundEvidence(raw, basfDemoInboundEvidence);
  }, [auditBundle, basfDemoInboundEvidence]);

  if (!auditBundle || !supplier) return null;

  return (
    <AuditBundleModalInner
      key={`${auditBundle.supplierId}-${(auditBundle.pillarKeys || []).join('|')}`}
      supplier={supplier}
      pillarKeys={auditBundle.pillarKeys}
      onClose={closeAuditBundle}
      emitToast={emitToast}
      lastScanAt={lastScanAt}
      now={now}
    />
  );
}

function AuditBundleModalInner({ supplier, pillarKeys, onClose, emitToast, lastScanAt, now }) {
  const docsSource = useMemo(() => {
    if (pillarKeys && pillarKeys.length) {
      const out = [];
      for (const k of pillarKeys) {
        out.push(...getDocumentsForPillar(supplier.id, k));
      }
      return out;
    }
    return getDocumentsForSupplier(supplier.id);
  }, [supplier.id, pillarKeys]);

  // Valent's initial pick — every document whose pillar has evidence on file.
  // Held separately from the reactive selection so the attribution sentence
  // stays stable as the operator toggles boxes (the footer carries live count).
  const initialValentPick = useMemo(() => {
    const ids = new Set();
    for (const d of docsSource) {
      const pillarStatus = supplier.pillars[d.pillarKey];
      if (pillarStatus && pillarStatus !== 'missing') ids.add(d.id);
    }
    return ids;
  }, [docsSource, supplier.pillars]);

  const valentPickCount = initialValentPick.size;

  const [selected, setSelected] = useState(initialValentPick);

  // Brand-aware recipient defaulting (Wave 1 of docs/85).
  // Single-brand supplier: prefill `{Brand} QA team`.
  // Multi-brand supplier: leave blank so Sarah picks, placeholder prompts her.
  const brandEntries = useMemo(
    () => getBrandsForSupplier(supplier.id),
    [supplier.id]
  );
  const soleBrand = brandEntries.length === 1 ? brandEntries[0].brand : null;
  const preparedForDefault = soleBrand ? `${soleBrand.name} QA team` : '';
  const preparedForPlaceholder =
    brandEntries.length > 1
      ? `Select brand · ${brandEntries.length} brands use this supplier`
      : '[recipient name]';

  const [preparedFor, setPreparedFor] = useState(preparedForDefault);
  const [note, setNote] = useState('');
  const [noteOpen, setNoteOpen] = useState(false);
  const [preview, setPreview] = useState(null);
  const [emailOpen, setEmailOpen] = useState(false);
  const [downloadFlashed, setDownloadFlashed] = useState(false);
  const [profileId, setProfileId] = useState(DEFAULT_RETAILER_PROFILE_ID);

  const activeProfile = useMemo(() => getRetailerProfile(profileId), [profileId]);
  const isProgramProfile = activeProfile && activeProfile.id !== DEFAULT_RETAILER_PROFILE_ID;
  const requiredPillarSet = useMemo(
    () => new Set(activeProfile?.requiredPillars || []),
    [activeProfile]
  );

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (preview) return; // let preview handle its own Escape
        if (emailOpen) setEmailOpen(false);
        else onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, preview, emailOpen]);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // Ordering: required-for-program pillars first, optional last. Preserves
  // input ordering within each bucket — one source of truth (requiredPillars),
  // no parallel evidenceOrder array.
  const orderedDocs = useMemo(() => {
    if (!isProgramProfile) return docsSource;
    const required = docsSource.filter((d) => requiredPillarSet.has(d.pillarKey));
    const optional = docsSource.filter((d) => !requiredPillarSet.has(d.pillarKey));
    return [...required, ...optional];
  }, [docsSource, isProgramProfile, requiredPillarSet]);

  // Required pillars the retailer program expects but the supplier has no
  // evidence for. Surfaced as a small amber banner above the evidence list
  // so Sarah sees the gap before downloading.
  const missingRequiredPillars = useMemo(() => {
    if (!isProgramProfile) return [];
    const gaps = [];
    for (const key of activeProfile.requiredPillars || []) {
      const status = supplier.pillars[key] || 'missing';
      if (status === 'missing') gaps.push(PILLARS[key]);
    }
    return gaps;
  }, [isProgramProfile, activeProfile, supplier.pillars]);

  const selectedDocs = orderedDocs.filter((d) => selected.has(d.id));
  const passingPillars = PILLAR_LIST.filter(
    (p) => supplier.pillars[p.key] === 'pass'
  ).length;

  const estimatedPages = Math.max(3, 2 + selectedDocs.length);
  const today = new Date().toISOString().slice(0, 10);

  const empty = docsSource.length === 0;
  const hasMissing = PILLAR_LIST.some(
    (p) => (supplier.pillars[p.key] || 'missing') === 'missing'
  );

  const bundleFilename = useMemo(() => {
    const supplierSlug = supplier.name.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    const programSlug = retailerFilenameSlug(activeProfile);
    return `${supplierSlug}-${programSlug}-audit-bundle.pdf`;
  }, [supplier.name, activeProfile]);

  const handleDownload = () => {
    if (empty || selectedDocs.length === 0) return;
    emitToast({
      tone: 'ok',
      title: 'Audit bundle queued',
      body: `${bundleFilename} · ${selectedDocs.length} documents for ${supplier.name} — will email when ready.`,
      supplierId: supplier.id,
    });
    setDownloadFlashed(true);
    setTimeout(() => setDownloadFlashed(false), 1500);
  };

  const handleEmailOpen = () => {
    if (empty || selectedDocs.length === 0) return;
    setEmailOpen(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Audit bundle for ${supplier.name}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex h-full max-h-[760px] w-full max-w-[920px] flex-col overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-md"
      >
        {/* Header */}
        <header className="flex items-start justify-between gap-4 border-b border-paper-200 px-5 py-3">
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">
              Audit bundle
            </div>
            <h2 className="mt-0.5 truncate text-base font-semibold text-ink-900">
              {supplier.name}
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              Generated{' '}
              <span className="font-mono tabular-nums">{today}</span>
              <span className="mx-1.5 text-ink-400">·</span>
              Trust score{' '}
              <span className="font-mono tabular-nums text-ink-700">
                {supplier.trustScore}
              </span>
              <span className="mx-1.5 text-ink-400">·</span>
              Status{' '}
              <span className="font-medium text-ink-700">{toTitle(supplier.status)}</span>
            </p>

            {/* Audit program format selector — per docs/80-feature-retailer-bundle-variants.md */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <label
                htmlFor="audit-program-format"
                className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500"
              >
                Audit program format
              </label>
              <select
                id="audit-program-format"
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
                className="rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-xs font-medium text-ink-900 transition-colors hover:bg-paper-50 focus:border-accent focus:outline-none focus-visible:shadow-focus"
              >
                {RETAILER_PROFILES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span
                className="text-[11px] text-ink-500"
                title={activeProfile?.tooltip || ''}
              >
                Shapes the cover, section order, and footer attestation — not the recipient.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close audit bundle"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-paper-300 bg-paper-0 text-ink-500 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-paper-50 px-6 py-5">
          {hasMissing && !empty ? (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-warn-100 bg-warn-50 px-3 py-2 text-xs text-warn-700">
              <AlertTriangle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0" />
              <span>
                This supplier has evidence gaps. The bundle will reflect current
                status — recipients will see missing pillars as well as what's on file.
              </span>
            </div>
          ) : null}

          {empty ? (
            <EmptyBundle onClose={onClose} />
          ) : (
            <>
              <ProvenanceBreadcrumb
                supplier={supplier}
                selectedCount={selectedDocs.length}
              />
              <CoverPreview
                supplier={supplier}
                preparedFor={preparedFor}
                onPreparedForChange={setPreparedFor}
                preparedForPlaceholder={preparedForPlaceholder}
                includedCount={selectedDocs.length}
                date={today}
                lastScanAt={lastScanAt}
                now={now}
                profile={activeProfile}
              />

              <div className="mt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <ProvenanceChip
                      variant="ranked"
                      title="Valent selected every document whose pillar has evidence on file. Missing pillars are intentionally omitted."
                    />
                    <p className="text-sm text-ink-700">
                      <span className="font-semibold text-ink-900">
                        Valent selected{' '}
                        <span className="font-mono tabular-nums">
                          {valentPickCount}
                        </span>{' '}
                        document{valentPickCount === 1 ? '' : 's'}
                      </span>{' '}
                      across 7 pillars
                      <span className="mx-1.5 text-ink-400">·</span>
                      <span className="text-ink-500">review and confirm.</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (selected.size === docsSource.length) {
                        setSelected(new Set());
                      } else {
                        setSelected(new Set(docsSource.map((d) => d.id)));
                      }
                    }}
                    className="text-xs font-medium text-ink-500 transition-colors hover:text-ink-700 focus:outline-none focus-visible:shadow-focus"
                  >
                    {selected.size === docsSource.length ? 'Uncheck all' : 'Check all'}
                  </button>
                </div>

                {/* Gap banner — required for the selected program but not on file. */}
                {missingRequiredPillars.length > 0 ? (
                  <div className="mt-2 flex items-start gap-2 rounded-md border border-warn-100 bg-warn-50 px-3 py-2 text-xs text-warn-700">
                    <AlertTriangle size={14} strokeWidth={2.25} className="mt-0.5 shrink-0" />
                    <span>
                      Required for {activeProfile.shortName} but not on file:{' '}
                      <span className="font-medium">
                        {missingRequiredPillars.map((p) => p.label).join(', ')}
                      </span>
                      .
                    </span>
                  </div>
                ) : null}

                <div className="mt-2 overflow-hidden rounded-lg border border-paper-300 bg-paper-0">
                  {orderedDocs.map((doc) => {
                    const isRequired =
                      isProgramProfile && requiredPillarSet.has(doc.pillarKey);
                    const isOptional =
                      isProgramProfile && !requiredPillarSet.has(doc.pillarKey);
                    return (
                      <EvidenceCheckRow
                        key={doc.id}
                        doc={doc}
                        checked={selected.has(doc.id)}
                        onToggle={() => toggle(doc.id)}
                        onPreview={() => setPreview(doc)}
                        profile={activeProfile}
                        isRequired={isRequired}
                        isOptional={isOptional}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Add note */}
              <div className="mt-5 overflow-hidden rounded-lg border border-paper-300 bg-paper-0">
                <button
                  type="button"
                  onClick={() => setNoteOpen((o) => !o)}
                  className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
                  aria-expanded={noteOpen}
                >
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-700">
                    <FileText size={14} strokeWidth={2} className="text-ink-500" />
                    Add note to recipient
                    {note && (
                      <span className="rounded-md bg-paper-100 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
                        draft
                      </span>
                    )}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    className={`text-ink-500 transition-transform ${noteOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {noteOpen && (
                  <div className="border-t border-paper-200 px-3 py-3">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={3}
                      placeholder="Appears on page 2 of the bundle. Keep it short — one to three sentences is ideal."
                      className="w-full resize-y rounded-md border border-paper-300 bg-paper-0 px-2.5 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:shadow-focus"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between gap-4 border-t border-paper-200 bg-paper-0 px-5 py-3">
          <div className="text-xs text-ink-500">
            {empty ? (
              <span>No evidence on file for this supplier.</span>
            ) : (
              <>
                <span className="font-mono tabular-nums text-ink-700">
                  {selectedDocs.length}
                </span>{' '}
                documents
                <span className="mx-1.5 text-ink-400">·</span>
                <span className="font-mono tabular-nums text-ink-700">
                  {passingPillars}
                </span>{' '}
                passing pillars
                <span className="mx-1.5 text-ink-400">·</span>
                estimated{' '}
                <span className="font-mono tabular-nums text-ink-700">
                  {estimatedPages}
                </span>
                -page PDF
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleEmailOpen}
              disabled={empty || selectedDocs.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail size={14} strokeWidth={2} />
              Email to recipient
            </button>
            <button
              type="button"
              onClick={handleDownload}
              disabled={empty || selectedDocs.length === 0}
              className="inline-flex items-center gap-1.5 rounded-md bg-ok px-3 py-2 text-sm font-semibold text-paper-0 shadow-sm transition-colors hover:bg-ok-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              {downloadFlashed ? (
                <>
                  <Check size={14} strokeWidth={2.5} />
                  Queued
                </>
              ) : (
                <>
                  <Download size={14} strokeWidth={2.25} />
                  Download PDF
                </>
              )}
            </button>
          </div>
        </footer>
      </div>

      {/* Document preview stacked on top */}
      {preview ? (
        <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      ) : null}

      {/* Email sub-modal */}
      {emailOpen ? (
        <EmailDialog
          supplier={supplier}
          preparedFor={preparedFor}
          selectedCount={selectedDocs.length}
          brandEntries={brandEntries}
          onCancel={() => setEmailOpen(false)}
          onSend={(to) => {
            emitToast({
              tone: 'ok',
              title: 'Audit bundle sent',
              body: `To ${to} · ${selectedDocs.length} documents for ${supplier.name}.`,
              supplierId: supplier.id,
            });
            setEmailOpen(false);
          }}
        />
      ) : null}
    </div>
  );
}

function CoverPreview({ supplier, preparedFor, onPreparedForChange, preparedForPlaceholder, includedCount, date, lastScanAt, now, profile }) {
  const taglineSuffix = profile?.coverTaglineSuffix || '';
  const attestation = profile?.footerAttestation
    ? profile.footerAttestation.replace('{date}', date)
    : null;
  const badge = profile?.badge;
  return (
    <div
      className="relative mx-auto max-w-[760px] rounded-lg border border-paper-300 bg-paper-0 px-10 py-8 shadow-sm"
      style={{ backgroundColor: '#FEFEFB' }}
    >
      {/* Wordmark + retailer program badge (stacked top-right) */}
      <div className="absolute right-6 top-6 flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
          <Sparkles size={12} strokeWidth={2.25} className="text-accent" />
          <span>Valent Trust</span>
        </div>
        {badge ? (
          <span className="rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-ink-700">
            {badge.label}
          </span>
        ) : null}
      </div>

      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-500">
        Compliance packet
      </div>
      <h2 className="mt-2 text-3xl font-semibold text-ink-900">{supplier.name}</h2>

      {/* Prepared-for editable */}
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-xs uppercase tracking-[0.08em] text-ink-500">
          Prepared for
        </span>
        <input
          type="text"
          value={preparedFor}
          onChange={(e) => onPreparedForChange(e.target.value)}
          placeholder={preparedForPlaceholder || '[recipient name]'}
          className="min-w-0 flex-1 border-b border-dashed border-paper-400 bg-transparent px-1 py-0.5 text-sm font-medium text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
        />
      </div>

      {/* Differentiation tagline — per docs/60-positioning.md.
          Program-format profiles append a suffix; they never replace the core tagline. */}
      <p className="mt-1.5 text-[11px] text-ink-500">
        Generated from continuous supplier monitoring · MoCRA §604 / 606 / 607 / 609
        {taglineSuffix ? <span className="ml-1">{taglineSuffix}</span> : null}
      </p>

      {/* Facts grid */}
      <dl className="mt-5 grid grid-cols-4 gap-4 border-y border-paper-200 py-4">
        <Fact label="Generated" value={date} mono />
        <Fact
          label="Trust score"
          value={`${supplier.trustScore} / 100`}
          mono
        />
        <Fact label="Status" value={toTitle(supplier.status)} />
        <Fact label="Documents" value={`${includedCount} included`} />
        <Fact
          label="Facilities"
          value={`${supplier.facilitiesCount}`}
          mono
        />
        <Fact
          label="Active ingredients"
          value={`${supplier.activeIngredientsCount}`}
          mono
        />
        <Fact
          label="Last scan"
          value={lastScanAt && now ? formatRelative(lastScanAt, now) : 'within the hour'}
        />
        <Fact label="Scope" value="All 7 pillars" />
      </dl>

      {/* Pillar strip */}
      <div className="mt-5">
        <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          Pillar status
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PILLAR_LIST.map((p) => {
            const s = supplier.pillars[p.key] || 'missing';
            return (
              <span
                key={p.key}
                className="inline-flex items-center gap-1.5 rounded-md border border-paper-300 bg-paper-50 px-2 py-0.5 text-[11px] font-medium text-ink-700"
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${PILLAR_DOT[s]}`} />
                {p.label}
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-6 border-t border-paper-200 pt-3 text-[11px] text-ink-500">
        {attestation ? (
          <p>{attestation}</p>
        ) : null}
        <p className={attestation ? 'mt-1 text-ink-400' : ''}>
          Continuous compliance monitoring · valent.trust
        </p>
      </div>
    </div>
  );
}

function Fact({ label, value, mono }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </dt>
      <dd
        className={`mt-0.5 text-sm ${mono ? 'font-mono tabular-nums' : ''} text-ink-900`}
      >
        {value}
      </dd>
    </div>
  );
}

function EvidenceCheckRow({ doc, checked, onToggle, onPreview, profile, isRequired, isOptional }) {
  const { now } = useTrust();
  const pillar = PILLARS[doc.pillarKey];
  const extraction = doc.extraction;
  const showProvenance = extraction && extraction.extractedBy === 'valent';
  const shortName = profile?.shortName;
  return (
    <div
      className={`flex items-center gap-3 border-b border-paper-200 px-3 py-2.5 last:border-b-0 ${
        checked ? 'bg-paper-0' : 'bg-paper-50'
      }`}
    >
      <label className="flex shrink-0 cursor-pointer items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="h-4 w-4 cursor-pointer rounded border-paper-400 text-ink-900 accent-ink-900 focus:outline-none focus-visible:shadow-focus"
        />
      </label>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-paper-100 text-ink-500">
        <FileText size={14} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className={`truncate text-sm ${checked ? 'font-medium text-ink-900' : 'text-ink-500'}`}>
          {doc.title}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-500">
          {pillar && <span>{pillar.label}</span>}
          <span className="text-ink-400">·</span>
          <span className="font-mono tabular-nums">{formatRelative(doc.ingestedAt, now)}</span>
          {isRequired && shortName ? (
            <>
              <span className="text-ink-400">·</span>
              <span className="inline-flex items-center rounded-md bg-ok-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-ok-700">
                Required · {shortName}
              </span>
            </>
          ) : null}
          {isOptional && shortName ? (
            <>
              <span className="text-ink-400">·</span>
              <span className="inline-flex items-center rounded-md bg-paper-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-ink-500">
                Optional for {shortName}
              </span>
            </>
          ) : null}
        </div>
      </div>
      {showProvenance && (
        <ProvenanceChip
          variant="extracted"
          confidence={extraction.confidence}
          timestamp={extraction.extractedAt}
          nowMs={now}
          compact
        />
      )}
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Preview ${doc.title}`}
        className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
      >
        <Eye size={11} strokeWidth={2} />
        Preview
      </button>
    </div>
  );
}

function EmailDialog({ supplier, preparedFor, selectedCount, brandEntries = [], onCancel, onSend }) {
  // Recipient resolution order:
  //  1. If preparedFor already looks like an email, use it verbatim.
  //  2. Sole-brand supplier → use that brand's diligenceContact.
  //  3. Multi-brand supplier → match preparedFor prefix to a brand name.
  //  4. Fall back to the supplier's primary contact (legacy behaviour).
  const soleBrand = brandEntries.length === 1 ? brandEntries[0].brand : null;
  const matchedBrand = (() => {
    if (!preparedFor?.trim() || brandEntries.length <= 1) return null;
    const lower = preparedFor.toLowerCase();
    const hit = brandEntries.find(({ brand }) =>
      lower.startsWith(brand.name.toLowerCase())
    );
    return hit ? hit.brand : null;
  })();
  const initialRecipient = (() => {
    if (preparedFor && /@/.test(preparedFor)) return preparedFor.trim();
    if (soleBrand) return soleBrand.diligenceContact;
    if (matchedBrand) return matchedBrand.diligenceContact;
    return supplier.primaryContact?.email || '';
  })();
  const [to, setTo] = useState(initialRecipient);
  const [subject, setSubject] = useState(
    `Compliance packet — ${supplier.name}`
  );
  const [body, setBody] = useState(
    `Hi ${preparedFor || 'team'},\n\nAttached is the Valent Trust compliance packet for ${supplier.name}. ${selectedCount} documents are included. Let me know if you need anything else.\n\n— Sarah`
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Email audit bundle"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/50 p-6"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex w-full max-w-[560px] flex-col overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-md"
      >
        <header className="flex items-center justify-between border-b border-paper-200 px-5 py-3">
          <div className="text-sm font-semibold text-ink-900">Email audit bundle</div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close email dialog"
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-paper-300 bg-paper-0 text-ink-500 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </header>
        <div className="space-y-3 px-5 py-4">
          <Field label="To">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:shadow-focus"
              placeholder="recipient@example.com"
            />
          </Field>
          <Field label="Subject">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1.5 text-sm text-ink-900 focus:border-accent focus:outline-none focus:shadow-focus"
            />
          </Field>
          <Field label="Body">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-md border border-paper-300 bg-paper-0 px-2.5 py-2 text-sm text-ink-900 focus:border-accent focus:outline-none focus:shadow-focus"
            />
          </Field>
          <p className="text-[11px] text-ink-500">
            Your bundle will be attached as a PDF.
          </p>
        </div>
        <footer className="flex items-center justify-end gap-2 border-t border-paper-200 px-5 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend(to || '(no recipient)')}
            disabled={!to.trim()}
            className="inline-flex items-center gap-1.5 rounded-md bg-ok px-3 py-1.5 text-sm font-semibold text-paper-0 shadow-sm transition-colors hover:bg-ok-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Mail size={14} strokeWidth={2.25} />
            Send
          </button>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function EmptyBundle({ onClose }) {
  const { navigate } = useTrust();
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-100 text-ink-500">
        <Inbox size={18} strokeWidth={2} />
      </span>
      <div className="text-sm font-semibold text-ink-900">Nothing to bundle yet</div>
      <p className="max-w-[360px] text-xs text-ink-500">
        No evidence has been ingested for this supplier. Set up ingestion to start
        collecting documents.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            navigate('ingest');
            onClose();
          }}
          className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          Set up ingestion
        </button>
      </div>
    </div>
  );
}

function toTitle(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function guessEmail(preparedFor) {
  // Lightweight heuristic for the demo — if the preparedFor string looks like
  // an email, pass it through; otherwise return empty so the operator fills it.
  if (/@/.test(preparedFor)) return preparedFor.trim();
  return '';
}

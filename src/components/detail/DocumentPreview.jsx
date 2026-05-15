import React, { useEffect, useState } from 'react';
import {
  X,
  FileText,
  FileCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  RotateCw,
  Ban,
  Undo2,
  Mail,
} from 'lucide-react';
import { PERSONAS } from '../../data/personas.js';
import { PILLARS } from '../../data/trustPillars.js';
import { getSupplier } from '../../data/suppliers.js';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';

// Review-control copy — kept in one place so the audit trail, toasts and
// undo banner all speak the same language.
const REVIEW_ACTION_META = {
  'approve-link': {
    label: 'Approved & linked',
    verb: 'approved',
    tone: 'ok',
    toastTitle: 'Extraction approved',
  },
  reject: {
    label: 'Rejected',
    verb: 'rejected',
    tone: 'block',
    toastTitle: 'Extraction rejected',
  },
  'request-reextraction': {
    label: 'Re-extraction requested',
    verb: 'routed for re-extraction',
    tone: 'warn',
    toastTitle: 'Re-extraction requested',
  },
};

// DocumentPreview — full-screen overlay modal.
// Two-pane layout: persona-tinted paper on the left, evidence-captured panel
// on the right. Closes on backdrop click or Escape.
//
// This component deliberately simulates a document + extraction view without
// loading a real PDF. The paper surface applies persona visual tokens (tint,
// grain, watermark, annotation) so the operator sees an accurate stand-in for
// how messy the real artifact looks. The captured-fields panel shows what the
// scan engine pulled out.

const SOURCE_PHRASE = {
  email: 'email',
  sharepoint: 'SharePoint',
  sftp: 'SFTP drop',
  manual: 'manual upload',
};

const CONFIDENCE_DESC = {
  high: 'Born-digital extraction path. All fields captured with high confidence.',
  medium: 'Scan-world extraction path. Most fields captured; a few flagged for review.',
  low: 'Degraded source quality. Several fields captured at low confidence; manual review recommended.',
};

export default function DocumentPreview({ doc, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const {
    now,
    documentReviews,
    emitDocumentReview,
    clearDocumentReview,
    emitToast,
    openChaseDraft,
  } = useTrust();
  if (!doc) return null;

  const persona = PERSONAS[doc.persona] || PERSONAS['clean-digital'];
  const pillar = PILLARS[doc.pillarKey];
  const supplier = getSupplier(doc.supplierId);
  const captured = buildCapturedFields(doc, supplier, pillar);
  const review = documentReviews ? documentReviews.get(doc.id) : null;
  const isReviewable =
    doc.linkStatus === 'needs-review' || doc.linkStatus === 'failed';
  const canActOnGap =
    Boolean(supplier) &&
    ((doc.flags && doc.flags.length > 0) || Boolean(doc.summary?.gap));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Document preview · ${doc.title}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-6"
      onClick={onClose}
    >
      <div
        role="document"
        onClick={(e) => e.stopPropagation()}
        className="relative grid h-full max-h-[780px] w-full max-w-[1100px] grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)] overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-md"
      >
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close preview"
          className="absolute right-3 top-3 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-paper-300 bg-paper-0 text-ink-500 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Left: persona paper surface */}
        <PersonaPaper doc={doc} persona={persona} supplier={supplier} pillar={pillar} />

        {/* Right: captured-by-scan panel */}
        <aside className="flex min-h-0 flex-col border-l border-paper-300 bg-paper-50">
          <header className="flex items-center gap-2.5 border-b border-accent/30 bg-accent/10 px-5 py-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-paper-0 shadow-sm">
              <Sparkles size={15} strokeWidth={2.25} />
            </span>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-700">
                Evidence captured
              </div>
              <div className="text-sm font-medium text-ink-900">
                {pillar ? pillar.label : 'Unassigned pillar'}
                {pillar && pillar.anchor ? (
                  <span className="ml-1 font-normal text-ink-500">· {pillar.anchor}</span>
                ) : null}
              </div>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
            <AgentSummaryBlock doc={doc} />

            {canActOnGap ? (
              <ActOnGapRow
                doc={doc}
                supplier={supplier}
                onChase={() => {
                  const title = (
                    (doc.flags && doc.flags[0]) ||
                    (doc.summary && doc.summary.nextStep) ||
                    'Evidence gap'
                  ).slice(0, 140);
                  openChaseDraft({
                    supplierId: doc.supplierId,
                    pillarKey: doc.pillarKey,
                    title,
                  });
                  onClose();
                }}
              />
            ) : null}

            {doc.flags && doc.flags.length > 0 ? (
              <div className="mb-4 rounded-lg border border-block-100 bg-block-50 px-3 py-2.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-block-700">
                  <AlertTriangle size={12} strokeWidth={2.25} />
                  <span>Flags</span>
                </div>
                <ul className="mt-1.5 space-y-0.5 text-xs text-block-700">
                  {doc.flags.map((flag, idx) => (
                    <li key={idx}>· {flag}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {isReviewable ? (
              <ReviewControls
                doc={doc}
                review={review}
                now={now}
                allowApprove={doc.linkStatus !== 'failed'}
                onReview={(action, note) => {
                  emitDocumentReview(doc.id, action, note);
                  const meta = REVIEW_ACTION_META[action];
                  if (meta) {
                    emitToast({
                      tone:
                        meta.tone === 'block'
                          ? 'warn'
                          : meta.tone === 'warn'
                            ? 'warn'
                            : 'ok',
                      title: meta.toastTitle,
                      body: `Sent feedback to Valent · ${doc.title}`,
                    });
                  }
                }}
                onUndo={() => {
                  clearDocumentReview(doc.id);
                  emitToast({
                    tone: 'info',
                    title: 'Review cleared',
                    body: `Re-opened ${doc.title} for review.`,
                  });
                }}
              />
            ) : null}

            <p className="mb-3 mt-4 text-xs text-ink-500">
              {CONFIDENCE_DESC[doc.extractionConfidence] || CONFIDENCE_DESC.medium}
            </p>

            <dl className="space-y-3">
              {captured.map((field) => (
                <CapturedField key={field.label} field={field} />
              ))}
            </dl>
          </div>

          <footer className="border-t border-paper-300 bg-paper-0 px-5 py-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              Source
            </div>
            <div className="mt-0.5 text-xs text-ink-700">
              {SOURCE_PHRASE[doc.source] || doc.source}
              <span className="mx-1 text-ink-400">·</span>
              <span className="font-mono tabular-nums">{formatRelative(doc.ingestedAt, now)}</span>
            </div>
            <div className="mt-0.5 truncate font-mono text-[11px] text-ink-500">
              {doc.sourceDetail}
            </div>
          </footer>
        </aside>
      </div>
    </div>
  );
}

function PersonaPaper({ doc, persona, supplier, pillar }) {
  const [assetFailed, setAssetFailed] = useState(false);
  const visual = persona.visual || {};
  const paperBg = {
    'paper-0': '#FFFFFF',
    'paper-50': '#F8F9FB',
    'paper-100': '#F1F3F7',
  }[visual.paperTint] || '#FFFFFF';
  const showPreviewImage = doc.previewImage && !assetFailed;

  return (
    <div className="relative flex min-h-0 flex-col bg-paper-100 p-6">
      {/* Persona header chip */}
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[11px] font-medium text-ink-500">
          <FileText size={11} strokeWidth={2.25} />
          <span>{doc.fileType?.toUpperCase() || 'PDF'}</span>
          {doc.pages ? (
            <span className="font-mono tabular-nums">· {doc.pages}pp</span>
          ) : null}
        </span>
        <span className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[11px] font-medium text-ink-500">
          Persona · {persona.label}
        </span>
      </div>

      {/* Paper surface */}
      <div
        className="relative flex-1 overflow-hidden rounded-lg border border-paper-300 shadow-sm"
        style={{ backgroundColor: paperBg }}
      >
        {showPreviewImage ? (
          <div className="relative h-full overflow-auto bg-paper-100 px-6 py-6">
            <img
              src={doc.previewImage}
              alt={`${doc.title} preview`}
              className="mx-auto block max-h-none w-full max-w-[640px] rounded-sm bg-paper-0 shadow-md"
              loading="eager"
              onError={() => setAssetFailed(true)}
            />
          </div>
        ) : (
          <>
            <GrainOverlay grain={visual.grain} />
            <WatermarkOverlay watermark={visual.watermark} />

            <div className="relative h-full overflow-y-auto px-10 py-10">
              <div className="mx-auto max-w-[560px]">
                <div className="mb-6 border-b border-paper-300 pb-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-500">
                    {supplier ? supplier.name : 'Unknown supplier'}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold text-ink-900">{doc.title}</h3>
                  {pillar ? (
                    <p className="mt-1 text-xs text-ink-500">
                      {pillar.fullLabel}
                    </p>
                  ) : null}
                </div>

                <MockDocumentBody doc={doc} pillar={pillar} supplier={supplier} />

                {visual.annotation === 'pen-blue' ? (
                  <p
                    className="mt-6 text-sm"
                    style={{
                      color: '#1E3A8A',
                      fontFamily: '"Caveat", "Comic Sans MS", cursive',
                      transform: 'rotate(-1.5deg)',
                    }}
                  >
                    ✓ reviewed – DH, 2026-03
                  </p>
                ) : null}

                {visual.annotation === 'redaction-bars' ? (
                  <div className="mt-6 space-y-1">
                    <span className="block h-3 w-40 bg-ink-900" />
                    <span className="block h-3 w-64 bg-ink-900" />
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function GrainOverlay({ grain }) {
  if (!grain || grain === 'none') return null;
  const opacity = grain === 'heavy' ? 0.14 : grain === 'banded' ? 0.1 : 0.06;
  const bgImage =
    grain === 'banded'
      ? 'repeating-linear-gradient(0deg, rgba(11,18,32,0.22) 0px, rgba(11,18,32,0.22) 1px, transparent 1px, transparent 5px)'
      : 'radial-gradient(circle at 20% 10%, rgba(11,18,32,0.18) 0, transparent 40%), radial-gradient(circle at 80% 30%, rgba(11,18,32,0.12) 0, transparent 35%), radial-gradient(circle at 50% 85%, rgba(11,18,32,0.15) 0, transparent 40%)';
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{ backgroundImage: bgImage, opacity }}
    />
  );
}

function WatermarkOverlay({ watermark }) {
  if (!watermark || watermark === 'none') return null;
  if (watermark === 'fax-header') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 right-0 top-0 border-b border-paper-300 bg-paper-50 px-4 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-500"
      >
        FAX · 2026-03-30 07:22 · 3 pages received
      </div>
    );
  }
  if (watermark === 'streaks') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(11,18,32,0.05) 0 2px, transparent 2px 60px)',
        }}
      />
    );
  }
  return null;
}

function MockDocumentBody({ doc, pillar, supplier }) {
  // Don't try to hallucinate the real content of a document. Show a simple
  // structured mock that echoes the metadata we actually have, so the preview
  // feels tangible without lying about extracted text.
  const lines = [];
  if (pillar) lines.push({ label: 'Document type', value: pillar.fullLabel });
  if (supplier) lines.push({ label: 'Supplier', value: supplier.name });
  if (doc.validityEndsAt) {
    lines.push({
      label: 'Validity window',
      value: `through ${doc.validityEndsAt.slice(0, 10)}`,
    });
  }
  lines.push({ label: 'File type', value: doc.fileType?.toUpperCase() || 'PDF' });
  if (doc.pages) lines.push({ label: 'Pages', value: `${doc.pages}` });

  return (
    <div className="space-y-3 text-sm">
      <p className="text-ink-700">
        This is a visual stand-in for the captured document. The real artifact is
        rendered in the operator's file system; Valent Trust's extraction engine
        reads it in place and surfaces the captured fields at right.
      </p>
      <dl className="grid grid-cols-[140px_1fr] gap-x-6 gap-y-2 border-t border-paper-300 pt-3">
        {lines.map((ln) => (
          <React.Fragment key={ln.label}>
            <dt className="text-xs text-ink-500">{ln.label}</dt>
            <dd className="text-sm text-ink-900">{ln.value}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

function CapturedField({ field }) {
  // Accent treatment for "good" captures — a fielded chip that extracted
  // cleanly gets the Valent-brand wash. Warn/block/info stay on neutral paper.
  const tone = field.tone || 'info';
  const statusIcon = {
    ok: { Icon: FileCheck, className: 'text-accent-ink' },
    warn: { Icon: AlertTriangle, className: 'text-warn-700' },
    block: { Icon: AlertTriangle, className: 'text-block-700' },
    info: { Icon: FileText, className: 'text-ink-500' },
  }[tone];

  const cardClass =
    tone === 'ok'
      ? 'rounded-md border border-accent/40 bg-accent/5 px-3 py-2'
      : 'rounded-md border border-paper-300 bg-paper-0 px-3 py-2';
  const labelClass =
    tone === 'ok'
      ? 'text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink'
      : 'text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500';

  const Icon = statusIcon.Icon;
  return (
    <div className={cardClass}>
      <div className="flex items-center justify-between">
        <dt className={labelClass}>
          {field.label}
        </dt>
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${statusIcon.className}`}>
          <Icon size={11} strokeWidth={2.25} />
          {field.confidence || 'captured'}
        </span>
      </div>
      <dd className="mt-1 text-sm text-ink-900">{field.value}</dd>
      {field.note ? (
        <p className="mt-0.5 text-[11px] text-ink-500">{field.note}</p>
      ) : null}
    </div>
  );
}

function AgentSummaryBlock({ doc }) {
  // Agent summary — the "Summarized by Valent" synthesis of what the document
  // establishes, what's missing, and what to do next. Rendered above the
  // captured-fields list so the operator reads the agent's take first.
  // Falls back gracefully when the doc hasn't been summarized yet.
  const summary = doc.summary;
  if (!summary) {
    return (
      <div className="mb-4 rounded-md border border-dashed border-paper-300 bg-paper-50 px-3 py-2.5 text-[11px] text-ink-500">
        <div className="flex items-center gap-1.5">
          <Sparkles size={11} strokeWidth={2.25} className="text-ink-400" />
          <span>Agent summary not yet available for this document.</span>
        </div>
      </div>
    );
  }
  return (
    <div className="mb-4 rounded-md border border-paper-300 bg-paper-0 px-3 py-2.5">
      <SummaryRow label="Contents" value={summary.contents} tone="info" />
      {summary.gap ? (
        <SummaryRow label="Gap" value={summary.gap} tone="warn" />
      ) : (
        <SummaryRow label="Gap" value="No compliance gap identified." tone="ok" />
      )}
      <SummaryRow
        label="Suggested next step"
        value={summary.nextStep}
        tone="info"
        last
      />
    </div>
  );
}

// ActOnGapRow — primary "do something about the gap" affordance on a doc
// that has flags or an agent-suggested next step. Opens the ChaseDraftModal
// with the supplier context synthesized from the doc — bypasses the normal
// flag-ID path so we can chase even when the pillar itself is green but the
// doc has a partial-refresh or low-confidence flag.
//
// Hero button on a gapped doc; absent on clean docs by design.
function ActOnGapRow({ doc, supplier, onChase }) {
  const contact = supplier && supplier.primaryContact ? supplier.primaryContact : null;
  const firstName = contact && contact.name ? contact.name.trim().split(/\s+/)[0] : null;
  const label = firstName ? `Draft chase to ${firstName}` : 'Draft chase email';
  return (
    <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 px-3 py-2.5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-accent-ink">
        <Sparkles size={11} strokeWidth={2.25} />
        Act on this gap
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <button
          type="button"
          onClick={onChase}
          className="inline-flex items-center gap-1.5 rounded-md bg-accent-ink px-3 py-1.5 text-xs font-semibold text-paper-0 shadow-sm transition-colors hover:brightness-110 focus:outline-none focus-visible:shadow-focus"
        >
          <Mail size={12} strokeWidth={2.25} />
          {label}
        </button>
        {contact && contact.email ? (
          <span className="truncate font-mono text-[11px] text-ink-500">
            {contact.email}
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, tone, last }) {
  const labelColor =
    tone === 'warn'
      ? 'text-warn-700'
      : tone === 'ok'
      ? 'text-ok-700'
      : 'text-ink-500';
  return (
    <div className={last ? '' : 'mb-1.5'}>
      <div
        className={`text-[10px] font-semibold uppercase tracking-[0.08em] ${labelColor}`}
      >
        {label}
      </div>
      <p className="mt-0.5 text-[12px] leading-snug text-ink-700">{value}</p>
    </div>
  );
}

function ReviewControls({ doc, review, now, allowApprove = true, onReview, onUndo }) {
  const [mode, setMode] = useState(null); // null | 'reject' | 'request-reextraction'
  const [note, setNote] = useState('');

  // Already-reviewed state — show the audit stamp with an Undo affordance.
  if (review) {
    const meta = REVIEW_ACTION_META[review.action];
    const toneClasses =
      meta && meta.tone === 'ok'
        ? 'border-ok-100 bg-ok-50 text-ok-700'
        : meta && meta.tone === 'block'
        ? 'border-block-100 bg-block-50 text-block-700'
        : 'border-warn-100 bg-warn-50 text-warn-700';
    const Icon =
      meta && meta.tone === 'ok'
        ? CheckCircle2
        : meta && meta.tone === 'block'
        ? Ban
        : RotateCw;
    return (
      <div className={`mt-5 rounded-lg border px-3 py-2.5 ${toneClasses}`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <Icon size={12} strokeWidth={2.25} />
            <span>{meta ? meta.label : 'Reviewed'}</span>
          </div>
          <button
            type="button"
            onClick={onUndo}
            className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            <Undo2 size={11} strokeWidth={2} />
            Undo
          </button>
        </div>
        <div className="mt-1 text-[11px] leading-snug">
          {review.reviewedBy} · {formatRelative(review.reviewedAt, now)}
          {review.note ? <span> — &ldquo;{review.note}&rdquo;</span> : null}
        </div>
      </div>
    );
  }

  // Note-entry state for reject / re-extract actions.
  if (mode) {
    const meta = REVIEW_ACTION_META[mode];
    return (
      <div className="mt-5 rounded-lg border border-paper-300 bg-paper-0 px-3 py-3">
        <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {meta.label} — add a note
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder={
            mode === 'reject'
              ? 'Why is this extraction wrong? (optional)'
              : 'What should Valent look at on re-extraction? (optional)'
          }
          className="w-full rounded-md border border-paper-300 bg-paper-50 px-2 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:shadow-focus"
        />
        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setMode(null);
              setNote('');
            }}
            className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onReview(mode, note);
              setMode(null);
              setNote('');
            }}
            className="inline-flex items-center rounded-md border border-ink-900 bg-ink-900 px-2.5 py-1 text-xs font-semibold text-paper-0 transition-colors hover:bg-ink-800 focus:outline-none focus-visible:shadow-focus"
          >
            Send feedback
          </button>
        </div>
      </div>
    );
  }

  // Default state — three-button review bar. Ingest docs that land here are
  // still awaiting operator judgment; the primary action is Approve & link.
  return (
    <div className="mt-5 rounded-lg border border-paper-300 bg-paper-0 px-3 py-2.5">
      <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        <Sparkles size={11} strokeWidth={2.25} className="text-accent" />
        Review required
      </div>
      <p className="mb-2.5 text-[11px] leading-snug text-ink-500">
        Confirm the extracted fields or send the document back for correction.
      </p>
      <div className="flex flex-wrap gap-2">
        {allowApprove ? (
          <button
            type="button"
            onClick={() => onReview('approve-link', '')}
            className="inline-flex items-center gap-1 rounded-md border border-ink-900 bg-ink-900 px-2.5 py-1 text-xs font-semibold text-paper-0 transition-colors hover:bg-ink-800 focus:outline-none focus-visible:shadow-focus"
          >
            <CheckCircle2 size={12} strokeWidth={2.25} />
            Approve &amp; link
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setMode('request-reextraction')}
          className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          <RotateCw size={12} strokeWidth={2} />
          Request re-extraction
        </button>
        <button
          type="button"
          onClick={() => setMode('reject')}
          className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1 text-xs font-medium text-block-700 transition-colors hover:bg-block-50 focus:outline-none focus-visible:shadow-focus"
        >
          <Ban size={12} strokeWidth={2} />
          Reject
        </button>
      </div>
    </div>
  );
}

function buildCapturedFields(doc, supplier, pillar) {
  const fields = [];
  // Supplier identity match
  fields.push({
    label: 'Supplier match',
    value: supplier ? supplier.name : 'unknown',
    confidence: supplier ? 'exact' : 'unmatched',
    tone: supplier ? 'ok' : 'block',
  });
  // Document type / pillar
  fields.push({
    label: 'Document type',
    value: pillar ? pillar.label : 'unclassified',
    confidence: doc.extractionConfidence || 'medium',
    tone:
      doc.extractionConfidence === 'low'
        ? 'warn'
        : doc.extractionConfidence === 'high'
        ? 'ok'
        : 'info',
  });
  // Validity
  if (doc.validityEndsAt) {
    const ends = doc.validityEndsAt.slice(0, 10);
    fields.push({
      label: 'Validity through',
      value: ends,
      confidence: doc.extractionConfidence || 'medium',
      tone: 'info',
    });
  }
  // Pages / file type
  fields.push({
    label: 'Format',
    value: `${doc.fileType?.toUpperCase() || 'PDF'}${doc.pages ? ` · ${doc.pages}pp` : ''}`,
    confidence: 'structural',
    tone: 'info',
  });
  // Ingested
  fields.push({
    label: 'Ingested',
    value: doc.ingestedAt.slice(0, 10),
    confidence: 'recorded',
    tone: 'info',
  });
  return fields;
}

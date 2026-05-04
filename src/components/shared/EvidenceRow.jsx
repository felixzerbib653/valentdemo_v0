import React from 'react';
import { FileText, Image as ImageIcon, Mail, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import { PILLARS } from '../../data/trustPillars.js';
import ChaseSendStatus from './ChaseSendStatus.jsx';

// EvidenceRow — single-line representation of one document.
// Per docs/20-design-system.md §Core components.
//
// File-type icon · title + metadata · flags · extraction score · click to preview.
// Kept deliberately simple — the row is a scannable line, the preview modal
// holds the detail.
//
// The right-side "Score" token promotes the raw extraction percentage that
// lived previously inside the Valent provenance chip. The chip was attribution
// (who extracted this, how confidently); the score is the headline number an
// operator reads first — blue on ≥ 80, amber below. Manual-source documents
// render no score — a human's upload is the default trust baseline.

// Score threshold — ≥ SCORE_GOOD reads as blue (Valent confident capture);
// below reads as amber (review recommended). Matches the bucket cutoff:
// EXTRACTION_BASE_BY_BUCKET.high = 92, .medium = 76, .low = 63.
const SCORE_GOOD = 80;

const FILE_ICONS = {
  pdf: FileText,
  image: ImageIcon,
  email: Mail,
};

const SOURCE_LABEL = {
  email: 'from email',
  sharepoint: 'from SharePoint',
  sftp: 'from SFTP',
  manual: 'uploaded',
};

export default function EvidenceRow({
  doc,
  onOpen,
  showPillarTag = false,
  demoEvidenceVerified = false,
  chaseSendEvent = null,
}) {
  const { now } = useTrust();
  const FileIcon = FILE_ICONS[doc.fileType] || FileText;
  const pillar = PILLARS[doc.pillarKey];
  const extraction = doc.extraction;
  const showScore =
    extraction &&
    extraction.extractedBy === 'valent' &&
    typeof extraction.confidence === 'number';
  const scoreGood = showScore && extraction.confidence >= SCORE_GOOD;

  const sourcePhrase = SOURCE_LABEL[doc.source] || doc.source;

  const handleClick = () => {
    if (typeof onOpen === 'function') onOpen(doc);
  };
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKey}
      className="group flex cursor-pointer items-center gap-4 border-b border-paper-200 bg-paper-0 px-4 py-3 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:bg-paper-50 focus-visible:shadow-focus"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-paper-100 text-ink-500">
        <FileIcon size={16} strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink-900">{doc.title}</div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-500">
          <span className="whitespace-nowrap">{sourcePhrase}</span>
          <span className="text-ink-400">·</span>
          <span className="whitespace-nowrap font-mono tabular-nums">{formatRelative(doc.ingestedAt, now)}</span>
          {doc.pages ? (
            <>
              <span className="text-ink-400">·</span>
              <span className="whitespace-nowrap font-mono tabular-nums">{doc.pages}pp</span>
            </>
          ) : null}
          {showPillarTag && pillar ? (
            <>
              <span className="text-ink-400">·</span>
              <span className="whitespace-nowrap">{pillar.label}</span>
            </>
          ) : null}
        </div>
        {/* Flags — live inside the middle column so they don't compete with
            the provenance chip for horizontal width. The EvidencePanel column
            is ~576px on the supplier detail page; a separate flags column
            squeezed the middle row down to zero width and forced aggressive
            wrapping of the metadata line. */}
        {doc.flags && doc.flags.length > 0 && (
          <div className="mt-1 flex flex-wrap items-center gap-1">
            {doc.flags.slice(0, 2).map((flag, idx) => (
              <span
                key={idx}
                className="inline-flex max-w-full items-center gap-1 rounded-md border border-block-100 bg-block-50 px-1.5 py-0.5 text-[11px] font-medium text-block-700"
              >
                <AlertTriangle size={11} strokeWidth={2.25} className="shrink-0" />
                <span className="truncate">{flag}</span>
              </span>
            ))}
            {doc.flags.length > 2 && (
              <span className="rounded-md border border-paper-300 bg-paper-50 px-1.5 py-0.5 text-[11px] font-medium text-ink-500">
                +{doc.flags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {(chaseSendEvent || demoEvidenceVerified || showScore) && (
      <div className="flex shrink-0 items-center gap-2">
        {chaseSendEvent ? (
          <ChaseSendStatus event={chaseSendEvent} compact />
        ) : null}
        {demoEvidenceVerified && (
          <span
            className="flex shrink-0 items-center gap-1 rounded-md border border-ok-100 bg-ok-50 px-2 py-1 text-[11px] font-semibold text-ok-700"
            title="Updated evidence received"
          >
            <CheckCircle size={14} strokeWidth={2.25} className="shrink-0" />
            Verified
          </span>
        )}
        {showScore && (
          <div className="flex shrink-0 flex-col items-end leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              Score
            </span>
            <span
              className={`mt-0.5 font-mono text-lg font-semibold tabular-nums ${
                scoreGood ? 'text-accent-ink' : 'text-warn-700'
              }`}
            >
              {extraction.confidence}
            </span>
          </div>
        )}
      </div>
      )}
    </div>
  );
}

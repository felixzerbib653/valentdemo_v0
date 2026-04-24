import React from 'react';
import { formatRelative } from '../../context/TrustContext.jsx';

// ProvenanceChip — the "agent did this" attribution primitive.
// Per docs/70-agentic-surfaces.md §ProvenanceChip variants.
//
// Five variants:
//   extracted  — field lifted from a source document
//     e.g. "Extracted by Valent · 94% · 3d ago"
//   computed   — derived calculation (trust score, rankings)
//     e.g. "Computed by Valent · 2m ago"
//   drafted    — copy generated for operator review
//     e.g. "Drafted by Valent"
//   ranked     — selection among candidates
//     e.g. "Valent selected"
//   summarized — agent-authored synthesis of a document
//     e.g. "Summarized by Valent"
//
// Visual contract:
//   - Paper-100 surface, hairline border, mono font for the numeric meta.
//   - A small cyan pulse dot on the left marks the agent attribution. This is
//     the one place accent cyan is allowed to encode identity (per design
//     system: accent is a marker, never a data encoding).
//   - Low-confidence chips (<75%) get an amber tint to signal the HITL
//     review bar. At or above 75% stays quiet paper.
//
// Never use this component to attribute work a human did — manual uploads,
// hand-resolved flags, operator edits. Those render with no chip at all.

const LABEL = {
  extracted: 'Extracted by Valent',
  computed: 'Computed by Valent',
  drafted: 'Drafted by Valent',
  ranked: 'Valent selected',
  summarized: 'Summarized by Valent',
};

// Confidence threshold — below this we tint amber to flag to the operator
// that this field should be double-checked before relying on it. Matches the
// HITL "auto-staged" cutoff in docs/70-agentic-surfaces.md.
const CONFIDENCE_REVIEW_FLOOR = 75;

function toneClasses(tone) {
  if (tone === 'warn') {
    return 'bg-warn-50 border-warn-100 text-warn-700';
  }
  return 'bg-paper-100 border-paper-300 text-ink-700';
}

function DotPulse({ tone }) {
  const dotColor = tone === 'warn' ? 'bg-warn' : 'bg-accent';
  const pulseColor = tone === 'warn' ? 'bg-warn' : 'bg-accent';
  return (
    <span
      aria-hidden="true"
      className="relative mr-0.5 inline-flex h-1.5 w-1.5 shrink-0 items-center justify-center"
    >
      <span
        className={`absolute inline-flex h-full w-full animate-pulse-soft rounded-full ${pulseColor} opacity-60`}
      />
      <span
        className={`relative inline-flex h-1.5 w-1.5 rounded-full ${dotColor}`}
      />
    </span>
  );
}

export default function ProvenanceChip({
  variant = 'extracted',
  confidence = null,
  timestamp = null,
  nowMs = null,
  compact = false,
  className = '',
  title,
}) {
  const label = LABEL[variant] || LABEL.extracted;

  const hasConfidence =
    typeof confidence === 'number' && Number.isFinite(confidence);
  const needsReview = hasConfidence && confidence < CONFIDENCE_REVIEW_FLOOR;
  const tone = needsReview ? 'warn' : 'default';

  const ago = timestamp && nowMs ? formatRelative(timestamp, nowMs) : null;

  const metaParts = [];
  if (hasConfidence && !compact) {
    metaParts.push(`${Math.round(confidence)}%`);
  }
  if (ago && !compact) {
    metaParts.push(ago);
  }

  const tooltip =
    title ||
    [
      label,
      hasConfidence ? `confidence ${Math.round(confidence)}%` : null,
      ago ? `as of ${ago}` : null,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <span
      title={tooltip}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-md border px-1.5 py-0.5 text-[10.5px] leading-none ${toneClasses(tone)} ${className}`}
    >
      <DotPulse tone={tone} />
      <span className="truncate">
        <span className="font-medium">{label}</span>
        {metaParts.length > 0 && (
          <span
            className={`ml-1 font-mono tabular-nums ${tone === 'warn' ? 'text-warn-700' : 'text-ink-500'}`}
          >
            · {metaParts.join(' · ')}
          </span>
        )}
      </span>
    </span>
  );
}

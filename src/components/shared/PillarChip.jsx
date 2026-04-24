import React from 'react';
import { PILLARS } from '../../data/trustPillars.js';

// PillarChip — 6px status dot + pillar short label.
// Per docs/20-design-system.md §Core components + docs/01-screen-trust-grid.md §Row anatomy.
//
// Four pillar statuses: pass / pending / fail / missing.
// - pass    — ink-500 dot (desaturated; success is the quiet default)
// - pending — amber filled dot
// - fail    — red filled dot
// - missing — outlined empty red ring
//
// The chip itself sits on paper-100 with a hairline border. Fail / missing
// chips get a subtle red tint to pull the eye when scanning a row. Pending
// chips get an amber tint. Pass chips stay visually quiet.

const DOT = {
  pass: {
    className: 'bg-ink-500',
    outlined: false,
  },
  pending: {
    className: 'bg-warn',
    outlined: false,
  },
  fail: {
    className: 'bg-block',
    outlined: false,
  },
  missing: {
    className: 'border border-block bg-paper-0',
    outlined: true,
  },
};

const CHIP_TONE = {
  pass: 'bg-paper-100 border-paper-300 text-ink-700',
  pending: 'bg-warn-50 border-warn-100 text-warn-700',
  fail: 'bg-block-50 border-block-100 text-block-700',
  missing: 'bg-block-50 border-block-100 text-block-700',
};

export default function PillarChip({
  pillarKey,
  status = 'pass',
  label,
  showStatusText = false,
  className = '',
  onClick,
  title,
}) {
  const pillar = PILLARS[pillarKey];
  const text = label || (pillar ? pillar.shortLabel : pillarKey);
  const tone = CHIP_TONE[status] || CHIP_TONE.pass;
  const dot = DOT[status] || DOT.pass;

  const tooltip =
    title ||
    (pillar
      ? `${pillar.label}${pillar.anchor ? ` · ${pillar.anchor}` : ''} — ${status}`
      : `${text} — ${status}`);

  const interactive = typeof onClick === 'function';

  const classes = `inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium ${tone} ${
    interactive ? 'transition-colors hover:brightness-[0.97] focus:outline-none focus-visible:shadow-focus' : ''
  } ${className}`;

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dot.className}`}
      />
      <span className="whitespace-nowrap">{text}</span>
      {showStatusText && (
        <span className="font-normal text-ink-500">· {statusWord(status)}</span>
      )}
    </>
  );

  if (interactive) {
    return (
      <button type="button" onClick={onClick} title={tooltip} className={classes}>
        {content}
      </button>
    );
  }
  return (
    <span title={tooltip} className={classes}>
      {content}
    </span>
  );
}

function statusWord(status) {
  switch (status) {
    case 'pass':
      return 'on file';
    case 'pending':
      return 'pending';
    case 'fail':
      return 'failed';
    case 'missing':
      return 'missing';
    default:
      return status;
  }
}

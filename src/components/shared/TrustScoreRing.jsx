import React from 'react';

// TrustScoreRing — circular progress ring with center number.
// Per docs/20-design-system.md §Core components.
//
// Size variants: sm 32px (trust grid rows), md 56px, lg 96px (supplier detail hero).
// Color: ok at ≥80, warn at 60–79, block at <60. Onboarding (no score yet) draws
// a muted dashed ring with an em-dash in the middle.
//
// Keep this component pure — it takes a score and status and renders the ring.
// It does not derive status itself; callers pass an explicit status so rows,
// detail headers, and summaries all stay in sync.

const SIZE = {
  sm: { px: 32, stroke: 3, fontClass: 'text-xs' },
  md: { px: 56, stroke: 4, fontClass: 'text-base' },
  lg: { px: 96, stroke: 6, fontClass: 'text-3xl' },
};

const TONE = {
  ready: { stroke: '#10B981', track: '#E6E9F0', text: 'text-ok-700' },
  watch: { stroke: '#F59E0B', track: '#E6E9F0', text: 'text-warn-700' },
  blocked: { stroke: '#EF4444', track: '#E6E9F0', text: 'text-block-700' },
  onboarding: { stroke: '#9099AA', track: '#E6E9F0', text: 'text-ink-500' },
};

export default function TrustScoreRing({
  score,
  status = 'ready',
  size = 'sm',
  showLabel = false,
  className = '',
}) {
  const cfg = SIZE[size] || SIZE.sm;
  const tone = TONE[status] || TONE.ready;
  const { px, stroke, fontClass } = cfg;

  const radius = (px - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const isOnboarding = status === 'onboarding' || score == null;
  const pct = Math.max(0, Math.min(100, Number(score) || 0));
  const dash = isOnboarding ? circumference : (pct / 100) * circumference;
  const gap = circumference - dash;

  return (
    <div
      className={`inline-flex flex-col items-center ${className}`}
      role="img"
      aria-label={
        isOnboarding
          ? 'Onboarding supplier, score pending'
          : `Trust score ${pct} of 100, ${status}`
      }
    >
      <div
        className="relative inline-flex items-center justify-center"
        style={{ width: px, height: px }}
      >
        <svg
          width={px}
          height={px}
          viewBox={`0 0 ${px} ${px}`}
          className="-rotate-90"
        >
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke={tone.track}
            strokeWidth={stroke}
          />
          <circle
            cx={px / 2}
            cy={px / 2}
            r={radius}
            fill="none"
            stroke={tone.stroke}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={0}
            style={isOnboarding ? { strokeDasharray: '3 4', opacity: 0.6 } : undefined}
          />
        </svg>
        <span
          className={`absolute font-mono font-semibold tabular-nums ${fontClass} ${tone.text}`}
        >
          {isOnboarding ? '—' : pct}
        </span>
      </div>
      {showLabel && (
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          {isOnboarding ? 'Onboarding' : statusLabel(status)}
        </span>
      )}
    </div>
  );
}

function statusLabel(status) {
  switch (status) {
    case 'ready':
      return 'Ready';
    case 'watch':
      return 'Watch';
    case 'blocked':
      return 'Blocked';
    case 'onboarding':
      return 'Onboarding';
    default:
      return status;
  }
}

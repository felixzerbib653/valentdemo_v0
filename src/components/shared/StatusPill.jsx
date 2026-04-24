import React from 'react';
import { CheckCircle, Clock, AlertOctagon, Radio } from 'lucide-react';

// StatusPill — one of four states: ready / watch / blocked / onboarding.
// Per docs/20-design-system.md §Core components.
//
// Every pill pairs a semantic hue with an icon so status is never encoded by
// color alone (a11y requirement). Default size is the row-level compact pill;
// the `lg` variant is used on supplier detail headers.

const TONES = {
  ready: {
    label: 'Ready',
    icon: CheckCircle,
    bg: 'bg-ok-50',
    text: 'text-ok-700',
    border: 'border-ok-100',
  },
  watch: {
    label: 'Watch',
    icon: Clock,
    bg: 'bg-warn-50',
    text: 'text-warn-700',
    border: 'border-warn-100',
  },
  blocked: {
    label: 'Blocked',
    icon: AlertOctagon,
    bg: 'bg-block-50',
    text: 'text-block-700',
    border: 'border-block-100',
  },
  onboarding: {
    label: 'Onboarding',
    icon: Radio,
    bg: 'bg-paper-100',
    text: 'text-ink-700',
    border: 'border-paper-300',
  },
};

const SIZES = {
  sm: {
    padding: 'px-2 py-0.5',
    text: 'text-xs',
    icon: 12,
    gap: 'gap-1',
  },
  md: {
    padding: 'px-2.5 py-1',
    text: 'text-xs',
    icon: 14,
    gap: 'gap-1.5',
  },
  lg: {
    padding: 'px-3 py-1.5',
    text: 'text-sm',
    icon: 16,
    gap: 'gap-2',
  },
};

export default function StatusPill({
  status = 'ready',
  size = 'sm',
  label,
  className = '',
}) {
  const tone = TONES[status] || TONES.ready;
  const sz = SIZES[size] || SIZES.sm;
  const Icon = tone.icon;
  const text = label || tone.label;
  return (
    <span
      className={`inline-flex items-center rounded-md border font-medium ${sz.padding} ${sz.text} ${sz.gap} ${tone.bg} ${tone.text} ${tone.border} ${className}`}
    >
      <Icon size={sz.icon} strokeWidth={2.25} />
      <span>{text}</span>
    </span>
  );
}

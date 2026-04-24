import React, { useEffect, useRef, useState } from 'react';
import { Check, X } from 'lucide-react';

// ResolvePopover — inline popover anchored beside the Resolve button on a flag.
// Captures the resolver's note and commits via onSubmit(note). Blocker-severity
// flags require a note (min 8 chars, trimmed) to reinforce the audit trail;
// watch / informational resolves accept an optional note.
//
// Per docs/05-screen-review-queue.md §Actions and the resolve-with-note pattern
// added to prevent trivial click-through.

const MIN_BLOCKER_NOTE = 8;

export default function ResolvePopover({ flag, onSubmit, onClose }) {
  const [note, setNote] = useState('');
  const textareaRef = useRef(null);
  const isBlocker = flag.severity === 'blocker';
  const trimmed = note.trim();
  const noteLongEnough = trimmed.length >= MIN_BLOCKER_NOTE;
  const canSubmit = !isBlocker || noteLongEnough;

  useEffect(() => {
    // Slight delay to ensure popover is mounted before focus.
    const t = setTimeout(() => textareaRef.current?.focus(), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canSubmit) {
        e.preventDefault();
        onSubmit(trimmed);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [canSubmit, trimmed, onSubmit, onClose]);

  const headerLabel = isBlocker ? 'Blocker — note required' : 'Resolve flag';
  const placeholder = isBlocker
    ? 'Required — what changed? (e.g. "FEI re-verified on FDA portal, entry in process")'
    : 'Add note (optional)';
  const hint = isBlocker
    ? `${Math.min(trimmed.length, 999)} / ${MIN_BLOCKER_NOTE}+ chars`
    : 'Logged to audit trail';

  return (
    <>
      <button
        type="button"
        aria-label="Close resolve popover"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="fixed inset-0 z-10 cursor-default bg-transparent"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Resolve flag with note"
        className="absolute right-0 top-[calc(100%+4px)] z-20 w-80 overflow-hidden rounded-lg border border-paper-300 bg-paper-0 shadow-md"
      >
        <div className="flex items-center justify-between gap-2 border-b border-paper-200 bg-paper-50 px-3 py-2">
          <span
            className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${
              isBlocker ? 'text-block-700' : 'text-ink-700'
            }`}
          >
            {headerLabel}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cancel"
            className="inline-flex h-5 w-5 items-center justify-center rounded text-ink-500 transition-colors hover:bg-paper-100 hover:text-ink-900 focus:outline-none focus-visible:shadow-focus"
          >
            <X size={11} strokeWidth={2.25} />
          </button>
        </div>
        <div className="p-3">
          <textarea
            ref={textareaRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={placeholder}
            className="w-full resize-none rounded-md border border-paper-300 bg-paper-0 px-2 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-ink-500">{hint}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onSubmit(trimmed)}
                disabled={!canSubmit}
                className="inline-flex items-center gap-1 rounded-md bg-ok px-2 py-1 text-[11px] font-semibold text-paper-0 transition-colors hover:bg-ok-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={11} strokeWidth={2.5} />
                Resolve
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

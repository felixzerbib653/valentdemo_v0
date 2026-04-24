import React from 'react';
import { Lock } from 'lucide-react';

// Shell for gated surfaces (Admin · Adoption, Roadmap items).
// Renders a blurred background impression of the page behind a "Coming soon"
// plate, mirroring the v3 treatment. Children are the blurred content —
// they're rendered (for visual structure) but pointer-events are disabled.

export default function LockedPageShell({ label, tagline, children }) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Blurred content behind the plate */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none opacity-60 blur-[2px]"
      >
        {children}
      </div>

      {/* Plate */}
      <div className="absolute inset-0 flex items-center justify-center bg-paper-50/60">
        <div className="flex max-w-md flex-col items-center gap-3 rounded-xl border border-paper-300 bg-paper-0 px-8 py-7 text-center shadow-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-100 text-ink-500">
            <Lock size={18} strokeWidth={2.25} />
          </span>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            Coming soon
          </div>
          <div className="text-xl font-semibold text-ink-900">{label}</div>
          {tagline && <p className="text-sm text-ink-600">{tagline}</p>}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const BOOT_DURATION_MS = 10_000;
const TICK_MS = 50;

/**
 * Full-viewport first-load gate: simulates document ingestion before the demo shell mounts.
 * Renders via portal on `document.body` so nothing inside `#root` can clip or stack above it.
 */
export default function BootGate({ children }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start;
      const pct = Math.min(100, (elapsed / BOOT_DURATION_MS) * 100);
      setProgress(pct);
      if (elapsed >= BOOT_DURATION_MS) {
        window.clearInterval(id);
        setReady(true);
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  if (ready) {
    return children;
  }

  const rounded = Math.min(100, Math.round(progress));

  const overlay = (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-paper-0 px-8 shadow-[inset_0_0_0_1px_rgba(11,18,32,0.06)]"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-full max-w-md text-center">
        <p className="text-lg font-medium leading-snug text-ink-800">
          Pulling in documents from email and shared drives
        </p>
        <div
          className="relative mt-8 h-2.5 w-full overflow-hidden rounded-full bg-paper-200 shadow-inner"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={rounded}
          aria-label="Ingestion progress"
        >
          {/* Shimmer on full track so motion reads at 0% fill (shimmer inside the fill was width 0). */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-0 w-[40%] animate-boot-shimmer opacity-35"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            }}
          />
          <div
            className="relative z-10 h-full rounded-full bg-accent"
            style={{ width: `${rounded}%` }}
          />
        </div>
        <p className="mt-3 font-mono text-xs tabular-nums text-ink-500">{rounded}%</p>
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}

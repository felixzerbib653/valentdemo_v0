import React from 'react';
import { Settings } from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';

// SourceCard — a single ingest source tile.
// Per docs/04-screen-ingest-inbox.md §Sources strip.
//
// All sources are "connected" in the demo (hard-coded). Configure emits a
// simulated toast; this is not a live integration surface.

export default function SourceCard({ source, Icon, label, sourceDetail, lastSyncAt, weekCount }) {
  const { emitToast, now } = useTrust();

  const handleConfigure = () => {
    emitToast({
      tone: 'info',
      title: 'Source configuration opened (simulated)',
      body: `${label} · ${sourceDetail}`,
    });
  };

  return (
    <div className="flex min-w-[220px] flex-1 flex-col gap-2 rounded-xl border border-paper-300 bg-paper-0 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-paper-100 text-ink-700">
            <Icon size={14} strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-500">
              {label}
            </div>
            <div className="mt-0.5 truncate font-mono text-[11px] text-ink-700">
              {sourceDetail}
            </div>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-md bg-paper-100 px-1.5 py-0.5 font-mono text-[11px] font-medium tabular-nums text-ink-700">
          {weekCount} this week
        </span>
      </div>

      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px] text-ink-500">
          <span className="inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
          <span>
            Connected
            {lastSyncAt ? (
              <>
                <span className="mx-1 text-ink-400">·</span>
                <span>last sync </span>
                <span className="font-mono tabular-nums">{formatRelative(lastSyncAt, now)}</span>
              </>
            ) : null}
          </span>
        </div>
        <button
          type="button"
          onClick={handleConfigure}
          className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-2 py-0.5 text-[11px] font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
        >
          <Settings size={11} strokeWidth={2} />
          Configure
        </button>
      </div>
    </div>
  );
}

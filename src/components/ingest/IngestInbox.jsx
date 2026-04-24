import React, { useMemo, useState } from 'react';
import {
  Mail,
  HardDrive,
  ServerCog,
  Upload,
  Inbox,
  ChevronDown,
} from 'lucide-react';
import { DOCUMENTS, getIngestCounts } from '../../data/documents.js';
import { useTrust } from '../../context/TrustContext.jsx';
import SourceCard from './SourceCard.jsx';
import DocumentRow from './DocumentRow.jsx';
import DocumentPreview from '../detail/DocumentPreview.jsx';

// IngestInbox — secondary screen. Two stacked regions:
//   1. Sources strip (collapsible) — four SourceCards.
//   2. Recent arrivals — filter chips + scrollable list of DocumentRows.
//
// Per docs/04-screen-ingest-inbox.md. Sources strip tagline per
// docs/60-positioning.md §Ingest Inbox.

const WEEK_MS = 7 * 86400000;

const SOURCES = [
  {
    key: 'email',
    Icon: Mail,
    label: 'Email',
    sourceDetail: 'compliance@elevationlabs.example',
  },
  {
    key: 'sharepoint',
    Icon: HardDrive,
    label: 'SharePoint',
    sourceDetail: '/Compliance/Suppliers',
  },
  {
    key: 'sftp',
    Icon: ServerCog,
    label: 'SFTP',
    sourceDetail: 'edi.elevationlabs.example',
  },
  {
    key: 'manual',
    Icon: Upload,
    label: 'Manual upload',
    sourceDetail: 'drag-and-drop · CSV / PDF',
  },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'needs-review', label: 'Needs review' },
  { key: 'failed', label: 'Failed' },
  { key: 'linked', label: 'Linked' },
];

export default function IngestInbox() {
  const { now } = useTrust();
  const [filter, setFilter] = useState('all');
  const [sourcesOpen, setSourcesOpen] = useState(true);
  const [preview, setPreview] = useState(null);

  const counts = useMemo(() => getIngestCounts(), []);

  const sortedDocs = useMemo(() => {
    return [...DOCUMENTS].sort(
      (a, b) => new Date(b.ingestedAt).getTime() - new Date(a.ingestedAt).getTime()
    );
  }, []);

  const sourceStats = useMemo(() => {
    const stats = {};
    for (const src of SOURCES) {
      let lastSyncAt = null;
      let weekCount = 0;
      for (const d of DOCUMENTS) {
        if (d.source !== src.key) continue;
        const t = new Date(d.ingestedAt).getTime();
        if (!lastSyncAt || t > new Date(lastSyncAt).getTime()) {
          lastSyncAt = d.ingestedAt;
        }
        if (now - t <= WEEK_MS) weekCount += 1;
      }
      stats[src.key] = { lastSyncAt, weekCount };
    }
    return stats;
  }, [now]);

  const visibleDocs = useMemo(() => {
    if (filter === 'all') return sortedDocs;
    return sortedDocs.filter((d) => d.linkStatus === filter);
  }, [sortedDocs, filter]);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-12 py-8">
      {/* Header strip */}
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Ingest Inbox</h2>
          <p className="mt-1 text-sm text-ink-500">
            Email · SharePoint · SFTP · Manual — ingredient PDFs in, structured evidence out.
          </p>
        </div>
      </header>

      {/* Sources strip */}
      <div className="overflow-hidden rounded-xl border border-paper-300 bg-paper-50 shadow-sm">
        <button
          type="button"
          onClick={() => setSourcesOpen((o) => !o)}
          aria-expanded={sourcesOpen}
          className="flex w-full items-center justify-between gap-3 border-b border-paper-200 bg-paper-0 px-4 py-2.5 text-left transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          <div className="flex items-center gap-2 text-ink-700">
            <Inbox size={14} strokeWidth={2} className="text-ink-500" />
            <span className="text-xs font-semibold uppercase tracking-[0.08em]">
              Sources
            </span>
            <span className="font-mono text-[11px] tabular-nums text-ink-500">
              {SOURCES.length} connected
            </span>
          </div>
          <ChevronDown
            size={14}
            strokeWidth={2}
            className={`text-ink-500 transition-transform ${sourcesOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {sourcesOpen ? (
          <div className="flex flex-wrap gap-3 p-4">
            {SOURCES.map((src) => {
              const stats = sourceStats[src.key] || {};
              return (
                <SourceCard
                  key={src.key}
                  source={src.key}
                  Icon={src.Icon}
                  label={src.label}
                  sourceDetail={src.sourceDetail}
                  lastSyncAt={stats.lastSyncAt}
                  weekCount={stats.weekCount || 0}
                />
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Recent arrivals */}
      <div className="mt-6 overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-paper-200 bg-paper-50 px-6 py-2.5">
          <div className="flex flex-wrap items-center gap-1">
            {FILTERS.map((f) => {
              const count = f.key === 'all' ? counts.all : counts[f.key] || 0;
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:shadow-focus ${
                    active
                      ? 'border-ink-900 bg-ink-900 text-paper-0'
                      : 'border-paper-300 bg-paper-0 text-ink-700 hover:bg-paper-100'
                  }`}
                >
                  <span>{f.label}</span>
                  <span
                    className={`font-mono tabular-nums ${
                      active ? 'text-paper-0/80' : 'text-ink-500'
                    }`}
                  >
                    · {count}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            {visibleDocs.length} of {DOCUMENTS.length}
            <span className="mx-1.5 text-ink-400">·</span>
            sorted newest first
          </div>
        </div>

        {visibleDocs.length === 0 ? (
          <EmptyArrivals onClear={() => setFilter('all')} />
        ) : (
          <div role="list">
            {visibleDocs.map((doc) => (
              <DocumentRow key={doc.id} doc={doc} onOpen={setPreview} />
            ))}
          </div>
        )}
      </div>

      {preview ? (
        <DocumentPreview doc={preview} onClose={() => setPreview(null)} />
      ) : null}
    </section>
  );
}

function EmptyArrivals({ onClear }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-paper-100 text-ink-500">
        <Inbox size={18} strokeWidth={2} />
      </span>
      <div className="text-sm font-semibold text-ink-900">Nothing matches that filter</div>
      <p className="max-w-[360px] text-xs text-ink-500">
        Try widening the filter or clearing it to see all recent arrivals.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
      >
        Clear filter
      </button>
    </div>
  );
}

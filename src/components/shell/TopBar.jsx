import React, { useEffect, useRef, useState } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import useSupplierSearch from '../../hooks/useSupplierSearch.js';
import StatusPill from '../shared/StatusPill.jsx';
import MonitoringAlertDropdown from './MonitoringAlertDropdown.jsx';

// TopBar — 56px page chrome. Page title left, global search middle (phase 3C
// typeahead), last-scan pulse + user chip right. Per docs/20-design-system.md
// §TopBar and docs/40-build-order.md §3C.
//
// The typeahead scores matches against supplier name, subtitle, and notes
// (which contain FEI mentions and ingredient names). Keyboard: arrow up/down
// move, Enter opens, Escape clears + closes. Click outside closes.

const PAGE_TITLES = {
  'trust-grid': 'Supplier Trust',
  'supplier-detail': 'Supplier',
  ingest: 'Ingest Inbox',
  review: 'Review Queue',
  admin: 'Admin · Adoption',
  pipeline: 'Pipeline Aggregator',
  sandbox: 'Bid Sandbox',
  margin: 'Margin Engine',
};

export default function TopBar() {
  const { page, lastScanAt, now, openSupplier } = useTrust();
  const title = PAGE_TITLES[page] || 'Valent Trust';

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const alertWrapRef = useRef(null);

  // Close the monitoring dropdown whenever the page route changes — the spec
  // (docs/70-agentic-surfaces.md §Surface 5) calls for this so the dropdown
  // doesn't float stale over a new screen.
  useEffect(() => {
    setAlertOpen(false);
  }, [page]);

  // Click-outside close for the monitoring dropdown. Lives here (not in the
  // dropdown) because the wrapper contains both the anchor button and panel
  // — otherwise clicking the anchor would close + reopen on the same click.
  useEffect(() => {
    if (!alertOpen) return undefined;
    const handler = (e) => {
      if (!alertWrapRef.current) return;
      if (alertWrapRef.current.contains(e.target)) return;
      setAlertOpen(false);
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, [alertOpen]);

  const results = useSupplierSearch(query);

  // Clamp active index when results change.
  useEffect(() => {
    if (activeIndex >= results.length) setActiveIndex(0);
  }, [results, activeIndex]);

  // Click outside to close.
  useEffect(() => {
    const handler = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener('mousedown', handler);
    return () => window.removeEventListener('mousedown', handler);
  }, []);

  const commitSupplier = (supplier) => {
    if (!supplier) return;
    openSupplier(supplier.id);
    setQuery('');
    setOpen(false);
    setActiveIndex(0);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(results.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const picked = results[activeIndex];
      if (picked) commitSupplier(picked.supplier);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setQuery('');
      setOpen(false);
    }
  };

  const showDropdown = open && query.trim().length > 0;

  return (
    <header className="flex h-14 shrink-0 items-center gap-6 border-b border-paper-300 bg-paper-0 px-6">
      {/* Left — page title */}
      <div className="flex min-w-[220px] items-center">
        <h1 className="text-base font-semibold text-ink-900">{title}</h1>
      </div>

      {/* Center — global search */}
      <div ref={containerRef} className="relative flex flex-1 items-center justify-center">
        <label className="flex w-full max-w-xl items-center gap-2 rounded-md border border-paper-300 bg-paper-50 px-3 py-1.5 text-ink-500 focus-within:border-accent focus-within:bg-paper-0">
          <Search size={16} strokeWidth={2} className="text-ink-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => {
              if (query.trim()) setOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search suppliers, FEI, ingredients…"
            className="w-full bg-transparent text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none"
          />
          <span className="hidden items-center rounded-md border border-paper-300 bg-paper-0 px-1.5 py-0.5 font-mono text-[10px] text-ink-500 sm:flex">
            ⌘K
          </span>
        </label>

        {showDropdown ? (
          <div className="absolute left-1/2 top-[calc(100%+4px)] z-30 w-full max-w-xl -translate-x-1/2 overflow-hidden rounded-lg border border-paper-300 bg-paper-0 shadow-md">
            {results.length === 0 ? (
              <div className="px-4 py-5 text-center text-xs text-ink-500">
                No match — try a supplier name or FEI.
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-paper-200 bg-paper-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                  <span>
                    {results.length} match{results.length === 1 ? '' : 'es'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CornerDownLeft size={10} strokeWidth={2.25} />
                    open
                  </span>
                </div>
                <ul role="listbox" aria-label="Supplier search results">
                  {results.map((r, i) => {
                    const active = i === activeIndex;
                    return (
                      <li key={r.supplier.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(i)}
                          onMouseDown={(e) => {
                            // Prevent input blur before click resolves.
                            e.preventDefault();
                          }}
                          onClick={() => commitSupplier(r.supplier)}
                          className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors focus:outline-none ${
                            active ? 'bg-paper-100' : 'bg-paper-0 hover:bg-paper-50'
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-sm font-medium text-ink-900">
                                {r.supplier.name}
                              </span>
                              <span className="font-mono text-[11px] tabular-nums text-ink-500">
                                · {r.supplier.trustScore}
                              </span>
                            </div>
                            <div className="mt-0.5 truncate text-[11px] text-ink-500">
                              {r.snippet || r.supplier.subtitle}
                            </div>
                          </div>
                          <StatusPill status={r.supplier.status} size="sm" />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* Right — last-scan + user chip */}
      <div className="flex items-center gap-4">
        <div ref={alertWrapRef} className="relative">
          <button
            type="button"
            aria-label="Monitoring alerts"
            aria-expanded={alertOpen}
            onClick={() => setAlertOpen((o) => !o)}
            className={`inline-flex items-center gap-2 rounded-md border px-2 py-1 transition-colors focus:outline-none focus-visible:shadow-focus ${
              alertOpen
                ? 'border-paper-300 bg-paper-100'
                : 'border-transparent hover:bg-paper-50'
            }`}
          >
            <span
              aria-hidden="true"
              className="relative flex h-2 w-2 items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full animate-pulse-soft rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs text-ink-500">
              last scan · {formatRelative(lastScanAt, now)}
            </span>
          </button>
          {alertOpen && (
            <MonitoringAlertDropdown onClose={() => setAlertOpen(false)} />
          )}
        </div>
        <div className="flex items-center gap-2 rounded-md border border-paper-300 bg-paper-0 py-1 pl-1 pr-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-paper-100 font-mono text-[11px] font-medium text-ink-700">
            SC
          </span>
          <span className="text-xs text-ink-700">Sarah Chen</span>
        </div>
      </div>
    </header>
  );
}

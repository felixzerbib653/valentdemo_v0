import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { PILLAR_LIST } from '../../data/trustPillars.js';
import { getSupplier } from '../../data/suppliers.js';

// FilterBar — sticky filter strip above the Review Queue.
// Per docs/05-screen-review-queue.md §Filter bar.
//
// Five filter groups (scope, pillar, severity, assignee, status). The scope
// "this supplier" chip only appears when TrustContext has an activeSupplierId.

const SEVERITY_OPTIONS = [
  { key: 'all', label: 'All severity' },
  { key: 'blocker', label: 'Blocker' },
  { key: 'watch', label: 'Watch' },
  { key: 'informational', label: 'Informational' },
];

const ASSIGNEE_OPTIONS = [
  { key: 'all', label: 'All assignees' },
  { key: 'me', label: 'Me' },
  { key: 'unassigned', label: 'Unassigned' },
];

const STATUS_OPTIONS = [
  { key: 'open', label: 'Open' },
  { key: 'resolved', label: 'Resolved' },
  { key: 'all', label: 'All' },
];

export default function FilterBar({
  filters,
  setFilters,
  counts,
  activeSupplierId,
  onClearScope,
}) {
  const activeSupplier = activeSupplierId ? getSupplier(activeSupplierId) : null;

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-paper-200 bg-paper-0 px-6 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {activeSupplier ? (
          <ScopeChip
            label={`This supplier · ${activeSupplier.name}`}
            onClear={onClearScope}
          />
        ) : null}

        <Dropdown
          label="Pillar"
          value={filters.pillar}
          options={[
            { key: 'all', label: 'All pillars' },
            ...PILLAR_LIST.map((p) => ({ key: p.key, label: p.label })),
          ]}
          onChange={(v) => setFilters({ ...filters, pillar: v })}
        />
        <Dropdown
          label="Severity"
          value={filters.severity}
          options={SEVERITY_OPTIONS}
          onChange={(v) => setFilters({ ...filters, severity: v })}
        />
        <Dropdown
          label="Assignee"
          value={filters.assignee}
          options={ASSIGNEE_OPTIONS}
          onChange={(v) => setFilters({ ...filters, assignee: v })}
        />
        <Dropdown
          label="Status"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(v) => setFilters({ ...filters, status: v })}
        />
      </div>

      <div className="text-xs text-ink-500">
        <span className="font-mono font-semibold tabular-nums text-ink-900">
          {counts.visibleOpen}
        </span>{' '}
        open
        <span className="mx-1.5 text-ink-400">·</span>
        <span className="font-mono tabular-nums text-ink-700">{counts.thisWeek}</span> this week
        <span className="mx-1.5 text-ink-400">·</span>
        <span className="font-mono tabular-nums text-ink-700">{counts.me}</span> assigned to you
      </div>
    </div>
  );
}

function Dropdown({ label, value, options, onChange }) {
  const [open, setOpen] = React.useState(false);
  const active = options.find((o) => o.key === value) || options[0];
  const isNonDefault = value && value !== 'all' && value !== options[0].key;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:shadow-focus ${
          isNonDefault
            ? 'border-ink-900 bg-ink-900 text-paper-0 hover:bg-ink-700'
            : 'border-paper-300 bg-paper-0 text-ink-700 hover:bg-paper-100'
        }`}
      >
        <span className={isNonDefault ? 'text-paper-0/70' : 'text-ink-500'}>
          {label}
        </span>
        <span>{active.label}</span>
        <ChevronDown
          size={11}
          strokeWidth={2}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open ? (
        <>
          <button
            type="button"
            aria-label="Close dropdown"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default bg-transparent"
          />
          <div className="absolute left-0 top-[calc(100%+4px)] z-20 max-h-[300px] w-48 overflow-y-auto rounded-lg border border-paper-300 bg-paper-0 shadow-md">
            {options.map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => {
                  onChange(opt.key);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs transition-colors hover:bg-paper-50 ${
                  opt.key === value ? 'font-semibold text-ink-900' : 'font-medium text-ink-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function ScopeChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-accent/60 bg-accent/10 px-2 py-1 text-xs font-medium text-ink-900">
      {label}
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear supplier scope"
        className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded text-ink-500 transition-colors hover:bg-paper-100 hover:text-ink-900 focus:outline-none focus-visible:shadow-focus"
      >
        <X size={10} strokeWidth={2.25} />
      </button>
    </span>
  );
}

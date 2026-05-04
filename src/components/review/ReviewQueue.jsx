import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { FLAGS, getFlagCounts, filterFlagsForDemoSession } from '../../data/flags.js';
import { getSupplier, applyBasfDemoInboundEvidence } from '../../data/suppliers.js';
import { STATUS_ORDER } from '../../data/trustPillars.js';
import { useTrust } from '../../context/TrustContext.jsx';
import FilterBar from './FilterBar.jsx';
import FlagRow from './FlagRow.jsx';

// ReviewQueue — portfolio-wide flag triage surface.
// Per docs/05-screen-review-queue.md.
//
// Flags are derived in src/data/flags.js. This screen holds:
//   - Filter state (pillar, severity, assignee, status) + scope from context.
//   - Local route state (session-only — demo mutations don't persist).
//   - Grouping by supplier when no supplier scope is active.
// Resolve state lives in TrustContext (`resolutions` Map) so the audit trail
// also surfaces in the Supplier Detail Activity panel.

const SEVERITY_ORDER = { blocker: 0, watch: 1, informational: 2 };
const WEEK_MS = 7 * 86400000;

const DEFAULT_FILTERS = {
  pillar: 'all',
  severity: 'all',
  assignee: 'all',
  status: 'open',
};

function applyFilters(flags, filters, activeSupplierId, resolutions) {
  return flags.filter((f) => {
    if (activeSupplierId && f.supplierId !== activeSupplierId) return false;
    if (filters.pillar !== 'all' && f.pillarKey !== filters.pillar) return false;
    if (filters.severity !== 'all' && f.severity !== filters.severity) return false;
    if (filters.assignee === 'me' && f.assignee?.name !== 'Sarah Chen') return false;
    if (filters.assignee === 'unassigned' && f.assignee) return false;
    const isResolved = resolutions.has(f.id);
    if (filters.status === 'open' && isResolved) return false;
    if (filters.status === 'resolved' && !isResolved) return false;
    return true;
  });
}

function groupBySupplier(flags, basfInbound) {
  const map = new Map();
  for (const f of flags) {
    const key = f.supplierId || '__unlinked__';
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(f);
  }
  const groups = [];
  for (const [supplierId, items] of map.entries()) {
    let supplier =
      supplierId === '__unlinked__' ? null : getSupplier(supplierId);
    if (supplier?.id === 'sup-basf') {
      supplier = applyBasfDemoInboundEvidence(supplier, basfInbound);
    }
    groups.push({ supplierId, supplier, items });
  }
  groups.sort((a, b) => {
    // Unlinked last.
    if (!a.supplier && b.supplier) return 1;
    if (a.supplier && !b.supplier) return -1;
    if (!a.supplier && !b.supplier) return 0;
    const orderA = STATUS_ORDER[a.supplier.status] ?? 99;
    const orderB = STATUS_ORDER[b.supplier.status] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    return (a.supplier.trustScore ?? 0) - (b.supplier.trustScore ?? 0);
  });
  return groups;
}

function sortFlags(flags) {
  return [...flags].sort((a, b) => {
    const orderA = SEVERITY_ORDER[a.severity] ?? 99;
    const orderB = SEVERITY_ORDER[b.severity] ?? 99;
    if (orderA !== orderB) return orderA - orderB;
    // Older flags float up within the same severity.
    return new Date(a.openedAt).getTime() - new Date(b.openedAt).getTime();
  });
}

export default function ReviewQueue() {
  const {
    activeSupplierId,
    activePillarKey,
    navigate,
    now,
    resolutions,
    basfDemoInboundEvidence,
  } = useTrust();
  // Initialize the pillar filter from the incoming pillar scope so a deep-link
  // from Supplier Detail ("Open in Review Queue" ghost link on a fail/pending
  // pillar) lands on a pre-filtered queue. Subsequent filter changes inside
  // the queue are local.
  const [filters, setFilters] = useState(() => ({
    ...DEFAULT_FILTERS,
    pillar: activePillarKey || 'all',
  }));
  const [routedIds, setRoutedIds] = useState(() => new Set());
  // Groups default to collapsed — operator opens the portfolio view and sees
  // the shape of where the problems live (supplier, counts by severity)
  // before drilling into any one block. Tracked as an expanded-set so the
  // empty default is "everything collapsed" with no pre-seeding needed.
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());

  // Sync the pillar filter when activePillarKey changes externally — e.g., a
  // second click on a different pillar's "Open in Review Queue" ghost link.
  useEffect(() => {
    if (activePillarKey) {
      setFilters((prev) =>
        prev.pillar === activePillarKey ? prev : { ...prev, pillar: activePillarKey }
      );
    }
  }, [activePillarKey]);

  const baseCounts = useMemo(() => getFlagCounts(), []);

  const sessionFlags = useMemo(
    () => filterFlagsForDemoSession(FLAGS, basfDemoInboundEvidence),
    [basfDemoInboundEvidence]
  );

  const visible = useMemo(
    () =>
      sortFlags(
        applyFilters(sessionFlags, filters, activeSupplierId, resolutions)
      ),
    [sessionFlags, filters, activeSupplierId, resolutions]
  );

  const headerCounts = useMemo(() => {
    const thisWeek = sessionFlags.filter((f) => {
      return now - new Date(f.openedAt).getTime() <= WEEK_MS;
    }).length;
    return {
      visibleOpen: visible.filter((f) => !resolutions.has(f.id)).length,
      thisWeek,
      me: baseCounts.me,
      unassigned: baseCounts.unassigned,
    };
  }, [visible, now, baseCounts, resolutions, sessionFlags]);

  const groups = useMemo(
    () => groupBySupplier(visible, basfDemoInboundEvidence),
    [visible, basfDemoInboundEvidence]
  );
  const groupingOn = !activeSupplierId;

  const routeFlag = (flag) => {
    setRoutedIds((prev) => {
      const next = new Set(prev);
      next.add(flag.id);
      return next;
    });
  };

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const clearScope = () => {
    navigate('review'); // navigate without supplierId drops the scope
  };

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const allClearForPortfolio =
    filters.status === 'open' &&
    filters.pillar === 'all' &&
    filters.severity === 'all' &&
    filters.assignee === 'all' &&
    !activeSupplierId &&
    visible.length === 0;

  return (
    <section className="mx-auto w-full max-w-[1280px] px-12 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Review Queue</h2>
          <p className="mt-1 text-sm text-ink-500">
            Open flags across the portfolio — triage, resolve, or route.
          </p>
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <FilterBar
          filters={filters}
          setFilters={setFilters}
          counts={headerCounts}
          activeSupplierId={activeSupplierId}
          onClearScope={clearScope}
        />

        {allClearForPortfolio ? (
          <AllClearEmpty />
        ) : visible.length === 0 ? (
          <NoMatchEmpty onClear={clearFilters} />
        ) : groupingOn ? (
          <div>
            {groups.map((group) => {
              const groupKey = group.supplierId;
              const collapsed = !expandedGroups.has(groupKey);
              return (
                <GroupBlock
                  key={groupKey}
                  group={group}
                  collapsed={collapsed}
                  onToggle={() => toggleGroup(groupKey)}
                  onRoute={routeFlag}
                />
              );
            })}
          </div>
        ) : (
          <div>
            {visible.map((f) => (
              <FlagRow
                key={f.id}
                flag={f}
                onRoute={routeFlag}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function GroupBlock({ group, collapsed, onToggle, onRoute }) {
  const { supplier, items } = group;
  const blockerCount = items.filter((f) => f.severity === 'blocker').length;
  const watchCount = items.filter((f) => f.severity === 'watch').length;
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="flex w-full items-center justify-between gap-3 border-b border-paper-200 bg-paper-50 px-6 py-2.5 text-left transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
      >
        <div className="flex min-w-0 items-center gap-2">
          <ChevronDown
            size={12}
            strokeWidth={2}
            className={`text-ink-500 transition-transform ${collapsed ? '-rotate-90' : ''}`}
          />
          <span className="truncate text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
            {supplier ? supplier.name : 'Unlinked documents'}
          </span>
          {supplier ? (
            <span className="font-mono text-[11px] tabular-nums text-ink-500">
              · {supplier.trustScore}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-ink-500">
          {blockerCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-block-50 px-1.5 py-0.5 font-medium text-block-700">
              <span className="h-1.5 w-1.5 rounded-full bg-block" />
              {blockerCount} blocker
            </span>
          ) : null}
          {watchCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-md bg-warn-50 px-1.5 py-0.5 font-medium text-warn-700">
              <span className="h-1.5 w-1.5 rounded-full bg-warn" />
              {watchCount} watch
            </span>
          ) : null}
          <span className="font-mono tabular-nums">{items.length} total</span>
        </div>
      </button>
      {!collapsed ? (
        <div>
          {items.map((f) => (
            <FlagRow
              key={f.id}
              flag={f}
              onRoute={onRoute}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function AllClearEmpty() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ok-50 text-ok-700">
        <CheckCircle2 size={22} strokeWidth={2.25} />
      </span>
      <div className="text-sm font-semibold text-ink-900">
        No open flags — all 7 pillars healthy across your supplier base.
      </div>
      <p className="max-w-[360px] text-xs text-ink-500">
        New flags appear here as continuous monitoring detects them.
      </p>
    </div>
  );
}

function NoMatchEmpty({ onClear }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <div className="text-sm font-semibold text-ink-900">No flags match these filters.</div>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
      >
        Clear filters
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import {
  LayoutGrid,
  ListChecks,
  Inbox,
  Settings,
  Lock,
  Sparkles,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useTrust } from '../../context/TrustContext.jsx';

// Sidebar per docs/20-design-system.md §Sidebar.
// 240px column. Portfolio + Admin sections always visible. Roadmap section
// collapsible and hidden entirely when mode === 'wedge'.

const PORTFOLIO_ITEMS = [
  {
    key: 'trust-grid',
    // "Valent TrustGrid" — TrustGrid carries the brand-accent cyan + semibold
    // so the product surface reads as a Valent-authored artifact in the nav.
    label: (
      <>
        Valent <span className="font-semibold text-accent">TrustGrid</span>
      </>
    ),
    icon: LayoutGrid,
  },
  { key: 'review', label: 'Review Queue', icon: ListChecks },
  { key: 'ingest', label: 'Ingest Inbox', icon: Inbox },
];

const ADMIN_ITEMS = [{ key: 'admin', label: 'Adoption', icon: Settings, locked: true }];

const ROADMAP_ITEMS = [
  { key: 'pipeline', label: 'Pipeline Aggregator', locked: true },
  { key: 'sandbox', label: 'Bid Sandbox', locked: true },
  { key: 'margin', label: 'Margin Engine', locked: true },
];

function NavItem({ item, active, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.key)}
      className={[
        'group relative flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors',
        active
          ? 'bg-paper-100 text-ink-900'
          : 'text-ink-700 hover:bg-paper-50 hover:text-ink-900',
      ].join(' ')}
    >
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r-md bg-ok"
        />
      )}
      {Icon && <Icon size={16} strokeWidth={2} className="shrink-0" />}
      <span
        className={[
          'text-sm',
          active ? 'font-semibold' : 'font-medium',
          item.locked ? 'text-ink-500' : '',
        ].join(' ')}
      >
        {item.label}
      </span>
      {item.locked && (
        <Lock size={12} strokeWidth={2} className="ml-auto text-ink-400" />
      )}
    </button>
  );
}

function SectionHeader({ children, count, collapsible, open, onToggle }) {
  const Chevron = open ? ChevronDown : ChevronRight;
  return (
    <div className="mb-1 mt-5 flex items-center gap-1 px-3">
      {collapsible && (
        <button
          type="button"
          onClick={onToggle}
          className="flex items-center gap-1 text-ink-500 hover:text-ink-700"
        >
          <Chevron size={12} strokeWidth={2.25} />
        </button>
      )}
      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {children}
      </span>
      {count !== undefined && (
        <span className="ml-auto rounded-md bg-paper-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500">
          {count}
        </span>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { page, navigate, mode } = useTrust();
  const [roadmapOpen, setRoadmapOpen] = useState(false);

  return (
    <aside className="flex h-full w-[240px] shrink-0 flex-col border-r border-paper-300 bg-paper-0">
      {/* Wordmark */}
      <div className="flex items-center gap-2 px-4 py-4">
        <Sparkles size={18} strokeWidth={2.25} className="text-accent" />
        <div className="flex items-baseline gap-1">
          <span className="font-sans text-lg font-semibold text-ink-900">Valent</span>
          <span className="font-sans text-lg font-normal text-ink-700">Trust</span>
        </div>
      </div>

      {/* Portfolio */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <SectionHeader>Portfolio</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {PORTFOLIO_ITEMS.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={page === item.key}
              onSelect={navigate}
            />
          ))}
        </div>

        {/* Admin */}
        <SectionHeader>Admin</SectionHeader>
        <div className="flex flex-col gap-0.5">
          {ADMIN_ITEMS.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              active={page === item.key}
              onSelect={navigate}
            />
          ))}
        </div>

        {/* Roadmap — hidden in wedge mode */}
        {mode !== 'wedge' && (
          <>
            <SectionHeader
              collapsible
              open={roadmapOpen}
              onToggle={() => setRoadmapOpen((v) => !v)}
              count={ROADMAP_ITEMS.length}
            >
              Roadmap
            </SectionHeader>
            {roadmapOpen && (
              <div className="flex flex-col gap-0.5">
                {ROADMAP_ITEMS.map((item) => (
                  <NavItem
                    key={item.key}
                    item={item}
                    active={page === item.key}
                    onSelect={navigate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-paper-200 px-4 py-3">
        <div className="text-[10px] font-medium uppercase tracking-[0.08em] text-ink-500">
          Demo build
        </div>
        <div className="mt-0.5 font-mono text-[11px] text-ink-500">r1 · 2026.04.20</div>
      </div>
    </aside>
  );
}

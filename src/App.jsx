import React from 'react';
import { TrustProvider, useTrust } from './context/TrustContext.jsx';
import BootGate from './components/shell/BootGate.jsx';
import Sidebar from './components/shell/Sidebar.jsx';
import TopBar from './components/shell/TopBar.jsx';
import LockedPageShell from './components/shell/LockedPageShell.jsx';
import ToastStack from './components/shell/ToastStack.jsx';
import TrustGrid from './components/grid/TrustGrid.jsx';
import SupplierDetail from './components/detail/SupplierDetail.jsx';
import AuditBundleModal from './components/bundle/AuditBundleModal.jsx';
import ChaseDraftModal from './components/review/ChaseDraftModal.jsx';
import IngestInbox from './components/ingest/IngestInbox.jsx';
import ReviewQueue from './components/review/ReviewQueue.jsx';
import AdminAdoption from './components/admin/AdminAdoption.jsx';

// App shell per docs/40-build-order.md §Phase 1 + §Phase 4.
// TrustProvider wraps everything. Sidebar + TopBar are the chrome.
// Page switcher routes each page key. Admin + Roadmap pages render inside a
// <LockedPageShell> so the surface is legible through the blur. In wedge mode
// a single Roadmap strip pinned to the bottom of the main region replaces the
// sidebar's Roadmap section — per docs/60-positioning.md §"Roadmap surface in
// wedge mode".

function Placeholder({ heading, subtitle, children }) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-12 py-10">
      <header className="mb-6 flex items-baseline justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">{heading}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-600">{subtitle}</p>}
        </div>
        <span className="rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
          Phase 1 · placeholder
        </span>
      </header>
      <div className="rounded-xl border border-paper-300 bg-paper-0 p-8 text-sm text-ink-600 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function LockedPlaceholder({ label, tagline, bodyLabel }) {
  return (
    <LockedPageShell label={label} tagline={tagline}>
      <Placeholder heading={bodyLabel || label}>
        <p>Gated surface. Blurred in demo.</p>
      </Placeholder>
    </LockedPageShell>
  );
}

const ROADMAP_TAGLINE =
  'Coming next — part of the Valent Trust roadmap. Available for design partners under contract.';

const ADMIN_TAGLINE =
  'Team adoption, processing metrics, and source configuration. Enabled for design partners under contract.';

function PageSwitch() {
  const { page } = useTrust();
  switch (page) {
    case 'trust-grid':
      return <TrustGrid />;
    case 'supplier-detail':
      return <SupplierDetail />;
    case 'ingest':
      return <IngestInbox />;
    case 'review':
      return <ReviewQueue />;
    case 'admin':
      return (
        <LockedPageShell label="Admin · Adoption" tagline={ADMIN_TAGLINE}>
          <AdminAdoption />
        </LockedPageShell>
      );
    case 'pipeline':
      return (
        <LockedPlaceholder
          label="Pipeline Aggregator"
          tagline={ROADMAP_TAGLINE}
          bodyLabel="Pipeline Aggregator"
        />
      );
    case 'sandbox':
      return (
        <LockedPlaceholder
          label="Bid Sandbox"
          tagline={ROADMAP_TAGLINE}
          bodyLabel="Bid Sandbox"
        />
      );
    case 'margin':
      return (
        <LockedPlaceholder
          label="Margin Engine"
          tagline={ROADMAP_TAGLINE}
          bodyLabel="Margin Engine"
        />
      );
    default:
      return (
        <Placeholder heading="Unknown page" subtitle={String(page)}>
          <p>Navigate via the sidebar.</p>
        </Placeholder>
      );
  }
}

// WedgeRoadmapStrip — wedge-mode-only surface. Pinned to the bottom of the
// main region. Muted, non-interactive. Answers "what's next?" without letting
// the reviewer click into a LockedPageShell dead-end. Copy locked per
// docs/60-positioning.md §"Roadmap surface in wedge mode".
function WedgeRoadmapStrip() {
  return (
    <div
      aria-hidden="true"
      className="border-t border-paper-200 bg-paper-50 px-12 py-2 text-center"
    >
      <span className="text-[11px] text-ink-500">
        <span className="font-medium text-ink-700">Pipeline · Bid Sandbox · Margin Engine</span>
        <span className="text-ink-400"> — </span>
        available for design partners under contract.
      </span>
    </div>
  );
}

function Shell() {
  const { mode } = useTrust();
  const isWedge = mode === 'wedge';
  return (
    <div className="flex h-full min-h-screen w-full bg-paper-50">
      <Sidebar />
      <div className="flex h-full min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <PageSwitch />
        </main>
        {isWedge ? <WedgeRoadmapStrip /> : null}
      </div>
      <AuditBundleModal />
      <ChaseDraftModal />
      <ToastStack />
    </div>
  );
}

export default function App() {
  return (
    <TrustProvider>
      <BootGate>
        <Shell />
      </BootGate>
    </TrustProvider>
  );
}

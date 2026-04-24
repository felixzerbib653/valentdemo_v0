# Build Order & Dependency Graph

## Phasing

Six phases after phase 0 (docs). Each phase ends with a STATE.md checkpoint and a TaskList update.

## Phase 1 — Scaffold

**Goal.** Project boots. Empty app shell renders. No screens yet.

**Outputs.**
- `package.json` — React 18, Vite 5, Tailwind 3, Lucide, Recharts. Private. Scripts: `dev`, `build`, `preview`.
- `vite.config.js` — React plugin, port 5173.
- `tailwind.config.js` — palette per `20-design-system.md`.
- `postcss.config.js`
- `index.html` — title "Valent Trust", Inter + JetBrains Mono from Google Fonts.
- `src/index.css` — Tailwind directives, base layer with font smoothing and body color.
- `src/main.jsx` — React root.
- `src/App.jsx` — mounts `<TrustProvider>`, `<Sidebar>`, `<TopBar>`, and a page switcher with empty placeholders.
- `src/context/TrustContext.jsx` — full state per `30-state-contract.md`.
- `src/components/shell/Sidebar.jsx` — fully functional nav per design system.
- `src/components/shell/TopBar.jsx` — search input + last-scan pulse.
- `src/components/shell/LockedPageShell.jsx` — for locked surfaces.
- `src/data/trustPillars.js` — pillar definitions.
- `src/data/suppliers.js` — 14 suppliers, full payloads.
- `src/data/documents.js` — 48 documents.
- `src/data/events.js` — 20 events.
- `src/data/personas.js` — PDF personas ported from v3.

**Dependency:** phase 0 complete (all docs written).

**Verification:** parse-check every file. Visual smoke — sidebar renders, clicking items updates `page` in context, empty screens render a placeholder header.

## Phase 2 — Core screens

Build the three pitch-essential screens in this order, because each builds on the previous.

### 2A — Supplier Trust Grid

**Goal.** Landing page renders with 14 supplier rows sortable by status.

**Outputs.**
- `src/components/grid/TrustGrid.jsx` — full screen.
- `src/components/grid/PortfolioSummaryBand.jsx` — the three-slot summary.
- `src/components/shared/TrustScoreRing.jsx` — `sm` / `md` / `lg` variants.
- `src/components/shared/PillarChip.jsx` — with status dot.
- `src/components/shared/StatusPill.jsx` — 4 states.
- `src/components/grid/SupplierRow.jsx`.

**Verification:** every supplier renders. Sort order is status-desc then score-asc. Hover reveals action buttons. Click routes to `supplier-detail`.

### 2B — Supplier Detail

**Goal.** Three-column layout renders for any supplier.

**Outputs.**
- `src/components/detail/SupplierDetail.jsx` — orchestrator.
- `src/components/detail/DetailHeader.jsx` — supplier name, score ring, action cluster.
- `src/components/detail/PillarList.jsx` — left column.
- `src/components/detail/EvidencePanel.jsx` — center column.
- `src/components/detail/ActivityPanel.jsx` — right column.
- `src/components/shared/EvidenceRow.jsx`.
- `src/components/shared/DocumentPreviewModal.jsx` — reusable; ports the v3 persona overlay logic.

**Verification:** click a pillar updates the center column. "Generate audit bundle" opens the modal. Evidence row click opens preview. Back button returns to grid.

### 2C — Audit Bundle modal

**Goal.** Hero artifact modal ships.

**Outputs.**
- `src/components/bundle/AuditBundleModal.jsx` — the modal shell.
- `src/components/bundle/CoverPagePreview.jsx` — the stylized cover.
- `src/components/bundle/IncludedEvidenceList.jsx` — checkable list.
- `src/components/bundle/BundleActions.jsx` — footer actions.

**Verification:** modal opens from grid row CTA and from detail header CTA. Editable recipient field works. Unchecking a doc updates the cover count. Download CTA emits toast.

### Phase 2 exit

- All three screens functional end-to-end.
- Cross-screen navigation works via context.
- Parse-check clean.
- STATE.md updated with "Phase 2 complete."

## Phase 3 — Supporting screens

### 3A — Ingest Inbox

`src/components/ingest/IngestInbox.jsx` + `SourceCard.jsx` + `DocumentRow.jsx`. Reuses `DocumentPreviewModal`.

### 3B — Review Queue

`src/components/review/ReviewQueue.jsx` + `FilterBar.jsx` + `FlagRow.jsx`. Introduces `src/data/flags.js` if pillar-derived flags aren't rich enough.

### 3C — Global search

Extends `TopBar.jsx` with a typeahead dropdown. Introduces `src/hooks/useSupplierSearch.js`.

### 3D — Toast system

`src/components/shell/ToastStack.jsx`. Already specced in context; this phase renders it.

### Phase 3 exit

- All six live screens functional.
- Toasts fire on at least four event types.
- Global search finds by name, FEI, ingredient.
- Parse-check clean.
- STATE.md updated.

## Phase 4 — Polish

- `src/components/admin/AdminAdoption.jsx` inside `<LockedPageShell>`.
- Sidebar `Roadmap` section — collapsible, 3 locked items.
- `?mode=wedge` flag in `App.jsx`.
- Build stamp in every screen footer (e.g., "Valent Trust · r1-2026.04.20").
- `scripts/parse-check.mjs` — runs `@babel/parser` across all `src/**/*.jsx`.

### Phase 4 exit

- All seven surfaces present.
- Wedge mode renders a clean, compliance-only IA.
- Build stamp visible everywhere.
- STATE.md updated.

## Phase 5 — Self-review

Agent adopts end-user persona and walks every journey. Output is `docs/50-verification-plan.md` populated with gap report.

## Phase 6 — Iterate

Fix defects. Re-run review. Loop until exit criteria met.

## Critical-path dependency graph

```
Phase 0 (docs) ──▶ Phase 1 (scaffold) ──▶ Phase 2A (grid) ──┐
                                                             ├──▶ Phase 2B (detail) ──▶ Phase 2C (bundle)
                                                             │
                                       Phase 1 also unblocks ┘
                                       Phase 3A/B/C/D (parallel)
                                                  │
                                                  ▼
                                          Phase 4 (polish)
                                                  │
                                                  ▼
                                          Phase 5 (review)
                                                  │
                                                  ▼
                                          Phase 6 (iterate)
```

## Subagent delegation map

| Phase | Good candidate for subagent? | Subagent type |
|---|---|---|
| 1 | Yes, if token budget tight | `general-purpose` |
| 2A | No — main thread owns orchestration |  |
| 2B | Yes after 2A lands | `general-purpose` |
| 2C | No — small enough to own directly |  |
| 3A | Yes | `general-purpose` |
| 3B | Yes | `general-purpose` |
| 3C | No — cross-cuts top bar |  |
| 3D | No — cross-cuts context |  |
| 4 | Partially — split into 3 subagent runs |  |
| 5 | Yes — fresh eyes are the point | `general-purpose` as end-user persona |
| 6 | Main thread |  |

## Resume strategy (for scheduled continuations)

Every scheduled task runs this checklist:

1. Read `STATE.md`.
2. Read `docs/00-master-prd.md`.
3. Read `docs/40-build-order.md` (this file).
4. Call `TaskList`. Claim the lowest-ID pending task whose dependencies are satisfied.
5. Execute.
6. Update STATE.md + task status on completion.
7. If context remaining is low, schedule next run before exiting.

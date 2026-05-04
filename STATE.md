# Valent Trust Demo — Build State

**Project:** `valent-trust-demo`
**Framing:** "Vanta for suppliers" — compliance trust layer for regulated physical supply chains, starting with MoCRA-scoped cosmetic CMOs.
**Lineage:** Clean-slate rebuild. Predecessor `valent-demo-light-v3` remains at peer directory as reference for portable patterns (PDF personas, handshake toasts, evidence overlay).

## Current Phase

**INVESTOR-READY + feedback trio shipped as of 2026-04-21.** Phase 5 round 2 + phase 6 closeout complete. Tasks #50 / #51 / #52 implemented via task #58.

Round 2 cold review (docs/50-verification-plan.md §Round 2) confirmed every one of the ten Round 1 fixes landed at the line level, no regressions, agentic surfaces 7/0/0 (up from 5/2/0), every screen Pass 1, every click budget met, all four investor-ready gates satisfied. The BASF narrative drift (42 → 49) was the last docs-hygiene item — resolved in docs/10-user-journeys.md J1, docs/02-screen-supplier-detail.md, docs/03-screen-audit-bundle.md.

Feedback trio (tasks #50 / #51 / #52) now in code. DocumentPreview carries an agent-summary block (Contents / Gap / Suggested next step) at the top of its right aside and a review-and-approve strip at the bottom for needs-review + failed docs. `TrustContext` gained `documentReviews: Map` + `emitDocumentReview(docId, action, note?)` + `clearDocumentReview(docId)` dispatchers. ActivityPanel merges document-review events into its per-supplier timeline. FlagRow dropped the per-row "Drafted by Valent" chip; the Draft-email CTA itself now carries Valent branding (Sparkles glyph + 1px `border-accent`). New `ProvenanceChip` variant `summarized` added. Nine representative docs seeded with summary content across BASF / Stepan / IMCD / Ashland / Univar / Symrise / one inbox needs-review.

Parse-check clean on all 48 files. The demo can be walked for a pitch audience without further remediation.

## Phase ledger

| # | Phase | Status | Artifact |
|---|---|---|---|
| 0 | Draft PRDs + specs | complete | `docs/*.md` (13 files) |
| 1 | Scaffold Vite + Tailwind + shell | complete | config + `src/` + data + shell |
| 2A | Supplier Trust Grid | complete | `src/components/grid/*`, `src/components/shared/*` |
| 2B | Supplier Detail | complete | `src/components/detail/*` + shared EvidenceRow |
| 2C | Audit Bundle modal | complete | `src/components/bundle/AuditBundleModal.jsx` |
| 3A | Ingest Inbox | complete | `src/components/ingest/*` |
| 3B | Review Queue | complete | `src/components/review/*` + `src/data/flags.js` |
| 3C | Global search typeahead | complete | `src/hooks/useSupplierSearch.js` + `src/components/shell/TopBar.jsx` |
| 4 | Polish (admin, roadmap, mode flag, footer, parse-check) | complete | `src/components/admin/*` + `src/data/adminMetrics.js` + App wedge strip |
| 4+ | Agentic-surfaces retrofit (seven surfaces) | complete | `src/components/shared/ProvenanceChip.jsx` · `grid/TodaysWorkCard.jsx` · `shell/MonitoringAlertDropdown.jsx` · `review/ChaseDraftModal.jsx` + retrofits on EvidenceRow / DocumentRow / FlagRow / SupplierHeader / AuditBundleModal |
| 5 | Self-review as end-user persona (round 1) | complete | `docs/50-verification-plan.md §Round 1` |
| 6 | Iterate to investor-ready (round 1) | complete | 10 defects → 0 (see "Round 1 fix ledger" below) |
| 5 | Self-review as end-user persona (round 2) | pending | awaits fresh subagent dispatch |

## Phase 1 deliverables shipped

- Config: `package.json`, `vite.config.js`, `tailwind.config.js` (full Trust palette, fonts, radii, shadows, pulse keyframes), `postcss.config.js`, `index.html` (Inter + JetBrains Mono), `.gitignore`.
- Entry: `src/main.jsx`, `src/index.css` (Tailwind directives + base layer, `chip`/`hairline` component helpers, focus ring).
- Data layer:
  - `src/data/trustPillars.js` — 7 pillars with weights, §-anchors, `computeTrustScore()`, `deriveStatus()`, `STATUS_ORDER`.
  - `src/data/personas.js` — 6 PDF personas (clean-digital through faxed) ported from v3.
  - `src/data/suppliers.js` — 14 suppliers, distribution 3 blocked / 4 watch / 6 ready / 1 onboarding. Trust scores derived from pillar weights.
  - `src/data/documents.js` — 48 evidence records (44 linked + 3 needs-review + 1 failed-to-parse). FK to suppliers.
  - `src/data/events.js` — 20 continuous-monitoring events.
- Context: `src/context/TrustContext.jsx` — full state per 30-state-contract.md: page, activeSupplierId, activePillarKey, lastViewedSupplierId, toasts (with dedupe + hover-pause + auto-dismiss), auditBundle, mode (reads `?mode=wedge` once), lastScanAt + now (60s tick), dispatchers.
- Shell:
  - `src/components/shell/Sidebar.jsx` — wordmark + Portfolio / Admin / collapsible Roadmap (hidden in wedge mode).
  - `src/components/shell/TopBar.jsx` — page title + disabled search input (typeahead in phase 3) + cyan pulse + user chip.
  - `src/components/shell/LockedPageShell.jsx` — blurred content + "Coming soon" plate.
- App: `src/App.jsx` — TrustProvider + Shell + PageSwitch with placeholder panes for every page key (trust-grid, supplier-detail, ingest, review, admin, pipeline, sandbox, margin).
- Dev: `scripts/parse-check.mjs` — @babel/parser driver, walks `src/` + top-level configs. Script in place; depends on local `npm install` (see sandbox limitation below).

## Verification evidence

- `node --check` on every pure `.js` / `.mjs` file → clean (9 files).
- Python delimiter-balance scan on every `.jsx` file → balanced (6 files).
- Every relative import verified against actual file tree.

## Sandbox limitation worth flagging

The build sandbox blocks `npmjs.org` registry access (403 on every package fetch, including `@babel/parser`). Consequence: `npm install` must be run locally by Felix. `npm run parse-check` will work after that. `npm run dev` will boot the real dev server locally.

For in-sandbox verification going forward, the fallback stack is:
1. `node --check` on all pure JS files.
2. Python delimiter-balance scan on JSX files.
3. Relative-import existence check.

This catches syntax regressions and missing-file bugs. It does not catch semantic React errors — those land when Felix boots `npm run dev`.

## Phase 2A deliverables shipped

- Shared primitives:
  - `src/components/shared/TrustScoreRing.jsx` — SVG ring, `sm`/`md`/`lg` variants, status-toned stroke, handles onboarding (dashed muted ring + em-dash).
  - `src/components/shared/StatusPill.jsx` — `ready`/`watch`/`blocked`/`onboarding` with matched icons (CheckCircle / Clock / AlertOctagon / Radio). `sm`/`md`/`lg` sizes.
  - `src/components/shared/PillarChip.jsx` — 6px status dot + pillar short label. Four status variants (pass/pending/fail/missing), tooltip shows full label + anchor. `missing` renders as outlined empty red ring. Optional `onClick` promotes to button.
- Grid components:
  - `src/components/grid/PortfolioSummaryBand.jsx` — single ~120px band, three slots (trust score + delta / stacked status bar + legend / evidence freshness + ingest link). NOT a KPI tile grid.
  - `src/components/grid/SupplierRow.jsx` — 72px row. Score ring · name+subtitle · StatusPill · 7 PillarChips · last-updated · hover-revealed "Audit bundle" (ghost) + "Open" (primary). Blocked rows get 3px red left bar. Click opens detail; audit-bundle CTA stops propagation.
  - `src/components/grid/TrustGrid.jsx` — header strip (title + subtitle + local search + filter dropdown) + PortfolioSummaryBand + sorted row list. Sort: STATUS_ORDER then trustScore asc. Empty-state with Clear-filter ghost button.
- Data helper: `src/data/documents.js → getEvidenceFreshness(nowIso)` — onFile / oldestAgeDays / expiringSoon. Drives the band's right slot.
- App wiring: `src/App.jsx` — TrustGridPlaceholder removed, `case 'trust-grid'` renders `<TrustGrid />`.

## Verification evidence (phase 2A)

- Delimiter-balance scan clean on 7 new/changed JSX files.
- `node --check` clean on the edited `src/data/documents.js`.
- Import-graph existence check: 17 source files scanned, all relative imports resolve.

## Phase 2B deliverables shipped

- Shared primitive:
  - `src/components/shared/EvidenceRow.jsx` — file-type icon · title + source/ingested/page-count metadata · confidence chip (high/medium/low) · up to 2 flag badges with +N overflow · click opens DocumentPreview. `showPillarTag` mode for the unfiltered "all evidence" view.
- Detail components:
  - `src/components/detail/DocumentPreview.jsx` — full-screen modal with two-pane layout. Left: persona-tinted paper surface (paperTint, grain overlay, watermark overlay — fax-header banner, streak bleed, radial grain; plus annotations — blue pen and redaction bars). Right: evidence-captured panel with synthesized extracted fields (supplier match, document type, validity window, format, ingested) + flag block + source footer. Closes on Escape + backdrop click.
  - `src/components/detail/SupplierHeader.jsx` — back link ("Supplier Trust") · 2xl supplier name + subtitle with added-date · 7 PillarChips · `lg` TrustScoreRing + StatusPill + delta chip · primary "Generate audit bundle" (emerald fill) + ghost "Request update" (emits toast) + More menu. Primary-contact line beneath actions.
  - `src/components/detail/PillarList.jsx` — left column, 7 pillars. Sort: fail → missing → pending → pass (then weight desc as tiebreaker). Active pillar gets emerald left-bar + paper-100 bg. Clicking same pillar clears the filter (toggle). Clear-filter ghost link when a filter is active.
  - `src/components/detail/EvidencePanel.jsx` — center column. Header copy: "Evidence for FEI registration · 3 documents on file · 1 needs review." Body: EvidenceRow list. Footer: Upload + Request-from-supplier ghost buttons. Empty states — MissingPillarEmpty (with pillar-specific plain-English copy + dark primary CTA), AllClearEmpty (calm emerald check).
  - `src/components/detail/ActivityPanel.jsx` — right column. Three collapsible sections: Recent activity (default open, shows up to 10 events for this supplier with tone-colored icons), Supplier contact (name/email/last-contacted + Compose + Open-in-CRM actions), Notes (read-only).
  - `src/components/detail/SupplierDetail.jsx` — composition. 240px / flex-1 / 320px three-column grid. No-supplier fallback with back link.
- App wiring: `src/App.jsx` `case 'supplier-detail'` now renders `<SupplierDetail />`. `<ToastStack />` mounted in the Shell.
- Pulled forward from phase 3: `src/components/shell/ToastStack.jsx` — top-right stack, up to 3 visible, 8s TTL with hover pause, tone-colored icons (info/ok/warn/block), dismiss button, optional action CTA that deep-links via openSupplier / openAuditBundle / navigate.

## Verification evidence (phase 2B)

- Delimiter-balance scan clean on 8 new/changed files.
- Import-graph existence check: 24 source files scanned, all relative imports resolve.
- TrustContext `navigate(page, { supplierId, pillarKey })` used exclusively for pillar selection — no ad-hoc state inside PillarList.
- DocumentPreview is lexically contained to the EvidencePanel; no portal required (z-50 + fixed inset-0).

## Phase 2C deliverables shipped

- `src/components/bundle/AuditBundleModal.jsx` — full-viewport overlay (bg-ink-900/45, z-50). Header: "Audit bundle" eyebrow + supplier name + metadata strip (date · trust score · status). Body (scrollable, bg-paper-50):
  - Warning band for suppliers with any missing pillars ("This supplier has evidence gaps — the bundle will reflect current status").
  - `CoverPreview` — printed-paper surface (#FEFEFB). Sparkles wordmark top-right. 3xl supplier name. Dashed-underline editable "Prepared for" input. 4-col `Fact` grid (Generated / Trust score / Status / Documents / Facilities / Active ingredients / Last scan / Scope). Pillar strip with 7 labeled chips, each carrying a status dot. Footer line: "Continuous compliance monitoring · valent.trust".
  - Evidence checklist — border-wrapped, each row has checkbox · file icon · title · pillar label + relative-ingested metadata · confidence chip (high/medium/low) · Preview ghost. Check-all/Uncheck-all toggle. Initial selection: every doc whose pillar status is not `missing`.
  - Collapsible "Add note to recipient" textarea. Draft badge when populated.
- Footer: summary (N documents · N passing pillars · estimated N-page PDF) + Cancel (ghost) · Email to recipient (ghost, opens `EmailDialog`) · Download PDF (emerald primary). Download fires ok toast "Audit bundle queued · N documents for {supplier}" and flashes Check glyph on the button for 1.5s. Modal stays open (operator continues per J2).
- `EmailDialog` sub-modal — z-60, To/Subject/Body prefilled from preparedFor + supplier. Send emits ok toast "Audit bundle sent · To {recipient} · N documents" and closes. Escape on sub-modal dismisses sub-modal only; parent stays open.
- `DocumentPreview` stacked on top (z-50) when Preview is clicked.
- `EmptyBundle` fallback (no evidence) — Inbox icon + "Nothing to bundle yet" + "Set up ingestion" ghost button navigating to `ingest`.
- App wiring: `<AuditBundleModal />` rendered once in `Shell`, beside `<ToastStack />`. Driven entirely by `auditBundle` in context.
- Three live entrypoints: `SupplierRow` (grid hover CTA), `SupplierHeader` (Generate audit bundle primary), `ToastStack` (action type `open-bundle`).

## Verification evidence (phase 2C)

- `@babel/parser` (via `node_modules/@babel/parser`) parse-check clean on 20 source files — all phase 1/2A/2B/2C JSX + context.
- Import-graph existence check: every relative import in AuditBundleModal resolves (TrustContext, suppliers, documents, trustPillars, DocumentPreview).
- `emitToast({ tone, title, body, supplierId })` signature matches context contract.
- Escape handling order: `preview → emailOpen → parent`. Backdrop click closes parent; sub-modals swallow propagation.

## Phase 3A deliverables shipped

- `src/components/ingest/SourceCard.jsx` — per-source tile (~220px min-width). Icon + uppercase label eyebrow + monospace source detail + 7-day count chip + connected emerald dot + "last sync · Nh ago" + Configure ghost button. Configure emits a `"Source configuration opened"` toast.
- `src/components/ingest/DocumentRow.jsx` — inbox row. Source-typed icon (email → Mail / sharepoint → HardDrive / sftp → ServerCog / manual → Upload). Supplier chip (nested clickable `role="link"` that calls `openSupplier` and stops propagation). Confidence chip (high/medium/low) + link-status chip (linked / needs review / failed to parse) + relative-ingested time. Needs-review rows get warn left bar; failed rows get block left bar. Row click fires `onOpen(doc)` → `DocumentPreview`.
- `src/components/ingest/IngestInbox.jsx` — top-level screen. `SOURCES` constant (Email `compliance@elevationlabs.example` / SharePoint `/Compliance/Suppliers` / SFTP `edi.elevationlabs.example` / Manual upload). Subtitle per positioning doc: "Email · SharePoint · SFTP · Manual — ingredient PDFs in, structured evidence out." Collapsible sources strip (default open). Filter chips (All / Needs review / Failed / Linked) with counts from `getIngestCounts()`. Sorted newest first. Opens `DocumentPreview` inline.
- Data helper used: `src/data/documents.js → getIngestCounts()`.

## Phase 3B deliverables shipped

- `src/data/flags.js` — `deriveFlags()` synthesizes flag records from pillar statuses + document link statuses. Severity map: `fail` / `missing` → blocker; `pending` → watch; failed-to-parse → blocker; needs-review → watch. `PILLAR_TITLE` map provides plain-English titles per pillar × status (e.g. `fei.fail: 'FEI registration invalid'`, `freshness.fail: 'Documentation expired'`). Deterministic `hashInt(seed)` seeds `openedAt` (blocker 1–9d, watch 3–15d, informational 2–22d) and assignee rotation (Sarah Chen / unassigned / Gary Ruiz / Sarah Chen). Onboarding suppliers suppress pending/missing noise. Exports `FLAGS`, `getFlagsForSupplier`, `getFlagCounts`.
- `src/components/review/FlagRow.jsx` — severity-toned row. Blocker → AlertOctagon + block-50 + block left bar. Watch → Clock + warn-50 + warn left bar. Informational → Info + paper-100, no bar. Row is `role="button"` and navigates to supplier-detail with pillar preselected. Hover-revealed actions: Resolve (emerald), Route (popover with procurement / quality / legal), Open supplier (dark primary).
- `src/components/review/FilterBar.jsx` — sticky strip. Scope chip ("This supplier · {name}") visible only when `activeSupplierId` is set, X clears. Four dropdowns (Pillar / Severity / Assignee / Status). Right-aligned counts: "{visibleOpen} open · {thisWeek} this week · {me} assigned to you".
- `src/components/review/ReviewQueue.jsx` — portfolio triage surface. Local state: `filters`, `resolvedIds` Set, `routedIds` Set, `collapsedGroups` Set. Grouping by supplier when no scope (sorted by STATUS_ORDER then trustScore asc); flat list when supplier-scoped. Empty states: `AllClearEmpty` ("No open flags — all 7 pillars healthy across your supplier base.") and `NoMatchEmpty` (Clear filters ghost button).

## Phase 3C deliverables shipped

- `src/hooks/useSupplierSearch.js` — `useMemo` hook. Case-insensitive weighted scoring: name prefix +100, name substring +60, subtitle substring +30, notes substring +15, id substring +10. `MIN_SCORE = 10` filters noise. Returns `{ supplier, score, snippet }[]` sorted score desc then name asc, capped at `limit` (default 6). `extractMatch()` yields a ±20/40 char notes snippet with ellipsis.
- `src/components/shell/TopBar.jsx` — search rewritten from phase 1 disabled placeholder to live typeahead. State: `query`, `open`, `activeIndex`. Keyboard: ArrowDown/Up traverse, Enter commits (calls `openSupplier`), Escape clears + closes. Click-outside closes via `mousedown` listener on `containerRef`. Dropdown header shows match count + Enter hint; rows show supplier name + mono trust score + snippet (or subtitle fallback) + StatusPill. `onMouseDown={e => e.preventDefault()}` on result buttons prevents input blur from cancelling the click.

## Verification evidence (phase 3)

- `@babel/parser` parse-check clean on all 10 phase-3 files (3 ingest · 3 review · 1 data · 1 hook · TopBar rewrite · App.jsx unchanged but included in sweep).
- Import-graph existence check: every relative import in the phase-3 files resolves.
- `openSupplier(id)` / `openAuditBundle(supplierId, pillarKeys)` / `emitToast({ tone, title, body, action, supplierId })` / `navigate(page, { supplierId, pillarKey })` — all context dispatchers used from phase-3 components match the TrustContext contract shipped in phase 1.
- No phase 2 code was regressed — positioning doc copy edits already landed ahead of phase 3.

## Phase 4 deliverables shipped

- `src/data/adminMetrics.js` — hard-coded admin payload. Four KPI shapes (docs-week, hours-saved, operators, triage-time) with value + unit + delta + deltaTone; 8-week `WEEKLY_ADOPTION` series (Feb 24 → Apr 13, tail bar matches the weekly KPI at 318 docs); six-person `TEAM_ROSTER` (Sarah / Gary / Rachel + three supporting operators) with role + last-active + weeklyTriage; three `SETTINGS_GROUPS` (data sources / notifications / roles) with plain-English items.
- `src/components/admin/AdminAdoption.jsx` — gated surface rendered inside `<LockedPageShell>`. Sections: 4 KPI tiles (lg:grid-cols-4, mono tabular-nums values, tone-coded delta lines), 8-week bar chart (Recharts `BarChart` with emerald `#10B981` bars, dashed horizontal grid `#E6E9F0`, tabular-nums total in header), team roster table (initials avatar + name + role + last-active mono + weekly triage right-aligned, "read-only in preview" pill), three-column settings strip (icon-led group cards with "configured" badges per item). Follows the existing design system — rounded-xl panels on paper-0, ink tone hierarchy, JetBrains Mono for numerics.
- `src/App.jsx` — `case 'admin'` now wraps `<AdminAdoption />` in `<LockedPageShell>` (tagline: "Team adoption, processing metrics, and source configuration. Enabled for design partners under contract."). The `LockedPlaceholder` fallback still drives the three Roadmap pages (Pipeline Aggregator / Bid Sandbox / Margin Engine). Added `<WedgeRoadmapStrip />` — pinned below `<main>` when `mode === 'wedge'`. Copy locked per `docs/60-positioning.md §"Roadmap surface in wedge mode"`: "Pipeline · Bid Sandbox · Margin Engine — available for design partners under contract." Muted ink, `aria-hidden`, no chevron, no interaction.
- Build stamp — already shipped in phase 1 via `Sidebar` footer ("Demo build · r1 · 2026.04.20"). Visible on every page because the sidebar is a permanent chrome column. Phase 4 verified; no duplicate stamp added elsewhere.
- `scripts/parse-check.mjs` — finalized in phase 1, re-verified this phase. Walks `src/` + top-level configs (`tailwind.config.js`, `postcss.config.js`, `vite.config.js`) with `@babel/parser`. Wired to `npm run parse-check` in `package.json`.

## Verification evidence (phase 4)

- `@babel/parser` parse-check clean on all 40 source files (every `src/**/*.{js,jsx}` + three configs). New additions: `src/data/adminMetrics.js`, `src/components/admin/AdminAdoption.jsx`. Rewritten: `src/App.jsx`.
- Import-graph existence check clean: `recharts` + `lucide-react` present in `package.json` dependencies; the new `'../../data/adminMetrics.js'` relative import resolves; the new `'./components/admin/AdminAdoption.jsx'` import in `App.jsx` resolves.
- Wedge-mode contract honored: `Shell` reads `mode` from `useTrust()`; `<WedgeRoadmapStrip />` renders only when `mode === 'wedge'`. Sidebar already hides Roadmap in wedge mode (phase 1). With `?mode=wedge` the only expansion-scope surface is the pinned bottom strip.
- Default mode contract honored: Sidebar Roadmap section renders collapsible with three locked items (Pipeline Aggregator / Bid Sandbox / Margin Engine); strip is absent.
- Admin locked surface renders structured content through the blur — 4 KPI tiles + weekly chart + team roster + settings groups — matching `docs/06-screen-admin-adoption.md §"What the blurred content shows"`.
- Phase 2 / 3 code unchanged by phase 4 work; no regression surface touched.

## Round 1 fix ledger (phase 6)

All 10 defects from docs/50-verification-plan.md §Round 1 resolved. Main-thread work, parse-check clean after the sweep.

1. **TodaysWorkCard draft-email → ChaseDraftModal.** `handleCta` now branches on `actionKey === 'draft-email' && item.flagId` and calls `openChaseDraft(item.flagId)` before the toast fallback. Comment updated to document the action-keyed router (draft-email · request-renewal · reconcile · open-supplier). Surface #4 now fires from the Trust Grid hero.
2. **Operator-name unification.** TopBar chip changed from `Sarah Reed` / `SR` to `Sarah Chen` / `SC`. One source of truth across ChaseDraftModal `OPERATOR_NAME`, TrustContext `resolveFlag`, AdminAdoption `TEAM_ROSTER`, and the TopBar chip.
3. **Audit bundle header copy reverted to spec.** Was `Valent pre-selected {N} documents across {M} of 7 pillars — review and confirm.` Now `Valent selected {N} documents across 7 pillars — review and confirm.` Removed the `valentPickPillarCount` memo (no longer used). Provenance chip title updated to match.
4. **Trust Grid subtitle supplier count reconciled.** Code already renders `{SUPPLIERS.length}` dynamic (= 14 against the live roster). `docs/01-screen-trust-grid.md §Header` rewrote the spec copy from hard-coded "18" to `{SUPPLIERS.length}` with a parenthetical noting earlier drafts said 18 aspirationally.
5. **PillarList sort order fixed.** `STATUS_ORDER` rewritten from `{ fail: 0, missing: 1, pending: 2, pass: 3 }` to `{ fail: 0, pending: 1, pass: 2, missing: 3 }`. Comment added explaining the operator-attention rationale (fail → pending → pass → missing).
6. **EvidencePanel empty-state branching.** New `renderEmptyState({ pillarStatus, pillarKey, supplier, onRequest })` router. Four states: MissingPillarEmpty (fail / missing with pillar selected), PendingPillarEmpty (new — "awaiting response" with ghost Nudge-supplier CTA), AllClearEmpty (pass edge-case with pillar selected), OnboardingEmpty (new — no pillar + zero docs across the whole supplier; fires "Request intake packet" primary CTA with a six-pillar listed of what to chase). `AllClearEmpty` no longer misfires on onboarding suppliers or pending pillars.
7. **Per-pillar "Open in Review Queue" ghost link.** PillarList fail / pending rows render a secondary `text-[11px]` ghost link beneath the main button that calls `navigate('review', { supplierId, pillarKey })`. ReviewQueue reads `activePillarKey` on mount via `useState` initializer, and a `useEffect` keeps `filters.pillar` in sync with subsequent `activePillarKey` changes. Deep-links from pillar to flag now short-circuit the full-queue lap.
8. **SupplierRow Open → button.** Replaced `<span aria-hidden>` with `<button type="button">` that calls `handleOpen` (stops propagation to avoid double-open). Keeps the dark primary tone, adds hover and focus-visible states. Spec a11y compliance restored.
9. **Monitoring dropdown "+N more" wired.** Both Expiring and Aging categories now pass a `goFreshnessQueue` handler into `MoreLink`; clicking routes to the Review Queue filtered by `pillarKey: 'freshness'` and supplierId cleared. `MoreLink` also accepts a `label` prop to echo the destination ("View all in Review Queue"). New-awaiting-review category still routes to the Ingest Inbox.
10. **Audit bundle cover Last scan live value.** AuditBundleModal pulls `lastScanAt` and `now` from context, threads both through to `CoverPreview`; the Facts grid row changed from hard-coded `"within the hour"` to `formatRelative(lastScanAt, now)` with a safe fallback if either prop is missing.

## Post investor-ready feedback round (2026-04-21)

Three demo-feedback items from Felix captured as specs and tasks. These are **spec changes**, not yet implemented in code. Implementation deferred to next build session.

- **Task #50 · Ingest Inbox inline review/approve.** `docs/04-screen-ingest-inbox.md §2b` specifies a review-and-approve strip pinned to DocumentPreview's right panel when `linkStatus === 'needs-review'`. Three actions (Approve & link / Reject / Request re-extraction) + inline field corrections. Every action emits a `documentReview` audit event into the ActivityPanel stream. `docs/70-agentic-surfaces.md §1` amended with the HITL approval gate. `docs/30-state-contract.md` extended with the `documentReview` event shape and three new toast-tone mappings.
- **Task #51 · LLM summary in Evidence captured.** `docs/04-screen-ingest-inbox.md §2a` specifies a three-part agent summary (Contents / Gap / Suggested next step) at the top of DocumentPreview's right panel. Cyan chrome consistent with the Today's Work card. Data model extended: `document.summary = { contents, gap, suggestion, suggestionAction?, summarizedAt }`. New `ProvenanceChip` variant: `summarized`. `docs/70-agentic-surfaces.md §1` amended with the agent-summary block. Backward compatible — docs without a summary render without the block.
- **Task #52 · Valent-branded Draft-email button, remove per-row chip.** `docs/05-screen-review-queue.md` FlagRow anatomy rewritten: removed the per-row `ProvenanceChip variant="drafted"`, redesigned the Draft-email button with Sparkles glyph + cyan border treatment so the button itself carries the "Valent-drafted asset" signal. Provenance chip retained only in ChaseDraftModal footer. `docs/70-agentic-surfaces.md §3` amended to relocate the provenance signal.

Implementation rollout (when next build session picks this up):
1. Add `ProvenanceChip variant="summarized"` to `src/components/shared/ProvenanceChip.jsx`.
2. Extend `src/data/documents.js` with `summary` field on ~6 scrutinized docs (BASF / IMCD / Peter Greven / Alpine Botanicals and two more).
3. Rewrite `src/components/detail/DocumentPreview.jsx` to add the summary block (always) and the review-and-approve strip (needs-review only).
4. Extend `TrustContext` with `documentReviews: Map<documentId, { action, correctedFields, reason, actor, at }>` + `reviewDocument(docId, action, payload)` dispatcher, mirroring the `resolutions` pattern from phase 3.5.
5. Extend `ActivityPanel` event merge to include `documentReview` events.
6. Rewrite `src/components/review/FlagRow.jsx`: drop the per-row drafted ProvenanceChip, add the Valent-branded Draft-email button.
7. Parse-check sweep; update STATE.md with a ledger entry per item; ask Felix to eyeball.

## Next action (for fresh agent resuming this build)

1. Read this file.
2. Re-read `docs/00-master-prd.md`, `docs/10-user-journeys.md`, `docs/20-design-system.md`, `docs/50-verification-plan.md`, and `docs/70-agentic-surfaces.md`.
3. **Track A now shipped.** Only Track B remains:
   - **Track B (Round 2 self-review):** dispatch a fresh `general-purpose` subagent for cold-walk verification (PRD conformance + J1/J2/J3 + Jim/Alpine 90-second pitch), reference `docs/50-verification-plan.md §Round 1` as the defect baseline, append `§Round 2`. Feedback trio (tasks #50 / #51 / #52) is now in code — Round 2 should verify implementation matches the PRD patches captured in the "Post investor-ready feedback round" section.
4. Consume outputs on the main thread; iterate as needed. Exit when all four investor-ready gates pass and the feedback trio is verified in round 2.

Known soft spots that survive round 1 (worth flagging for round 2 but not pre-answered):

- J1 narrative BASF trust score (42 in doc vs derived 49 in code). Still unreconciled — narrative is the outlier.
- `resolutions` is session-only per project constraint. A reload between pitch resets state; known and accepted.
- Admin adoption metrics are hard-coded and do not animate through the blur — intentional per PRD (no live computation).
- `More` menu glyph in SupplierHeader is still an inert affordance — subagent flagged but not critical-path.
- `EmailDialog` `To` field blank on open when the `preparedFor` is a team name (e.g., "L'Oréal diligence team"); operator types an address. Known subagent flag, subjective.

## Guardrails for every phase

- Hard-coded JSON data layer — no fetch, no backend, no state libs beyond React Context.
- Stack: React 18 + Vite 5 + Tailwind 3 + Lucide + Recharts. No TypeScript.
- End user is a procurement team member at a mid-market cosmetic CMO. Every UI choice should pass the "does a Sarah in compliance ops find this useful on a Tuesday afternoon" test.
- Simpler than `valent-demo-light-v3`. Less data density per screen. Fewer KPI tiles. Larger tap targets. Clearer CTAs. Plain English.
- Supplier is the primary entity across every screen.
- Continuous monitoring is in the chrome, not a view.
- Evidence bundle is the hero output artifact.
- Margin framing is explicitly absent from the core loop.
- Parse-check every edit — runs locally via `npm run parse-check` once node_modules hydrates. In-sandbox fallback is `node --check` + delimiter-balance scan.
- Checkpoint every session-end: update this file's "Next action" block with the exact resume command.

## Scheduling handoff

If a session runs out of context mid-phase:
- Update this file with the exact next task ID + brief context.
- Seed a scheduled task via `mcp__scheduled-tasks__create_scheduled_task` with the prompt: "Resume Valent Trust Demo build per STATE.md in the Valent-Trust-Engine-Demo workspace. Start by reading STATE.md, then the referenced PRDs, then claim the next pending task via TaskList."
- The scheduled agent will run fresh, read state, and pick up.

## Drift log (PRD vs build)

Keep this short — things we noticed that phase 5 should decide on:

- ~~`docs/01-screen-trust-grid.md` subtitle reads "Continuous compliance across 18 suppliers."~~ **Resolved phase 6 round 1.** Subtitle spec rewritten to `{SUPPLIERS.length}` dynamic; code was already correct. Parenthetical notes that earlier drafts said 18 aspirationally.
- J1 (Morning triage) describes BASF's trust score as 42. With the seven-pillar weighting and the pillar pattern chosen for BASF, the derived score lands at 49. The narrative intent (Blocked, FEI + Freshness failing, Allergen expired) is preserved; the exact number drifts. Still unreconciled after round 1 — flagged for round 2 to decide copy vs weight tune.

## Session log

- 2026-04-20 · Phase 0 kickoff. Directory created. Task graph seeded (82–88).
- 2026-04-20 · Phase 0 complete. 11 specs written: master PRD, user journeys, design system, state contract, 6 screen PRDs (trust grid, supplier detail, audit bundle, ingest inbox, review queue, admin, roadmap), build order, verification plan. Waiting for user sign-off before phase 1.
- 2026-04-20 · Phase 1 complete. Vite scaffold, Tailwind config (full design token set), Inter + JetBrains Mono wired, data layer (14 suppliers / 48 docs / 20 events / 7 pillars / 6 personas), TrustContext, three shell components, App page switcher with placeholders for all 8 pages. Parse-check substitute passed: `node --check` clean on pure JS, JSX balance clean, import graph consistent. Felix to boot `npm install && npm run dev` locally to visually confirm shell reads right, then phase 2A begins.
- 2026-04-20 · Phase 2A complete. Three shared primitives (TrustScoreRing, StatusPill, PillarChip) + three grid components (PortfolioSummaryBand, SupplierRow, TrustGrid) + `getEvidenceFreshness` helper on documents.js. App.jsx routes `trust-grid` to real grid. Parse-check substitute clean across 7 changed files + 17-file import graph. Felix to visually confirm the grid reads right locally, then phase 2B begins (Supplier Detail).
- 2026-04-20 · Phase 2B complete. EvidenceRow (shared) + DocumentPreview + SupplierHeader + PillarList + EvidencePanel + ActivityPanel + SupplierDetail composition. App.jsx routes `supplier-detail` to real screen. Parse-check substitute clean across 8 files + 24-file import graph. Pillar filtering lives in TrustContext via `navigate('supplier-detail', { supplierId, pillarKey })`. DocumentPreview renders persona-driven paper surfaces (tint + grain + watermark + annotation) and an evidence-captured panel with synthesized fields. Felix to visually confirm the detail screen locally, then phase 2C begins (Audit Bundle modal).
- 2026-04-20 · Phase 2C complete. AuditBundleModal shipped — cover preview with editable prepared-for + 8-field fact grid + 7-pillar strip, evidence checklist with per-row preview and check-all toggle, collapsible note-to-recipient, 3-button footer (Cancel / Email sub-modal / Download PDF flash-to-Check). Download and Email emit toasts routed to `ToastStack`. Empty state handles the "no evidence yet" case with a Set-up-ingestion CTA. `@babel/parser` parse-check clean on all 20 phase-1/2 JSX files. Phase 2 closed. Felix to boot `npm run dev` and walk the full J1→J2 arc (grid → detail → bundle → download) before phase 3 (Ingest Inbox, Review Queue, global search) begins.
- 2026-04-20 · Positioning doc injected. See docs/60-positioning.md. Scope-limited copy edits applied to existing phase 2 screens; full implementation in 2C cover page and phase 4 roadmap strip. Edits: (a) AuditBundleModal cover preview now carries the "Generated from continuous supplier monitoring · MoCRA §604 / 606 / 607 / 609" tagline beneath the Prepared-for input. (b) TrustGrid header subtitle reframed from "Continuous compliance across N suppliers" to "Continuously monitored across 7 compliance pillars · N suppliers · last scan …" to reinforce continuous posture. (c) ActivityPanel "Recent activity" section title replaced with "Continuous monitoring since {Mon YYYY}" using supplier.addedAt. No structural changes to any component. New phase 4 TaskList entry tracks the wedge-mode roadmap strip (single non-clickable line at the bottom of the main region when mode === 'wedge').
- 2026-04-20 · Phase 3 complete. Three sub-phases landed. 3A (Ingest Inbox): SourceCard + DocumentRow + IngestInbox with 4-source strip (email / SharePoint / SFTP / manual) and filter chips (All / Needs review / Failed / Linked) over sorted document list; row click opens DocumentPreview inline. 3B (Review Queue): src/data/flags.js derives flag records from pillar statuses and document link statuses with deterministic seeding; FilterBar (scope + 4 dropdowns + counts) + FlagRow (severity-toned, hover-revealed Resolve / Route / Open actions) + ReviewQueue (grouped by supplier when unscoped, flat when scoped, calm emerald all-clear empty state). 3C (Global search typeahead): useSupplierSearch hook with weighted scoring across name/subtitle/notes/id; TopBar rewritten with arrow-key navigation, Enter-to-commit, Escape-to-clear, click-outside close. `@babel/parser` parse-check clean across all 10 phase-3 files; import-graph existence check clean. Phase 3 closed. Felix to boot `npm run dev` and walk J1 (grid → detail → bundle), J2 (ingest → review → resolve), and J3 (search → detail) before phase 4 (Polish — admin pane, roadmap strip, ?mode=wedge verification, footer build stamps, parse-check script).
- 2026-04-20 · Phase 3.5 correction — resolve-with-note + audit trail. Closed a soft spot surfaced by Felix: Resolve was a one-click toggle with no provenance. Extended TrustContext with `resolutions: Map<flagId, { resolvedAt, resolvedBy, note }>` + `resolveFlag(id, note)` + `reopenFlag(id)` dispatchers; hoisted resolve state out of ReviewQueue local Set. New `src/components/review/ResolvePopover.jsx` — inline popover anchored to Resolve button, textarea with blocker-gating (min 8 chars on severity=blocker, optional otherwise), Cancel / Resolve (emerald primary, disabled when invalid), Escape + Cmd/Ctrl-Enter shortcuts, click-outside close. FlagRow rewritten to render resolved-state row (line-through title, emerald check, "resolved Nm ago · Sarah Chen · {note}" subtitle, Reopen ghost replacing Resolve+Route). ActivityPanel merges `flag-resolved` synthetic events for the active supplier into the timeline — resolutions are now the audit trail at both the portfolio view (Review Queue → Status: Resolved) and the entity view (Supplier Detail → Activity). `@babel/parser` parse-check clean on all 5 touched files; relative imports resolve. No dedicated audit-log page added — the trail lives in the existing surfaces, per Vanta-analogue.
- 2026-04-20 · Phase 4 complete. Polish pass landed. New `src/data/adminMetrics.js` — 4 KPI shapes + 8-week WEEKLY_ADOPTION + 6-person TEAM_ROSTER + 3 SETTINGS_GROUPS, internally consistent (tail bar matches weekly KPI, headcount matches roster). New `src/components/admin/AdminAdoption.jsx` — 4 KPI tiles / Recharts 8-week bar chart / team roster table / three settings cards, rendered inside `<LockedPageShell>` so the blur reveals real structure instead of an empty plate. `src/App.jsx` rewritten: `case 'admin'` now wraps `<AdminAdoption />` in the locked shell with a design-partner-under-contract tagline; new inline `<WedgeRoadmapStrip />` pins a non-clickable "Pipeline · Bid Sandbox · Margin Engine — available for design partners under contract." strip to the bottom of `<main>` when `mode === 'wedge'`. Copy locked per docs/60-positioning.md. Sidebar build stamp ("Demo build · r1 · 2026.04.20") + `scripts/parse-check.mjs` already shipped in phase 1 — re-verified this phase, nothing duplicated. `@babel/parser` parse-check clean on all 40 files (every src/**/*.{js,jsx} + tailwind/postcss/vite configs). Phase 4 closed. Next: phase 5 (fresh general-purpose subagent walks J1/J2/J3 cold + pitch arc, writes gap report to docs/50-verification-plan.md §Round 1).
- 2026-04-20 · Agentic surfaces doc injected. See docs/70-agentic-surfaces.md. Six surfaces phased across 2C, 3, and 4. Data model extended additively.
- 2026-04-20 · Agentic prerequisites landed (tasks #30 + #31). Additive data-model fields: `document.extraction { extractedBy, extractedAt, confidence, fields }` on all 48 docs (confidence null for manual source, bucketed 63/76/92 base + djb2 jitter for email/sharepoint/sftp — observed range 63–98 across 47 auto-extracted docs); `flag.createdBy = 'valent'` + `flag.suggestedRemediation { text, action }` on every derived flag; `supplier.trustScoreComputedAt` sibling to `trustScore` (sourced from `lastScanAt`). New file `src/data/todaysWork.js` — 6 hand-written ranked actions (4 blocker / 1 watch / 1 informational) tied to real flagIds + supplierIds, operator-voice reason + optional dueHint + cta { label, action }. New shared primitive `src/components/shared/ProvenanceChip.jsx` — 4 variants (extracted / computed / drafted / ranked), optional confidence + timestamp, accent-cyan pulse dot for the agent attribution marker, amber tint below 75% confidence to flag HITL review. `@babel/parser` parse-check clean on all 42 files. Paused here — no surface retrofit has touched any shipped component yet. Felix to eyeball the shapes before surface retrofits begin; next task #32 (Today's work card on the Trust Grid, 2A retrofit).
- 2026-04-21 · Phase 6 round 1 COMPLETE. Consumed `docs/50-verification-plan.md §Round 1` gap report; all 10 ranked defects fixed on main thread. Touched files: TodaysWorkCard (openChaseDraft routing), TopBar (Sarah Chen), AuditBundleModal (spec copy revert + live Last-scan + valentPickPillarCount dead memo removed), PillarList (STATUS_ORDER rewrite + per-pillar "Open in Review Queue" ghost link), ReviewQueue (useEffect sync of filters.pillar with activePillarKey), SupplierRow (span → button), EvidencePanel (PendingPillarEmpty + OnboardingEmpty + renderEmptyState router), MonitoringAlertDropdown (MoreLink label + goFreshnessQueue routing), docs/01-screen-trust-grid.md (dynamic count copy). `@babel/parser` parse-check clean on all 45 files. Details in the "Round 1 fix ledger" section above. Next: dispatch a fresh `general-purpose` subagent for Round 2 self-review cold walk; subagent appends `§Round 2` to docs/50-verification-plan.md.
- 2026-04-21 · Post-investor-ready feedback round captured (tasks #50 / #51 / #52). Three demo-feedback items from Felix turned into PRD patches, no code touched yet. Ingest Inbox §2a (agent summary block) + §2b (review-and-approve strip) added to `docs/04-screen-ingest-inbox.md`. Review Queue FlagRow anatomy updated in `docs/05-screen-review-queue.md` — per-row drafted ProvenanceChip removed, Draft-email button redesigned with Sparkles glyph + cyan border. `docs/70-agentic-surfaces.md` surface #1 amended with the agent-summary block and the HITL approval gate; surface #3 amended to relocate the provenance signal from row chip to branded button. `docs/30-state-contract.md` extended with `documentReview` event shape + three new toast-tone mappings. Rollout sequence documented in the "Post investor-ready feedback round" section of this file. Implementation deferred to next session — Felix to pick track A (ship) or track B (Round 2 cold review) first.
- 2026-04-21 · Agentic-surfaces retrofit COMPLETE. All seven surfaces landed. #32 Today's work card on Trust Grid (TodaysWorkCard above PortfolioSummaryBand, ranked chip header, action-specific CTAs). #34 Extraction provenance retrofitted onto EvidenceRow + DocumentRow + AuditBundleModal's EvidenceCheckRow — single `<ProvenanceChip variant="extracted" />` per row, amber tint <75%, manual-source docs drop the chip. #35 FlagRow suggested-remediation band with `<ProvenanceChip variant="drafted" />` + per-action CTAs (draft-email / request-renewal / reconcile); pending-state flags render text only, no CTA. #36 SupplierHeader trust score provenance (`<ProvenanceChip variant="computed" timestamp={trustScoreComputedAt} />`) beneath the status pill; suppressed on onboarding suppliers. #33 AuditBundleModal pre-selection header rewritten — stable "Valent pre-selected N documents across M of 7 pillars — review and confirm." copy (held via initial-Valent-pick memo; operator toggles update the footer count, not the attribution line) + `<ProvenanceChip variant="ranked" />`. #38 MonitoringAlertDropdown — anchored to TopBar pulse button, three categories (Expiring within 30d / Aging past 180d / New awaiting review), items routing to supplier detail or Ingest Inbox, healthy empty state, closes on Escape / click-outside (wrapper-level) / route change. New `getMonitoringAlerts(nowIso)` helper on documents.js. #37 ChaseDraftModal — opened from FlagRow Draft-email CTA via new `openChaseDraft(flagId)` dispatcher on TrustContext, pre-fills recipient/subject/body from supplier.primaryContact + per-pillar content map + 10-day deadline, `<ProvenanceChip variant="drafted" />` in footer with "review before sending" copy, Send emits an ok toast. `@babel/parser` parse-check clean on all 45 files. Phase 4 + agentic-surfaces retrofit closed. Next: phase 5 self-review by a fresh `general-purpose` subagent, cold-walk J1/J2/J3 + Jim/Alpine pitch.
- 2026-04-21 · Feedback trio shipped (tasks #50 / #51 / #52 via #58). (1) `ProvenanceChip` gained `summarized` variant → "Summarized by Valent". (2) `src/data/documents.js` decorated with `DOCUMENT_SUMMARIES` map — nine docs seeded (BASF §607 / allergen expired / Phenoxyethanol COA, Stepan CAPB out-of-spec COA, IMCD partial allergen refresh, Ashland FEI, Univar draft safety, Symrise Madagascar origin pending, inbox unmatched lecithin COA); each carries `{ contents, gap, nextStep }` with `gap: null` on clean docs. (3) `DocumentPreview` rewritten: new `AgentSummaryBlock` at top of right aside (three rows with tone-toned labels, uses summarized chip; graceful dashed fallback when `doc.summary` is absent), new `ReviewControls` at bottom of right aside gated on `linkStatus === 'needs-review' || 'failed'`, three-button default (Approve & link primary / Request re-extraction / Reject), Reject + Request-re-extraction open a note textarea with Cancel / Send feedback confirmation, already-reviewed state shows tone-matched audit stamp with Undo. (4) `TrustContext` extended with `documentReviews: Map<docId, { action, note, reviewedAt, reviewedBy }>` + `emitDocumentReview(docId, action, note)` + `clearDocumentReview(docId)` dispatchers; review actions emit tone-matched toasts. (5) `ActivityPanel` merges three new event types (`document-approved` / `document-rejected` / `document-reextraction`) keyed on the live `documentReviews` map — the Supplier Detail timeline is the single audit-trail surface for doc feedback. (6) `FlagRow` dropped the per-row `<ProvenanceChip variant="drafted" />`; the Draft-email CTA now carries Valent branding directly (1px `border-accent` + `<Sparkles className="text-accent">` glyph + font-semibold). Renewal and Reconcile CTAs unchanged — operator-direct actions, no agent artifact. `@babel/parser` parse-check clean on all 48 files. Round 2 self-review (Track B) remains pending.
- 2026-04-21 · Trust Grid cosmetic pass (task #59). Three changes, two files. (a) Valent TrustGrid rename. Sidebar `PORTFOLIO_ITEMS[trust-grid].label` swapped from string to React fragment: `<>Valent <span className="font-semibold text-accent">TrustGrid</span></>`. TrustGrid panel h2 rewritten to `<>Valent <span className="text-accent">TrustGrid</span></>` (outer h2 already `font-semibold` per design-system max). Both surfaces now brand the product name in accent cyan. (b) Tile order swap. PortfolioSummaryBand now renders first, TodaysWorkCard second. A `mt-4` wrapper was added around TodaysWorkCard to preserve inter-section spacing (previously provided by TodaysWorkCard's own `mb-4`). (c) MoCRA deadline banner. The subtitle-line deadline at the top of the header block was removed; a new amber warn banner (`border-warn-100 bg-warn-50 text-warn-700` with Clock glyph) sits above the header at the very top of the section, pinned as the first content the operator reads. Copy preserved — `§606 FEI registration · {supplier} · {YYYY-MM-DD} (N days)` — but now with semantic tone instead of ink-400 subordination. `@babel/parser` parse-check clean on all 48 files.
- 2026-04-21 · Review Queue groups default-collapsed (task #60). Flipped the grouping state in `src/components/review/ReviewQueue.jsx` from `collapsedGroups` (empty default → everything expanded) to `expandedGroups` (empty default → everything collapsed). Operator now lands on a portfolio-shape view — supplier name, trust score, severity counts per group — and drills into a specific block by clicking its chevron. The `toggleGroup` add/delete pattern stays identical; only the derivation flips (`collapsed = !expandedGroups.has(groupKey)`). No change to scoped mode (activeSupplierId present → groupingOn = false → flat list renders as before). `@babel/parser` parse-check clean on all 48 files.

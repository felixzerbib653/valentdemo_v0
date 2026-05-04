# Screen PRD — Supplier Detail

## Purpose

The drill-down. Answers "what specifically is broken for this supplier, and what do I do about it?"

## User goal

Understand the full compliance posture of one supplier, drill into any failing pillar to see the evidence, and initiate the right remediation action in one to two clicks.

## Primary journeys supported

J1 Morning triage (after clicking a grid row). J2 Buyer audit prep (via "Generate audit bundle"). J3 New flag (via toast deep-link). J5 Change-control.

## Layout

Three columns under a page header.

### Page header (full width)

Sits above the three-column body, ~120px tall.

- Left: back button ("← Supplier Trust") + supplier name (`text-2xl`, `font-semibold`, ink-900) + small subtitle ("2 facilities · 4 active ingredients · added 2024-08-11").
- Center: trust score ring, `lg` size (96px), with center number and status word ("49 · Blocked"). Below the ring: delta chip ("-4 this week").
- Right: primary action cluster — **Generate audit bundle** (primary button, emerald fill) + **Request update** (ghost button) + **More** menu (three-dot).

### Left column (240px, fixed)

**Trust pillars list.** Seven rows, one per pillar. Each row clickable.

- Icon (status-colored)
- Pillar full label (`FEI registration`, `§607 cosmetic listing`, etc.)
- Status word (`Pass` / `Watch` / `Blocked` / `Missing`) in small-caps metadata
- Last-evaluated timestamp (right-aligned, muted)

Active pillar (clicked) shows a left-edge 3px emerald bar + `paper-100` background. Sets `activePillarKey` in context; the center column updates to reflect.

Sorting: failing pillars first (red), then pending (amber), then pass (muted), then missing (outlined empty).

### Center column (flex-1)

**Evidence panel.** Shows the evidence tied to the active pillar. If no pillar is selected, shows all evidence for the supplier.

Header row: "Evidence for FEI registration · 3 documents on file · 1 needs review."

Body: list of `<EvidenceRow>` components. Each row:

- File-type icon (PDF, image, email attachment)
- Doc title (`text-sm`, `font-medium`)
- Ingested timestamp + source ("from email · 2024-10-14")
- Confidence chip (`High` / `Medium` / `Low` with a dot)
- Flag badges (if any) — "§606 not cited", "FEI not matched", etc.
- Click → opens `<DocumentPreview>` modal

Below the list: action strip — "Upload new document" (ghost) + "Request from supplier" (ghost).

If the active pillar has `missing` status, the evidence panel shows an empty state with a one-line plain-English explanation of what's needed: "No FEI registration on file. This supplier has not provided an FDA facility registration number or a copy of the registration certificate." Plus a "Request from supplier" primary button.

### Right column (320px, fixed)

**Activity & contact panel.**

Three collapsible sub-panels.

1. **Recent activity** (open by default). Chronological feed of events tied to this supplier — evidence ingested, pillar status changes, audit bundles generated. Last 10 events.
2. **Supplier contact.** Primary contact name, email, last-contacted timestamp. "Open in CRM" link (no-op toast). "Compose email" button.
3. **Notes.** Free-text internal notes, hard-coded in data. Non-editable in the demo; labeled "Notes (read-only in preview)."

## Data contract

Reads `suppliers.js` (the full supplier record including pillars) + `documents.js` (filtered to `supplier.id`) + `events.js` (filtered to `supplier.id`).

## Copy register

- Pillar labels in this view use the full name + §-anchor: `FEI registration · §606`. This is the first place in the user journey where the anchor appears; the grid used short labels, the detail page expands.
- Status words unchanged (Pass / Watch / Blocked / Missing).
- Evidence row copy leads with the plain-English document type ("Certificate of Analysis" not "COA" on first mention; the abbreviation can appear after).

## Interactions with other screens

- Back button / sidebar click → navigate to Trust Grid. Grid restores scroll position and highlights the last-viewed row.
- "Generate audit bundle" → `openAuditBundle(supplier.id)`.
- Evidence row click → `<DocumentPreview>` modal (in-page, not a page nav).
- Pillar row click → sets `activePillarKey` in context, updates center column. Also available: small "Open in Review Queue" ghost link per pillar for pillars with `fail` or `pending` status; clicking navigates to Review Queue pre-filtered.
- Toast CTAs that target this screen set `activeSupplierId` and optionally `activePillarKey`; the detail page mounts with the correct pillar pre-selected and scrolls to the evidence panel.

## Empty / edge states

- Supplier has no evidence at all (fresh onboarding): empty state for the evidence panel with "Set up ingestion" primary CTA → navigates to Ingest Inbox.
- Supplier has all pillars passing: center column shows a calm "All pillars pass — nothing needs attention today" empty state with a small emerald check. Activity panel still shows recent events.

## What this screen does not do

- Does not embed a full PDF viewer inline. PDFs open in a modal (`<DocumentPreview>`).
- Does not edit data. The supplier record is read-only; editing is a future capability.
- Does not surface portfolio-level context — no "rank among suppliers" or "portfolio percentile." This is a single-entity view.

## Investor-readiness gates (for phase 5)

- A reviewer can reach the worst pillar on the worst supplier in two clicks from Trust Grid.
- Clicking a pillar updates the center column with no flash or loading state (static data, instant).
- The trust score ring is the dominant visual at first glance, not the pillar list.
- The right column is collapsible and does not crowd the center.
- "Generate audit bundle" is the single most prominent CTA on the page.

## Known design questions to revisit

- Should the page header also carry the pillar chip strip from the grid (for consistency)? Proposal: no — the left column list is the pillar view on this page. Duplicating creates visual noise.
- Should the delta chip show a sparkline? Probably not for v1 — keep it to a single number.
- Is "Request update" a real action or a toast no-op? For demo: toast no-op with clear copy ("Compose window opened in Outlook"). For production: templated compose flow outside scope.

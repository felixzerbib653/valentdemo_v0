# Screen PRD — Supplier Trust Grid

## Purpose

Landing page. Answers "what do I need to look at today?" for a compliance ops operator.

## User goal

In under thirty seconds, identify which suppliers are not ready to ship and why, and click through to act on the worst one first.

## Primary journey supported

J1 Morning triage (primary). J3 New flag (entry via toast). J4 Onboarding (entry via search).

## Layout

Three regions, top-to-bottom.

### 1. Header strip (above the grid)

- Left: page title "Supplier Trust" + small subtitle "Continuous compliance across {SUPPLIERS.length} suppliers · last scan {x}m ago." Count is dynamic against the seeded roster — live roster is 14 (see docs/00-master-prd.md §Data shape). Earlier drafts of this spec said "18"; that reference was aspirational.
- Right: two controls — search input (global supplier search, mirrors the TopBar search but local on this page), filter dropdown ("All suppliers · {N}" / "Blocked · {N}" / "Watch · {N}" / "Ready · {N}" / "Onboarding · {N}"). Counts are dynamic.
- Height: ~80px total including padding.

### 2. Portfolio summary band

A single horizontal band, not a grid of tiles. Three slots separated by vertical dividers.

- **Left slot:** portfolio trust score (aggregate 0–100, font-mono, semibold, `text-4xl`). Below: "Portfolio trust score" label + delta chip ("+2 this week").
- **Center slot:** status distribution — horizontal stacked bar, ~12px tall, emerald/amber/red segments. Below: legend row ("3 blocked · 4 watch · 11 ready").
- **Right slot:** evidence freshness — "42 documents on file · oldest 28 days · 6 expiring this week." Below: a muted "Open ingest inbox" ghost link.

Total height: ~120px. Distinct from v3's six-tile KPI grid; this is a single visual unit that answers "how's the portfolio?" without fragmenting attention.

### 3. Supplier grid (the hero)

A vertical list of supplier rows. Each row ~72px tall.

Default sort: status (`blocked` first, then `watch`, then `ready`), then by trust score ascending within each status.

#### Row anatomy (left-to-right)

- **Trust score ring** (32px): circular ring, colored by status tone. Center number in font-mono, `text-sm`, semibold.
- **Supplier name + subtitle.** Name in `text-base`, `font-medium`, ink-900. Subtitle (`text-xs`, ink-500): "2 facilities · 4 active ingredients" or similar metadata.
- **Status pill.** `<StatusPill>` component — one of Ready / Watch / Blocked / Onboarding.
- **Pillar chip strip.** Horizontal strip of 7 `<PillarChip>` components — one per trust pillar. Each shows a 6px status dot + pillar short label (`FEI`, `§607`, `Safety`, `Allergen`, `Origin`, `Purity`, `Freshness`). Failed pillars show in red, pending in amber, pass in ink-500 (desaturated), missing as an outlined empty dot.
- **Last-updated timestamp.** Right-aligned, `text-xs`, ink-500. "Updated 2h ago" or "Last scan · now."
- **Row actions (hover-revealed):** two buttons — "Open" (primary) and "Audit bundle" (ghost). Desktop hover reveals them; on touch they're always visible.

#### Row interaction

- Click anywhere on the row (except action buttons) → navigate to Supplier Detail.
- Hover → `paper-100` background, reveals action buttons.
- Keyboard: arrow keys move focus through rows, Enter opens the focused row.

### 4. Empty / edge states

- No suppliers match filter: "No suppliers match this filter." + clear-filter ghost button.
- Loading (demo uses static data, so this state is decorative): skeleton rows with shimmer. Not required for v1.

## Data contract

Reads from `src/data/suppliers.js`. Each supplier record has:

```js
{
  id: string,
  name: string,
  facilitiesCount: number,
  activeIngredientsCount: number,
  trustScore: number,        // 0-100
  status: 'ready' | 'watch' | 'blocked' | 'onboarding',
  pillars: {
    fei: 'pass' | 'fail' | 'pending' | 'missing',
    cosmeticListing: 'pass' | ...,
    safety: ...,
    allergen: ...,
    origin: ...,
    purity: ...,
    freshness: ...,
  },
  lastScanAt: ISO string,
  lastUpdatedAt: ISO string,
  evidenceCount: number,
  subtitle: string,          // precomputed "2 facilities · 4 ingredients"
}
```

## Copy register

- Plain English over §-anchors. Pillar chip label is `FEI`, not `§606 FEI`. Tooltip or click expands.
- Status words: `Ready` / `Watch` / `Blocked` / `Onboarding`. No other statuses.
- Numbers use font-mono and tabular-nums.
- Timestamps are relative ("4m ago", "2h ago", "yesterday"). Absolute timestamps only in tooltips.

## Interactions with other screens

- Row click → Supplier Detail (via `openSupplier(id)`).
- Row "Audit bundle" ghost button → `openAuditBundle(id)` (modal opens without navigating).
- Header search → debounced, filters the visible list locally. Enter submits to full Supplier Detail of the top match.
- Filter dropdown → local UI state, no context write.
- Portfolio summary band's "Open ingest inbox" link → `navigate('ingest')`.

## What this screen does not do

- Does not show per-pillar portfolio aggregates. v3's compliance monitor had this; Trust Grid keeps the portfolio at an aggregate level and pushes pillar detail to per-supplier drill-down.
- Does not show documents. Documents live in Ingest Inbox and Supplier Detail.
- Does not show margin, bidding, or optimization framing. Ever.
- Does not surface the locked roadmap section — that's sidebar-only.

## Investor-readiness gates (for phase 5)

- A reviewer can answer "which supplier is the worst off" in under 5 seconds.
- A reviewer can articulate what the pillar chip strip means in under 15 seconds without being told.
- The portfolio summary band reads as one unit, not three competing stats.
- Empty-state copy does not use jargon.
- Keyboard nav works for rows and actions.

## Known design questions to revisit

- Should the row include a tiny sparkline of trust score over time? Deferred — probably noise for daily driver, useful for pitch. Decide at phase 5.
- Should blocked suppliers show a red left edge (3px bar) in addition to the status pill? Try it in phase 2; drop if it reads as alarm fatigue.
- The pillar chip strip is seven chips wide. On narrow viewports this may wrap. Minimum supported width is 1280px; below that, collapse to a count chip ("3 issues · hover for detail").

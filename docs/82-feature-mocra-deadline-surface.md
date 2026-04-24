# Feature PRD — MoCRA deadline surface

Layered on: `docs/01-screen-trust-grid.md`
Phase: 3
Competitive anchor: Worldover leans on CPSR/PIF and EU/UK regulatory framing. Valent's native regulatory framing is MoCRA — the statute Sarah's CMO actually lives under. Surfacing the next §-deadline on the landing page is a one-second signal that Valent is built inside the CMO's regulatory reality.

## Scope (2026-04-21 review) · COLLAPSED

**In scope for build — a single-line deadline ribbon on Trust Grid, derived from existing pillar data.** The full spec below (4-tile Supplier Detail row, `mocraState` collection, 4 inline §-chips on Trust Grid with click-to-filter) is deferred.

What ships:

- A compact one-line ribbon on the Trust Grid header region, right of the page title or beneath the subtitle. Format: `Next MoCRA deadline: §607 biennial listing · {Supplier} · {date} ({N} days).`
- Source: derived at render time from the existing pillar `dueDate` / `freshness` fields on the `suppliers.js` / `documents.js` data. No new `mocraState` collection.
- Visual: muted ink-400, 12px, no chip background. It reads as chrome context, not an interactive element. No hover tooltip in v1.
- Copy rule preserved: `§` glyph rendered literally, never "Section 607."

Why this is enough:

- The existing 7-pillar chip strip on SupplierHeader already encodes §606 / §607 / §608-equivalent / §609 per supplier. Adding a parallel 4-tile row duplicates state.
- A new `mocraState` collection would be a second source of truth for the same deadline data — drift risk on every pillar change.
- The compact ribbon carries the same five-second signal ("Valent speaks regulatory language natively") without chrome budget competition with Today's Work card + PortfolioSummaryBand.

Deferred from the spec below:

- The 4-tile row on Supplier Detail (§604 / §606 / §607 / §609). Redundant with the 7-pillar chip strip already in SupplierHeader.
- Inline §-chips with click-to-filter on the Trust Grid. Pillar chips already filter; no need for a parallel filtering taxonomy.
- The `mocraState` root collection. Derive instead.
- The per-supplier §-tiles and their "View evidence" CTAs.
- §604 (Responsible Person) references. Per the brand-is-Responsible-Person model, §604 is the brand's obligation, not the CMO's — surfacing §604 state on a CMO compliance screen is off-model. The ribbon leads with §607 / §606 / §609 deadlines only.

Everything under this line is preserved as reference for a later, wider MoCRA surface phase if wanted.

## Purpose

Make the product's regulatory framing legible on every screen. MoCRA isn't a feature — it's the compliance ground truth. A CMO who opens Valent should see the specific §-sections that matter to them, and the deadlines pinned to each. The demo needs this surface to hold up under a compliance-sophisticated buyer's gaze.

## User goal

Sarah glances at the Trust Grid and sees a band across the top — "§607 product listing · 2 items due within 90 days." She clicks it and a filtered list opens showing exactly which suppliers have listing windows approaching. She moves those to the top of her queue. No scrolling through every supplier row looking for deadline dots.

## Primary journey supported

J1 Morning triage (primary). J2 Buyer audit prep benefits when a prospective retailer asks "show me your §607 state" — Sarah has a single surface to open.

## Surface type

Composite. Two treatments:

- Trust Grid top band (sticky under the header, ~56px, full-width)
- Supplier Detail MoCRA strip (inside the supplier summary card, 4 pinned §-states)

## Layout

### Trust Grid top band

Full-width strip beneath the page header, above the grid.

- Four §-section chips inline, left-aligned: `§604 · Responsible Person`, `§606 · FEI`, `§607 · Product Listing`, `§609 · Safety Substantiation`. Each chip shows a small colored status dot (emerald, amber, red) and a count — e.g. `§607 · 3 due in 30d`.
- Right edge: a muted secondary string — `Next MoCRA deadline: §607 biennial listing · 2026-12-29 (254 days)`.
- Hover on a §-chip: tooltip with one-line statute paraphrase — e.g. "§607 requires product listing submission within 120 days of marketing; renewed biennially."
- Click on a §-chip: filters the Trust Grid below to suppliers with an open item in that §.

### Supplier Detail MoCRA strip

Inside the Supplier Detail page, below the header summary, above the evidence list. Four tiles in a row — one per § (§604, §606, §607, §609).

Each tile:

- § label (slate-500, 12px)
- One-line status — `Submitted 2025-08-14`, `FEI valid through 2027-03`, `Due 2026-10-12 · 176 days`, `Substantiation file on hand`
- Status dot matching the band chip
- Ghost CTA: `View evidence` (scrolls the evidence list below to the relevant pillar)

If a § is missing for the supplier (no evidence on file), the tile shows a muted `Not on file · add evidence` CTA.

## Data contract

New root collection: `mocraState`.

```
mocraState: {
  lastComputed: "2026-04-20T08:00:00Z",
  byScope: {
    global: {
      "§604": { status: "green", countOpen: 0, nextDue: null, note: "Responsible Person named for 43 of 43 suppliers." },
      "§606": { status: "amber", countOpen: 2, nextDue: "2026-06-11", note: "2 facility FEI renewals within 60 days." },
      "§607": { status: "amber", countOpen: 3, nextDue: "2026-07-02", note: "3 product listings due within 90 days. Biennial renewal window." },
      "§609": { status: "green", countOpen: 0, nextDue: null, note: "All suppliers have substantiation files on hand." }
    },
    bySupplier: {
      "sup_midwest_chem": {
        "§604": { status: "green", lastEvent: "2025-08-14", label: "Submitted 2025-08-14" },
        "§606": { status: "green", lastEvent: "2024-03-10", label: "FEI valid through 2027-03" },
        "§607": { status: "amber", dueDate: "2026-10-12", label: "Due 2026-10-12 · 176 days" },
        "§609": { status: "green", lastEvent: "2025-11-02", label: "Substantiation file on hand" }
      },
      ...
    }
  }
}
```

Global states are rendered in the Trust Grid band. Per-supplier states are rendered in the Supplier Detail strip.

## Copy register

- Always render the section number with the § glyph, never as "Section 607" or "Sec 607." The glyph is the tell that the product speaks regulatory language natively.
- Deadline strings show both the date and the day-count — humans use both interchangeably; collapsing to one alienates half the audience.
- "Biennial" and "within 120 days of marketing" are phrases from the statute — use them sparingly to anchor credibility, not in every tooltip.
- "Not on file" is the neutral honest state. Not "Missing" (accusatory) or "Pending" (implies motion).

## Actions and their effects

- Click a §-chip in the Trust Grid band: filters the grid to suppliers with an open item in that §. The active chip gets a cyan outline. Second click removes the filter.
- Click a tile CTA in Supplier Detail: scrolls the evidence list to the relevant pillar. If no evidence, opens the `Add evidence` affordance (phase 3 work).
- Hover a chip or tile: tooltip with statute paraphrase + computed reasoning (e.g. "Next due: Supplier Midwest Chem's product listing for Glycerin USP, submitted 2024-10-12, biennial refresh window opens 2026-07-02").

## Interactions with other screens

- Trust Grid: band appears above the existing filter bar. Does not replace or conflict with the existing status filter chips.
- Supplier Detail: MoCRA strip appears above the evidence list, below the supplier summary.
- Audit Bundle modal: the cover page's pillar strip gets a second row showing the four § statuses. Non-intrusive, one line.
- Today's Work: MoCRA-driven items (e.g. "§607 listing for Supplier X expires in 45 days") appear as a tagged work item — tag reads `§607 · due 45d`.

## Empty / edge states

- Supplier with no MoCRA state computed (demo edge): all four tiles show `Not on file · add evidence`. The band chip count excludes these suppliers from its denominator.
- Global `§604 status: red` (hypothetical — no Responsible Person named anywhere): band chip renders red and surfaces `Critical: no §604 on file for N suppliers` in the right-edge string. Unlikely in demo, but visible.
- `mocraState.lastComputed` older than 24h: a thin amber line at the bottom of the band — `Status refreshed 2d ago` — prompts the user without blocking. Demo default: freshly computed.

## Visual design notes

- The band is the single piece of chrome above the grid that is always MoCRA. It does not compete for attention with the grid rows; it sits above them, quieter in font weight.
- The § glyph should render at the same size as the section number — not oversized, not underweight. Use a Unicode-aware font stack.
- Status dots on chips and tiles are the same palette used elsewhere in the product (emerald/amber/red), so the reviewer reads the state without a legend.
- The supplier tile row should visually feel like a dashboard stat block, not a checklist — this is a summary, not a todo.

## What this feature does not do

- Does not compute §-status from live statute text. The `mocraState` collection is curated per demo supplier.
- Does not cover every subsection of MoCRA — only the four sections Sarah operationally tracks. §608 (adverse event reporting) is referenced in copy but not surfaced as a chip; it's a reactive flow, not a deadline flow.
- Does not file with FDA. This is a monitoring surface, not a submission channel.
- Does not localize to non-US regulatory regimes. Step-out roadmap (phase 6+).

## Competitive differentiation

Worldover's brand-facing framing speaks to CPSR, PIF, and retailer-specific standards — the export side of compliance. Valent's MoCRA surface speaks to the statute Sarah's CMO is *regulated under*, not the one her customers' brands export into. Naming the specific § sections on the home screen is a one-second signal that Valent is built inside the CMO's regulatory reality, not adapted from an EU-origin product.

## Investor-readiness gates (for phase 5)

- A compliance-literate reviewer reads the band in under five seconds and nods without asking what "§607" means.
- Clicking `§607` filters the Trust Grid visibly — the band chip shows a selected state and the grid below shrinks.
- The Supplier Detail tile row reads as part of the page, not a bolt-on — alignment and type weight match the surrounding summary card.
- At least one seeded supplier has an amber `§607` tile with a plausible due date the reviewer notices.
- The deadline string in the band's right edge is specific enough to feel real (date + day count + § + supplier context in tooltip).

## Known design questions to revisit

- Should §608 (adverse events) get a fifth tile? Probably yes in production — but it changes the visual rhythm from 4 to 5 tiles and muddles the deadline-centric framing. Deferred.
- Should the band collapse to a single summary chip on narrow viewports? Yes — below 1200px, collapse to `MoCRA: 5 items open · next due in 62 days` with a click-to-expand affordance. Land with the feature.
- Should the § labels be clickable to a glossary? Tempting, but a glossary page adds scope with little demo payoff. Tooltip is enough.

# Feature PRD — Multi-brand CMO view

Layered on: `docs/01-screen-trust-grid.md`, `docs/02-screen-supplier-detail.md`, `docs/03-screen-audit-bundle.md`
Phase: 3
Competitive anchor: Worldover is brand-first — one tenant is one brand's regulatory team managing that brand's products. Valent is CMO-first — one tenant is a contract manufacturer serving many brand customers from a shared supplier pool. That one-to-many data model is the competitive moat. This feature makes the moat visible in the UI.

## Scope (2026-04-21 review) · SPLIT · WAVE 1 SHIPS

The full spec is split into two waves. Wave 1 delivers the punchline (the sidebar card + bundle recipient defaulting); Wave 2 delivers the tenancy-model filter plumbing. The punchline is what a reviewer remembers; the plumbing they assume.

### Wave 1 — IN SCOPE for current build

What ships:

- **`brands` root collection** with **5 seeded brands** mapped across the existing 14 suppliers. Engineer exactly three overlaps where a single supplier is used by multiple brands — overlap is what makes the "shared pool" claim credible at a glance. Brand shape follows the original spec minus `retailerAccounts` (not used in Wave 1).
- **"Brands sharing this supplier" card** added to Supplier Detail's ActivityPanel sidebar (new collapsible section alongside Recent activity / Supplier contact / Notes). Lists brand name + SKU count per brand. Clicking a brand row in Wave 1 emits a toast with the brand's diligence contact ("Aurelia Skincare · compliance@aurelia.example"); no filter activation (filter is Wave 2). The card is the single visual expression of the CMO-tenancy moat.
- **Audit Bundle recipient defaulting.** When a supplier has exactly one brand in its `brandIds`, the bundle's `Prepared for` input defaults to `{Brand} QA team`. When a supplier has multiple brands, the placeholder becomes `Select brand · {N} brands use this supplier`. Operator can always override.
- **EmailDialog `To` field defaulting.** When `Prepared for` resolves to a single brand, the EmailDialog `To` field prefills with that brand's `diligenceContact`. Override inline.

### Wave 2 — DEFERRED (post-investor-ready phase)

What's deferred:

- Global BRAND selector in the app header chrome.
- Session-persisted brand filter state in TrustContext.
- Trust Grid cyan scope-band (`Scoped to Aurelia Skincare · 14 of 43 suppliers shown · clear`).
- Brand-aware filtering on Review Queue, Ingest Inbox, MoCRA deadline ribbon (PRD 82).
- Empty states for "this supplier is not used by current-brand filter."
- Expanding from 5 to 12 seeded brands.
- URL-scoped filter (`?brand=aurelia`).

Wave 2 is the bigger build (touches every screen via cross-cutting filter state). It's better done as a focused phase rather than bolted onto current investor-ready polish.

### Why Wave 1 alone is enough for pitch

The "Brands sharing this supplier" card is the moment that makes a reviewer understand — without a pitch line — that Valent's tenancy model is structurally different from any brand-first incumbent. That card carries ~80% of the PRD's demo signal on its own. The global filter is useful ergonomics for Sarah's daily workflow, but not load-bearing for the five-second "oh" moment in a pitch.

Everything under this line is the original full spec. Sections pertaining to the header selector, cyan scope band, and cross-screen filter belong to Wave 2 and are not built in this pass.

## Purpose

Surface the CMO's many-brands-one-supplier-pool reality as a first-class dimension of the product. A CMO who contract-manufactures for twelve brands should be able to filter every screen — Trust Grid, Supplier Detail, Audit Bundle — by brand. That filter is the mechanic that makes Valent feel built-for-them rather than adapted-for-them.

## User goal

Sarah, serving twelve brand customers from one shared supplier pool, opens the Trust Grid and picks "Aurelia Skincare" from the brand selector at the top. The grid filters to suppliers touching any Aurelia SKU. She generates an audit bundle; the bundle's cover reads "Prepared for Aurelia Skincare's diligence team" by default. Brand context carries through the session without Sarah re-selecting at every screen.

## Primary journey supported

J2 Buyer audit prep (primary). The prep-for-a-specific-retailer flow is downstream of prep-for-a-specific-brand; the brand filter is the enabling step.

Also: J1 Morning triage benefits when Sarah wants to scope her morning to one brand's urgent list.

## Surface type

Global filter. Persisted in session state. Appears as a selector in the page header on Trust Grid, Supplier Detail, and Audit Bundle.

## Layout

### Header brand selector

Inline in the app header, immediately right of the app logo / wordmark.

- Label (slate-500, 11px, small-caps): `BRAND`
- Selector chip: `Aurelia Skincare ▾` (slate-100, 14px, medium weight, cyan hover)
- Click opens a dropdown with all seeded brands + an `All brands` default.
- Dropdown rows show brand name (slate-100) and supplier count (slate-500) — e.g. `Aurelia Skincare · 14 suppliers`.

Default state: `All brands` (no filter).

### Filtered-state visual signals

When a specific brand is selected:

- Header selector chip renders with a subtle cyan underline.
- Trust Grid: a thin cyan band under the header with the string `Scoped to Aurelia Skincare · 14 of 43 suppliers shown · clear`. `clear` is a ghost action that returns to `All brands`.
- Supplier Detail: the brand scope shows in the breadcrumb — `Trust Grid · Aurelia Skincare · Midwest Chemical`. The supplier's own detail content is unchanged, but a small "Brands sharing this supplier" card appears in the sidebar (see below).
- Audit Bundle modal: the `Prepared for` field defaults to `Aurelia Skincare diligence team` instead of the generic placeholder. The bundle cover footer reads `Prepared on behalf of Aurelia Skincare`.

### Supplier Detail sidebar: "Brands sharing this supplier"

A small card on Supplier Detail (visible regardless of whether a brand filter is active). Shows the list of brands whose SKUs use this supplier.

- Title: `Brands using this supplier · 5`
- Rows: brand name + SKU count — `Aurelia Skincare · 3 SKUs`, `Finca Beauty · 1 SKU`, etc.
- Clicking a brand row: sets the brand filter to that brand and stays on the current supplier.

This card is the product's sharpest expression of the CMO data model. It reads as "you share this vendor across your book of business" — something a brand-first tool structurally can't show.

## Data contract

New root collection: `brands`.

```
brands: [
  {
    id: "brand_aurelia",
    name: "Aurelia Skincare",
    segment: "luxury skincare",
    supplierIds: ["sup_midwest_chem", "sup_borneo_naturals", "sup_fragrance_co", ...],
    skuCount: 34,
    retailerAccounts: ["Sephora", "Neiman Marcus"],
    diligenceContact: "compliance@aurelia-skincare.example"
  },
  {
    id: "brand_finca",
    name: "Finca Beauty",
    segment: "mass clean beauty",
    supplierIds: ["sup_midwest_chem", "sup_amazon_oils", ...],
    skuCount: 12,
    retailerAccounts: ["Target · Target Clean", "Ulta"],
    diligenceContact: "qa@finca-beauty.example"
  },
  ...
]
```

Existing `suppliers` collection gains a derived `brandIds` field (populated from `brands[].supplierIds` on load).

Twelve brands seed for the demo. Enough to make the shared-pool dynamic real; not so many the selector becomes a scroll surface.

## Copy register

- The selector label is "BRAND" in small-caps, explicitly singular even when `All brands` is selected. The label names the axis, not the current value.
- "Scoped to" as the filter-state string on Trust Grid. Not "Filtered by" (too generic), not "Showing" (weakens the context).
- "Brands sharing this supplier" on Supplier Detail carries the one-to-many framing in the title itself. The word "sharing" is the tell.
- Audit bundle recipient phrasing — `Aurelia Skincare diligence team` — is a naming convention, not a live integration. Use ` diligence team` consistently across all seeded brands.

## Actions and their effects

- Select a brand in the header: filters the current screen immediately. Persists across navigation within the session. Survives refresh (session-scoped, not URL-scoped; demo resets on hard reload).
- `All brands`: clears the filter, removes the cyan band, returns to unscoped view.
- Click a brand row in the "Brands sharing this supplier" card: sets the filter to that brand. The current supplier stays loaded; the breadcrumb updates.
- Generate audit bundle while a brand is selected: bundle's `Prepared for` defaults to the brand's diligence team; Sarah can still override inline.
- Unselecting mid-bundle (via `clear`): the bundle's `Prepared for` field does not clear — once edited, it stays. Filter state and bundle state are independent after bundle open.

## Interactions with other screens

- Trust Grid: filter reduces the grid row set.
- Supplier Detail: accessible even when supplier is not in the current brand's pool (direct-link scenarios). A muted note appears: `This supplier is not used by Aurelia Skincare · view all brands →`.
- Audit Bundle: pre-fills recipient field; retailer selector (PRD 80) is unaffected by brand scope.
- Agent Activity Digest (PRD 83): respects the brand filter when active. The digest stats recompute for the scoped supplier subset. (Seeded per brand.)
- MoCRA deadline surface (PRD 82): respects the filter. The band's counts reflect the current brand scope.
- Retailer bundle variants (PRD 80): brand and retailer are orthogonal axes. A CMO selects both; the bundle stamps both on the cover.

## Empty / edge states

- Brand with zero suppliers in the pool (shouldn't happen, but render-safe): Trust Grid shows an empty state — `No suppliers currently in Aurelia Skincare's pool.` with a `clear filter` ghost CTA.
- Supplier used by only one brand: the "Brands sharing this supplier" card renders with a single row and the title `Brands using this supplier · 1`. No special treatment.
- Many brands (>8) in the sharing card: scroll within the card. Demo stays under this threshold deliberately.
- Direct-link to Supplier Detail for a supplier not in the filter's brand: the muted note appears, the page still renders, the filter stays active.

## Visual design notes

- The header brand selector sits to the right of the app logo; it reads as *identity* context, not *page* context. It is closer to an account switcher than a filter.
- The cyan band on Trust Grid is the single in-page signal that a filter is active. It must be visible but quiet — slate-900 background with a 1px cyan top border and a cyan-tinted body at ~8% opacity.
- The "Brands sharing this supplier" card uses the same slate-800 card surface as the rest of Supplier Detail's sidebar, with one visual differentiator: a small stacked-people icon next to the title to cue multiplicity.
- Brand names in dropdown and sidebar render in the same type treatment as supplier names — this reinforces that brands are first-class entities in the data model, not a lens layered on top.

## What this feature does not do

- Does not add a per-brand login or permission boundary. In the demo, Sarah sees all brands; the filter is a scoping lens, not an access control.
- Does not synthesize per-brand compliance states from scratch. The underlying supplier evidence is shared; the filter shows which brands touch which evidence.
- Does not send emails to the brand contacts. The `diligenceContact` field is metadata for recipient defaulting, not an outbound channel.
- Does not expose brand financials, revenue, or margin data. Out of scope for a compliance surface.

## Competitive differentiation

Worldover's tenant model is brand = tenant. A CMO using Worldover would need twelve Worldover instances for twelve brand customers, each with its own duplicated supplier pool. Valent's tenant model is CMO = tenant, with brands as first-class entities inside that tenant, all drawing from one shared supplier pool. The "Brands sharing this supplier" card is the single clearest visual expression of this distinction. Any reviewer seeing that card understands — without a pitch — that Valent's data model is structurally different from any brand-first incumbent's. Rebuilding this in Worldover's shape would require rebuilding the tenancy model.

## Investor-readiness gates (for phase 5)

- A reviewer selecting a brand sees the Trust Grid visibly shrink (43 → 14) and the cyan band confirm the state — the reaction is immediate.
- The "Brands sharing this supplier" card reads as the demo's punchline moment on Supplier Detail. Reviewers notice it without prompting.
- Generating an audit bundle while a brand is selected shows the pre-filled recipient string on the cover — the brand context carries through to the artifact.
- Filter persistence across screens works smoothly; the brand selector doesn't reset when Sarah clicks into a supplier.
- The brand dropdown has at least twelve seeded brands, three of which overlap on at least one supplier. The overlap is what makes the "shared pool" claim credible.

## Known design questions to revisit

- Should the brand filter be URL-scoped (deep-linkable `?brand=aurelia`) rather than session-scoped? Probably yes in production; session-scoped is fine for demo.
- Should brands have their own detail page (list of SKUs, compliance summary per brand)? Deferred to phase 4. The filter itself is enough to demonstrate the data model without a dedicated brand screen.
- Should the audit bundle cover include both the brand recipient and the audit program format simultaneously? Yes. The brand axis names the recipient (`Prepared for: Aurelia Skincare QA team`); the program axis names the format the brand will submit to (`· Clean at Sephora audit program`). Two lines on the cover, two orthogonal axes — one says who's receiving it, the other says what shape it's in. Land with this feature.
- Should the `diligenceContact` auto-populate into the `Email to recipient` modal's `to` field? Yes, with an override. Small UX win; land with this feature.

# Design System

The v3 demo was PE-grade — data-dense, tile-forward, dashboard-y. That aesthetic is correct for a pitch deck audience but wrong for the actual end user. Valent Trust's UI is built for a Compliance Ops operator with thirty open tabs who needs to answer "what do I do next" in five seconds.

The rules below codify that shift.

## Principles

**Entity-first layouts.** Every screen leads with supplier rows or a supplier header. KPI tiles are support, not hero.

**Plain English before jargon.** "Supplier not ready to ship" beats "§606 FEI registration missing." The §-anchor appears only on drill-down.

**One job per screen.** Each screen answers one user question. Secondary information lives in expandable panels, not in the primary layout.

**Room to breathe.** v3 had ~6px to ~12px gutters between dense tiles. Trust uses 16–24px as the default, and reserves compact spacing only for row-internal layouts.

**One accent color per surface.** v3 used four accent hues routinely (profit, signal, danger, cyan). Trust reduces to three semantic tones plus one brand accent. Never more than two accent hues on screen at the same time.

**Tap targets are buttons, not text.** Every clickable affordance is a sized control with a border or background. No underlined-text navigation inside data regions.

## Palette

Light surface, low-chroma, single warm brand accent.

### Surface tones (light paper)

- `paper-0`  `#FFFFFF` — page background
- `paper-50` `#F8F9FB` — section background
- `paper-100` `#F1F3F7` — row hover, inactive tile
- `paper-200` `#E6E9F0` — tile background, muted bar
- `paper-300` `#D5D9E2` — hairline border
- `paper-400` `#BAC0CC` — subtle dividers

### Ink tones (text)

- `ink-900` `#0B1220` — headings, primary numbers
- `ink-800` `#1A2233` — body strong
- `ink-700` `#344055` — body
- `ink-600` `#4B5669` — secondary
- `ink-500` `#6B7388` — tertiary, metadata
- `ink-400` `#9099AA` — placeholder, disabled

### Semantic tones

Exactly three. They encode pillar status and map one-to-one to trust states.

- `ok` `#10B981` — emerald — `pass` pillars, "ready to ship," healthy trust-score rings. (Same hex as v3's `profit`, but repurposed for trust, not margin. Margin framing is absent from this product.)
- `warn` `#F59E0B` — amber — `pending` pillars, aging evidence, items approaching expiry
- `block` `#EF4444` — red — `fail` and `missing` pillars, "not ready to ship" status

### Brand accent

- `accent` `#22D3EE` — cyan — used only for the wordmark glyph, a single focus ring, and the "last scan" pulse. Never used to encode data.

### Why these exact choices

`ok` is emerald (not blue, not teal) because it needs to read as "healthy" with maximum perceptual salience for a glance-driven operator. `block` is red because "not ready to ship" is a legal/operational stop. `warn` is amber because the middle state is "evidence is there but something is aging" — this is different enough from a full block that it earns its own hue. Any additional hues dilute the signal.

## Typography

### Families

- Sans: **Inter** — UI, body, headers.
- Mono: **JetBrains Mono** — trust scores, counts, timestamps, anything tabular.

### Scale

- `text-xs` 11px — metadata, timestamps, status chips
- `text-sm` 13px — body, secondary labels
- `text-base` 14px — default body, row labels
- `text-lg` 16px — screen section headers
- `text-xl` 20px — page titles
- `text-2xl` 24px — supplier name in detail, modal titles
- `text-3xl` 30px — trust score hero number
- `text-4xl` 36px — rarely used; portfolio trust score on landing only

### Weights

- `font-regular` 400 — body
- `font-medium` 500 — row labels, tile titles
- `font-semibold` 600 — screen titles, numbers

No `font-bold`. The jump from semibold to bold is visually aggressive and not needed in a light-surface product.

### Casing

No all-caps labels in primary UI. v3 used uppercase tracked labels for section dividers — keep that pattern only in the sidebar section headers, and only at `text-[10px]`. Everywhere else: sentence case.

## Spacing scale

Use Tailwind's default 4-px scale but restrict to these values:

- `space-2` 8px — intra-component (icon → label)
- `space-3` 12px — row-internal (cell-to-cell in a compact table)
- `space-4` 16px — default gap between tiles, list items
- `space-6` 24px — section-to-section
- `space-8` 32px — major section breaks
- `space-12` 48px — page padding, hero-to-content

Avoid the in-between values (5, 7, 10, 14) unless there's a specific optical reason.

## Radii

- `rounded-md` 6px — buttons, pills, tags
- `rounded-lg` 8px — tiles, cards, modal content
- `rounded-xl` 12px — page-level sections
- `rounded-2xl` 16px — the trust score ring on supplier detail only

## Shadows

Three registered tokens, no more.

- `shadow-sm` — default tile lift (barely perceptible)
- `shadow-md` — modal content, popover
- `shadow-focus` — `0 0 0 3px rgba(34,211,238,0.25)` — focus ring for keyboard nav

No colored glows on trust tiles. The v3 habit of `shadow-profit-glow` / `shadow-danger-glow` reads as decorative; drop it.

## Core components (contract)

### `<TrustScoreRing>`

A circular progress ring with center number.
- Size variants: `sm` (32px), `md` (56px), `lg` (96px). Trust grid uses `sm`, supplier detail uses `lg`.
- Color: `ok` at ≥80, `warn` at 60–79, `block` at <60.
- Always accompanied by a short status word (`Ready` / `Watch` / `Blocked`).

### `<PillarChip>`

A small pill showing pillar label + status dot.
- Status dot: 6px, colored by pillar status.
- Label: pillar short name (`FEI`, `§607`, `Safety`, `Allergen`, `Origin`, `Purity`, `Freshness`).
- Used in: supplier row, supplier detail header, audit bundle.

### `<EvidenceRow>`

A single-line representation of one document.
- Icon: file-type (PDF, image, email).
- Label: doc title + ingested timestamp.
- Right-side: confidence chip + flag badges.
- Click: opens DocumentPreview modal.

### `<StatusPill>`

Standard state encoding.
- `ready` — emerald background tint, emerald text, check icon
- `watch` — amber background tint, amber text, clock icon
- `blocked` — red background tint, red text, octagon icon
- `missing` — ink-500 background tint, ink-700 text, minus icon

### `<Sidebar>`

- Single column, 240px wide.
- Two sections under full mode: **Portfolio** (Trust Grid, Review Queue, Ingest Inbox), **Admin** (Adoption, locked). Plus collapsed **Roadmap** (Pipeline, Bids, Margin — all locked).
- Active state: left-edge 3px emerald bar + bold label.
- No icon-heavy treatment. One icon per item, 16px.

### `<TopBar>`

- 56px tall. Page title on left, last-scan pulse + user chip on right.
- Search input in the middle, always visible (global supplier search).
- Last-scan pulse: "last scan · Nm ago" with a 6px cyan dot that pulses softly.

### `<Toast>`

- Top-right, 360px wide.
- Stack of up to 3, auto-dismiss at 8s unless hovered.
- Tones: `info` (ink-900 text on paper-0), `warn`, `block`, `ok`.
- Optional action CTA ("View supplier", "Open bundle").

## Iconography

Lucide only. Restrict to this set for the v1 demo:

- Supplier / entity: `Building2`, `Factory`
- Evidence / document: `FileText`, `FileCheck`, `FileWarning`
- Status: `CheckCircle`, `AlertCircle`, `XCircle`, `Clock`
- Action: `Download`, `Send`, `ExternalLink`, `Search`, `Filter`
- Nav: `LayoutGrid`, `Inbox`, `ListChecks`, `Settings`, `Lock`, `ChevronRight`, `ChevronDown`
- Pulse: `Activity`, `Radio`

Strokes: 2.0 default. 2.25 for status icons where legibility matters at small size.

## Motion

Sparing. Three tokens:

- `transition-colors` 120ms — hover, focus
- `transition-transform` 180ms — chevron rotation, modal enter
- `animate-pulse-soft` 2s — last-scan dot

No entrance animations on page loads. No staggered list fades. Pitch demos reward instant rendering.

## Dark mode

Not in scope for this demo.

## Accessibility

- Contrast ratio ≥ 4.5 for body text, ≥ 3.0 for large text. The chosen ink/paper tones satisfy this with room to spare.
- Every interactive element has a visible focus ring (`shadow-focus`).
- Status is never encoded by color alone — every status chip pairs hue with an icon.

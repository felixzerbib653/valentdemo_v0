# Screen PRD — Review Queue

## Purpose

Triage surface for open flags across the portfolio. Answers "what needs a human judgment call today?"

## User goal

For a compliance ops operator: work through a prioritized list of open flags, resolve or route each one, and see progress over time.

## Primary journey supported

Secondary support for J1 Morning triage — Sarah can use this as an alternative entry point to "what needs attention" instead of the Trust Grid. Primary support for portfolio-wide triage workflows.

## Layout

Three regions.

### 1. Filter bar (sticky top, 56px)

Five filter chips from left:

- **Scope:** All suppliers · This supplier (if context has `activeSupplierId`, this is preselected)
- **Pillar:** All · FEI · §607 · Safety · Allergen · Origin · Purity · Freshness
- **Severity:** All · Blocker · Watch · Informational
- **Assignee:** All · Me · Unassigned
- **Status:** Open · Resolved (hidden from default)

Selecting a chip filters the list below. Filters stack (AND).

Right-aligned in the bar: a count — "24 open · 12 this week · 8 assigned to you".

### 2. Queue list (scrollable)

One row per open flag. ~64px tall.

Row anatomy:

- Severity icon (colored) — octagon for blocker, clock for watch, info-circle for informational
- Flag title (`text-sm`, `font-medium`) — plain English — "FEI registration missing" or "Allergen declaration expiring in 7 days"
- Supplier chip (clickable) — supplier name + trust score
- Pillar tag — short pillar label
- Age — "opened 2d ago"
- Assignee chip — avatar + name, or "Unassigned"
- Suggested-remediation sub-line (below the title) — plain English, one sentence, no provenance chip. Example: `Suggested: request current §607 listing from Supplier X.`
- Right-aligned actions (on hover): **Draft email** (when action = draft-email) + **Resolve** + **Route** + **Open supplier**

**Draft-email button — Valent-branded treatment.** Distinct from the other row CTAs because it's the one action that produces a Valent-drafted artifact. The button carries: (a) the Valent glyph (Sparkles mark) at left at ~14px, (b) the label "Draft email" in ink-900, (c) a 1px brand-cyan border (`#22D3EE`) with `bg-paper-0` fill, (d) hover raises to `bg-cyan-50` tint with the same border. No fill-color button — flat, bordered, premium. This is the single cyan interactive element on the row; every other row button uses ink/emerald/ghost tones per design system. The button tells the operator "this yields a Valent-drafted asset" without needing a row-level provenance chip to announce it. The chase draft modal that opens still carries "Drafted by Valent · review before sending" in its footer per surface #4.

**No per-row drafted-by-Valent provenance chip.** Earlier agentic-surfaces spec called for a `<ProvenanceChip variant="drafted" />` on every FlagRow's suggested-remediation line. This was repetitive across a 24-row queue and the signal it carried belongs on the button producing the artifact. Removed from FlagRow; retained in ChaseDraftModal footer.

Grouping: rows are grouped by supplier (collapsed by default) when no supplier filter is active. Expanding a group reveals the supplier's flags. When a supplier filter is active, grouping is suppressed and rows render flat.

Row click: navigates to Supplier Detail with the relevant pillar pre-selected.

### 3. Empty / all-clear state

If zero open flags: a calm empty state — "Nothing in the queue. All open flags resolved." with a small emerald check icon. Muted copy below: "New flags appear here as they're detected."

## Data contract

Reads derived state from `suppliers.js` — each supplier's failing / pending pillars become queue rows. May optionally read a separate `flags.js` if flag metadata (age, assignee, notes) grows richer than what pillar status captures.

Proposed `flags.js` shape:

```js
{
  id: string,
  supplierId: string,
  pillarKey: PillarKey,
  severity: 'blocker' | 'watch' | 'informational',
  title: string,                 // plain English title
  body: string,                  // one-paragraph explanation
  openedAt: ISO string,
  assignee: { name, avatar } | null,
  status: 'open' | 'resolved',
  relatedDocuments: string[],    // doc ids
}
```

## Actions

- **Resolve.** Marks the flag resolved in local state. Toast confirms.
- **Route.** Opens a small popover with team options ("Route to Procurement", "Route to Quality", "Route to Legal"). Selecting one emits a toast and marks the flag as routed.
- **Open supplier.** Navigates to Supplier Detail with the pillar pre-selected.

## Interactions with other screens

- Opens from: Sidebar nav, Supplier Detail pillar "Open in review queue" link, toast CTAs that reference a flag, Trust Grid portfolio summary "24 open flags" chip (if added in phase 3).
- Opens to: Supplier Detail (primary path), audit bundle (secondary, from supplier chip hover).
- Sets no cross-screen context on resolve/route — local state only.

## Copy register

- Flag titles read as statements of fact, not commands: "FEI registration missing" not "Register FEI."
- Severity words: Blocker (ships-affecting legal block), Watch (aging, not yet blocking), Informational (notice-worthy).
- Age uses relative time.

## Empty / edge states

- No open flags: the calm empty state above.
- No flags match the current filter: "No flags match these filters." + clear-filters ghost button.
- A supplier with 10+ flags: group shows count in the header, collapses by default. Expanding shows all 10.

## What this screen does not do

- Does not replace the Trust Grid as the default landing page. Grid is entity-first; Queue is flag-first.
- Does not allow editing flag content. Resolve/route are the only mutations.
- Does not show resolved flags by default — they're hidden behind a filter toggle.

## Investor-readiness gates (for phase 5)

- A reviewer can answer "how does Sarah work through a backlog" by watching 20 seconds on this screen.
- The grouping by supplier is visually clear without instruction.
- Severity icons are distinguishable at a glance.
- Resolve and Route are both reachable in one click per row.

## Known design questions to revisit

- Should the queue show an SLA countdown per blocker ("expires in 5 days · shipping hold")? Adds urgency; risks clutter. Try in phase 3, decide at phase 5.
- Should Resolved flags be viewable in a tab? Probably yes for "show your work" purposes. Default-hide, expose via filter. Already specced above.
- Should there be keyboard shortcuts (J/K to move, Enter to open, R to resolve)? Yes for the power user. Add in phase 3 polish.

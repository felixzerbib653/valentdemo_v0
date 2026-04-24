# Feature PRD — Agent activity digest

Layered on: `docs/01-screen-trust-grid.md`
Phase: 3
Competitive anchor: Worldover's product presents itself as a dossier generator — humans produce, Worldover formats. Valent's product is a set of agents doing continuous work for Sarah. That work is invisible if the UI doesn't show it. This feature makes the agents visible in one glance, as a labor ledger.

## Scope (2026-04-21 review) · DEFERRED

**Not shipping in current build.** The labor-ledger instinct is valuable but this PRD as specified would compete with two existing surfaces for the same landing-page real estate:

- **Today's Work card** already answers *what should I do today* with ranked agent actions above the PortfolioSummaryBand on Trust Grid.
- **MonitoringAlertDropdown** already answers *what has the system noticed* with Expiring / Aging / New-awaiting-review categories, anchored to the TopBar pulse.

A third card ("This week, Valent") at ~340 × 280 px would visually compete with Today's Work. Two cards that roughly mean "here's what the agents did for you" make both feel less real to a reviewer.

It also introduces a 5-agent taxonomy (INGEST / BUNDLE / FLAG / CHASE / WATCH) that disagrees with the 7-surface taxonomy in docs/70-agentic-surfaces.md and with the 3-agent chain in PRD 84 (Ingest → Flag → Bundle). Three disagreeing agent counts in three docs is a reviewer trap.

**Lightweight replacement option (not currently staged, available if retention-signal pressure increases):** fold a single-line weekly summary into the existing MonitoringAlertDropdown header. Format: `Valent · this week · 34 docs ingested · 4 flags raised · 6 bundles shipped.` Lives in the chrome, doesn't compete for card real estate, doesn't introduce a new agent-name taxonomy. Roughly a 20-line addition to MonitoringAlertDropdown.

The full spec below is preserved as reference for a later decision.

## Purpose

Show the CMO — and any reviewer watching a demo — the work the agents did this week, in aggregate, on their behalf. Without this surface, the agentic claim is a footer line in the pitch deck. With it, the agents have a home on the home screen.

## User goal

Sarah loads the Trust Grid on Monday morning and sees, on the right side of her header, a card titled "This week, Valent." Inside: five rows — "Ingested 34 docs · 31 auto-approved," "Bundled 6 retailer audits," "Flagged 4 compliance issues," "Chased 9 suppliers," "Watched 12 deadlines." She reads it in three seconds. She feels her team got bigger.

## Primary journey supported

J1 Morning triage (primary). Also serves as a recurring engagement signal — every login has a fresh tally.

## Surface type

Card component. Inline on the Trust Grid, right-justified in the header region, ~340px wide, ~280px tall. Not a modal, not a separate page.

## Layout (within the card)

Three bands top-to-bottom.

### 1. Header (40px)

- Left: title "This week, Valent" (slate-100, 14px, medium weight)
- Right: segmented toggle — `7d` / `30d` / `All time`. Default `7d`.

### 2. Body (5 stat rows)

One row per agent. Each row is ~36px tall.

- Left: agent name in small-caps (slate-500, 11px, tracking-wide) — `INGEST`, `BUNDLE`, `FLAG`, `CHASE`, `WATCH`.
- Middle: primary stat (slate-100, 18px, tabular numerals) — e.g. `34 docs`, `6 bundles`, `4 issues`, `9 suppliers`, `12 deadlines`.
- Right: secondary stat (slate-400, 12px) — e.g. `31 auto · 3 to review`, `all downloaded`, `2 resolved · 2 open`, `7 replied`, `3 within 30d`.

Hover a row: a thin cyan rule appears on the left edge and the row gets a subtle slate-800 hover fill. Click the row: navigates to a pre-filtered surface (Ingest Inbox filtered to the week; Trust Grid filtered to flagged suppliers; etc.).

### 3. Footer (28px)

- Left: muted string — `Last updated 08:03` (server-computed timestamp).
- Right: muted link — `See activity log →` (routes to a full activity list — phase 4 work; demo stub only).

## Data contract

New root collection: `agentActivity`.

```
agentActivity: {
  lastComputed: "2026-04-20T08:03:00Z",
  windows: {
    "7d": {
      ingest: { primary: "34 docs", secondary: "31 auto · 3 to review", deepLinkTarget: "ingest-inbox?range=7d" },
      bundle: { primary: "6 bundles", secondary: "all downloaded", deepLinkTarget: "trust-grid?filter=bundled_recent" },
      flag:   { primary: "4 issues", secondary: "2 resolved · 2 open", deepLinkTarget: "review-queue?range=7d" },
      chase:  { primary: "9 suppliers", secondary: "7 replied", deepLinkTarget: "supplier-outreach?range=7d" },
      watch:  { primary: "12 deadlines", secondary: "3 within 30d", deepLinkTarget: "trust-grid?filter=watch_upcoming" },
    },
    "30d": { ... },
    "allTime": { ... }
  }
}
```

Three windows seeded. Numbers are fixed per window and don't recompute in the demo.

## Copy register

- Title starts with "This week, Valent" — subject-verb-object. The company is the actor. The phrasing makes the agents' work read as collective, not a list of software features.
- Agent names render in SMALL-CAPS — a visual cue that these are named entities with roles, not generic functions. Matches the agent-naming language in the pitch deck.
- Secondary stats use plain language: `31 auto · 3 to review`, not `31 automated extractions, 3 pending human review`. The dots separate the two halves of the HITL split cleanly.
- "All time" window uses round numbers — `428 docs`, `92 bundles`. No false precision.

## Actions and their effects

- Click a row: navigates to the row's `deepLinkTarget`. Ingest → filtered Ingest Inbox. Flag → filtered Review Queue. Etc.
- Toggle `7d` / `30d` / `All time`: re-renders the card body with the new window's numbers. Transition is a fast cross-fade, not a slide or stagger — the card should feel like a display switch, not an animation moment.
- Click `See activity log →`: routes to `/activity-log` (demo stub — returns a placeholder "Phase 4" state).

## Interactions with other screens

- Trust Grid: card lives in the header row. Does not displace filter chips or the MoCRA band; occupies the right-side header space previously empty.
- Every row is a deep-link source, so the card functions as a quiet navigation surface in addition to a stat summary.
- Review Queue and Ingest Inbox gain range-filters (`?range=7d`) to honor the deep-links — small scope add there.

## Empty / edge states

- Agent with zero activity in the selected window: row renders with primary `0` (slate-600) and secondary `no activity`. The row is not clickable. Should not happen in seeded demo data, but renders honestly if it does.
- Stale data (`lastComputed` >1 day old): footer string reads `Last updated 2d ago` in amber. Demo default: fresh.
- Card failed to load: skeletal placeholder with five faded rows. Keeps the header layout stable.

## Visual design notes

- The card uses the same slate-800 card surface as the Trust Grid tiles, so it reads as a sibling of the grid, not a separate widget.
- Stat numbers should use tabular figures (tabular-nums Tailwind class) — the columns align even when values shift between windows.
- The segmented toggle is slim — 24px tall, cyan-tinted when active, slate-700 outline otherwise. Not a button group.
- Hovering a row is the one moment the card animates. Keep it to a 120ms ease — this is a status surface, not a playground.

## What this feature does not do

- Does not show real-time activity. Numbers update per computed window; no live counters ticking.
- Does not attribute individual actions to specific agents by name-and-run (e.g. "Bundle agent run 4421 at 08:02"). The activity log (phase 4) does that; the digest summarizes.
- Does not forecast — no "you'll see 40 docs next week." Forecasting misreads as promise.
- Does not expose confidence or autonomy scores per agent. Those are developer surfaces.

## Competitive differentiation

The agentic claim is the product's most vulnerable demo moment — reviewers have heard it often enough that the word has lost weight. The cure is a quiet, numeric surface that shows work done, not work promised. Worldover's UI is organized around brand-output artifacts (the formulation dossier). Valent's this-week-at-a-glance panel is organized around agent-input labor (docs ingested, suppliers chased, deadlines watched). The two surfaces sell different stories about who is doing the work.

## Investor-readiness gates (for phase 5)

- A reviewer reads the card in three seconds and says some variant of "oh — the agents are doing real work."
- Agent names in SMALL-CAPS land as named entities, not generic labels — the typography carries the framing.
- Clicking a row and landing on a filtered surface makes the deep-link claim real; the surface reflects the number in the row.
- `7d` and `30d` toggles both show plausibly scaled numbers — 7d `34 docs`, 30d `128 docs`, all-time `428 docs`. A reviewer doing mental math doesn't catch an inconsistency.
- The card sits on the home screen without competing visually with the Trust Grid rows below it.

## Known design questions to revisit

- Should the digest include a sixth row for `RANKER` (the prioritization agent)? Ranker's work is diffuse — every grid sort is a Ranker output. Exposing it as a stat row is hard to phrase honestly. Deferred.
- Should Sarah get a weekly email version of this digest? Yes — it is the product's best passive engagement lever. Out of scope for demo, on the roadmap.
- Should the card animate in on page load with a subtle count-up? Tempting. Loses to distraction-risk. Render it static.

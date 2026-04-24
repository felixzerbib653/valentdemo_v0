# Feature PRD — Bundle provenance breadcrumb

Layered on: `docs/03-screen-audit-bundle.md`
Phase: 2C
Competitive anchor: Worldover's dossiers, as rendered publicly, do not expose the chain of operations that produced them. Content reads as hand-curated. Valent's breadcrumb — "this bundle was assembled by these agents in this order" — makes orchestration visible. It reframes the bundle from "a document" to "an output the agents produced."

## Scope (2026-04-21 review) · SHIP SIMPLIFIED

**In scope for build.** Ships as layered addition to AuditBundleModal. Fixed-shape breadcrumb, collapsed-default, compact expanded state.

Tightened from original spec:

- **Fixed 3-step chain.** Every bundle renders `Ingest → Flag → Bundle` exactly. The original spec allowed variable chains (Chase / Watch insertions); we lock the chain at three agents. Flag row elides its body text when no flags were raised (the row still renders to maintain visual rhythm; copy becomes `No compliance gaps identified.`). Predictable structure reads cleaner than variable structure.
- **Agent taxonomy aligned.** The three breadcrumb agents map exactly to the canonical agentic surfaces in docs/70-agentic-surfaces.md: Ingest = surface #1 (extraction), Flag = surface #3 (proactive flag generation), Bundle = surface #2 (auto-assembled audit bundle). No new agent names are introduced.
- **Compact expanded state.** Height reduced from the original ~160px target to **~96px** (three rows at ~28px plus connector). Keeps the cover preview above the fold on standard viewports.

No cross-surface agent-name taxonomy disagreement: PRD 83's 5-agent list (INGEST / BUNDLE / FLAG / CHASE / WATCH) is deferred; PRD 84's 3-agent chain is now the only canonical list exposed in UI copy.

Nothing else deferred. The feature is a one-afternoon build.

## Purpose

Inside the audit bundle modal, expose the chain of agentic work that produced the bundle. The breadcrumb is the demo's shortest path from "Valent made a bundle" to "Valent orchestrated a set of agents to make this bundle." Without it, the bundle looks like any other PDF export; with it, it looks like an agentic product.

## User goal

Sarah opens the bundle modal and sees, above the cover preview, a collapsed one-line strip: `Assembled by Ingest → Flag → Bundle · 14 agent actions · view detail ↓`. She doesn't need the detail most of the time. When a reviewer in a pitch meeting asks "how was this made?", she clicks to expand and the chain unfolds into a three-step provenance trail with counts and one-line descriptions. Collapses back when she's done.

## Primary journey supported

J2 Buyer audit prep (primary, as a moment of transparency). Secondary: any demo scenario where the reviewer wants to see the agentic claim substantiated.

## Surface type

In-modal component. Sits at the top of the audit bundle modal body, between the header band and the cover preview. Collapsed by default (24px tall), expands to ~160px when opened.

## Layout (within the modal body)

### Collapsed state (default, 24px)

Single horizontal strip.

- Left: agent chain as a breadcrumb — `Ingest → Flag → Bundle`. Agent names in SMALL-CAPS, cyan, connected by slate-500 arrows.
- Middle: action count — `14 agent actions` (slate-400, 12px).
- Right: expand affordance — `view detail ↓` (cyan, 12px, clickable).

Hover the strip: slate-800 background tint. Click anywhere on the strip: expands.

### Expanded state (~96px, per Scope)

Three stacked rows, one per step in the fixed chain. Each row ~28px tall.

- Left column (~64px): agent badge — a small pill with the agent's name in SMALL-CAPS and its icon (Ingest: scan, Flag: flag, Bundle: package). Cyan-tinted.
- Middle column: action description — one sentence per step.
  - Ingest: `Extracted 22 fields from 6 supplier documents. 18 auto-approved, 4 sent to review.`
  - Flag: `Identified 1 compliance gap (§607 listing stale by 62 days). No blocker.`
  - Bundle: `Assembled cover, pillar strip, and 6 evidence documents into this artifact.`
- Right column (~120px): secondary metadata — timestamp + duration, e.g. `Apr 14, 08:03 · 11s`. Smaller, slate-500.

Between rows: a thin slate-700 vertical connector, left-aligned under the badge column, giving the three rows the visual read of a linked chain.

At the bottom of the expanded state: a muted collapse affordance — `hide detail ↑` (cyan, 12px).

## Data contract

Extend the `auditBundle` object with a `provenance` field:

```
auditBundle: {
  supplierId: "sup_midwest_chem",
  pillarKeys: ["allergen", "purity", "origin", ...],
  provenance: {
    actionCount: 14,
    chain: [
      {
        agent: "ingest",
        label: "Ingest",
        description: "Extracted 22 fields from 6 supplier documents. 18 auto-approved, 4 sent to review.",
        timestamp: "2026-04-14T08:03:00Z",
        durationSeconds: 11
      },
      {
        agent: "flag",
        label: "Flag",
        description: "Identified 1 compliance gap (§607 listing stale by 62 days). No blocker.",
        timestamp: "2026-04-14T08:03:14Z",
        durationSeconds: 2
      },
      {
        agent: "bundle",
        label: "Bundle",
        description: "Assembled cover, pillar strip, and 6 evidence documents into this artifact.",
        timestamp: "2026-04-20T10:41:00Z",
        durationSeconds: 3
      }
    ]
  }
}
```

Provenance data is computed per bundle invocation. In the demo, each seeded supplier has a pre-canned provenance chain.

## Copy register

- "Assembled by" as the collapsed-strip opener. Not "Generated by" (generic), not "Powered by" (marketing).
- Agent names in SMALL-CAPS match the pitch deck's framing and the Agent Activity Digest. Consistency across surfaces is part of the agentic claim landing.
- Descriptions are single sentences, past tense, specific to counts. `Extracted 22 fields from 6 supplier documents.` — not `AI extraction performed on supplier inputs.`
- The `§607 listing stale by 62 days` phrase inside Flag's description demonstrates MoCRA-fluency inside an agent output. It earns the breadcrumb its place in front of a compliance reviewer.

## Actions and their effects

- Click the collapsed strip: expands to show the three rows. Smooth ease, 180ms.
- Click `hide detail ↑`: collapses back.
- Hover an agent badge in the expanded view: tooltip with a one-line agent description — e.g. "Ingest: OCRs and §-tags supplier documents on arrival."
- The breadcrumb is inert beyond expand/collapse — clicking an agent badge does not navigate. Intentional: the bundle is a focused artifact, not a branching exploration.

## Interactions with other screens

- Audit bundle modal: extended. Breadcrumb sits above the cover preview; the three-band internal layout of the modal is preserved.
- Retailer bundle variants (PRD 80): the breadcrumb is program-format-agnostic. Changing the audit program format does not change the provenance chain. The chain describes how the bundle was assembled, not which program format it's shaped for.
- Live extraction demo (PRD 81): the Ingest row of the breadcrumb references extraction outcomes that were set in the live extraction modal. The numbers tie together.

## Empty / edge states

- Bundle with no flags raised: chain still renders as `Ingest → Flag → Bundle` per Scope. The Flag row's description becomes `No compliance gaps identified.` — absence is stated, not elided, to keep the three-step visual rhythm stable.
- No provenance data on the bundle object: the strip does not render at all. Silent fallback — the absence of the strip is better than a broken one.
- Chase / Watch insertions into the chain are deferred. The chain is fixed three-step. If a supplier was chased during bundling, that fact surfaces through the existing activity log and ChaseDraftModal send-history, not the breadcrumb.

## Visual design notes

- The collapsed strip is deliberately understated — it is the product's quietest way of saying "agents did this." Reviewers who care, see it; reviewers who don't, aren't distracted.
- The expanded chain uses a left-anchored vertical connector between rows to read as a sequence, not a list. Flow direction is unambiguous.
- Agent icons are small (~14px), cyan-tinted, paired with the SMALL-CAPS label. They should read as a single compound badge.
- Timestamps on the right align to a consistent column — when the chain expands, the eye can scan down the right edge and read the time progression.

## What this feature does not do

- Does not expose prompt text, model version, or raw agent inputs/outputs. The provenance is narrative, not forensic.
- Does not let the CMO re-run individual steps from inside the bundle. Re-runs happen from the agents' own surfaces.
- Does not track edits made by Sarah (e.g. unchecked documents, custom recipient text). Those are CMO edits, not agent actions; they belong to a different log.
- Does not persist beyond the bundle. The breadcrumb is a read of this bundle's history, not a system-wide activity feed.

## Competitive differentiation

Dossiers produced by pre-agentic platforms read as "content someone assembled." Bundles produced by Valent read as "outputs an agent mesh produced." The breadcrumb is the visual proof of that distinction. It is a small surface — two lines collapsed, six expanded — but it converts an invisible architectural claim into a thing the reviewer can point at. Worldover's incumbent artifacts will not have this surface without a material architectural change.

## Investor-readiness gates (for phase 5)

- A reviewer who clicks the collapsed strip and sees the three-row chain expand has a visible "oh" moment within 10 seconds.
- The agent descriptions are specific enough (counts, timestamps, MoCRA references) that a compliance reviewer believes they reflect real agent runs.
- The visual continuity between this surface, the Agent Activity Digest (PRD 83), and the pitch deck's architecture slide is obvious — same agent names, same SMALL-CAPS treatment, same cyan accent.
- Collapsed default state means the breadcrumb does not intrude on the audit bundle's artifact-reading flow. The bundle still reads as a professional document first.
- Expanding and collapsing is snappy; no layout shift of the cover preview below.

## Known design questions to revisit

- Should the breadcrumb show on retailer-specific bundles as well? Yes (confirmed above). The chain is retailer-agnostic and the breadcrumb applies.
- Should there be a "copy as plain text" affordance for the provenance — so it can be pasted into an email? Interesting; deferred until someone asks.
- Should the expanded chain include a link to the live Ingest extraction (PRD 81) record? Cross-linking risk — the bundle becomes a branching surface. Keep the chain descriptive, non-navigational, for v1.

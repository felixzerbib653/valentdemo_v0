# Feature PRD — Retailer bundle variants

Layered on: `docs/03-screen-audit-bundle.md`
Phase: 4
Competitive anchor: Worldover ships a formulation dossier shaped to CPSR / PIF — the brand's regulatory file convention. No incumbent ships bundles shaped for the audit program the brand is actively submitting to (Clean at Sephora, Conscious Beauty, Target Clean, retailer private-label qualification). This is the highest-differentiation addition in the demo — it makes the bundle feel like a product primitive rather than a report export.

## Scope (2026-04-21 review)

**In scope for build.** Full feature ships as a layered addition to AuditBundleModal. No new screens, no cross-screen state.

Trimmed from original spec:
- Retailer profiles reduced from 5 to **3 + Generic** (Clean at Sephora, Target Clean, Credo Clean Standard, Generic MoCRA). Ulta and Whole Foods dropped — they don't add a meaningfully different bundle shape from the three kept, and a 4-option dropdown reads as curated where a 6-option dropdown reads as "starter list."
- Data shape simplified: `evidenceOrder` field dropped. Evidence ordering derived from `requiredPillars` + `requiredEvidenceTypes` — one source of truth for ordering, not two.
- "Required for {Retailer} · not on file" chip reuses the existing amber pillar-status tone; no new chip variant.

Nothing else deferred. The feature is small enough to ship in one pass.

## Purpose

Turn the audit bundle from a generic compliance export into an audit-program-shaped artifact. The bundle's value to a CMO is that the downstream audit program — most often a retailer clean / clinical standard that a brand's QA team is submitting to — accepts it on first pass. That acceptance is downstream of formatting conventions that differ per program: cover wording, evidence ordering, required section types, footer attestation language.

One bundle format for all audit programs is a report. Many formats, selected per handoff, is a product.

## Who sends the bundle where

Worth naming so the selector's framing is unambiguous. Under MoCRA the brand is the Responsible Person and is the primary sender of audit packets — even when the destination is a retailer's audit program. Typical flow: a brand's QA team prepares a submission for Clean at Sephora; they pull supplier evidence from the CMO; the CMO generates the bundle, stamps it with the retailer-program format the brand is submitting to, and returns it to the brand. Retailer private label is the one lane where the retailer is both the brand and the direct bundle recipient (Target, Walmart Kirkland, Costco, Amazon Basics / Solimo). Either way, this selector encodes **which audit program the bundle is being formatted for**, not who the bundle is being handed to. Recipient identity lives on the `Prepared for` line (default: `Brand QA team — [Brand Name]`), which is an orthogonal axis to the program format.

## User goal

Sarah, preparing a bundle that her customer's brand QA team will submit to Clean at Sephora, selects "Clean at Sephora" as the audit-program format. The cover switches to Sephora-audit-program language, the evidence list re-orders to lead with §607 listing + allergen disclosure + fragrance IFRA statement — the things Sephora's auditor opens the bundle to check first. Download. Send to the brand. Done.

## Primary journey supported

J2 Buyer audit prep (primary). New sub-step: retailer selection before download.

## Surface type

Additive. Existing audit bundle modal (`AuditBundleModal`) gains an Audit program format selector. No new screen.

## Layout addition

### Header band update

Existing header: "Audit bundle · [Supplier Name]" title + subtitle + close button.

Addition: a second row of meta, ~32px, below the subtitle.

- Left: "Audit program format:" label + dropdown chip showing the selected program. Default `Generic MoCRA audit format`. Options (per Scope trim): `Clean at Sephora`, `Target · Target Clean`, `Credo Clean Standard`, `Generic MoCRA audit format`.
- Right: muted secondary hint — "Shapes the bundle for the program your brand is submitting to. Changes cover, section order, footer attestation." Hover reveals a tooltip listing the specific diffs for the selected program. The hint is deliberately clear that the program is the *format*, not the *recipient* — the recipient is named on the `Prepared for` line.

### Cover page preview

Cover page updates when retailer changes.

- Retailer program name appears below "Prepared for" if user hasn't typed a custom recipient.
- Cover tagline swaps its retailer-facing suffix. The core Valent tagline stays constant.
- A small retailer-program badge appears top-right of the cover — paper-0 styled, program name as text, no logo abuse.
- Footer attestation line adapts per retailer profile.

### Included evidence list

When retailer changes, the list re-orders (not re-filters):

- Required-for-retailer evidence rises to the top, marked with a small `Required · [Retailer]` chip.
- Nice-to-have evidence stays in its place, unchanged.
- Evidence the retailer's program does not require is still included but drops to the bottom with a muted `Optional for this retailer` chip.

## Data contract

New collection: `retailerProfiles` at root.

```
retailerProfiles: [
  {
    id: "sephora-clean",
    name: "Clean at Sephora",
    shortName: "Sephora",
    audienceLabel: "Clean at Sephora audit program",
    coverTaglineSuffix: "· aligned to Clean at Sephora ingredient standards",
    footerAttestation: "This bundle reflects current continuous monitoring as of {date}. Valent Trust attests to the accuracy of extracted evidence subject to supplier-provided documents.",
    requiredPillars: ["allergen", "purity", "origin"],
    requiredEvidenceTypes: ["COA", "SDS", "IFRA_statement", "fragrance_disclosure"],
    badge: { label: "Clean at Sephora", style: "paper-0" }
  },
  ...
]
```

Reference only. No existing field changes. **Four profiles** seed for the demo (Sephora, Target, Credo, Generic) per Scope trim. Evidence ordering is derived from `requiredPillars` + `requiredEvidenceTypes` at render time — no separate `evidenceOrder` array.

## Copy register

- "Audit program format" as the selector label. Not "Retailer" (implies account login or direct recipient), not "Audience" (ambiguous about who the bundle is for).
- Chip language: "Required · Sephora", not "Mandatory" or "Must include."
- Cover taglines append the program-facing phrase; they never replace the core Valent tagline ("Generated from continuous supplier monitoring · MoCRA §604 / 606 / 607 / 609").
- Retailer / program names render as text. Never use the retailer's logo. Legal-safe and brand-clean.
- Nothing in the copy anywhere suggests the bundle is sent *to* the retailer. The brand is almost always the sender. The program format selector describes the bundle's shape, not its destination.

## Actions and their effects

- Retailer selector change: cover preview and evidence list re-render. No toast.
- Download / Email: uses the active retailer profile to stamp the cover and order the evidence. Uses the default profile if none selected.
- Retailer reset (selecting `Generic retailer audit`): returns to default ordering and the base Valent tagline.

## Interactions with other screens

- Audit bundle modal: extended.
- Trust Grid row "Audit bundle" CTA: unchanged entry. Retailer selector appears inside the modal.
- Supplier Detail "Generate audit bundle" CTA: unchanged entry. Retailer selector appears inside the modal.

## Empty / edge states

- No retailer profiles seeded: dropdown shows only "Generic retailer audit" and the tooltip hint is suppressed. Should not happen in demo.
- Retailer profile references an evidence type the supplier lacks: the required chip renders amber — `Required for Sephora · not on file`. This is honest; it tells Sarah what's missing before she downloads.

## Visual design notes

- The retailer chip in the cover's top-right is stylized as printed — thin border, paper-0 background, small-caps text, no gloss or shadow.
- The retailer name in the dropdown renders slate-800 bold; the program label renders slate-500 smaller. Visual hierarchy: retailer > program.
- Required / optional chips sit tight against the document row, not floating. Clear visual grouping.

## What this feature does not do

- Does not log in to the retailer's audit portal. It is a formatting layer on the artifact, not a submission channel.
- Does not pull retailer-specific data from a live retailer API. Profiles are curated once by Valent; CMOs do not author them in the demo.
- Does not produce a real PDF with retailer headers. The cover is a styled React preview.
- Does not add retailer-specific pillars. The seven-pillar model is stable; retailer profiles only re-weight display order.

## Competitive differentiation

The line the demo wants to draw: Worldover ships a formulation dossier aligned to CPSR / PIF — a document that lives inside a brand's regulatory file and is shaped for that file's conventions. Valent Trust ships an artifact the brand QA team can submit directly into whichever audit program it is preparing for — Clean at Sephora, Conscious Beauty, Target Clean, a retailer private-label qualification, or a plain MoCRA packet. The CMO hands the packet to the brand; the brand submits it to the program. Valent's bundle is shaped for the destination, even when the destination is one step downstream of the direct recipient. The program-format selector is the demo's visible proof that the bundle is a product primitive, not a static report — five seconds of demo footage converts the architectural claim into something a reviewer can point at.

## Investor-readiness gates (for phase 5)

- A reviewer selecting two retailer profiles in sequence sees visible and coherent changes — cover, required chips, evidence order — not cosmetic-only.
- At least three of the five seeded retailer profiles have authentic-sounding audit program names and footer attestations. A compliance ops reviewer recognizes them.
- The `Required · [Retailer]` chip is unmistakable on its row; no one reads past it.
- Switching retailers does not reset the user's `Prepared for` text or unchecked documents.

## Known design questions to revisit

- Should Sarah be able to author custom retailer profiles (add a boutique retailer of her own)? Deferred — creates config burden and drifts toward a platform posture.
- Should the bundle PDF filename reflect the retailer (`SupplierX-Sephora-audit-bundle.pdf`)? Yes. Simple and useful. Land with the feature.
- Should retailer profiles carry version/revision numbers so a bundle is pinned to a profile version? Out of scope for demo; real product concern.

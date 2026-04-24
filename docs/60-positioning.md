# Positioning & Competitive Differentiation

Injected after phase 2 kickoff. This is an additive doc — it does not contradict or replace existing PRDs. It tells the build agent where competitive differentiation should surface in copy and where it should stay out of the way.

## Why this doc exists

The compliance-first trim that shaped this rebuild made the demo clearer but narrowed its visible surface. A knowledgeable reviewer — someone who has seen Assent, Sphera, Ecovadis, or existing Vanta — could watch the full walkthrough and ask "how is this not just a narrower Assent?" Today, the UI does not answer them.

The fix is not to re-add features. It is to ensure the narrative layer — cover pages, empty states, pitch mode micro-surfaces, tooltips — carries the differentiation that the UI intentionally does not.

## Core positioning statement

Valent Trust is the continuous compliance trust layer for mid-market cosmetic CMOs. It turns messy ingredient PDFs into audit-ready evidence bundles a retailer can accept on first pass. MoCRA is the wedge; the bundle is the artifact; continuous monitoring is the moat.

Not: "a supplier compliance platform."
Not: "Vanta for physical supply chains."
Not: "a margin recovery tool."

The two-sentence version above is load-bearing. Every piece of copy should be consistent with it.

## Five differentiators

1. **Cosmetic-CMO-specific data model.** INCI-indexed ingredient identity, §-anchored pillar evaluation (§604/606/607/609), retailer-audit output shape built in. Not a generic supplier platform configured for cosmetics.
2. **Evidence-bundle-as-workflow-output.** The audit bundle is a product primitive, not a report export. It is the thing the CMO hands to a retailer's auditor, formatted for that handoff. Assent produces spreadsheets; Vanta produces SOC 2 artifacts; nobody produces retailer-audit-ready cosmetic evidence bundles today.
3. **Ingredient-PDF-to-structured-evidence ingest.** The wedge. Solves the atomic unit of compliance pain — the messy supplier-sent PDF that has to become structured, verified, and linkable to a pillar.
4. **Continuous monitoring as chrome, not as a view.** Last-scan pulse lives in the top bar. Scans run without user action. No "monitoring" page to configure. The monitoring is the product, not a module.
5. **Cost-to-serve fit for mid-market.** A 2-facility CMO can deploy this without an Assent-scale implementation. The roadmap (Pipeline Aggregator, Bid Sandbox, Margin Engine) is additive, not prerequisite.

## "Why not X" — quick reference

| Alternative | Why it falls short for the ICP |
|---|---|
| **Assent** | Enterprise-scale, supplier-portal-first, spreadsheet-coded reports, high implementation cost |
| **Sphera** | Broader supply-chain risk surface; not MoCRA-aware; requires configuration to be useful for cosmetics |
| **Ecovadis** | Sustainability-weighted scoring, not compliance-workflow-centric; adjacent use case |
| **Trustwell / TraceOne** | Food-and-supplement native; cosmetic MoCRA not a first-class surface |
| **Vanta / Drata** | Internal-controls-centric; does not model third-party supplier evidence |
| **Excel + SharePoint** | The real incumbent. Every CMO runs on this today. Valent Trust wins by turning the same evidence into a bundle instead of a pile |

This table is for pitch narrative and the positioning doc. It does not need to appear in the UI.

## Where differentiation surfaces in copy (by screen)

### Supplier Trust Grid
- Portfolio summary band tagline: reinforce continuous posture ("Continuously monitored across 7 compliance pillars") rather than feature list.
- Empty state (zero suppliers — unlikely in demo data but still specced): lead with "Upload supplier documents to begin continuous monitoring" not "Add a supplier."

### Supplier Detail
- Activity panel header: "Continuous monitoring since {onboarded date}" — reinforces always-on framing.
- Pillar list: plain-English row labels (per copy register), but detail drill-down shows the §-anchor — this reinforces MoCRA-native data model without jargon on the surface.

### Audit Bundle modal — primary differentiation surface
- Cover page tagline (below "Prepared for {retailer}"): add one line that reads `Generated from continuous supplier monitoring · MoCRA §604 / 606 / 607 / 609`.
- This is the single most-viewed surface in the demo during pitch time. The tagline does two jobs: it tells the reviewer "this isn't Vanta repurposed" and "this isn't a spreadsheet export."

### Ingest Inbox
- Sources strip copy: "Email · SharePoint · SFTP · Manual — ingredient PDFs in, structured evidence out." The "in, out" framing reinforces the wedge as a transformation, not just a filing cabinet.

### Review Queue
- Empty-queue state: "No open flags — all 7 pillars healthy across your supplier base." Reinforces continuous monitoring as the default rather than a feature.

### Roadmap section (full mode)
- Keep existing locked labels. No copy change needed.

### Roadmap surface in wedge mode — new
- Current behavior: wedge mode hides the entire Roadmap section from the sidebar.
- New behavior: render a single non-clickable strip at the bottom of the main content region in wedge mode only. One line: `Pipeline · Bid Sandbox · Margin Engine — available for design partners under contract.` Muted ink, no chevron, no interaction.
- This lets a pitch reviewer answer "what's next?" without cluttering the wedge narrative or inviting clicks that dead-end into LockedPageShells.

## Anti-patterns — what not to write anywhere

- Do not use "margin" as a noun in any Operate-scope screen copy. The word belongs only on roadmap-locked surfaces.
- Do not write "SOC 2" anywhere. The Vanta analogy is for pitch, not UI.
- Do not write "platform." Use "tool" or omit.
- Do not write "AI-powered," "intelligent," "smart," or "powered by." The product does real work; the copy should describe the work, not brand the mechanism.
- Do not write "bid" in any Operate-scope screen. Bidding vocabulary is roadmap-locked.
- Do not use the word "dashboard." Use "grid," "panel," "view," or omit.

## Implementation notes for the build agent

- This doc is additive. Phase 2A (Trust Grid) and 2B (Supplier Detail) built before this doc landed do not need structural rework — only the copy edits listed above.
- Phase 2C (Audit Bundle) is the only phase 2 deliverable where a specific copy line (cover page tagline) needs to land first time. If 2C is already complete at doc-injection time, treat the tagline as a single-file copy edit and ship it.
- Phase 4 is where the wedge-mode roadmap strip gets built. Add a task to the Phase 4 backlog referencing this doc's "Roadmap surface in wedge mode" section.
- No new components are required by this doc. All changes fit within existing component contracts.

## Out of scope

- The ICP one-pager (why Elevation Labs, why now) is a separate doc for pitch use. It is not part of the build.
- A full competitive matrix with feature-level gridding is not needed. The table above is enough for narrative use.
- Copy A/B variants are not part of this doc. Ship one line; iterate via UAT.

# Feature PRD — Live extraction demo

Layered on: `docs/04-screen-ingest-inbox.md`
Phase: 3B
Competitive anchor: Worldover's public demos show structured dossiers but not the extraction moment. Ingestion is assumed. This feature makes the act of turning a messy supplier PDF into structured, source-cited evidence visible in real time. It is the single most persuasive proof that the post-LLM architecture is doing work a pre-2023 system cannot.

## Scope (2026-04-21 review) · DEFERRED

**Not shipping in current build.** The full spec below describes a 680px modal with a two-pane layout, scripted ~12-second extraction animation, PDF region highlighting, timed field-population stagger, and three seeded extraction scenarios. That's a 1–2 day build for one theatrical demo moment.

Reasons for deferral:

1. **Violates the "agent is in the chrome, not on a page" principle** from docs/70-agentic-surfaces.md. Scripted extraction theater is exactly an agent on a page.
2. **Duplicates existing surfaces.** Extraction provenance already ships in three places: `ProvenanceChip variant="extracted"` on every document row (surface #1), the new agent summary block in DocumentPreview (task #51), and the new review/approve strip (task #50).
3. **Conflicts with DocumentPreview.** If `linkStatus === 'linked'` opens one modal and a hypothetical `linkStatus === 'extracting'` opens a different modal, operators lose the mental model.
4. **High scripted-animation risk.** Timed staggers, layout shifts during field population, and PDF region flash timing are prone to visual bugs that make the demo feel fragile on first pitch.

**Lightweight replacement option (not staged for current build, available if demo-theater pressure increases):** add a "View extraction trace" disclosure to the existing DocumentPreview's right panel. Expands to show the extracted field list with page-number provenance chips that flash the corresponding region of the already-rendered persona document when clicked. No stagger, no timing, no new modal. Roughly 40 lines of code. Can be lifted into a new PRD number if/when wanted.

The full spec below is preserved as reference for that future decision. Treat everything under this line as archived, not current.

## Purpose

Show the reviewer — in under fifteen seconds — that an ugly, human-authored supplier PDF arrives in Sarah's inbox and leaves as structured, §-tagged, source-cited evidence. The extraction is the product's central LLM moment. If the demo skips it, the agentic claim reads as aspirational. If the demo shows it, the claim reads as shipped.

## User goal

Sarah clicks a pending doc in the Ingest Inbox and watches the fields populate — INCI names, CAS numbers, supplier FEI, country of origin, allergen flags — each field landing with a provenance citation pointing back to the PDF page it came from. She sees the confidence scores resolve. She clicks `Approve` or, if confidence is below threshold, `Review`.

## Primary journey supported

J1 Morning triage (primary). Secondary use: a walkthrough moment for a CMO watching a sales demo.

## Surface type

Modal. Opens from an `Extracting…` row in the Ingest Inbox. Full-viewport overlay, paper-0 content surface at ~1040px wide, ~680px tall.

## Layout (within the modal)

Two-column.

### Left column (~48% width): PDF viewer

- Renders the source PDF page-by-page with a light paper texture, ink-900 text, realistic layout inconsistencies (crooked tables, stamp marks, hand-annotations).
- Three seeded source docs:
  1. "Glycerin USP · Certificate of Analysis" — a typed COA from a mid-market supplier with a scanned-in lot stamp.
  2. "Fragrance Blend 4471 · Declaration" — an IFRA-style allergen disclosure with tiny-font ingredient list.
  3. "Phenoxyethanol · SDS · Section 3 composition" — a multi-page SDS with composition table on page 2.
- As extraction runs, source text regions highlight in cyan briefly, then fade to a thin cyan underline. The underline remains — a persistent visual trace of what got extracted from where.
- A small page navigator at the bottom: `← Page 2 / 4 →`.

### Right column (~52% width): structured fields

- Stacked card list, each card one extraction category:
  - Identity (INCI, CAS, common name)
  - Origin (country, supplier FEI, facility address)
  - Safety (allergens, prop-65 flags, IFRA category)
  - Quality (lot #, expiry, assay %)
  - Sourcing (supplier name, date of supply)
- Each field row inside a card:
  - Field label (slate-500, 12px)
  - Extracted value (slate-900, 14px, bold if high-confidence)
  - Confidence chip (emerald ≥95%, amber 80–95%, red <80%)
  - `ProvenanceChip` — a small pill with page number, e.g. `p. 2 · §3`, clickable. Clicking it pans the left viewer to that page and re-flashes the cyan highlight.
- Fields populate in a timed stagger — not instant, not slow. ~250ms per field, total extraction run ~8–12 seconds. The stagger reads as "the model is thinking" without being performative.

### Footer (64px)

- Left: extraction status string — `Extracting… 14 of 22 fields · 6.2s elapsed` during run; `Extracted 22 of 22 · 11.4s · 18 high-confidence · 4 for review` on complete.
- Right: action cluster — `Approve all` (emerald, primary, disabled until extraction completes), `Review low-confidence` (ghost, routes to Review Queue pre-filtered to this doc's low-confidence items), `Cancel` (ghost).

## Data contract

New collection: `extractionScenarios` at root.

```
extractionScenarios: [
  {
    id: "glycerin-coa",
    docId: "doc_glycerin_coa_042",
    supplierRef: "sup_midwest_chem",
    pages: 2,
    totalFields: 22,
    expectedDurationMs: 11000,
    fields: [
      { category: "identity", label: "INCI name", value: "Glycerin", confidence: 0.99, page: 1, region: "header", delayMs: 400 },
      { category: "identity", label: "CAS number", value: "56-81-5", confidence: 0.99, page: 1, region: "header", delayMs: 650 },
      { category: "quality", label: "Assay %", value: "99.7%", confidence: 0.97, page: 1, region: "results_table", delayMs: 1900 },
      { category: "quality", label: "Lot number", value: "MW-24-10-A", confidence: 0.72, page: 1, region: "stamp", delayMs: 2400 },
      ...
    ],
    pdfPreviewAsset: "/demo/glycerin-coa-preview.png"
  },
  ...
]
```

Three scenarios seed for the demo. Each is a full scripted extraction, so the demo never calls a live model.

## Copy register

- "Extracted from" as the cue for provenance chips. Plain-language, not "source citation."
- Confidence chips read `99% confident`, not `0.99`. Humans don't read decimals.
- The status string on the footer is the only live-updating string. It feels like real work. Everything else is steady.
- `Approve all` implies the CMO trusts the agent with the high-confidence majority; `Review low-confidence` routes only the amber/red fields to a human. The split is the product's core HITL claim made visible.

## Actions and their effects

- `Approve all`: transitions the Ingest Inbox row from `Extracting…` to `Approved`. Emits a toast: `Evidence added to [Supplier name] · 4 fields routed to review`. The low-confidence fields enter the Review Queue.
- `Review low-confidence`: closes the modal, navigates to Review Queue filtered to this doc's amber/red fields.
- Clicking a ProvenanceChip: pans and flashes the left viewer, does not close the modal.
- Clicking a source region in the PDF viewer: scrolls the right column to the field extracted from that region.
- `Cancel`: closes modal, Ingest Inbox row reverts to `Pending`.

## Interactions with other screens

- Opened by: clicking any `Extracting…` or `Pending` row in the Ingest Inbox.
- Closes into: Ingest Inbox (approved row updates its status) or Review Queue (if the reviewer picks Review).
- Does not interact with Trust Grid directly — the evidence flows through Supplier Detail on next render.

## Empty / edge states

- Low-confidence document (all fields <80%): the modal still runs the stagger, but `Approve all` is disabled and the CMO is forced to go to Review Queue. Footer copy shifts to `Confidence too low for auto-approval · 22 fields need human review`.
- Corrupted PDF scenario: one of the three seeded docs has a "page 3 unreadable" state — the modal shows a muted card `Page 3 unreadable · 3 fields skipped` with a retry ghost button (no-op in demo).

## Visual design notes

- The cyan highlight on the PDF should feel like a cursor lighting up text, not a block fill. Short-duration flash (~300ms), then settle to a 1px cyan underline that persists for the session.
- Confidence chips are sized to match the field value height — they read as siblings, not labels.
- The stagger timing must feel agentic, not animated for its own sake. Random-ish spacing, not metronomic. Use `delayMs` values in the scenario JSON that have natural jitter (400, 650, 890, 1200…).
- Low-confidence fields should be visible at a glance — red/amber chips cluster visually so the reviewer can see the "review pile" without reading every row.

## What this feature does not do

- Does not run a live LLM. Every field and its provenance is scripted per scenario.
- Does not let the reviewer edit extracted values inline. Corrections happen in Review Queue.
- Does not OCR arbitrary user-uploaded PDFs. The three seeded scenarios are fixed.
- Does not show a diff against a prior version of the same document. First-pass extraction only.

## Competitive differentiation

Worldover's demo flow, as publicly observed, shows formulation dossiers rendered from already-structured data. The extraction moment is absent — the reviewer never sees a supplier's ugly PDF become clean fields with source citations. Live extraction is the hardest thing to fake in a demo, which is exactly why showing it reads as unfakeable. It is also the most LLM-specific capability in the product; rendering it explicitly is the demo's strongest response to "why couldn't Worldover just add this?" The answer is that Worldover's 2022 architecture likely treats ingestion as a one-off onboarding task, not a continuous agentic surface.

## Investor-readiness gates (for phase 5)

- A reviewer sees the cyan highlight land on a region of the PDF and the corresponding field populate in the right column within the same half-second — the causal link is unmissable.
- At least one seeded scenario has a low-confidence field (amber or red) that a reviewer notices and asks about.
- Clicking a ProvenanceChip and seeing the PDF pan + flash is the "oh" moment the demo scripts around.
- Total extraction run completes in under 12 seconds; no reviewer watches a progress bar for longer.
- The footer status string updates smoothly — no jumps from 3 to 17.

## Known design questions to revisit

- Should the reviewer be able to pause the extraction stagger to examine a mid-run field? Tempting for depth, but interrupts the "agent doing work" read. Deferred.
- Should the PDF viewer support zoom? No — zoom invites examination the scripted asset won't reward. Keep page-navigator only.
- Should completed extractions be re-openable for post-hoc examination? Yes — from the Supplier Detail evidence list, a ghost CTA `View extraction` re-opens this modal in a completed state. Land with the feature.

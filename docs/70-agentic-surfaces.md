# Agentic Capabilities & Provenance Surfaces

Injected after phase 2 kickoff. Additive doc — does not contradict or replace existing PRDs. Tells the build agent where Valent's own agentic work should surface contextually inside existing screens, replacing manual-feeling interactions with "review what the agent already did" patterns.

## Why this doc exists

The earlier PRDs describe a compliance viewer with continuous-monitoring framing. They do not describe where the agent has already done work before the user arrives on a screen. Without explicit agentic surfaces, the demo reads as a static dashboard dressed with a pulse indicator. This is a pitch-risk problem and a buyer-value problem.

The fix is not a dedicated agents screen or agent-theater styling. It is in-context provenance — small badges, pre-selection, draft-ready content, proactive flags — that reveal the agent already worked.

## Principles

- **The agent is in the chrome, not on a page.** No "Agents" nav item, no agent terminal, no streaming log.
- **Surfaces are contextual.** Each agentic artifact appears in the screen where the user would act on it.
- **Human-in-the-loop on every consequential action.** The agent stages work; the human reviews, edits, approves, or overrides. The only surfaces without a human gate are derived outputs (extraction provenance, score computation) — those are disclosures, not actions.
- **Provenance is always visible when agent work is involved.** If the agent extracted a field, the field shows "Extracted by Valent · 94%". If the agent pre-selected documents for a bundle, the modal header says so. No invisible automation.
- **The user's role is confirm, not author.** Reading, clicking, sending, unchecking, editing — yes. Writing from scratch — no, if the agent can stage it.
- **Confidence is shown, not hidden.** Low-confidence extractions are routed to review with the confidence score visible.
- **The app answers "what should I do today" on landing.** A prioritized action list is the first thing Sarah sees. This is what makes the product a system of action, not a system of record.
- **No buzzword copy.** Continue to avoid "AI-powered," "intelligent," "smart," "powered by," "automation engine." Describe the work, not the mechanism. "Extracted by Valent" beats "AI-extracted" every time.

## Public agent names (UI copy taxonomy)

The seven surfaces above are the **internal** taxonomy — they describe the full work the system does. The **public** taxonomy, surfaced in UI copy and the pitch deck, is a smaller list: four named agents.

| Public name | Maps to internal surface(s) | UI locations |
|---|---|---|
| **Ingest** | #1 (Extraction at ingest) | ProvenanceChip `extracted` / `summarized`, DocumentPreview summary block header, Bundle provenance breadcrumb step 1 |
| **Flag** | #3 (Proactive flag generation) | Review Queue row remediation lines, ChaseDraftModal subject default, Bundle provenance breadcrumb step 2 |
| **Bundle** | #2 (Auto-assembled audit bundle) | AuditBundleModal header ProvenanceChip `ranked`, Bundle provenance breadcrumb step 3 |
| **Chase** | #4 (Supplier chase drafts) | ChaseDraftModal footer ("Drafted by Valent · review before sending"), Review Queue branded Draft-email button |

Surfaces #5 (Forward-looking alerts), #6 (Trust score provenance), and #7 (Today's work) are **not publicly named as agents** in UI copy. Their work is diffuse — Monitor's output is the pulse in the TopBar and the alert dropdown categories; Score's output is a number on every supplier; Rank's output is the sort order on the Today's Work card and the Review Queue. Naming each as a distinct "agent" in UI copy would force invented labor metrics ("Rank ran 340 times this week") that read as padding. Their provenance is still shown via ProvenanceChip variants (`computed`, `ranked`), but the chip attributes work to "Valent" collectively, not to a named agent.

**Consequences for future PRDs and build work:**

- Any UI surface that names agents in copy uses this four-name list (Ingest / Flag / Bundle / Chase). No other names — no INGEST / BUNDLE / FLAG / CHASE / WATCH five-name list, no seven-name expansion, no single-name collapse.
- ProvenanceChip stays on its four-variant taxonomy (`extracted`, `computed`, `drafted`, `ranked`, `summarized`). The variant names are about the *kind of agent output*, not the *agent identity* — the two taxonomies are orthogonal and intentionally distinct.
- If a future PRD wants to expose an un-named surface (Monitor / Score / Rank) as a named agent, that PRD must first amend this section with a rationale. Do not silently introduce new agent names.
- The pitch deck's architecture slide should match this list. If it currently shows a different set of agent names, update the deck, not this doc.

## HITL classification

Every agentic surface has a declared mode and gate. The build agent must enforce these — not ship any surface without its declared human-in-the-loop behavior.

| # | Surface | Mode | HITL gate |
|---|---|---|---|
| 1 | Extraction at ingest | auto + review-on-exception | None above 90% confidence; Review Queue gate below 90% |
| 2 | Auto-assembled audit bundle | auto-staged | User confirms list + recipient before download |
| 3 | Proactive flag generation | auto | User resolves, routes, or dismisses in queue |
| 4 | Supplier chase drafts | auto-staged | User reviews + edits + sends |
| 5 | Forward-looking alerts | auto | User clicks through to act |
| 6 | Trust score provenance | auto | None — derived output, not an action |
| 7 | Today's work | auto-ranked | User picks what to act on |

"auto" = the agent does the work; provenance is shown; no approval gate.
"auto-staged" = the agent prepares the work; a human confirms before the action leaves the system.
"review-on-exception" = auto above a confidence threshold; routed to a human below it.

## Seven agentic surfaces

### 1. Extraction at ingest

**Screen:** Ingest Inbox, Supplier Detail evidence panel, DocumentPreview modal.

**Behavior:**
- Every document row in the inbox shows a provenance chip: `Extracted by Valent · {confidence}%`.
- Confidence ≥90%: chip is muted green. Document auto-links to supplier + pillar. No review needed.
- Confidence 70–89%: chip is amber. Document links but is marked "Needs review" and appears in the Review Queue.
- Confidence <70%: chip is red. Document unlinked, routed to Review Queue with suggested mapping.
- On the Supplier Detail evidence panel, the same chip is shown on each document row.
- Hovering the chip reveals a tooltip with the extracted field map: "Ingredient: Niacinamide · CAS: 98-92-0 · Supplier: ABC Labs · §606 FEI: 3012345678."

**Agent summary block (DocumentPreview right panel).** Every document that opens in DocumentPreview renders a three-part summary at the top of the "Evidence captured" panel: Contents / Gap / Suggested next step. Each is one sentence, inputs-led, no hedges. The Suggested-next-step line is a clickable action when the action maps to an existing surface (Draft email, Route to Review Queue, Link to supplier, Request updated §609). Header carries `<ProvenanceChip variant="summarized" timestamp={summarizedAt} />` reading `Summarized by Valent · {timestamp}`. Styled to match the Today's Work card chrome (2px cyan left border on paper-50 fill) so the two agentic surfaces read as of-a-kind. Full spec in `docs/04-screen-ingest-inbox.md §2a`.

**Review-and-approve HITL gate (Needs review documents).** When `linkStatus === 'needs-review'`, DocumentPreview pins a review-and-approve strip below the summary block. Three actions — **Approve & link** (primary emerald), **Reject** (ghost red, requires reason), **Request re-extraction** (ghost ink). Approve is `Cmd/Ctrl-Enter`. Every action emits a `documentReview` audit event into the shared event stream (surfaced in Supplier Detail ActivityPanel's Recent activity section alongside `flag-resolved` events). Full spec in `docs/04-screen-ingest-inbox.md §2b`.

**Copy rule:** "Extracted by Valent · 94%" for the row chip — no other wording. Never "AI-extracted," never "automatically detected." For the summary chip: "Summarized by Valent · {timestamp}" — never "AI summary" or "analysis." For the approval strip: primary button is always "Approve & link"; destructive is always "Reject."

### 2. Auto-assembled audit bundle

**Screen:** Audit Bundle modal (Phase 2C).

**Behavior:**
- When the modal opens, the evidence list is pre-populated with the freshest passing evidence per pillar.
- Header reads: `Valent selected {N} documents across 7 pillars — review and confirm.`
- Each pre-selected row has a subtle "pre-selected" indicator (not a checkbox state change — users expect unchecked = removed).
- User can uncheck any row. The header count updates.
- User can also click "Show all documents" to reveal non-selected evidence (e.g., older versions, superseded documents) and swap in alternates.
- No change to existing modal layout beyond the header line and the pre-selection logic.

**Copy rule:** The word "selected" — not "recommended," not "curated," not "intelligently chosen."

### 3. Proactive flag generation

**Screen:** Review Queue.

**Behavior:**
- Flags are not authored by users. They are created by the agent when extraction or monitoring detects:
  - A missing required field (e.g., supplier has no §607 listing on file)
  - An expired or aging field (e.g., FEI renewal date <30 days)
  - A conflicting field (e.g., two documents disagree on a CAS number)
  - A new document that could not be linked confidently
- Each flag has a suggested-remediation line below the flag title, e.g., `Suggested: request current §607 listing from Supplier X.` (Plain sentence, no chip.)
- The row's primary action is a **Valent-branded Draft-email button** — Sparkles glyph + "Draft email" label + 1px brand-cyan border on paper-0 fill. The button itself communicates "this yields a Valent-drafted asset," which removes the need for a per-row provenance chip. Clicking opens the supplier-chase modal (surface #4).
- Flags still carry `created_by: 'valent'` in the data model for audit-trail and filtering purposes. **No row-level ProvenanceChip variant="drafted" is rendered.** Earlier spec placed one on every flag row; it was repetitive across a 24-row queue and the signal it carried belongs on the button producing the artifact. Provenance is retained in ChaseDraftModal's footer ("Drafted by Valent · review before sending") per surface #4.

**Copy rule:** "Suggested:" prefix on the remediation sub-line, never "We recommend" or "AI suggests." Draft-email button label is always "Draft email" — never "Compose," never "Reach out."

### 4. Supplier chase drafts

**Screen:** New modal, launched from Review Queue flag rows.

**Behavior:**
- Clicking "Draft email" on a flag opens a modal with a pre-written email.
- Modal contents:
  - Recipient: auto-filled from supplier contact on file (editable).
  - Subject: context-specific (e.g., "Request: current §607 listing — due Apr 30").
  - Body: three short paragraphs — opener, specific ask with deadline, sign-off. Plain English, professional register, no jargon.
  - Footer: "Drafted by Valent · review before sending."
- User can edit any field. "Send" routes through mailto or logs the send with a toast confirmation.
- Modal is reusable across multiple flag types — body copy varies by flag.category.

**Copy rule:** Draft body uses plain English. "Hi {contact name}, we're refreshing our MoCRA evidence and need a current §607 cosmetic product listing for {ingredient/product}. Can you send by {deadline}? Thanks, {user name}."

### 5. Forward-looking monitoring alerts

**Screen:** TopBar, extended.

**Behavior:**
- The existing "last scan 2 min ago" pulse expands into a small dropdown when clicked.
- Dropdown shows three categories:
  - **Expiring soon** — fields within 30-day expiry window.
  - **Aging** — fields past their soft-freshness threshold but not yet expired.
  - **New — awaiting review** — documents that arrived since last user session.
- Each line in the dropdown is clickable and routes to the relevant supplier or flag.
- Empty state (rare in demo data): `All pillars healthy · next scheduled scan in 4h.`
- Dropdown closes on route change.

**Copy rule:** Numbers lead, not adjectives. "3 fields expiring within 30 days" — not "Some items need attention."

### 6. Trust score provenance

**Screen:** Trust Grid, Supplier Detail header.

**Behavior:**
- Hovering the trust score ring reveals a tooltip: `Computed from 7 pillars · last evaluated {timestamp}`.
- On Supplier Detail, a small text line below the score reads: `Computed by Valent · {timestamp}`.
- This is subtle — the goal is to reinforce that the score is output of agent work, not a human-entered number, without adding visual clutter.

**Copy rule:** "Computed by Valent" — not "calculated," not "derived," not "generated."

### 7. Today's work — the system-of-action surface

**Screen:** Trust Grid landing page. Positioned at the top of the main content region, above the portfolio summary band. Default state: always visible for logged-in users. Height is bounded — never more than 5 items visible at once. Overflow collapses to "+ N more" inline link.

**Purpose:** Answer the question "what should I do right now" on landing. This is the single surface that makes Valent Trust a system of action rather than a system of record. Without it, Sarah has to scan four surfaces and mentally triage. With it, she has a ranked short list on open.

**Styling must read agentic, not like a to-do list.** This is the load-bearing design call for this surface. The functional shape is a ranked list, which is also the shape of Asana, Linear, Trello, or a handwritten notebook. Differentiation is carried by four visual elements below. If any of them is cut, the card regresses to generic task UI.

#### Card chrome

- **Card header layout:** `Today's work` title on the left, `ProvenanceChip variant="ranked" · Ranked by Valent · 2m ago` on the right. The chip is the same component used by the other six surfaces — consistency across agentic surfaces is the point.
- **No subhead.** Drop "Ranked by Valent. Review and act." The provenance chip carries the signal; the subhead would duplicate it and soften it.
- **Card border accent:** subtle 2px left border in brand cyan (`#22D3EE`). Cyan is reserved for chrome per design system; this card is chrome-adjacent (continuous system output). No other cards on the landing page get this treatment — the border is the card's visual marker.
- **Shadow:** `shadow-md` per design system. Slightly elevated vs. the portfolio summary band below it, so landing attention lands here first.

#### Row anatomy (two-line row)

Each row is two lines of content, not one. This is the single most important visual differentiator from to-do list UI.

Line 1 (action line):
- **Rank badge** (monospace, muted ink, `01` / `02` / `03`). Left-most element. This reads as "computed sequence" the moment the eye hits it.
- **Severity dot** (red / amber / emerald, 8px). Between rank and description.
- **Action description** (verb-led, one sentence, max ~70 chars). Primary text.
- **Context chip** (supplier name or scope), right-aligned before CTA.
- **CTA button** (primary, rounded, verb label like "Draft email" or "Open bundle"), right-most.

Line 2 (reasoning glimpse):
- **One-sentence computed rationale** in smaller, tertiary-ink text. Examples:
  - `deadline in 3 days · §607 pillar · 2 retailer audits depend on this`
  - `low confidence extraction · 2 docs from same supplier · re-run possible`
  - `bundle due Friday · 21 of 23 docs ready · ingredient declaration pending`
- This line is the load-bearing signal that agent work produced the ranking. Hand-authored task lists do not show derived reasoning under each item.

Full row example:

```
01  🔴  Draft chase email to Supplier X — §607 listing expires Apr 28         [Alpine Botanicals]   [Draft email]
        deadline in 3 days · §607 pillar · 2 retailer audits depend on this

02  🟡  Review 2 low-confidence extractions                                    [Ingest Inbox]        [Open queue]
        74% and 69% confidence · both from same supplier batch
```

Monospace treatment on the rank badge and the reasoning glimpse is a visual callback to the "computed provenance" pattern used in the trust score tooltip and the extraction confidence chip. The font mix (Inter for action, JetBrains Mono for rank + reasoning) is the same mix used for data-dense surfaces elsewhere.

#### Ranking rule

Deadline × severity × supplier criticality. Encoded in data (the `todaysWork` collection), not computed live. The demo data should include 5–8 entries ranked in a way that visibly reflects this logic — e.g., the top item has the tightest deadline, the second item has high severity but a looser deadline, the third item has medium severity but affects the most retailers.

Hand-write the `reasoning` field for each entry so it reads derived-from-inputs, not decorative.

#### Empty state

Header retains the ProvenanceChip. Body reads: `All clear — next scan in 4h.` No rows rendered.

#### HITL mode

Auto-ranked. User chooses what to act on. No action happens from the card alone — every CTA lands the user in the screen where they confirm, edit, or send. The card is a picker, not a queue that auto-advances.

#### Copy rules

- Action line: verb-led, one sentence, object-explicit. "Draft chase email to Supplier X — §607 listing expires Apr 28" is correct. "Follow up with Supplier X" is not — too vague, reads human-authored.
- Reasoning line: inputs-led, data-dense, middle-dot-separated. Reads like a formula output, not a caption.
- No "You should…", "Consider…", "Valent recommends…". The ranking is the recommendation; the copy states the action.
- No emoji in production copy. The severity dot is a colored circle element, not a literal emoji. (Emoji examples above are just doc shorthand.)

#### Why this lives on Trust Grid, not on its own screen

The agent is in the chrome, not on a page. A dedicated "Today" screen would compete with the Trust Grid for landing-page primacy, and worse, it would imply "today's work" is separable from "your supplier base." It isn't. The supplier grid is the context; today's work is the priority layer over it.

#### Pitch value

This is the surface that makes Jim say "oh — it tells you what to do." More than any other surface, this is what earns the Vanta analogy. Vanta tells internal-controls owners what to fix; this tells compliance ops owners what to chase. Equivalent mechanic. The two-line row with computed rationale is what visually separates this from "another dashboard" — the reasoning glimpse is the moment a reviewer realizes the system is doing work.

## How this changes the demo feel

Before this doc: the user arrives at a screen with data and takes manual action.
After this doc: the user arrives at a screen where the agent has already staged work, and takes approval action.

Concrete change per screen:

| Screen | Manual feel (before) | Agentic feel (after) |
|---|---|---|
| Trust Grid (landing) | Supplier table | **Today's work card** above table with ranked actions |
| Ingest Inbox | Documents listed | Documents listed **with extraction provenance and auto-links** |
| Supplier Detail | Evidence rows listed | Evidence rows listed **with extraction provenance** |
| Review Queue | Flags to author | Flags **auto-created with suggested remediation** |
| Audit Bundle | Pick documents | **Pre-selected documents** to review and confirm |
| Trust Grid rings | Scores displayed | Scores **with computed provenance** on hover |
| TopBar | "Last scan 2m ago" pulse | Pulse opens into **forward-looking alert dropdown** |

Net effect: the wedge ("messy PDFs become audit-ready evidence") is visibly delivered rather than implied, AND the user lands in a system of action rather than a viewer.

## Data model additions

The existing state contract needs four additive fields. These are append-only — no existing field changes.

- Document object: `extraction: { confidence: 0–100, extractedBy: 'valent', extractedAt: ISO, fields: { ingredient, cas, supplier, fei, ... } }`.
- Document object: `summary: { contents: string, gap: string, suggestion: string, suggestionAction?: { label, action, targetId }, summarizedAt: ISO }`. Hard-coded per doc. Documents without a summary render DocumentPreview without the summary block (backward compatible).
- Flag object: `createdBy: 'valent' | 'user'`, `suggestedRemediation: { text, action: 'draft-email' | 'request-renewal' | 'reconcile' | 'none' }`. Note: `createdBy` no longer renders as a per-row chip on FlagRow — the branded Draft-email button carries that signal.
- Event stream: new `documentReview` event type `{ type: 'document-review', documentId, supplierId, action: 'approve' | 'reject' | 'requeue', actor, at, correctedFields?: object, reason?: string }`. Emitted by DocumentPreview's review-and-approve strip. Rendered in Supplier Detail ActivityPanel Recent activity alongside `flag-resolved`.
- Supplier object: `trustScore.computedAt: ISO`.
- New **todaysWork** collection at root of data: an array of 5–8 ranked action objects. Each has: `{ id, rank: 01–05, severity: 'red|amber|emerald', description, reasoning, contextChip, cta: { label, action, targetScreen, targetId } }`. The `reasoning` field is a short input-led sentence like "deadline in 3 days · §607 pillar · 2 retailer audits depend on this" — visibly derived from data inputs, not decorative copy. Hard-coded for the demo; in production this would be derived from flags + alerts + deadlines.

Each field has sensible defaults if absent (treat as legacy manual data). This keeps the change backward-compatible with whatever schema the build agent already settled on.

## Implementation notes for the build agent

- This doc is additive. Do not restructure existing components. Each surface is a new subcomponent or an injected prop inside an existing component.
- The provenance chip is a new shared component: `<ProvenanceChip variant="extracted|computed|drafted|ranked" confidence={94} timestamp="2m ago" />`. Build once, reuse across screens #1, #3, #4, #6, #7. The `ranked` variant renders "Ranked by Valent · {timestamp}" without a confidence percent.
- The forward-looking alert dropdown extends the TopBar — reuse existing last-scan pulse, expand it.
- The chase-draft modal is a new modal but uses the existing audit bundle modal shell pattern.
- All six surfaces must land before phase 4 exit to hit the agentic-feel bar. They do not all need to land in the same phase.
- Recommended phasing: #1 and #6 land with phase 3 (they touch Ingest Inbox and trust grid chrome). #2 and #3 land as phase 2C and phase 3B addenda respectively. #4 and #5 land in phase 4 polish. #7 (Today's work) is a phase 2A addendum — it lives on Trust Grid and should land as part of the landing page, not as a retrofit.
- Surface #7 is the single most important agentic addition for the Sarah persona's "Tuesday afternoon" test. It should not slip phases.

## Out of scope

- Any "Agents" screen, "Agent Terminal," or agent dashboard. The agent is in the chrome, not on a page.
- Streaming text animations or "thinking" indicators. No fake log lines.
- Self-healing actions that run without user approval. Every agentic action ends in a human review step.
- Multi-turn agent conversation UI. Draft modals are one-shot.
- Real LLM calls. This is still hard-coded JSON data — the "extraction" output is pre-baked, not computed at runtime.

## What this unlocks for pitch

A knowledgeable reviewer watching the demo now sees:
- Documents arriving and being extracted (wedge delivered)
- Flags appearing with suggested fixes (proactive, not reactive)
- A draft email ready-to-send (the most tangible "agent did work" moment)
- A bundle that pre-assembles (the hero artifact is an agent output)
- A forward-looking alert (continuous monitoring is visible, not implied)

These are the product primitives that make "Vanta for suppliers" earn its positioning. Without them, the analogy is a claim. With them, it's demonstrated.

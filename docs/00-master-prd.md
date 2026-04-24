# Valent Trust — Master PRD

## One-line thesis

Valent Trust is the continuous compliance layer for regulated physical supply chains. For a mid-market cosmetic CMO, it turns a chaotic inbox of supplier PDFs into a live, per-supplier trust record an auditor or a buyer can read in sixty seconds.

## Why now

MoCRA puts three new legal obligations on cosmetic CMOs: facility registration (§606), cosmetic product listing (§607), and safety substantiation (§609). The evidence for each lives in messy supplier documents — COAs, SDSs, allergen declarations, origin statements — that the CMO receives by email and stores across Box folders, SFTP dumps, and ERP attachments. Nobody has a live, entity-level view of whether any given supplier can actually support a shipment legally. Every audit, every buyer diligence request, every product launch turns into a fire drill through PDFs.

The Vanta analogy is precise on the wedge: continuous monitoring, evidence-on-tap, buyer-facing trust signal. It is not precise on the underlying evidence plane — supplier documents are messier, remediation loops are slower, and the regulatory surface is more fragmented than SaaS security. The product has to respect that.

## End user persona (primary)

**Sarah · Compliance Ops operator**

- Mid-market cosmetic CMO, 2–4 production facilities.
- Daily driver of the tool. Triages inbound supplier documents, chases missing evidence, answers "can we ship this?" from operations, prepares audit packets when a buyer or FDA asks.
- Lives in Outlook, Excel, and SharePoint. Rarely opens a BI tool. A Tuesday afternoon looks like: thirty inbound supplier emails, four open audit threads, two "Sarah can you check this?" Slack DMs from procurement.
- Success for Sarah is not a dashboard. Success is a screen she opens at 9am that tells her which three suppliers need her attention today, a one-click way to act on each, and a shareable bundle she can hand to a buyer without rebuilding it from scratch.
- Anti-goals: she does not want to read PE-grade KPIs, she does not care about margin, she does not want to learn a new vocabulary.

## End user persona (secondary)

**Gary · Procurement Lead**

- Evaluates suppliers, issues RFQs, decides who to buy from. Needs per-supplier trust posture visible at the moment of decision, but lives mostly in his ERP and supplier scorecards.
- Uses Valent Trust episodically — when onboarding a new supplier or when a buyer escalates.

## End user persona (tertiary)

**Rachel · Quality Manager**

- Approves ingredient specs against formulation requirements and regulatory floors. Needs evidence trails per ingredient, not per supplier.
- Uses Valent Trust during change-control moments (reformulation, new market entry, buyer-driven spec tightening).

## Personas out of scope for this demo

- **Jim · CEO.** He will see this demo in a pitch context but is not an end user. The demo should be legible to him in ninety seconds — that legibility is a side-effect of nailing Sarah's experience, not a separate design goal.
- **Alpine reviewer / LP-style investor.** Same treatment as Jim. Demo should read as a crisp wedge product, not as a PE deck.

## Product surface (IA)

Primary entity is **Supplier**. Every screen either lists suppliers, drills into a supplier, or supports a supplier-centric workflow.

Six live screens plus one locked roadmap section:

1. **Supplier Trust Grid** — landing page. Vanta-style entity dashboard.
2. **Supplier Detail** — per-supplier trust pillars, evidence timeline, actions.
3. **Audit Bundle** — modal launched from grid or detail. The shareable artifact.
4. **Ingest Inbox** — where evidence comes from (email, drive, SFTP).
5. **Review Queue** — flagged items needing human judgment, rolled up per supplier.
6. **Admin · Adoption** — gated. Ops-manager KPIs, not pitch-relevant.

Roadmap section (collapsed by default, all locked): Pipeline Aggregator, Bid Sandbox, Margin Engine. These preserve the expansion narrative without cluttering the wedge story.

## Trust model

Each supplier carries a **trust score** (0–100) derived from seven **trust pillars**:

1. **FEI registration** — does the supplier's facility have an active FDA Establishment Identifier matched to their name? (§606)
2. **Cosmetic product listing** — is the substance or formulation listed per §607 where applicable?
3. **Safety substantiation** — does the supplier have adequate safety data on file per §609?
4. **Allergen declaration** — are allergens declared accurately and completely?
5. **Origin & chain-of-custody** — is country-of-origin and upstream sourcing documented?
6. **Purity & identity** — does the most recent COA meet the spec floor? Is the identity (CAS/INCI) cleanly mapped?
7. **Documentation freshness** — is the most recent COA or spec doc within its validity window?

Each pillar evaluates to one of four states: `pass`, `fail`, `pending` (evidence received, awaiting review), `missing` (no evidence on file). Pillar weighting is hard-coded and documented in `docs/20-design-system.md`.

## Evidence model

Every pillar points to one or more evidence records. An evidence record is a document (COA, SDS, allergen statement, origin letter, §606 registration screenshot, §607 listing) with identity, provenance source (email / drive / SFTP / manual), ingested timestamp, extraction confidence, and the raw file reference. The audit bundle screen assembles these into a shareable packet.

## Continuous monitoring

The product is framed as always-on. Every screen carries a small "last scan · Nm ago" pulse in the top bar. Scans in this demo are simulated — the hard-coded `lastScan` timestamp is set a few minutes in the past. Underneath, the model is: every supplier's pillars are re-evaluated whenever new evidence arrives or existing evidence expires. Changes trigger toast events in the right-side activity feed (phase 3).

## Success criteria for the demo

A procurement operator who opens the demo cold can, in five minutes, answer each of:

1. Which of my suppliers is not ready to ship right now?
2. What specifically is broken for the worst one?
3. What do I need to do, and who has to do it?
4. Can I hand a buyer or an auditor evidence that my supplier is in compliance?

A PE-grade reviewer who watches a ninety-second walkthrough can articulate:

1. What the wedge is (continuous supplier compliance).
2. Who the buyer is (compliance ops at a regulated CMO).
3. What the artifact is (the audit bundle).
4. Where the expansion goes (the roadmap section).

## Out of scope for this demo

- Real FDA API integration. The §606 / §607 cross-checks are simulated on hard-coded data.
- Multi-tenancy, auth, user management.
- Mobile breakpoints below 1024px. Demo is desktop-first.
- Localization.
- Any bidding, pipeline, or margin functionality (lives in the locked roadmap section only).

## Tech stack

React 18 + Vite 5 + Tailwind 3 + Lucide + Recharts. No TypeScript. Hard-coded JSON data layer. React Context for cross-screen state (active supplier, selected pillar, toast queue). No routing library — single `activePage` + optional `activeSupplierId` in App-level state.

## Data boundaries

- `src/data/suppliers.js` — 12–18 suppliers with full pillar + evidence payloads. Designed so the grid reads legibly (mix of pass / fail / pending / missing across pillars).
- `src/data/documents.js` — 40–60 document records tied to suppliers by foreign key.
- `src/data/events.js` — 15–25 continuous-monitoring events for the activity feed.
- `src/data/trustPillars.js` — the seven pillar definitions with weights, labels, §-anchors.
- `src/data/personas.js` — PDF persona tags (scan-light, photocopy, handwritten, etc.) ported from v3.

## Build posture

- Ship the PRDs first; no code in phase 0.
- Scaffold before screens; design tokens before components.
- Parse-check every edit; the sandbox lacks a working Vite build binary.
- Every phase ends with a STATE.md checkpoint.
- Self-review is a first-class phase, not a vibe check.

## Naming

- Product name in UI: **Valent Trust**.
- Wordmark: "Valent" + "Trust" in a subdued weight relationship (semibold + regular).
- Tagline (optional, chrome-level): "Continuous supplier compliance for regulated supply chains."
- Glyph: inherited from v3 sidebar (Sparkles, cyan accent).

## Open questions (to revisit at phase 5)

- Does "trust score" as a 0–100 number oversimplify in a way that a compliance operator will resent? Fallback: categorical (`Ready` / `Watch` / `Blocked`).
- Is Ingest Inbox useful in the demo, or should it collapse into a "last ingested" pill on the supplier row? Will decide after phase 2.
- Does the audit bundle need a real PDF preview, or is a stylized in-app preview enough for the pitch? Current plan: stylized in-app, with a "download" ghost CTA that triggers a toast ("audit bundle queued · will email when ready").

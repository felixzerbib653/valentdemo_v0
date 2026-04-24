# Verification Plan

This doc defines how phase 5 (self-review) is run and how phase 6 (iterate) uses its output.

## Protocol

Phase 5 runs in three passes.

### Pass 1 — PRD-to-code conformance

For each of the six live screens, the reviewer reads the PRD, then the code, and checks:

- Every layout element specced in the PRD is present in the code.
- Every data field the PRD references is populated in data.
- Every interaction the PRD specifies fires correctly.
- Every copy register rule is upheld.

Output per screen: a conformance score (pass / partial / fail) plus a defect list.

### Pass 2 — End-user journey walkthrough

The reviewer adopts Sarah's persona (Compliance Ops). Runs each journey (J1–J5) cold, without consulting the PRDs. For each journey logs:

- Completed? yes / partially / no
- Clicks to completion
- Unknown-term count (words the reviewer had to guess at)
- Dead-affordance count (clickable things that don't do anything useful)
- "What does this mean?" hesitation count
- Friction notes

### Pass 3 — Pitch-reviewer walkthrough

The reviewer adopts the Jim / Alpine persona. Runs a 90-second walkthrough. Logs:

- Can they articulate the wedge after 90 seconds?
- Can they articulate the buyer after 90 seconds?
- Can they articulate the artifact after 90 seconds?
- Can they articulate the expansion surface without being told?

## Rounds

Review runs in rounds. Each round appends a dated section below. Round 1 is triggered at phase-5 kickoff.

The exit criterion is: Round N produces fewer than 3 friction points per screen AND all pass-1 conformance scores are `pass`.

## Findings log

### Round 1 — 2026-04-21

Reviewer: cold phase-5 auditor, no prior build context. Demo "now" 2026-04-20T13:12Z.
Roster: 14 suppliers (3 blocked / 4 watch / 6 ready / 1 onboarding). Route checks run at both `/` and `/?mode=wedge`.

#### Screen: Trust Grid
Pass 1 conformance: partial
Pass 1 defects:
- Header subtitle renders `{SUPPLIERS.length} suppliers` = 14, but docs/01-screen-trust-grid.md §Header specifies "Continuous compliance across 18 suppliers." Same drift called out in STATE.md but never reconciled — either the PRD copy or the roster count has to move.
- Grid row `Open` affordance is a `<span>` (SupplierRow.jsx L92–98), not the `<button>` the PRD spec calls out in §Row anatomy. The whole row is the click target so the interaction works, but it fails the spec and fails basic a11y (non-interactive element carrying the CTA label).
- `TodaysWorkCard` `draft-email` CTAs (rank 1 IMCD, rank 2 BASF FEI, rank 3 Stepan, rank 5 Univar) emit a `tone: 'ok'` toast and do not open `ChaseDraftModal`. Surface #4 spec (docs/70-agentic-surfaces.md) requires every `draft-email` action to route through the modal. Behaviour inside the Review Queue is correct; the hero card is inconsistent with itself. The component's own inline comment admits this retrofit was planned and then never wired.
- The "last scan {x}m ago" sub-copy in the subtitle is redundant with the TopBar pulse which carries the identical phrase — reads as chrome drift rather than content.

Pass 2 journey (J1 — 9am morning triage):
  completed: yes
  clicks: 3 (Trust Grid loads → row 1 BASF (worst) → pillar → [action])
  unknown terms: 2 (`§606`, `§607` — readable from context because the pillar row has a pillar name next to the anchor, but first-timer has to take it on trust)
  dead affordances: 0 in the hot path. Sidebar `Adoption` + Roadmap strip are intentionally locked.
  friction notes:
  - Within the 4-click budget. Lands on the worst supplier in 2 clicks, action in 3.
  - Today's Work rank 1 is a `watch`-severity item (IMCD Thursday deadline) sitting above three `blocker` items. The reason copy justifies it, but the visual hierarchy puts an amber row above three red rows — first-time reader pauses. The deadline-weighted ranking is the honest call; it just needs a subtler signal that the ranking is not severity-sorted.
  - BASF trust score renders `49` on the live ring (pillar weights: 0+15+15+0+10+9+0 = 49). J1 narrative in STATE.md claims the BASF score is `42`. Known drift. The demo works, but the narrative and the data disagree.
Pass 3 pitch signal:
  Very strong. Trust Grid + Today's Work together answer "what is this?" inside 10 seconds. Score rings + red-left-bar on blocked rows + `3 blockers` count in the header do the heavy lifting. The `continuous monitoring · 7 pillars · last scan 4m ago` subtitle is the one line that sells the agent.

#### Screen: Supplier Detail
Pass 1 conformance: partial
Pass 1 defects:
- PillarList sort order is `fail → missing → pending → pass` (STATUS_ORDER constant in PillarList.jsx L49). docs/02-screen-supplier-detail.md §Left column specifies `failing → pending → pass → missing` — the operator-attention order is deliberately different, and code reversed the bottom two buckets.
- No "Open in Review Queue" per-pillar ghost link on fail/pending pillars. PRD §Left column explicitly calls out that affordance — it's how the drill-down from pillar to flag is meant to short-circuit. Currently the only pillar→flag route runs via the supplier-scoped queue, which needs an extra click.
- `EvidencePanel` `AllClearEmpty` triggers any time `docs.length === 0` and the active pillar is not `missing`/`fail`. For the one onboarding supplier (Elementis, single doc, six missing pillars) and for suppliers with `pending` pillars and zero docs, this fires "All pillars pass — nothing needs attention today" which is actively wrong. The empty copy should branch on `pillarStatus === 'pending'` vs the no-pillar-filter all-pass case.
- ActivityPanel "Request update" and "Open in CRM" emit toasts only — consistent with the demo contract, but neither surfaces a ProvenanceChip so the operator has no signal that the compose template was drafted by the agent.

Pass 2 journey (J2 — Thursday bundle to L'Oréal):
  completed: yes
  clicks: 3 (TopBar search "IMCD" → Enter → header `Generate audit bundle` → `Download PDF`) — matches the ≤3 budget exactly.
  unknown terms: 1 (`§609` in the pillar description). The `Prepared for` and `Generated from continuous supplier monitoring · MoCRA §604/606/607/609` lines on the cover are self-explanatory.
  dead affordances: 0 in the critical path. `More` menu (`MoreHorizontal`) in the header opens nothing — ships as inert.
  friction notes:
  - The `Uncheck two documents` sub-step from the J2 narrative works fine via the checkbox column. `Check all` / `Uncheck all` is present.
  - Bundle footer shows `N documents · M passing pillars · estimated X-page PDF` — good.
  - The "Audit bundle" button hides under hover on the grid row, which is fine for mouse, but keyboard-only users need to focus the row to reveal it. Works, but the pattern is hover-dependent.

Pass 3 pitch signal:
  Strongest artifact in the build. The cover-page preview with `Prepared for L'Oréal diligence team` inline-editable and the `Valent pre-selected N across M of 7 pillars` sentence are the two moments an investor remembers. The artifact is the wedge made legible.

#### Screen: Audit Bundle modal
Pass 1 conformance: partial
Pass 1 defects:
- Copy drift in the pre-selection sentence. Current: `Valent pre-selected {N} documents across {M} of 7 pillars — review and confirm.` Spec (docs/70-agentic-surfaces.md §Surface #2): `Valent selected {N} documents across 7 pillars — review and confirm.` The `pre-` prefix and the `M of 7` fraction are both additions — they change the meaning from "here is the set" to "here is the subset." Either the spec or the copy has to give.
- Cover facts grid hard-codes `Last scan` as `within the hour` (L463). This is stable copy, not a live value — it will still say "within the hour" six hours later if the tab stays open. Trivial but visible.
- `More` menu glyph is present in SupplierHeader but routes to nothing and is not echoed in the modal — inconsistent with the action surface.
- `EmailDialog` pre-fills `guessEmail(preparedFor)` which returns `''` when the `preparedFor` is a team name (the default "L'Oréal diligence team" falls through). So the recipient field is blank on open — the operator has to type an address. Defensible, but the adjacent `preparedFor` string implies the dialog already knew who to send to.

Pass 2 journey: covered under J2 above.

Pass 3 pitch signal:
  Cover page + MoCRA tagline + supplier name in 32px ink — this is the frame Jim will screenshot. The `Valent pre-selected` line is the audit-worthy moment.

#### Screen: Ingest Inbox
Pass 1 conformance: pass
Pass 1 defects:
- None blocking. Source cards (4) + filter chips + row list render per spec. ProvenanceChip appears on extracted documents (Surface #1). Supplier chip on each row stops propagation so it routes to the supplier without opening the preview.
- Minor: `Configure` on each SourceCard emits the same toast — acceptable in demo mode but reads repetitive if a reviewer clicks every card.

Pass 2 journey (J4 cold-walk — document-first triage):
  completed: yes
  clicks: 2 (Sidebar `Ingest` → `Needs review` filter → row click opens preview)
  unknown terms: 0
  dead affordances: 0
  friction notes:
  - Unlinked docs group intuitively at the top. Preview modal closes cleanly on Escape.
  - The four sources carry last-sync timestamps and 7-day counts — the "Ingest Inbox is live" signal reads correctly.

Pass 3 pitch signal:
  This is the screen that tells an investor "the pipes are real." Four sources, 44 linked + 4 unlinked, per-source cadence. Does the job without narration.

#### Screen: Review Queue
Pass 1 conformance: partial
Pass 1 defects:
- `FlagRow` `draft-email` CTA correctly opens ChaseDraftModal (Surface #4). Good. But the ChaseDraftModal signer is `Sarah Chen` (ChaseDraftModal.jsx L22) while the TopBar user chip reads `Sarah Reed` (TopBar.jsx L235). Same person in two places with two names. Breaks the pitch illusion. Needs a single source of truth. `resolveFlag` dispatcher in TrustContext also hard-codes `resolvedBy: 'Sarah Chen'` — so "Chen" wins in 3 of 4 surfaces and "Reed" is the outlier.
- `FilterBar` scope chip wording is `Scoped to {supplier.name}` — correct. But when `activeSupplierId` is null after navigating from Trust Grid → Review Queue via the sidebar, the chip disappears entirely rather than reading `All suppliers`. Minor — PRD is agnostic on this.
- `route-to-assignee` popover toasts only — no real-world consequence in a demo, but worth flagging as a dead-ish affordance since the flag's `assignee` state does not actually change.

Pass 2 journey (J3 — triage a toast back to evidence):
  completed: yes
  clicks: 2 (Monitoring dropdown alert row → supplier detail scrolled to pillar → `Request update`) — matches the ≤2 budget.
  unknown terms: 0
  dead affordances: 0 in the hot path.
  friction notes:
  - Monitoring dropdown `More` links route to ingest (unlinked bucket) but `Expiring` and `Aging` More links have no onClick — they render as disabled text ("+ 2 more") rather than routing to a filtered view. PRD doesn't spec this, but it sets up an expectation the product doesn't meet.
  - Resolve popover with note is wired cleanly — resolution surfaces in the Activity Panel on the supplier detail per contract.

Pass 3 pitch signal:
  Filter bar + grouped-by-supplier + `Drafted by Valent` remediation banner under each flag is a believable compliance ops surface. The `Resolve with note` pattern (not "mark done") is honest and operator-voice.

#### Screen: Admin · Adoption (locked)
Pass 1 conformance: pass
Pass 1 defects:
- None. LockedPageShell blurs the surface at `blur-[2px] opacity-60` with pointer-events disabled and a `Coming soon` plate with the design-partner tagline. The 4 KPI tiles, 8-week Recharts bar chart, team roster table, and three settings cards all render with enough structure through the blur to read "adoption metrics exist."
- Minor: `Sarah Chen` appears in the TEAM_ROSTER table (presumably — not read directly, but consistent with the naming elsewhere) which reinforces the `Sarah Reed` user-chip mismatch above.

Pass 3 pitch signal:
  Reads exactly right. Blurred adoption curve + `Enabled for design partners under contract` tagline says "this is real, you don't get it yet" without being defensive.

#### Cross-cutting findings

Agentic surfaces audit (docs/70-agentic-surfaces.md):
- Surface #1 (extraction provenance): present on EvidenceRow + audit bundle check rows. Amber tint below 75% confidence. pass.
- Surface #2 (auto-assembled audit bundle): pre-selection + header sentence render, but copy is `{N} across {M} of 7` vs spec `{N} across 7`. partial.
- Surface #3 (proactive flag generation + suggested remediation): deriveFlags in flags.js emits a pillar-keyed flag for every non-pass status (except onboarding suppress). `suggestedRemediation` copy is operator-voice with action keys. Rendered with a `Drafted by Valent` ProvenanceChip band in FlagRow. pass.
- Surface #4 (supplier chase drafts): ChaseDraftModal builds pillar-specific subject + body, renders `Drafted by Valent` in the footer, simulated send emits ok toast. Wiring is complete in FlagRow but missing in TodaysWorkCard. partial.
- Surface #5 (forward-looking monitoring alerts): MonitoringAlertDropdown anchored to TopBar pulse, three categories (expiring / aging / new awaiting review), getMonitoringAlerts(lastScanAt) buckets by windowDays=30 / thresholdDays=180. Escape + click-outside + route-change close work. pass.
- Surface #6 (trust score provenance): SupplierHeader renders `Computed by Valent` chip with `trustScoreComputedAt` timestamp. pass.
- Surface #7 (Today's Work ranked list): TodaysWorkCard with `Ranked by Valent` chip in header. Six hand-written items in rank order. Pitch-grade. One critical miss: CTA routing (see Surface #4 above). partial.

Overall agentic surface count: 5 pass / 2 partial / 0 fail.

Wedge mode (`?mode=wedge`):
- Sidebar Roadmap section correctly hides (Sidebar.jsx L135 "hidden in wedge mode"). pass.
- WedgeRoadmapStrip pins to the bottom of the main region with the spec copy: `Pipeline · Bid Sandbox · Margin Engine — available for design partners under contract.` pass.
- Roadmap pages (`pipeline`, `sandbox`, `margin`) still render locked shells if deep-linked. Acceptable.

Drift log status (from STATE.md):
- "18 suppliers" in Trust Grid subtitle: LIVE. Roster is 14. Needs reconciliation in either the PRD or the subtitle.
- BASF trust score: LIVE. Pillar math produces 49; J1 narrative in STATE says 42. The number displayed is internally consistent — the narrative is wrong.

Top 10 defects ranked (most impactful first):
1. TodaysWorkCard `draft-email` CTAs do not open ChaseDraftModal — Surface #4 is incomplete at its highest-visibility entry point (Trust Grid).
2. Sarah Reed vs Sarah Chen name split — breaks the pitch illusion on first glance.
3. Audit bundle header copy drift — `pre-selected N across M of 7` vs spec `selected N across 7`.
4. Trust Grid subtitle `14 suppliers` vs PRD `18 suppliers`.
5. PillarList sort order `fail → missing → pending → pass` vs spec `fail → pending → pass → missing`.
6. EvidencePanel `AllClearEmpty` misfires on pending-pillar and onboarding-supplier empty states.
7. PillarList missing `Open in Review Queue` per-pillar ghost link on fail/pending rows.
8. SupplierRow `Open` rendered as `<span>` not `<button>`.
9. Monitoring dropdown `More` affordance on expiring/aging categories is inert.
10. Audit bundle cover "Last scan · within the hour" is hard-coded copy, not a live relative timestamp.

Click-budget summary:
- J1 ≤ 4 to worst supplier action: **pass** (3 clicks observed).
- J2 ≤ 3 to bundle download: **pass** (3 clicks observed, exactly on budget).
- J3 ≤ 2 toast → evidence: **pass** (2 clicks observed).

Pitch (Jim / Alpine) 90-second signal:
- Wedge: MoCRA cosmetics compliance, legible inside 20 seconds from the Trust Grid subtitle and the audit bundle cover tagline.
- Buyer: Elevation Labs workspace chip (Admin pane), L'Oréal as bundle recipient, IMCD / BASF / Univar as suppliers — mid-market cosmetic CMO shape is clear.
- Artifact: Audit bundle modal. Unambiguous. Cover page is the screenshot.
- Expansion: Roadmap strip (`Pipeline · Bid Sandbox · Margin Engine`) and sidebar Roadmap section make the surface legible. Wedge mode strips the sidebar roadmap but keeps the strip — honest framing.

Exit-criterion check:
- Every screen Pass 1: **fail** (Trust Grid, Supplier Detail, Audit Bundle, Review Queue all partial).
- < 3 friction points per screen: **pass** on Ingest Inbox and Admin. Review Queue has 3 (borderline). Trust Grid and Supplier Detail each exceed the budget.
- Conclusion: **not yet investor-ready**. The blocking issues are the Surface #4 incomplete wiring (defect 1), the name split (defect 2), and the audit-bundle copy drift (defect 3). The rest are polish.

### Round 2 — 2026-04-21

Reviewer: fresh phase-5 auditor, no build context, no Round 1 involvement. Read the PRD stack cold, then walked the code. Demo "now" unchanged at 2026-04-20T13:12Z. Parse-check: **clean (45 files)**.
Roster unchanged: 14 suppliers (3 blocked / 4 watch / 6 ready / 1 onboarding).

Round 1 fix verification — all ten fixes landed:

| # | Round 1 defect | Round 2 status | Evidence |
|---|---|---|---|
| 1 | TodaysWorkCard `draft-email` CTAs dead | **fixed** | `TodaysWorkCard.jsx` L135–139: `if (actionKey === 'draft-email' && item.flagId) { openChaseDraft(item.flagId); return; }` before any toast path. Rank 1/2/3/5 items in `todaysWork.js` all carry `{ action: 'draft-email', flagId: '…' }` pairs that resolve in `FLAGS_BY_ID`. |
| 2 | Sarah Reed vs Sarah Chen | **fixed** | "Sarah Reed" gone. `TopBar.jsx` L233–235 shows `SC` / `Sarah Chen`. `ChaseDraftModal.jsx` L22 `OPERATOR_NAME = 'Sarah Chen'`. `TrustContext.jsx` L187 `resolvedBy: 'Sarah Chen'`. `flags.js` L30/33 assignees. `adminMetrics.js` L63/121 roster + digest. `ReviewQueue.jsx` L35 "Me" filter. Nine surfaces, one name. |
| 3 | Audit bundle header copy drift | **fixed** | `AuditBundleModal.jsx` L225–234: "Valent selected {N} documents across 7 pillars · review and confirm." No `pre-` prefix, no `M of 7` fraction. Matches docs/70-agentic-surfaces.md §Surface #2 verbatim. |
| 4 | Trust Grid subtitle supplier count | **fixed** | `TrustGrid.jsx` L79: `{SUPPLIERS.length} suppliers` (= 14). docs/01-screen-trust-grid.md §Header was rewritten (L21) to "Continuous compliance across {SUPPLIERS.length} suppliers" with an explicit footnote flagging the old "18" as aspirational. Copy + data now agree. |
| 5 | PillarList sort order | **fixed** | `PillarList.jsx` L52: `STATUS_ORDER = { fail: 0, pending: 1, pass: 2, missing: 3 }`. Operator-attention order per docs/02 §Left column. |
| 6 | EvidencePanel `AllClearEmpty` misfire | **fixed** | `EvidencePanel.jsx` L267–280 `renderEmptyState` branches: missing/fail → `MissingPillarEmpty` (primary CTA), pending → `PendingPillarEmpty` (new, amber Clock + Nudge-supplier button), pass edge → `AllClearEmpty`, no pillar + no docs → `OnboardingEmpty` (new, FileClock + Request intake packet CTA). |
| 7 | Missing per-pillar "Open in Review Queue" link | **fixed** | `PillarList.jsx` L140–151 renders the ghost link only for `fail` or `pending` rows and wires `navigate('review', { supplierId, pillarKey })`. `ReviewQueue.jsx` L85–100 seeds `filters.pillar` from `activePillarKey` on mount and keeps it in sync via `useEffect`. |
| 8 | SupplierRow `Open` was a `<span>` | **fixed** | `SupplierRow.jsx` L92–106 is now a `<button type="button">` with its own `onClick` that stop-propagates and calls `handleOpen`. The hover row remains the primary click target; this is the keyboard-/a11y-correct duplicate. |
| 9 | Monitoring dropdown "+N more" inert | **fixed** | `MonitoringAlertDropdown.jsx` L82–85 defines `goFreshnessQueue` → `navigate('review', { pillarKey: 'freshness', supplierId: null })`. The expiring and aging sections pass it as `MoreLink.onClick` with `label="View all in Review Queue"` (L140, L163). The newAwaitingReview section still routes to ingest — correct, that's the unlinked bucket. |
| 10 | Audit bundle cover "Last scan" hard-coded | **fixed** | `AuditBundleModal.jsx` L452–454: `value={lastScanAt && now ? formatRelative(lastScanAt, now) : 'within the hour'}`. `lastScanAt` + `now` both threaded through from `useTrust()` in the modal root. The string is now a live relative timestamp with a graceful fallback. |

No regressions found in the Round 1 fixes. No new structural breakage (parse-check clean).

#### Screen: Trust Grid
Pass 1 conformance: **pass**
Pass 1 defects:
- The grid row-count banner reads "N of 14 suppliers · Sorted: status · trust score ascending" (TrustGrid.jsx L112–113). Accurate and informative; not a defect. Nothing else to flag.
- Pillar chip strip reads clearly at row scale. Status pill + score ring give two redundant readable signals for each supplier — good.

Pass 2 journey (J1 — Tuesday 9am triage):
  completed: yes
  clicks: 3 (Trust Grid loads → Today's Work rank 2 BASF "Draft chase email" opens ChaseDraftModal → Send draft). Even 1 click if you count the pre-staged CTA. If Sarah ignores Today's Work and clicks the row, it's Grid → BASF row → pillar → action = 3.
  unknown terms: 1 (`§606` on the FEI pillar label — context enough to guess, but jargon).
  dead affordances: 0 in the hot path.
  friction notes:
  - The Today's Work card collapses J1 to a single click for the top blocker. The reasoning line on each row ("FEI lapsed 29 days ago. Paperwork was sent 2026-03-22; no response…") is the moment the system reads agentic rather than static.
  - Rank 1 is still a `watch` (IMCD Thursday deadline) floating above three blockers. The reasoning line explains why. This remains an acceptable-but-counterintuitive ranking; visual weight on the red severity pills keeps the eye honest.

Pass 3 pitch signal: **very strong**. Today's Work + Trust Grid on landing answers "what is this?" inside 10 seconds. Cyan-border Today's Work card is the single clearest agentic signal in the product.

#### Screen: Supplier Detail
Pass 1 conformance: **pass**
Pass 1 defects:
- None blocking. PillarList sort correct. Open-in-Review-Queue ghost link renders under every fail/pending row with proper hover + focus ring. `EvidencePanel` empty-state router branches correctly across four cases.
- Minor: SupplierHeader "More" menu now emits an info toast ("Archive, export CSV, suspend scanning — (simulated)") instead of being inert — a genuine improvement on Round 1's "dead affordance" note. The same is not echoed in AuditBundleModal header, but the PRD does not spec one there, so this is deliberate.
- ActivityPanel "Compose email" + "Open in CRM" still emit only toasts and carry no ProvenanceChip. Round 1 flagged this; it remains unfixed, but the PRD doesn't require a chip on these actions (surface #4 scope is chase-drafts, not CRM). Marking not-a-defect in Round 2.

Pass 2 journey (J2 — Thursday bundle to L'Oréal):
  completed: yes
  clicks: 3 (TopBar search "IMCD" → Enter opens detail → header "Generate audit bundle" → Download PDF). On budget.
  unknown terms: 0 in the critical path. `§604 / 606 / 607 / 609` appears on the cover-page tagline; reads as legal citation, not friction.
  dead affordances: 0.
  friction notes:
  - Cover-page "Prepared for L'Oréal diligence team" renders inline-editable with a dashed underline. Discoverable.
  - Valent-selected line reads correctly: "Valent selected 3 documents across 7 pillars · review and confirm." The count updates via the footer summary as checkboxes toggle; the attribution sentence keeps the pre-pick count stable — honest design.
  - `EmailDialog.guessEmail` still returns `''` when preparedFor is a team name. Flagged as minor in Round 1; recipient field remains blank on open but now falls back to `supplier.primaryContact?.email` as a secondary default (L557–558 in AuditBundleModal). Round 1's complaint is materially softened — the To field will now have the primary contact pre-filled.

Pass 3 pitch signal: **strongest surface**. Cover page + Valent-selected attribution + MoCRA tagline is investor-grade. This is the screenshot.

#### Screen: Audit Bundle modal
Pass 1 conformance: **pass**
Pass 1 defects:
- None of Round 1's four defects remain. Header copy matches spec, Last scan uses live `formatRelative`, EmailDialog recipient now falls through to the supplier primary contact when preparedFor doesn't parse.
- Minor polish not called out by Round 1: the ProvenanceChip next to the Valent-selected line uses `variant="ranked"` which renders as "Ranked by Valent." This reads slightly off — the audit bundle is "selected," not "ranked." Low-impact; the adjacent sentence carries the right verb, and the chip has no visible timestamp, so it effectively reads as a provenance tag rather than a verb claim. Not a blocker.

Pass 2 journey: covered in J2 above.

Pass 3 pitch signal: **investor-grade**. The cover page, facts grid, pillar strip, and Included-evidence checklist each do exactly one job without crowding.

#### Screen: Ingest Inbox
Pass 1 conformance: **pass**
Pass 1 defects:
- None. Four source cards, filter chips (`all` / `needs-review` / `failed` / `linked`), row list with ProvenanceChip on extracted rows.
- Unchanged from Round 1. The "Configure" toasts on each source card still all look the same; low-priority polish, not a defect.

Pass 2 journey (J4 cold-walk): unchanged from Round 1 — 2 clicks, zero unknowns, zero dead affordances.

Pass 3 pitch signal: **correct**. The pipes are visibly real.

#### Screen: Review Queue
Pass 1 conformance: **pass**
Pass 1 defects:
- None blocking. Name mismatch resolved — every Sarah is Sarah Chen. FlagRow draft-email opens ChaseDraftModal; resolve-with-note surfaces in ActivityPanel via the resolutions Map.
- Minor: `FilterBar` scope chip still disappears when `activeSupplierId` is null (no "All suppliers" placeholder). PRD is agnostic, Round 1 flagged as minor; the Status + Pillar + Severity + Assignee dropdowns all carry the "All …" default label on their own, so the overall row still reads coherent.
- Minor: Route popover still toasts only — `assignee` field isn't mutated in demo. Round 1 called this a dead-ish affordance; I agree, but it's within the demo contract.

Pass 2 journey (J3 — toast back to evidence):
  completed: yes
  clicks: 2 (Monitoring dropdown alert row → supplier detail scrolled to pillar → Resolve with note, or Request update). On budget.
  unknown terms: 0.
  dead affordances: 0 in hot path. Monitoring dropdown "+N more" now routes to Review Queue filtered by freshness (expiring + aging) or Ingest Inbox (new awaiting review). Round 1's inert complaint resolved.
  friction notes:
  - Resolve popover with note writes to `TrustContext.resolutions`; next render the supplier's ActivityPanel carries the resolution entry. Cross-screen audit trail is coherent.

Pass 3 pitch signal: **correct**. Grouped-by-supplier + Drafted-by-Valent banner + Resolve-with-note reads like operator-voice software, not dashboard.

#### Screen: Admin · Adoption (locked)
Pass 1 conformance: **pass**
Pass 1 defects:
- None. `LockedPageShell` blur + Coming-soon plate intact; `TEAM_ROSTER` in `adminMetrics.js` lists Sarah Chen + teammates (consistent with the rest of the app per fix #2).

Pass 3 pitch signal: **correct**. Reads as "this exists, you don't get it yet."

#### Cross-cutting findings

Agentic surfaces audit (re-checked against docs/70-agentic-surfaces.md):
- Surface #1 (extraction provenance): **pass**. Unchanged since Round 1.
- Surface #2 (auto-assembled audit bundle): **pass**. Copy drift fixed.
- Surface #3 (proactive flag generation + suggested remediation): **pass**. Unchanged.
- Surface #4 (supplier chase drafts): **pass**. Both Review Queue flag rows AND TodaysWorkCard rank-1/2/3/5 CTAs now route to ChaseDraftModal. Surface #4 is complete at both its entry points.
- Surface #5 (forward-looking monitoring alerts): **pass**. "+N more" on expiring + aging routes to Review Queue filtered by freshness; newAwaitingReview routes to Ingest.
- Surface #6 (trust score provenance): **pass**. Unchanged.
- Surface #7 (Today's Work): **pass**. All CTAs now land in their correct downstream surface. Ranking is visibly derived via the reasoning glimpse.

Overall agentic surface count: **7 pass / 0 partial / 0 fail.** (Round 1: 5 pass / 2 partial / 0 fail.)

Wedge mode: unchanged — sidebar Roadmap hidden, WedgeRoadmapStrip pinned, deep-links to pipeline/sandbox/margin still absorb into LockedPageShell. pass.

Drift log status (from STATE.md):
- "18 suppliers" vs 14: **resolved.** PRD copy reconciled to `{SUPPLIERS.length}`.
- BASF trust score 42 (narrative) vs 49 (derived): **unresolved narrative drift**, acknowledged in STATE.md L194/225. The UI is internally consistent — pillar math produces 49, ring displays 49. Only the J1 narrative in STATE says 42. Not a product defect; a docs-hygiene item. Recommend either tuning the BASF pillar set to land at 42 or rewriting the J1 narrative to 49 before the pitch.

Top defects ranked (most impactful first): **<3 per screen across every screen.**

1. BASF narrative vs derived score (docs drift only — no UI surface is wrong).
2. `EmailDialog.guessEmail` still blank when preparedFor is a team name (minor; primary-contact fallback now fills the slot).
3. Review Queue "Route" popover is decorative — assignee state doesn't actually mutate. Within demo contract; acceptable.

No defect rises to Pass-1-partial status on any screen. No defect blocks any journey.

Click-budget summary:
- J1 ≤ 4 to worst-supplier action: **pass** (1 click via Today's Work, 3 clicks via grid-row path).
- J2 ≤ 3 to bundle download: **pass** (3 clicks, exactly on budget).
- J3 ≤ 2 toast → evidence: **pass** (2 clicks).

Pitch (Jim / Alpine) 90-second signal:
- **Wedge** — legible inside 20 seconds. Trust Grid subtitle + Today's Work card + MoCRA tagline on the audit bundle cover stack three independent confirmations of "continuous MoCRA compliance for cosmetic CMOs."
- **Buyer** — Sarah Chen (operator) in the user chip + `SC` avatar. Elevation Labs workspace in Admin. L'Oréal as bundle recipient. BASF / IMCD / Univar as suppliers. Mid-market cosmetic CMO shape unambiguous.
- **Artifact** — the audit bundle modal. Cover page + pillar strip + Included evidence list. Unchanged but now with correct spec-conformant attribution sentence.
- **Expansion** — sidebar Roadmap section (full mode) or WedgeRoadmapStrip (wedge mode). Both read cleanly.

Exit-criterion check against §"What counts as investor-ready":
1. Every screen passes Pass 1 conformance: **pass** (all six screens).
2. Sarah completes J1, J2, J3 within click budgets: **pass** (1/3/3/2 observed).
3. Jim can articulate wedge / buyer / artifact / expansion in 90 seconds unprompted: **pass**.
4. No critical-path affordance is dead: **pass**. The three remaining minor items (guessEmail default, Route popover, disappearing scope chip) are all non-critical-path.

**Conclusion: investor-ready.** Round 1 closed all ten blockers cleanly, no regressions found, all four exit gates satisfied, and the per-screen defect budget (<3) is met on every screen. The demo can be walked in front of a pitch audience without further remediation. The BASF 42-vs-49 narrative drift is the one docs-hygiene item worth settling before the pitch; either path works and neither blocks the walkthrough.

## What counts as "investor-ready"

All four must be true:

1. Every screen passes Pass 1 conformance.
2. Sarah can complete J1, J2, J3 in her expected click budget (J1 ≤ 4 clicks to acting on the worst supplier; J2 ≤ 3 clicks to audit bundle download; J3 ≤ 2 clicks from toast to evidence).
3. Jim can articulate the wedge, buyer, artifact, and expansion in a 90-second walkthrough without being prompted.
4. No critical-path affordance is dead (every button, every row click, every toast CTA does what it says).

## Tools available for self-review

- Read the rendered components by reading the JSX source.
- Parse-check via `@babel/parser` to confirm no structural breakage.
- `extract-text` on any generated artifact.
- Subagent delegation — spawn a fresh `general-purpose` agent to run passes 2 or 3 with no prior context, since self-review by the same agent that built the thing is compromised.

## Scheduling rule for reviews

Phase 5 is always run by a fresh subagent with no coding history in this session. Phase 6 (iteration) is run by the main thread. This separation is load-bearing — self-reviews by the author are noise.

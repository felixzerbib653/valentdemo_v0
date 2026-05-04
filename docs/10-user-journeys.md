# User Journeys

Three personas. Sarah (Compliance Ops, primary) drives every UI decision. Gary (Procurement) and Rachel (Quality) are secondary and get tested in self-review but do not drive layout.

## Sarah · Compliance Ops operator

### Journey 1 — "Morning triage"

**Context.** Tuesday 9:12am. Sarah opens Valent Trust from the Outlook side-panel. She's got thirty supplier emails waiting and a buyer audit later in the week.

**Expected flow.**

1. Lands on Trust Grid. Sees a top-strip summary: "3 suppliers blocked · 4 in watch · 11 ready." The three blocked rows are sorted to the top by default.
2. Scans the blocked rows. For each, the pillar chips on the row tell her *why* (e.g., "FEI missing," "COA expired 2d").
3. Clicks the worst offender — supplier with two failing pillars and stale evidence. Lands on Supplier Detail.
4. Detail shows trust score ring at 49, status `Blocked`, pillar list with two red pillars at the top (FEI registration, documentation freshness).
5. Clicks the "FEI registration" pillar → evidence panel shows "no FEI on file." Clicks "Request from supplier" → emits a toast: "Draft email opened in Outlook." In the demo this is a no-op toast; in production it would open a templated compose window.
6. Clicks back to Trust Grid. Supplier row is still highlighted. She moves to the next blocked supplier.

**What success feels like.** Sarah spent two minutes to know exactly which three suppliers need her attention and has initiated the first chase. No screen required her to read a KPI tile or parse a chart.

**What would break the journey.** A landing page that leads with portfolio totals rather than supplier rows. Pillar chips that use §-anchor jargon without a plain-English label. A "chase" action that requires more than two clicks.

### Journey 2 — "Buyer audit prep"

**Context.** Thursday 2pm. A buyer (L'Oréal diligence team) has asked Sarah to send a compliance packet for three specific suppliers by Friday.

**Expected flow.**

1. Global search in the top bar: "Peter Greven." Selects the matching supplier. Lands on Supplier Detail.
2. Clicks "Generate audit bundle." Modal opens, shows cover page (supplier name, trust score, date, "prepared for L'Oréal — editable"), a one-page summary of pillar statuses, and a list of attached evidence (COAs, SDSs, FEI screenshots).
3. Unchecks two evidence items that aren't relevant to this buyer's request. Updates the "prepared for" field.
4. Clicks "Download." Toast: "Audit bundle queued · will email when ready." Modal stays open; she can start the next supplier.
5. Repeats for the other two suppliers.

**What success feels like.** Three audit bundles prepared in under five minutes, each tailored without rebuilding from scratch.

**What would break the journey.** Audit bundle generation that requires picking evidence one-by-one from scratch. A downstream download flow that takes her out of the tool. A modal that can't be re-opened with slightly different parameters without reloading everything.

### Journey 3 — "New flag mid-afternoon"

**Context.** 3:45pm. Sarah is not actively in the tool but has it pinned in a tab. A toast appears: "Supplier BASF · Allergen declaration expired · now blocked."

**Expected flow.**

1. Clicks the toast. Navigates to BASF supplier detail, scrolled to the Allergen pillar.
2. Sees the expired document, the date of expiration, and the most recent contact log with this supplier.
3. Clicks "Request update." Toast: "Compose window opened."

**What success feels like.** She handled the new flag without losing what she was doing before — the toast is an interrupt, not a context switch.

## Gary · Procurement Lead

### Journey 4 — "New supplier onboarding check"

**Context.** Gary is evaluating a new ingredient supplier. He wants to see if they can actually be onboarded or if there's a compliance blocker upstream.

**Expected flow.**

1. Gary opens Trust Grid, uses the supplier search to find the candidate. If the supplier isn't yet in the system (onboarding phase), he lands on an "add supplier" placeholder — out of scope for this demo, but the path should degrade gracefully.
2. If the supplier is in the system, he lands on Supplier Detail. Reads the trust score ring + status word ("Watch · 73") + the one-sentence summary.
3. Clicks "Share with procurement team" (phase 3 — not essential for demo). Toast confirms.

**What success feels like.** Gary got a readable posture in under thirty seconds. He didn't need to understand the pillar taxonomy; the score and the status word told him enough.

## Rachel · Quality Manager

### Journey 5 — "Change-control evidence trail"

**Context.** Rachel is reformulating a sunscreen for a new market. She needs to confirm that the ingredients in the reformulated product all have valid safety substantiation and origin documentation.

**Expected flow.**

1. Rachel uses search to find each ingredient's supplier one at a time.
2. On Supplier Detail, she clicks the Safety and Origin pillars to open the evidence panel.
3. Evidence rows show docs with validity dates. She clicks into each to preview.

**What success feels like.** Rachel can build an ingredient-level evidence trail without leaving the tool. She's not the primary user, but the drill-down path is usable.

**Where the demo is honest about limits.** Rachel's true daily driver is the ingredient (spec) view, not the supplier view. This demo does not include a standalone ingredient-centric surface — that's a phase-later extension. The self-review phase should call this out explicitly.

## Non-users who will nonetheless see the demo

### Jim · CEO (pitch audience, not user)

Jim watches a ninety-second walkthrough and needs to leave with:
- "What it does" (continuous supplier compliance).
- "Who it's for" (compliance ops at regulated CMOs, MoCRA-scoped today).
- "How they make money" (SaaS per supplier seat — not shown in demo, lives in the deck).
- "What's the moat" (the evidence extraction layer + continuous FEI/§607 registry maintenance).

The demo does not need to cater to Jim's cognitive load — Sarah's clean journey is sufficient, and a CEO watches over her shoulder.

### Alpine reviewer (pitch audience)

Same as Jim but wants to see the expansion surface. The collapsed roadmap section in the sidebar delivers this without contaminating the wedge story.

## Journey-to-screen coverage matrix

| Journey | Trust Grid | Supplier Detail | Audit Bundle | Ingest Inbox | Review Queue | Admin |
|---|---|---|---|---|---|---|
| J1 Morning triage | ✅ | ✅ | — | — | ◐ | — |
| J2 Buyer audit prep | — | ✅ | ✅ | — | — | — |
| J3 New flag | ✅ (via toast) | ✅ | — | — | ◐ | — |
| J4 Onboarding | ✅ | ✅ | — | — | — | — |
| J5 Change-control | — | ✅ | — | — | — | — |

◐ = supported but not primary path.

Coverage gap identified: Ingest Inbox is not touched by any primary journey. This is intentional — Ingest is the "how does evidence get here" answer for curious reviewers, not a daily-driver surface for Sarah. Flag for phase-5 self-review to decide whether to keep it as a standalone screen or collapse it into Admin.

## What each journey should produce in self-review

For each journey, phase 5 produces a friction log:

- How many clicks to completion.
- How many unknown terms encountered.
- How many times the user had to leave the screen to continue the task.
- Any "I don't understand what this means" moments.
- Any "what happens if I click this" hesitation points.

# Screen PRD — Ingest Inbox

## Purpose

Answers "where does the evidence come from?" Supports daily operators who want to see what's landed recently, and pitch reviewers who want to understand the upstream plumbing.

## User goal

Scan recent evidence arrivals, resolve any that failed to auto-link to a supplier, and (for first-run configuration) see which evidence sources are connected.

## Primary journey supported

No primary journey. Secondary support for J1 (Sarah occasionally checks "what just came in"). Also: pitch-reviewer curiosity about the ingestion pipeline.

## Layout

Two regions stacked.

### 1. Sources strip (top)

A horizontal row of four source cards, each ~220px wide. Each card:

- Icon (Mail, HardDrive/Box, ServerCog for SFTP, Upload for manual)
- Source label ("Email · compliance@acmecosmetics.com", "SharePoint · /Compliance/Suppliers", "SFTP · edi.acme.com", "Manual upload")
- Status dot + text ("Connected · last sync 3m ago" / "Connected · last sync 1d ago" / etc.)
- Count chip ("14 this week")
- Settings ghost link ("Configure")

All four are connected in the demo (hard-coded). Clicking "Configure" emits a toast: "Source configuration opened."

This strip is the "Vanta for your inbox" moment — it visibly locates where the compliance evidence originates.

### 2. Recent arrivals (the hero)

A vertical list of ingested documents, most recent first. ~50 rows visible in the demo, scrollable.

Each row ~56px tall:

- File-type icon
- Doc title (`text-sm`, `font-medium`) — "Certificate of Analysis · LEC-SOY-70 · lot 2024-0814"
- Source tag — small pill showing origin ("from email" / "from SharePoint" / etc.)
- Linked supplier (clickable chip) — "IMCD · Peter Greven · FEI:1234567"
- Ingested timestamp — "2m ago"
- Extraction confidence chip — High / Medium / Low
- Right-aligned: a status — "Linked to pillar · §606 FEI" (if auto-routed) or "Needs review" (if ambiguous) or "Failed to parse" (if extraction broke)

Rows with `Needs review` or `Failed to parse` status are visually weighted — a light amber or red left-edge bar, respectively.

Row click: opens `<DocumentPreview>` modal in-page. From the preview the user can assign the document to a supplier and pillar if the auto-link failed.

Above the list: a filter strip — "All · 42 | Needs review · 3 | Failed · 1 | Linked · 38" with the active filter highlighted. Sarah can use this to triage.

### 2a. DocumentPreview — agent summary block

When DocumentPreview opens from an Ingest Inbox row, the right-hand "Evidence captured" panel leads with a three-part agent summary before the extracted fields list. This replaces the older "here are the raw extracted fields" framing with "here is what the agent understood."

Block shape:

- Header row: `ProvenanceChip variant="summarized"` reading `Summarized by Valent · {timestamp}`. Cyan accent dot consistent with the other agentic-surface chips. No buzzword copy.
- Three labeled one-sentence lines, each prefixed by a small labelled icon (FileText / AlertCircle / ArrowRight):
  - **Contents.** What this document actually contains, in plain English. Example: `Certificate of analysis for lecithin lot 2024-0814, issued by IMCD on Mar 12, 2026.`
  - **Gap.** What's missing, outdated, or not reconciling against other evidence on file. Example: `Allergen declaration references soy but §609 substantiation on file is for sunflower-derived lecithin — mismatch with supplier spec.`
  - **Suggested next step.** One concrete action, verb-led. When the action maps to an existing surface (Draft email, Route to Review Queue, Link to supplier, Request updated §609), the line is a clickable button; otherwise it renders as muted prose. Example: `Request updated §609 from IMCD · Draft email`.
- Visual treatment: cyan-tinted surface (`bg-paper-50` with a 2px left border in brand cyan), `rounded-lg`, 12px internal padding. Echoes the Today's Work card chrome so the two agentic surfaces feel of-a-kind.

**Copy rule:** Inputs-led, past-tense for Contents, present-tense for Gap, imperative for Suggested next step. No "We believe…", "It appears that…", or other hedges. If the agent isn't confident enough to state a gap, the Gap line reads `No gap detected against pillars on file.` — not an empty string.

**Data shape:** Each document gets a `summary: { contents: string, gap: string, suggestion: string, suggestionAction?: { label, action, targetId } }` field. Hard-coded per doc in `src/data/documents.js`. Demos seed ~6 summaries for the most-scrutinized rows (BASF, IMCD, Peter Greven, Alpine Botanicals). Documents without a `summary` render the Evidence-captured panel without the summary block — backward compatible.

### 2b. DocumentPreview — review-and-approve controls (Needs review only)

When a document's `linkStatus === 'needs-review'`, DocumentPreview additionally renders a highly-actionable review-and-approve strip pinned to the bottom of the right-hand panel, directly below the agent summary block. The intent is that Sarah never has to scan for the next action — it's the visually dominant control set on the screen.

Strip anatomy:

- Leading label: `Review required · {reason}` in ink-600 (reason is "extraction confidence 74%" or "ambiguous supplier match" or similar — derived from the document's flags[] array).
- Correction region: the fields that triggered review appear as inline-editable mono inputs (Supplier, Pillar, FEI, Validity-window, as applicable). Prefilled with the agent's best guess; user can correct before approving. Each corrected field is recorded in the audit log.
- Action row (left-to-right):
  - **Approve & link** — primary button, emerald-600 fill, dark text on light fill per design system. Submits with current field values. Emits an `ok` toast ("Linked to {supplier} · {pillar}") and updates `linkStatus → 'linked'`.
  - **Reject** — ghost button, red-600 text. Marks `linkStatus → 'rejected'`, removes row from Needs review count. Requires a one-line reason (small popover textarea, min 6 chars).
  - **Request re-extraction** — ghost button, ink-600 text. Flags the doc for a second pass; `linkStatus` stays `needs-review` but row gets a "requeued" chip. Deferred in demo.
- Keyboard: `Cmd/Ctrl-Enter` triggers Approve; `Esc` closes the modal without action.

Every action emits a `documentReview` event into the audit trail. Events are readable from Supplier Detail ActivityPanel under the existing "Recent activity" section, alongside the phase-3.5 `flag-resolved` synthetic events. Event payload: `{ documentId, supplierId, action: 'approve' | 'reject' | 'requeue', actor, at, correctedFields?, reason? }`.

**Copy rule:** The primary button is always a decisive verb-object: "Approve & link" — never "Submit," "OK," or "Confirm." The destructive button is always "Reject" — never "Discard." The headline above the strip is always "Review required" — never "Action needed" or "Please review."

**Pitch value:** This strip is what turns the demo's "needs review" chip into a visible HITL surface. Without it, the agent's review-on-exception mode is a claim; with it, the reviewer watches Sarah approve a low-confidence extraction in two clicks and sees the audit trail land in ActivityPanel.

## Data contract

Reads `documents.js`. The document shape:

```js
{
  id: string,
  title: string,
  supplierId: string | null,       // null if auto-link failed
  pillarKey: PillarKey | null,
  source: 'email' | 'sharepoint' | 'sftp' | 'manual',
  sourceDetail: string,            // "compliance@acmecosmetics.com"
  ingestedAt: ISO string,
  extractionConfidence: 'high' | 'medium' | 'low',
  linkStatus: 'linked' | 'needs-review' | 'failed',
  flags: string[],                 // extraction warnings
  persona: PersonaKey,             // scan-light, photocopy, handwritten, etc.
}
```

Note: the `persona` field is ported from v3's ingestion data and controls how the document renders in the preview modal (clean scan vs. photocopied vs. handwritten). This is reused, not rebuilt.

## Copy register

- Plain English. "Needs review" beats "unresolved extraction." "Failed to parse" is acceptable jargon for this screen since the user chooses to be here.
- Source tags are friendly: "from email" not "mail ingest".
- Timestamps relative for recent, absolute for older-than-a-week.

## Interactions with other screens

- Row → `<DocumentPreview>` modal (local, reused on Supplier Detail).
- Linked supplier chip → navigate to that supplier's detail page.
- "Needs review" row → DocumentPreview opens with the review-and-approve strip (§2b) active. Approve & link commits the supplier/pillar mapping, emits a toast, and routes an audit event into Supplier Detail ActivityPanel.
- "Configure" on source card → toast no-op.

## Empty / edge states

- Zero recent arrivals: empty state — "No documents ingested in the last 7 days. Sources appear connected." with a "Upload manually" ghost CTA.
- All sources disconnected (not possible in demo, but designed): source cards render in a muted state with a red dot and a "Fix connection" CTA.

## What this screen does not do

- Does not let the user *edit* extracted data. Extraction corrections route through `<DocumentPreview>` modal.
- Does not display a live extraction pipeline animation (that was a v3 feature that read as demo-ware). Trust keeps it calm.
- Does not show historical ingestion analytics. That's Admin territory.

## Investor-readiness gates (for phase 5)

- A reviewer who clicks into Ingest Inbox for the first time understands in under 10 seconds that this is the upstream plumbing, not the main product surface.
- The source cards visibly explain "connected to your email / drive / SFTP."
- The `Needs review` + `Failed` filters get a reviewer to a non-trivial workflow in one click.

## Known design questions to revisit

- Is this screen worth keeping as a standalone, or should it collapse into an "Evidence tab" on Supplier Detail plus a portfolio-wide "Needs review" count on the Trust Grid? Decision deferred to phase 5. Current plan: keep as standalone, validate in self-review.
- Should the source strip be collapsible (hidden by default) since it's mostly set-and-forget? Probably yes — collapse once phase 2 is shipped.

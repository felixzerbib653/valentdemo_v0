# Screen PRD — Audit Bundle

## Purpose

The shareable artifact. The product's hero output. Every other screen exists to make this one usable.

## User goal

In under ninety seconds, prepare a compliance packet for a specific supplier, tailored to a specific recipient (buyer or auditor), ready to download or email.

## Primary journey supported

J2 Buyer audit prep (primary). Secondary trigger from J1 Morning triage as a way to end-cap a remediation.

## Surface type

Modal (not a page). Full-viewport overlay with a paper-0 content surface at ~920px wide, ~640px tall min. Backdrop is ink-900 at 45% opacity. Escape key closes; backdrop click closes.

## Layout (within the modal)

Three bands top-to-bottom.

### 1. Modal header (64px)

- Left: modal title "Audit bundle · [Supplier Name]" + small subtitle "Generated 2026-04-20 · Trust score 49 · Status Blocked"
- Right: close button (X)

### 2. Body (scrollable)

Two sub-regions stacked.

#### 2a. Cover page preview

Visual representation of page 1 of the bundle. ~280px tall. Styled to look like a printed page — white surface with subtle shadow, ink-900 text, a simple Valent Trust wordmark top-right.

Content on the cover:

- Supplier name (large, `text-3xl`, `font-semibold`)
- Prepared for: **editable inline text field** (default: "[recipient name]"). Sarah types in "L'Oréal diligence team" or similar.
- Date, trust score, status, facilities count, active ingredients count
- A horizontal "pillar strip" showing all 7 pillars with status dots
- Tagline at footer: "Continuous compliance monitoring · valent.trust"

This is a stylized preview, not a real PDF. Hard-coded layout.

#### 2b. Included evidence list

Title: "Included evidence · N documents."

Below the title: a checkable list of documents. Each row:

- Checkbox (checked by default for all documents tied to passing/pending pillars; unchecked for documents tied to `missing` pillars since there's nothing to include)
- File icon
- Doc title + pillar it maps to + ingested date
- Confidence chip
- Small "preview" ghost button (opens `<DocumentPreview>`)

User can uncheck any item to exclude it from the bundle. The cover-page preview updates the "N documents" count as checkboxes change.

Below the list: a muted "Add note to recipient" expandable — a text area where Sarah can write a custom message that appears on page 2 of the bundle.

### 3. Footer (72px)

Fixed at the bottom of the modal.

- Left: summary — "6 documents · 4 passing pillars · estimated 12-page PDF."
- Right: action cluster — **Download PDF** (primary emerald) + **Email to recipient** (secondary) + **Cancel** (ghost).

## Data contract

Reads from the supplier record passed in via `auditBundle.supplierId` in context, plus the full documents list filtered to this supplier. Pillar scope is derived from `auditBundle.pillarKeys` (defaults to all 7).

## Copy register

- The modal speaks in the language of the recipient: "Prepared for", "Included evidence", "Download PDF" — these are words a buyer or auditor expects to see on the receiving end.
- No internal jargon. No references to the user's triage queue or trust score delta.
- The tagline on the cover page is stable ("Continuous compliance monitoring · valent.trust") so it's recognizable across bundles.

## Actions and their effects

- **Download PDF.** Emits an `ok` toast "Audit bundle queued · will email when ready." Modal stays open. Button briefly shows a check icon for ~1.5s.
- **Email to recipient.** Opens a secondary mini-modal — to-field (prefilled if recipient was typed), subject (prefilled with "Compliance packet — [Supplier Name]"), body (short canned message with a "your bundle is attached" placeholder). Confirm button emits a toast and closes both modals.
- **Cancel / close (X) / backdrop.** Closes modal, resets state. Does not persist edits to the "prepared for" field or the unchecked documents — demo resets on re-open.

## Interactions with other screens

- Opened by:
  - Trust Grid row "Audit bundle" ghost CTA
  - Supplier Detail "Generate audit bundle" primary CTA
  - Review Queue bulk action (phase 3) — "Generate bundle for N suppliers" — out of scope for v1; single-supplier only in demo
- Closed by: close button, backdrop, Escape key.
- Does not navigate. Modal is a side-effect; underlying page remains in place.

## Empty / edge states

- Supplier with zero evidence: modal shows an empty "Nothing to bundle yet" state with a "Set up ingestion" ghost CTA that navigates to Ingest Inbox. Download/Email actions are disabled.
- Supplier with only `missing` pillars: modal shows a warning band at the top — "This supplier has multiple evidence gaps. The bundle will reflect current status." — but still renders. User can choose to send an "incomplete" bundle; this is the honest artifact for a blocked supplier.

## Visual design notes

- The cover page preview should feel like printed paper, not a screen UI. Slightly off-white paper surface (`#FEFEFB` if needed, or `paper-0`), subtle drop shadow, minimal decoration.
- The evidence list below should feel like screen UI, clearly differentiated from the preview.
- The emerald Download CTA is the one place in the product where emerald reads as "go" (action) rather than "healthy" (status). This is intentional — the download moment is the product's highest-value action.

## What this screen does not do

- Does not generate a real PDF. The "Download" action is a demo handoff.
- Does not send a real email.
- Does not let the user re-order evidence in the bundle (v1 limitation — evidence is grouped by pillar in a fixed order).
- Does not include a multi-supplier bundle flow (v1 single-supplier only).

## Investor-readiness gates (for phase 5)

- A reviewer watching the flow says "oh — this is what they send to a buyer" within 10 seconds of the modal opening.
- The cover page reads as a professional artifact, not a demo mock.
- The "prepared for" editable field is discoverable without a label explaining it.
- Unchecking a document visibly updates the cover page summary count.
- The emerald Download CTA is unmistakably the intended action.

## Known design questions to revisit

- Should the cover page actually render as an iframe of an HTML printable template? For v1, no — a styled React component is enough and much faster to iterate on.
- Should there be a "share via link" option alongside Download and Email? Tempting but risks scope creep. Deferred to phase 5 review.
- Should the bundle include a QR code that links to a live verification URL? Concept-cool, demo-unnecessary. Deferred.

# Cross-Interface State Contract

This doc defines how state flows between screens so each screen can be built independently without losing coherence.

## Source of truth

All persistent data is static JSON in `src/data/`. Runtime state is React Context. No localStorage, no URL state beyond `?mode=wedge`, no routing library.

## Context providers

One provider at the app root: `<TrustContext>`.

### Shape

```js
{
  // active navigation
  page: 'trust-grid' | 'supplier-detail' | 'ingest' | 'review' | 'admin'
      | 'pipeline' | 'sandbox' | 'margin',
  activeSupplierId: string | null,
  activePillarKey: PillarKey | null,  // set when user drills from a pillar chip

  // cross-screen state
  toasts: Toast[],
  auditBundle: { supplierId: string, pillarKeys: PillarKey[] } | null,  // open modal

  // pitch mode
  mode: 'full' | 'wedge',

  // action dispatchers
  navigate(page, opts?),         // page + optional { supplierId, pillarKey }
  openSupplier(supplierId),      // sugar for navigate('supplier-detail', { supplierId })
  openAuditBundle(supplierId, pillarKeys?),
  closeAuditBundle(),
  emitToast({ tone, title, body, action? }),
  dismissToast(id),
}
```

### Rationale

One context, not many. v3 had `BidDispatchContext` which evolved into a grab-bag for toasts, routing, and pipeline state; the coupling was fine but the name no longer described the scope. Trust starts with a single named provider that owns all cross-screen concerns.

Route state is in context, not URL, because this is a demo — browser back/forward is not a user journey we're designing for. The only URL state is `?mode=wedge`, read once at mount.

## Toast tone → source mapping

| Source event | Toast tone |
|---|---|
| Audit bundle generated | `ok` |
| Pillar flipped to `fail` | `block` |
| Evidence expiring soon | `warn` |
| New document ingested from inbox | `info` |
| Supplier moved from `blocked` to `watch` | `ok` |
| Supplier moved from `ready` to `watch` or `blocked` | `warn` / `block` |
| Needs-review document approved via DocumentPreview | `ok` |
| Needs-review document rejected | `warn` |
| Needs-review document requeued for re-extraction | `info` |

Toasts always carry a `supplierId` when applicable so the action CTA can route to that supplier's detail page.

## Cross-screen deep-link targets

Every screen accepts navigation from every other screen. The handshakes worth naming explicitly:

- **Trust Grid row → Supplier Detail.** Primary click path. Sets `activeSupplierId`, navigates to `supplier-detail`.
- **Trust Grid row → Audit Bundle.** Secondary CTA. Opens `auditBundle` modal without navigating away from the grid.
- **Supplier Detail pillar chip → Review Queue (filtered).** Clicking a failing pillar navigates to the review queue pre-filtered to that pillar and supplier.
- **Supplier Detail evidence row → Document Preview.** In-page modal, not a nav.
- **Supplier Detail "Generate audit bundle" → Audit Bundle modal.**
- **Review Queue row → Supplier Detail.** Row click navigates to detail with `activePillarKey` set so the drill-down scrolls to the relevant pillar.
- **Ingest Inbox "View supplier" → Supplier Detail.**
- **Toast action CTA → any.** Toasts serialize the full `navigate()` payload.
- **Global search → any supplier.** Typed input, selects supplier, navigates to detail.

## Navigation side-effects

Calling `navigate(page)` without a supplier clears `activeSupplierId`. Calling `navigate('supplier-detail', { supplierId })` sets both. `navigate('review', { supplierId, pillarKey })` sets both supplier and pillar for the queue filter.

When `mode === 'wedge'`, attempts to navigate to `pipeline`, `sandbox`, or `margin` are allowed (they render a `<LockedPageShell>`) but the sidebar does not list them, so these navigations come only from stale toast CTAs or programmatic paths. The LockedPageShell acts as a graceful absorber.

## Last-scan clock

The top bar reads a single shared `lastScanAt` timestamp from context, updated on mount to "now minus 4 minutes." A `setInterval` every 60 seconds advances the displayed minute ("last scan · 5m ago" → "6m ago"). No real scanning happens. This is presentation, not logic.

## Selection memory

When a user navigates from Trust Grid → Supplier Detail → back to Trust Grid, the grid should remember the last selected supplier (row highlighted, in-view). Implementation: context holds `lastViewedSupplierId`, grid checks it on mount.

## Toast queue semantics

- New toast pushes onto the stack, renders at top.
- Auto-dismiss at 8000ms unless user hovers — hover pauses the timer.
- Max 3 visible; older ones fade out.
- Action CTA dismisses the toast on click regardless of timer.
- Emitting a toast with the same `(supplierId, tone, title)` triple within 2 seconds deduplicates rather than stacks.

## Audit bundle modal lifecycle

- `openAuditBundle(supplierId, pillarKeys?)` — `pillarKeys` defaults to all pillars. Used by Trust Grid CTA, Supplier Detail CTA, and Review Queue bulk action (phase 3).
- Modal mounts, generates a stylized preview from hard-coded data, shows a "download" ghost CTA.
- "Download" → emits an `ok` toast: "Audit bundle queued · will email when ready". Modal stays open; user can close manually.
- `closeAuditBundle()` clears state. Escape key and backdrop click both invoke this.

## Document review events

DocumentPreview's review-and-approve strip (Ingest Inbox §2b) emits a `documentReview` event on Approve / Reject / Requeue. Event shape:

```js
{
  type: 'document-review',
  documentId: string,
  supplierId: string,
  action: 'approve' | 'reject' | 'requeue',
  actor: string,              // 'Sarah Chen' in the demo
  at: ISO string,
  correctedFields?: {         // present only on approve when operator edited fields
    supplierId?: string,
    pillarKey?: PillarKey,
    fei?: string,
    validity?: string,
  },
  reason?: string,            // required on reject, 6-char min
}
```

Events merge into the ActivityPanel's Recent activity stream alongside `flag-resolved` synthetic events. No dedicated audit-log screen; the trail lives on the entity views per the Vanta-analogue pattern.

Approve transitions the document `linkStatus: 'needs-review' → 'linked'` and sets `supplierId` + `pillarKey` from the corrected fields (or from the agent's pre-filled values if the operator didn't correct anything). Reject transitions to `linkStatus: 'rejected'` and removes the doc from Needs-review counts. Requeue keeps `linkStatus: 'needs-review'` but adds a transient `requeuedAt` timestamp to the document.

Session-scoped like `resolutions` — reloading the demo clears pending reviews back to seed state.

## Review Queue filter state

The queue screen accepts optional filters from context:
- `activeSupplierId` → scopes queue to one supplier.
- `activePillarKey` → scopes queue to one pillar.
- If both are unset, queue shows all open flags portfolio-wide.
- Queue screen can clear filters locally without touching context (local `UIFilters` state).

## Phase-2 vs phase-3 contract

Phase 2 builds Trust Grid, Supplier Detail, Audit Bundle, and the continuous-monitoring chrome. Phase 3 adds Ingest Inbox, Review Queue, and global search. The context defined above must be complete before phase 2 ships so phase 3 screens can subscribe without refactor.

## Parity with v3 (for portable pattern reuse)

`BidDispatchContext` in v3 uses a reducer pattern with typed action names. Trust will use discrete setter functions exposed on the context value instead — less ceremony, easier for a solo reviewer to read, and sufficient for the state graph sketched above. If the state graph grows beyond ~15 action surfaces, revisit.

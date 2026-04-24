# Screen PRD — Roadmap section (locked)

## Purpose

Preserves the expansion narrative — "this is where we're going next" — without contaminating the wedge story that the primary product surfaces are telling.

## Behavior

Lives in the sidebar under a collapsible "Roadmap · 3" header (chevron + count). Default state: collapsed.

Three items, all locked:

1. **Pipeline Aggregator.** Supplier onboarding funnel — upcoming sign-ups, diligence progress, compliance gate status.
2. **Bid Sandbox.** The margin-recovery surface (deferred from v3). Shows how compliance-clean BOMs unlock bidding optimization.
3. **Margin Engine.** The executive dashboard for margin recovery across the portfolio.

## Behavior when clicked

Each item navigates to a LockedPageShell with a blurred screenshot-style placeholder and a "Coming soon · Roadmap" plate.

Under `mode=wedge`, this entire section is hidden from the sidebar (the user will never see these surfaces).

## Visual treatment

Chevron + uppercase label + right-aligned muted count chip ("roadmap · 3"). Items render with:
- A Lock icon inline
- Muted ink-500 text
- Tooltip: "On the roadmap — gated in production"

## Why this screen exists

A reviewer — especially a PE-grade one — will ask "what's next after compliance?" The roadmap section answers without forcing the wedge demo to carry expansion weight.

## Build priority

Phase 4. The collapsible mechanism + the three locked placeholders are implemented together.

## Copy

Sidebar section label: `Roadmap`
Tagline in each locked view: `Coming next — part of the Valent Trust roadmap. Available for design partners under contract.`

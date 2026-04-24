# Screen PRD — Admin · Adoption

## Purpose

Gated surface for administrators. Shows team-level adoption and processing metrics. Not a pitch-essential screen; included because the product will have this surface in production and leaving it out entirely would be dishonest.

## Behavior in demo

Rendered inside a `<LockedPageShell>` — blurred content with a "Coming soon · Admin view" overlay. Reviewers can click into it from the sidebar but cannot interact. This mirrors v3's handling of gated views.

## What the blurred content shows

A light version of the admin dashboard so the blur reveals enough structure to communicate "this exists":

- Four KPI tiles along the top: Documents processed this week, Hours saved, Active operators, Average triage time.
- A weekly adoption chart (bar chart of documents processed per day for last 8 weeks).
- A team roster table — operators, role, last active timestamp, weekly triage count.
- A settings section placeholder — data sources, notification preferences, role assignments.

## Data contract

Reads an `adminMetrics.js` file (to be created in phase 4). Values are hard-coded. No live computation.

## Why this screen exists at all

- Pitch reviewers will ask "how do you prove adoption?" — the admin view is the answer.
- Design partners who sign will need this surface day-one.
- Keeps the sidebar IA honest — there's an Admin section visible even in full mode.

## What this screen does not do

- Does not surface end-user metrics (that's a separate internal dashboard, not a product screen).
- Does not allow configuration in demo.

## Build priority

Phase 4. Lowest priority among the seven screens.

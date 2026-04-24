// Today's Work — ranked action list for the Supplier Trust Grid hero card.
// Per docs/70-agentic-surfaces.md §Surface #7.
//
// Shape of each action:
//   {
//     id,
//     rank,                         // 1..N, ordered priority for Sarah's morning
//     supplierId,                   // canonical supplier reference
//     flagId,                       // optional — deep-link into Review Queue
//     severity,                     // 'blocker' | 'watch' | 'informational'
//     title,                        // action-verb-led, one line
//     reason,                       // one sentence — why Valent ranked this here
//     dueHint,                      // optional — "Thursday", "3d overdue"
//     cta: { label, action },       // action drives the primary button
//     rankedBy: 'valent',
//     rankedAt: ISO string,
//   }
//
// These are hand-written for the demo — not derived from flags — because the
// operator-voice "reason" is the whole point. Each title and reason pair
// reads like something Sarah would write in her own notebook at 9am.
// The supplierId and flagId values resolve to rows in suppliers.js / flags.js
// so the card can route straight into the relevant screen.

const RANKED_AT = '2026-04-20T13:12:00.000Z';

export const TODAYS_WORK = [
  {
    id: 'todo-imcd-allergen',
    rank: 1,
    supplierId: 'sup-imcd-greven',
    flagId: 'flag-sup-imcd-greven-allergen',
    severity: 'watch',
    title: "Close the L'Oréal diligence packet for IMCD · Peter Greven",
    reason:
      'Packet is due Thursday. Allergen refresh is the last pillar outstanding — Thomas Brandt promised end of week but has not sent yet.',
    dueHint: 'Thursday',
    cta: { label: 'Draft follow-up', action: 'draft-email' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
  {
    id: 'todo-basf-fei',
    rank: 2,
    supplierId: 'sup-basf',
    flagId: 'flag-sup-basf-fei',
    severity: 'blocker',
    title: 'Chase BASF Düsseldorf FEI registration',
    reason:
      'FEI lapsed 29 days ago. Paperwork was sent 2026-03-22; no response from Mara Kessler. Cannot ship any BASF ingredient under MoCRA without this.',
    dueHint: '29d overdue',
    cta: { label: 'Draft chase email', action: 'draft-email' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
  {
    id: 'todo-stepan-purity',
    rank: 3,
    supplierId: 'sup-stepan',
    flagId: 'flag-sup-stepan-purity',
    severity: 'blocker',
    title: 'Escalate Stepan CAPB lot 24-118 out-of-spec CoA',
    reason:
      'Certificate of Analysis came in below spec floor. Priya Venkatesh last contacted 2026-04-12 — no replacement lot identified. Production blocked until resolved.',
    dueHint: '8d open',
    cta: { label: 'Escalate to Quality', action: 'draft-email' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
  {
    id: 'todo-basf-allergen',
    rank: 4,
    supplierId: 'sup-basf',
    flagId: 'flag-sup-basf-allergen',
    severity: 'blocker',
    title: 'Request refreshed BASF allergen statement',
    reason:
      'On-file statement dates to 2024 and does not cover the current nut-oil blend. Labelling risk on every BASF-sourced SKU until this lands.',
    cta: { label: 'Request current version', action: 'request-renewal' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
  {
    id: 'todo-univar-safety',
    rank: 5,
    supplierId: 'sup-univar',
    flagId: 'flag-sup-univar-safety',
    severity: 'blocker',
    title: 'Follow up with Univar on reformulated polyol safety studies',
    reason:
      'Univar reformulated the polyol line in Q1 2026. Safety substantiation for the new formula has not been re-submitted. Devon Hart acknowledged on 2026-04-17 but has not delivered.',
    dueHint: '3d since last contact',
    cta: { label: 'Draft follow-up', action: 'draft-email' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
  {
    id: 'todo-elementis-baseline',
    rank: 6,
    supplierId: 'sup-elementis',
    flagId: null,
    severity: 'informational',
    title: 'Check in on Elementis onboarding baseline',
    reason:
      'SDS received last Friday, remaining six pillars still pending. Two-week onboarding window closes 2026-04-29. Jordan Vale on point.',
    dueHint: '9d to baseline',
    cta: { label: 'Open supplier', action: 'open-supplier' },
    rankedBy: 'valent',
    rankedAt: RANKED_AT,
  },
];

export function getTodaysWork() {
  // Stable sort by rank — fail safe even if the hand-written list gets
  // re-ordered later.
  return [...TODAYS_WORK].sort((a, b) => a.rank - b.rank);
}

export function getTodaysWorkCount() {
  return TODAYS_WORK.length;
}

export function getTodaysWorkBySeverity() {
  const counts = { blocker: 0, watch: 0, informational: 0 };
  for (const item of TODAYS_WORK) {
    counts[item.severity] = (counts[item.severity] || 0) + 1;
  }
  return counts;
}

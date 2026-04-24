// Continuous-monitoring events, feeding the right-side activity panel on
// Supplier Detail and (phase 3) the portfolio activity strip. Events are the
// timeline of what the scan engine observed or what operators did.
//
// Types:
//   evidence-ingested  — a new document landed and was auto-linked
//   pillar-flipped     — a pillar status changed (pass → fail, pending → pass, etc.)
//   bundle-generated   — an audit bundle was generated for a recipient
//   evidence-expiring  — a document is approaching expiry within its validity window
//   supplier-contacted — operator-initiated outreach (request update, compose)
//   pillar-resolved    — a blocker flag was resolved by operator action
//   scan-summary       — aggregated scan event for the portfolio

export const EVENTS = [
  // ─── Recent (today / yesterday) ──────────────────────────────────────────
  {
    id: 'evt-001',
    supplierId: 'sup-basf',
    type: 'pillar-flipped',
    at: '2026-04-20T11:42:00.000Z',
    tone: 'block',
    title: 'Allergen declaration expired',
    body: 'Nut-oil blend statement dated 2024-10-20 exceeded its validity window. Pillar moved to fail.',
  },
  {
    id: 'evt-002',
    supplierId: 'sup-elementis',
    type: 'evidence-ingested',
    at: '2026-04-19T16:48:00.000Z',
    tone: 'info',
    title: 'Intro SDS received',
    body: 'Onboarding packet received from j.vale@elementis.example. First evidence record for this supplier.',
  },
  {
    id: 'evt-003',
    supplierId: 'sup-univar',
    type: 'pillar-flipped',
    at: '2026-04-19T22:15:00.000Z',
    tone: 'block',
    title: 'Safety dossier marked incomplete',
    body: 'Polyol line safety draft is missing study citations. Pillar moved to fail.',
  },
  {
    id: 'evt-004',
    supplierId: 'sup-evonik',
    type: 'evidence-ingested',
    at: '2026-04-19T09:00:00.000Z',
    tone: 'ok',
    title: 'COA ingested · Dicaprylyl Carbonate',
    body: 'Lot 26-0408 COA received via SFTP. High extraction confidence. Linked to Purity.',
  },
  {
    id: 'evt-005',
    supplierId: 'sup-imcd-greven',
    type: 'evidence-ingested',
    at: '2026-04-15T17:35:00.000Z',
    tone: 'info',
    title: 'Allergen refresh (partial)',
    body: '3 of 7 product lines updated in latest submission. Awaiting remainder.',
  },
  {
    id: 'evt-006',
    supplierId: 'sup-stepan',
    type: 'pillar-flipped',
    at: '2026-04-18T14:00:00.000Z',
    tone: 'block',
    title: 'Purity failed · CAPB lot 24-118',
    body: 'Most recent COA shows spec floor failure. Lot is under shipping hold.',
  },
  {
    id: 'evt-007',
    supplierId: 'sup-dsm',
    type: 'evidence-expiring',
    at: '2026-04-17T11:00:00.000Z',
    tone: 'warn',
    title: 'Allergen declaration expiring in 14 days',
    body: 'Current declaration valid through 2026-05-04. Request refresh.',
  },
  {
    id: 'evt-008',
    supplierId: 'sup-givaudan',
    type: 'supplier-contacted',
    at: '2026-04-17T08:30:00.000Z',
    tone: 'info',
    title: 'Safety dossier request sent',
    body: 'Template-compose opened for Celine Roux. Follow-up due in 5 business days.',
  },

  // ─── Earlier this week ───────────────────────────────────────────────────
  {
    id: 'evt-009',
    supplierId: 'sup-croda',
    type: 'bundle-generated',
    at: '2026-04-16T13:20:00.000Z',
    tone: 'ok',
    title: 'Audit bundle generated · Sephora diligence',
    body: '3 pillars, 2 documents, 7-page packet. Queued for email delivery.',
  },
  {
    id: 'evt-010',
    supplierId: 'sup-symrise',
    type: 'pillar-flipped',
    at: '2026-04-16T09:12:00.000Z',
    tone: 'warn',
    title: 'Origin moved to pending',
    body: 'Madagascar vanilla chain awaiting upstream consolidation.',
  },
  {
    id: 'evt-011',
    supplierId: 'sup-imcd-greven',
    type: 'evidence-ingested',
    at: '2026-04-15T14:00:00.000Z',
    tone: 'info',
    title: 'Allergen refresh started',
    body: 'Thomas Brandt acknowledged request, working through product lines.',
  },
  {
    id: 'evt-012',
    supplierId: 'sup-ashland',
    type: 'scan-summary',
    at: '2026-04-14T10:15:00.000Z',
    tone: 'ok',
    title: 'Scan clean · all 7 pillars pass',
    body: 'No changes detected since last scan. Supplier remains ready.',
  },
  {
    id: 'evt-013',
    supplierId: 'sup-clariant',
    type: 'evidence-ingested',
    at: '2026-04-13T16:50:00.000Z',
    tone: 'info',
    title: 'Purity COA · Cetearyl Alcohol',
    body: 'Lot 26-0226 COA processed. Spec within tolerance.',
  },
  {
    id: 'evt-014',
    supplierId: 'sup-lubrizol',
    type: 'scan-summary',
    at: '2026-04-12T11:45:00.000Z',
    tone: 'ok',
    title: 'No change',
    body: 'All pillars stable.',
  },

  // ─── Last week ───────────────────────────────────────────────────────────
  {
    id: 'evt-015',
    supplierId: 'sup-basf',
    type: 'supplier-contacted',
    at: '2026-04-11T15:20:00.000Z',
    tone: 'info',
    title: 'FEI re-submission requested',
    body: 'Template-compose opened for Mara Kessler. Düsseldorf FEI lapsed; certificate requested.',
  },
  {
    id: 'evt-016',
    supplierId: 'sup-kao',
    type: 'scan-summary',
    at: '2026-04-11T08:00:00.000Z',
    tone: 'warn',
    title: 'Purity aging',
    body: 'Most recent COA is 20 weeks old. New COA queued with Rin Nakamura.',
  },
  {
    id: 'evt-017',
    supplierId: 'sup-imcd-greven',
    type: 'bundle-generated',
    at: '2026-04-09T10:05:00.000Z',
    tone: 'ok',
    title: 'Audit bundle generated · Target diligence',
    body: '5 pillars, 4 documents, 12-page packet.',
  },
  {
    id: 'evt-018',
    supplierId: 'sup-stepan',
    type: 'supplier-contacted',
    at: '2026-04-12T09:30:00.000Z',
    tone: 'info',
    title: 'Listing confirmation requested',
    body: 'Template-compose opened for Priya Venkatesh. §607 receipt not on file.',
  },
  {
    id: 'evt-019',
    supplierId: 'sup-dsm',
    type: 'evidence-ingested',
    at: '2026-04-08T03:30:00.000Z',
    tone: 'info',
    title: 'Retinoids safety dossier refreshed',
    body: 'Quarterly refresh received via SFTP. Linked to Safety pillar.',
  },
  {
    id: 'evt-020',
    supplierId: 'sup-basf',
    type: 'pillar-flipped',
    at: '2026-04-07T19:12:00.000Z',
    tone: 'block',
    title: 'FEI registration lapsed',
    body: 'Düsseldorf facility FEI expired. Pillar moved to missing pending re-registration.',
  },
];

export function getEventsForSupplier(supplierId) {
  return EVENTS.filter((e) => e.supplierId === supplierId).sort((a, b) =>
    b.at.localeCompare(a.at)
  );
}

export function getRecentEvents(limit = 10) {
  return [...EVENTS].sort((a, b) => b.at.localeCompare(a.at)).slice(0, limit);
}

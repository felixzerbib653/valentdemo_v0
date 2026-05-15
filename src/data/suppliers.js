import { computeTrustScore, deriveStatus } from './trustPillars.js';

// 14 supplier roster for the Trust Grid.
// Distribution targeted for a readable demo: 3 blocked / 4 watch / 6 ready / 1 onboarding.
// Pillar statuses are the source of truth — trustScore is derived below.
// Demo "now": 2026-04-20T13:12:00Z (Monday 9:12am ET — matches J1 morning triage).

const DEMO_NOW = '2026-04-20T13:12:00.000Z';

const roster = [
  // ─── Blocked ────────────────────────────────────────────────────────────
  {
    id: 'sup-basf',
    name: 'BASF Personal Care',
    facilitiesCount: 2,
    activeIngredientsCount: 6,
    statusOverride: null,
    subtitle: '2 facilities · 6 active ingredients',
    addedAt: '2023-06-14T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-20T11:42:00.000Z',
    evidenceCount: 6,
    deltaWeek: -4,
    primaryContact: {
      name: 'Mara Kessler',
      email: 'm.kessler@basf-personal-care.example',
      lastContactedAt: '2026-04-11T15:20:00.000Z',
    },
    notes:
      'Consolidated supplier record across Ludwigshafen and Düsseldorf facilities. FEI on the Düsseldorf site has lapsed — paperwork sent 2026-03-22, no response. Allergen statement from 2025 no longer reflects the current nut-oil blend.',
    pillars: {
      fei: 'fail',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'fail',
      origin: 'pass',
      purity: 'pending',
      freshness: 'pass',
    },
  },
  {
    id: 'sup-univar',
    name: 'Univar Solutions Cosmetics',
    facilitiesCount: 3,
    activeIngredientsCount: 9,
    statusOverride: null,
    subtitle: '3 facilities · 9 active ingredients',
    addedAt: '2022-11-03T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-19T22:15:00.000Z',
    evidenceCount: 4,
    deltaWeek: -2,
    primaryContact: {
      name: 'Devon Hart',
      email: 'devon.hart@univar.example',
      lastContactedAt: '2026-04-17T10:05:00.000Z',
    },
    notes:
      'Distributor relationship, not a primary manufacturer — origin documentation depends on upstream suppliers they do not always surface promptly. Safety studies on the new polyol line not yet re-submitted after 2026 reformulation.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'fail',
      safety: 'fail',
      allergen: 'pass',
      origin: 'missing',
      purity: 'pass',
      freshness: 'pending',
    },
  },
  {
    id: 'sup-stepan',
    name: 'Stepan Cosmetics',
    facilitiesCount: 1,
    activeIngredientsCount: 4,
    statusOverride: null,
    subtitle: '1 facility · 4 active ingredients',
    addedAt: '2024-02-20T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-18T14:00:00.000Z',
    evidenceCount: 3,
    deltaWeek: -1,
    primaryContact: {
      name: 'Priya Venkatesh',
      email: 'p.venkatesh@stepan.example',
      lastContactedAt: '2026-04-12T09:30:00.000Z',
    },
    notes:
      'New relationship, still coming up the curve. §607 listing was filed but the receipt confirmation has not landed back in our file — Stepan to re-send. CAPB lot 24-118 is on QA hold — COA below acceptance floor; NC/OOS and supplier investigation in progress.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'missing',
      safety: 'pending',
      allergen: 'pending',
      origin: 'pass',
      purity: 'fail',
      freshness: 'pending',
    },
  },

  // ─── Watch ──────────────────────────────────────────────────────────────
  {
    id: 'sup-imcd-greven',
    name: 'IMCD · Peter Greven',
    facilitiesCount: 2,
    activeIngredientsCount: 7,
    statusOverride: null,
    subtitle: '2 facilities · 7 active ingredients',
    addedAt: '2022-08-11T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-15T17:40:00.000Z',
    evidenceCount: 4,
    deltaWeek: 1,
    primaryContact: {
      name: 'Thomas Brandt',
      email: 't.brandt@imcd-greven.example',
      lastContactedAt: '2026-04-15T13:00:00.000Z',
    },
    notes:
      'Prime candidate for the L\'Oréal diligence packet (Thursday deadline). Allergen statement refresh is in flight — expected by end of week. Everything else is current.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pending',
      safety: 'pending',
      allergen: 'pending',
      origin: 'pending',
      purity: 'pass',
      freshness: 'pending',
    },
  },
  {
    id: 'sup-symrise',
    name: 'Symrise Actives',
    facilitiesCount: 2,
    activeIngredientsCount: 5,
    statusOverride: null,
    subtitle: '2 facilities · 5 active ingredients',
    addedAt: '2023-01-18T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-16T09:12:00.000Z',
    evidenceCount: 3,
    deltaWeek: 0,
    primaryContact: {
      name: 'Anja Fischer',
      email: 'a.fischer@symrise-actives.example',
      lastContactedAt: '2026-04-08T16:45:00.000Z',
    },
    notes:
      'Origin & purity documents for the Madagascar vanilla-derived line are pending upstream consolidation — Symrise has asked for another two weeks.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pending',
      safety: 'pending',
      allergen: 'pass',
      origin: 'pending',
      purity: 'pending',
      freshness: 'pass',
    },
  },
  {
    id: 'sup-dsm',
    name: 'DSM Cosmetic Ingredients',
    facilitiesCount: 3,
    activeIngredientsCount: 8,
    statusOverride: null,
    subtitle: '3 facilities · 8 active ingredients',
    addedAt: '2022-05-02T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-17T11:00:00.000Z',
    evidenceCount: 4,
    deltaWeek: 2,
    primaryContact: {
      name: 'Liam Weber',
      email: 'liam.weber@dsm-ci.example',
      lastContactedAt: '2026-04-17T08:50:00.000Z',
    },
    notes:
      'Strong supplier on paper but documentation freshness is consistently a quarter late. Everything on file is valid; nothing is on the edge.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pending',
      safety: 'pending',
      allergen: 'pending',
      origin: 'pending',
      purity: 'pending',
      freshness: 'pending',
    },
  },
  {
    id: 'sup-givaudan',
    name: 'Givaudan Actives',
    facilitiesCount: 2,
    activeIngredientsCount: 6,
    statusOverride: null,
    subtitle: '2 facilities · 6 active ingredients',
    addedAt: '2023-09-30T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-17T08:30:00.000Z',
    evidenceCount: 3,
    deltaWeek: 1,
    primaryContact: {
      name: 'Celine Roux',
      email: 'c.roux@givaudan-actives.example',
      lastContactedAt: '2026-04-09T14:20:00.000Z',
    },
    notes:
      'New §609 safety dossier under review at their end — update promised this week. Purity and allergen are solid.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pending',
      safety: 'pending',
      allergen: 'pending',
      origin: 'pass',
      purity: 'pending',
      freshness: 'pending',
    },
  },

  // ─── Ready ──────────────────────────────────────────────────────────────
  {
    id: 'sup-evonik',
    name: 'Evonik Essentials',
    facilitiesCount: 2,
    activeIngredientsCount: 5,
    statusOverride: null,
    subtitle: '2 facilities · 5 active ingredients',
    addedAt: '2022-03-15T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-19T09:00:00.000Z',
    evidenceCount: 3,
    deltaWeek: 3,
    primaryContact: {
      name: 'Ingrid Kohl',
      email: 'i.kohl@evonik-essentials.example',
      lastContactedAt: '2026-04-01T11:00:00.000Z',
    },
    notes:
      'Reliable. Freshness slipped slightly on the 2025-Q4 COA batch; re-issued receipt expected any day.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pending',
      purity: 'pass',
      freshness: 'pending',
    },
  },
  {
    id: 'sup-ashland',
    name: 'Ashland Specialty',
    facilitiesCount: 1,
    activeIngredientsCount: 3,
    statusOverride: null,
    subtitle: '1 facility · 3 active ingredients',
    addedAt: '2021-09-08T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-14T10:15:00.000Z',
    evidenceCount: 3,
    deltaWeek: 0,
    primaryContact: {
      name: 'Ruben Alvarez',
      email: 'r.alvarez@ashland-specialty.example',
      lastContactedAt: '2026-03-28T13:40:00.000Z',
    },
    notes:
      'Consistently clean. Single-facility account, fully registered, all docs current.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pass',
      purity: 'pass',
      freshness: 'pass',
    },
  },
  {
    id: 'sup-clariant',
    name: 'Clariant Personal Care',
    facilitiesCount: 2,
    activeIngredientsCount: 4,
    statusOverride: null,
    subtitle: '2 facilities · 4 active ingredients',
    addedAt: '2022-02-04T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-13T16:50:00.000Z',
    evidenceCount: 3,
    deltaWeek: 1,
    primaryContact: {
      name: 'Hana Aoki',
      email: 'h.aoki@clariant-pc.example',
      lastContactedAt: '2026-04-05T09:10:00.000Z',
    },
    notes:
      'Clean record. Freshness dropping on the Muttenz site — new certificate expected this month.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pending',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pass',
      purity: 'pass',
      freshness: 'pending',
    },
  },
  {
    id: 'sup-croda',
    name: 'Croda Beauty',
    facilitiesCount: 3,
    activeIngredientsCount: 7,
    statusOverride: null,
    subtitle: '3 facilities · 7 active ingredients',
    addedAt: '2021-12-02T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-18T12:20:00.000Z',
    evidenceCount: 3,
    deltaWeek: 2,
    primaryContact: {
      name: 'Oliver Finch',
      email: 'o.finch@croda-beauty.example',
      lastContactedAt: '2026-04-02T14:30:00.000Z',
    },
    notes:
      'Top-of-class documentation discipline. Origin evidence for Asia-Pacific tracking pending supplier consolidation — not a compliance issue.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pending',
      purity: 'pass',
      freshness: 'pass',
    },
  },
  {
    id: 'sup-lubrizol',
    name: 'Lubrizol Life Sciences',
    facilitiesCount: 2,
    activeIngredientsCount: 4,
    statusOverride: null,
    subtitle: '2 facilities · 4 active ingredients',
    addedAt: '2022-07-19T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-12T11:45:00.000Z',
    evidenceCount: 3,
    deltaWeek: 0,
    primaryContact: {
      name: 'Sasha Pollard',
      email: 's.pollard@lubrizol-ls.example',
      lastContactedAt: '2026-03-30T15:00:00.000Z',
    },
    notes:
      'Reliable. No open items.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pass',
      purity: 'pass',
      freshness: 'pass',
    },
  },
  {
    id: 'sup-kao',
    name: 'Kao Specialties',
    facilitiesCount: 1,
    activeIngredientsCount: 3,
    statusOverride: null,
    subtitle: '1 facility · 3 active ingredients',
    addedAt: '2023-05-26T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-11T08:00:00.000Z',
    evidenceCount: 2,
    deltaWeek: 1,
    primaryContact: {
      name: 'Rin Nakamura',
      email: 'r.nakamura@kao-specialties.example',
      lastContactedAt: '2026-03-22T10:30:00.000Z',
    },
    notes:
      'Narrow footprint, clean record. Purity slightly aging on 2025-Q4 batch, new COA queued.',
    pillars: {
      fei: 'pass',
      cosmeticListing: 'pass',
      safety: 'pass',
      allergen: 'pass',
      origin: 'pass',
      purity: 'pending',
      freshness: 'pass',
    },
  },

  // ─── Onboarding ─────────────────────────────────────────────────────────
  {
    id: 'sup-elementis',
    name: 'Elementis Specialties',
    facilitiesCount: 1,
    activeIngredientsCount: 2,
    statusOverride: 'onboarding',
    subtitle: '1 facility · 2 active ingredients · onboarding',
    addedAt: '2026-04-15T00:00:00.000Z',
    lastScanAt: '2026-04-20T13:08:00.000Z',
    lastUpdatedAt: '2026-04-19T17:10:00.000Z',
    evidenceCount: 1,
    deltaWeek: null,
    primaryContact: {
      name: 'Jordan Vale',
      email: 'j.vale@elementis.example',
      lastContactedAt: '2026-04-19T09:40:00.000Z',
    },
    notes:
      'First onboarding run — introductory SDS received, everything else pending. Expected to clear baseline pillars within two weeks.',
    pillars: {
      fei: 'pending',
      cosmeticListing: 'missing',
      safety: 'pending',
      allergen: 'missing',
      origin: 'pending',
      purity: 'missing',
      freshness: 'missing',
    },
  },
];

// trustScoreComputedAt sibling per docs/70-agentic-surfaces.md §Surface #6.
// The score is re-computed on every scan; the anchor is the supplier's
// lastScanAt (and falls back to DEMO_NOW for any roster entry that somehow
// lacks one). ProvenanceChip on Supplier Detail reads this directly.
export const SUPPLIERS = roster.map((s) => {
  const trustScore = computeTrustScore(s.pillars);
  const status = s.statusOverride || deriveStatus(trustScore);
  const trustScoreComputedAt = s.lastScanAt || DEMO_NOW;
  return { ...s, trustScore, trustScoreComputedAt, status };
});

// Lookup helpers for screens.
export const SUPPLIERS_BY_ID = Object.fromEntries(SUPPLIERS.map((s) => [s.id, s]));

export function getSupplier(id) {
  return SUPPLIERS_BY_ID[id] || null;
}

// Portfolio roll-ups for the Trust Grid summary band.
export function getPortfolioSummary(suppliers = SUPPLIERS) {
  const counts = { ready: 0, watch: 0, blocked: 0, onboarding: 0 };
  let sum = 0;
  let scoredCount = 0;
  for (const s of suppliers) {
    counts[s.status] = (counts[s.status] || 0) + 1;
    if (s.status !== 'onboarding') {
      sum += s.trustScore;
      scoredCount += 1;
    }
  }
  const portfolioScore = scoredCount ? Math.round(sum / scoredCount) : 0;
  return {
    total: suppliers.length,
    counts,
    portfolioScore,
    portfolioDeltaWeek: 2,
  };
}

// Live demo: after chase letters for BASF allergen + FEI, session state marks
// evidence as received; project an effective supplier for score / status / pillars.
export function applyBasfDemoInboundEvidence(supplier, inbound) {
  if (!supplier || supplier.id !== 'sup-basf') return supplier;
  const inboundSafe = inbound || {};
  const pillars = { ...supplier.pillars };
  if (inboundSafe.allergen) pillars.allergen = 'pass';
  if (inboundSafe.fei) pillars.fei = 'pass';
  const trustScore = computeTrustScore(pillars);
  const both = Boolean(inboundSafe.allergen && inboundSafe.fei);
  const status = both
    ? supplier.statusOverride || deriveStatus(trustScore)
    : 'blocked';
  return {
    ...supplier,
    pillars,
    trustScore,
    status,
  };
}

export { DEMO_NOW };

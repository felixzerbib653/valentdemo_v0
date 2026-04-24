// Seven trust pillars. See docs/00-master-prd.md § Trust model.
// Weights sum to 100. Trust score per supplier = Σ(weight × pillar factor).
// Pillar factor: pass=1.0, pending=0.6, fail=0.0, missing=0.0.
// Weights are hard-coded — do not recalibrate in code, surface as data.

export const PILLAR_KEYS = [
  'fei',
  'cosmeticListing',
  'safety',
  'allergen',
  'origin',
  'purity',
  'freshness',
];

export const PILLARS = {
  fei: {
    key: 'fei',
    shortLabel: 'FEI',
    label: 'FEI registration',
    fullLabel: 'FEI registration · §606',
    anchor: '§606',
    weight: 20,
    description:
      'The supplier has an active FDA Establishment Identifier matched to the manufacturing facility name on file.',
  },
  cosmeticListing: {
    key: 'cosmeticListing',
    shortLabel: '§607',
    label: 'Cosmetic product listing',
    fullLabel: 'Cosmetic product listing · §607',
    anchor: '§607',
    weight: 15,
    description:
      'The substance or finished formulation is listed under the cosmetic product listing registry per §607, where applicable.',
  },
  safety: {
    key: 'safety',
    shortLabel: 'Safety',
    label: 'Safety substantiation',
    fullLabel: 'Safety substantiation · §609',
    anchor: '§609',
    weight: 15,
    description:
      'Adequate safety substantiation for the ingredient is on file per §609, with source studies cited.',
  },
  allergen: {
    key: 'allergen',
    shortLabel: 'Allergen',
    label: 'Allergen declaration',
    fullLabel: 'Allergen declaration',
    anchor: null,
    weight: 15,
    description:
      'Allergens present in the ingredient are declared accurately and completely, with a current allergen statement on file.',
  },
  origin: {
    key: 'origin',
    shortLabel: 'Origin',
    label: 'Origin & chain-of-custody',
    fullLabel: 'Origin & chain-of-custody',
    anchor: null,
    weight: 10,
    description:
      'Country-of-origin and upstream sourcing are documented through to the primary producer.',
  },
  purity: {
    key: 'purity',
    shortLabel: 'Purity',
    label: 'Purity & identity',
    fullLabel: 'Purity & identity',
    anchor: null,
    weight: 15,
    description:
      'The most recent Certificate of Analysis meets the spec floor. Identity (CAS / INCI) is cleanly mapped to the internal item master.',
  },
  freshness: {
    key: 'freshness',
    shortLabel: 'Freshness',
    label: 'Documentation freshness',
    fullLabel: 'Documentation freshness',
    anchor: null,
    weight: 10,
    description:
      'The most recent COA or spec document is within its validity window. Stale evidence ages into a pending state, then a fail.',
  },
};

// Ordered list for UI iteration.
export const PILLAR_LIST = PILLAR_KEYS.map((k) => PILLARS[k]);

// Pillar factor for score math.
export const PILLAR_FACTOR = {
  pass: 1.0,
  pending: 0.6,
  fail: 0.0,
  missing: 0.0,
};

export function computeTrustScore(pillars) {
  if (!pillars) return 0;
  let score = 0;
  for (const key of PILLAR_KEYS) {
    const status = pillars[key] || 'missing';
    score += PILLARS[key].weight * PILLAR_FACTOR[status];
  }
  return Math.round(score);
}

// Status category derivation: Ready ≥ 80, Watch 60–79, Blocked < 60.
// Onboarding is an explicit supplier state set at the record level, not derived.
export function deriveStatus(score) {
  if (score >= 80) return 'ready';
  if (score >= 60) return 'watch';
  return 'blocked';
}

export const STATUS_ORDER = { blocked: 0, watch: 1, onboarding: 2, ready: 3 };

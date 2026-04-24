// Retailer bundle variant profiles. See docs/80-feature-retailer-bundle-variants.md.
//
// Each profile describes the *audit program format* the bundle is being shaped
// for — not the direct recipient. Under MoCRA the brand is usually the sender;
// the CMO returns a program-shaped packet to the brand, and the brand submits.
// The one exception is retailer private-label (Target Clean's private-label
// lane), where the retailer is both the brand and the direct recipient.
//
// The profile drives three visible changes in AuditBundleModal:
//   1. Cover tagline suffix (appended to the core Valent tagline, never
//      replacing it).
//   2. Footer attestation line on the cover.
//   3. Evidence list ordering — required pillars rise to the top with a
//      `Required · {shortName}` chip; if the supplier is missing a required
//      pillar, the chip renders amber with `Required for {shortName} · not on
//      file`. Optional pillars drop to the bottom with a muted `Optional for
//      this retailer` chip.
//
// Evidence ordering is derived from `requiredPillars` at render time — one
// source of truth, no parallel `evidenceOrder` array.
//
// Generic MoCRA is the default. Selecting it returns the modal to the baseline
// ordering and suppresses the program badge + tagline suffix.

export const RETAILER_PROFILES = [
  {
    id: 'generic-mocra',
    name: 'Generic MoCRA audit format',
    shortName: 'MoCRA',
    audienceLabel: 'Generic MoCRA audit packet',
    coverTaglineSuffix: null,
    footerAttestation:
      'This bundle reflects continuous Valent Trust supplier monitoring as of {date}. Valent Trust attests to the accuracy of extracted evidence subject to supplier-provided documents.',
    requiredPillars: ['fei', 'cosmeticListing', 'safety'],
    badge: null,
    tooltip:
      'Default MoCRA-shaped packet — §606 FEI, §607 product listing, §609 safety substantiation lead the evidence list.',
  },
  {
    id: 'sephora-clean',
    name: 'Clean at Sephora',
    shortName: 'Sephora',
    audienceLabel: 'Clean at Sephora audit program',
    coverTaglineSuffix: '· aligned to Clean at Sephora ingredient standards',
    footerAttestation:
      'This bundle reflects continuous Valent Trust supplier monitoring aligned to the Clean at Sephora ingredient standard as of {date}. Valent Trust attests to the accuracy of extracted evidence subject to supplier-provided documents.',
    requiredPillars: ['allergen', 'purity', 'origin'],
    badge: { label: 'Clean at Sephora' },
    tooltip:
      'Allergen declaration, purity/identity, and origin evidence lead the bundle. Cover carries the Clean at Sephora badge.',
  },
  {
    id: 'target-clean',
    name: 'Target · Target Clean',
    shortName: 'Target',
    audienceLabel: 'Target Clean ingredient review',
    coverTaglineSuffix: '· aligned to Target Clean ingredient restrictions',
    footerAttestation:
      'This bundle is prepared for submission alongside a Target Clean ingredient review and reflects continuous Valent Trust supplier monitoring as of {date}. Valent Trust attests to the accuracy of extracted evidence subject to supplier-provided documents.',
    requiredPillars: ['allergen', 'purity', 'safety'],
    badge: { label: 'Target Clean' },
    tooltip:
      'Allergen declaration, purity/identity, and safety substantiation lead the bundle. Cover carries the Target Clean badge.',
  },
  {
    id: 'credo-clean',
    name: 'Credo Clean Standard',
    shortName: 'Credo',
    audienceLabel: 'Credo Clean Standard review',
    coverTaglineSuffix: '· aligned to Credo Clean Standard',
    footerAttestation:
      'This bundle is prepared for review against The Credo Clean Standard and reflects continuous Valent Trust supplier monitoring as of {date}. Valent Trust attests to the accuracy of extracted evidence subject to supplier-provided documents.',
    requiredPillars: ['allergen', 'purity', 'safety', 'origin'],
    badge: { label: 'Credo Clean Standard' },
    tooltip:
      'Allergen declaration, purity/identity, safety substantiation, and origin/chain-of-custody all lead the bundle — Credo is the strictest of the three retailer programs.',
  },
];

export const DEFAULT_RETAILER_PROFILE_ID = 'generic-mocra';

export function getRetailerProfile(id) {
  return (
    RETAILER_PROFILES.find((p) => p.id === id) ||
    RETAILER_PROFILES.find((p) => p.id === DEFAULT_RETAILER_PROFILE_ID)
  );
}

// Slug-safe short-name for bundle filenames, e.g. "Clean at Sephora" → "Sephora".
export function retailerFilenameSlug(profile) {
  if (!profile) return 'MoCRA';
  return profile.shortName || profile.name;
}

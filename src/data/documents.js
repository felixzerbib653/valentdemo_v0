// 45 linked evidence documents across the 14 suppliers, plus 4 unlinked records
// (3 needs-review, 1 failed-to-parse) that populate the Ingest Inbox filters.
// Source mix: email (majority), sharepoint, sftp, manual. Personas cover the
// full visual range from clean-digital through faxed.
//
// Foreign key: supplierId → src/data/suppliers.js.
// Pillar key: must be a valid PillarKey from src/data/trustPillars.js.

export const DOCUMENTS = [
  // ─── BASF Personal Care (6 linked) ───────────────────────────────────────
  {
    id: 'doc-basf-001',
    title: 'Cosmetic product listing · §607 acknowledgment',
    supplierId: 'sup-basf',
    pillarKey: 'cosmeticListing',
    source: 'email',
    sourceDetail: 'm.kessler@basf-personal-care.example',
    ingestedAt: '2026-04-03T14:22:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    extractionScore: 97,
    validityEndsAt: '2027-04-03T00:00:00.000Z',
  },
  {
    id: 'doc-basf-002',
    title: 'Safety substantiation · Avobenzone dossier',
    supplierId: 'sup-basf',
    pillarKey: 'safety',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/BASF/Safety/',
    ingestedAt: '2026-02-18T09:45:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/basf-safety-avobenzone-609.png',
    extractionScore: 95,
    validityEndsAt: '2027-02-18T00:00:00.000Z',
  },
  {
    id: 'doc-basf-003',
    title: 'Allergen declaration · nut-oil blend (expired)',
    supplierId: 'sup-basf',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'compliance@basf-personal-care.example',
    ingestedAt: '2025-03-09T11:12:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: ['expired 42d ago', 'supersedes required'],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    previewImage: '/demo-documents/basf-allergen-nut-oil-expired.png',
    extractionScore: 94,
    validityEndsAt: '2026-03-09T00:00:00.000Z',
  },
  {
    id: 'doc-basf-004',
    title: 'Origin letter · Glyceryl Stearate chain of custody',
    supplierId: 'sup-basf',
    pillarKey: 'origin',
    source: 'email',
    sourceDetail: 'm.kessler@basf-personal-care.example',
    ingestedAt: '2025-12-11T16:02:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/basf-origin-glyceryl-stearate.png',
    extractionScore: 93,
    validityEndsAt: '2026-05-15T00:00:00.000Z',
  },
  {
    id: 'doc-basf-005',
    title: 'Certificate of Analysis · Phenoxyethanol lot 25-114',
    supplierId: 'sup-basf',
    pillarKey: 'purity',
    source: 'email',
    sourceDetail: 'coa-bot@basf-personal-care.example',
    ingestedAt: '2026-03-30T07:30:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/basf-coa-phenoxyethanol-25-114.png',
    extractionScore: 96,
    validityEndsAt: '2026-09-30T00:00:00.000Z',
  },
  {
    id: 'doc-basf-006',
    title: 'FEI registration confirmation · Houston Site',
    supplierId: 'sup-basf',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/BASF/Registrations/',
    ingestedAt: '2026-01-09T10:18:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: ['renewal date passed'],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/basf-fei-houston-606.png',
    extractionScore: 97,
    validityEndsAt: '2025-12-31T00:00:00.000Z',
  },

  // ─── Univar Solutions Cosmetics (4) ──────────────────────────────────────
  {
    id: 'doc-univar-001',
    title: 'FEI registration confirmation · Houston TX',
    supplierId: 'sup-univar',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Univar/Registrations/',
    ingestedAt: '2026-01-09T10:18:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2027-01-09T00:00:00.000Z',
  },
  {
    id: 'doc-univar-002',
    title: 'Allergen declaration · aggregate distributor statement',
    supplierId: 'sup-univar',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'devon.hart@univar.example',
    ingestedAt: '2026-02-27T15:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2027-02-27T00:00:00.000Z',
  },
  {
    id: 'doc-univar-003',
    title: 'COA · Glycerin USP lot U-2026-0412',
    supplierId: 'sup-univar',
    pillarKey: 'purity',
    source: 'sftp',
    sourceDetail: 'edi.univar.example:/coa-outbound',
    ingestedAt: '2026-04-12T05:10:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-10-12T00:00:00.000Z',
  },
  {
    id: 'doc-univar-004',
    title: 'Safety substantiation · polyol line (draft)',
    supplierId: 'sup-univar',
    pillarKey: 'safety',
    source: 'email',
    sourceDetail: 'devon.hart@univar.example',
    ingestedAt: '2026-03-18T13:44:00.000Z',
    extractionConfidence: 'low',
    linkStatus: 'linked',
    flags: ['draft — not finalized', 'study citations missing'],
    persona: 'handwritten',
    fileType: 'pdf',
    pages: 9,
    validityEndsAt: null,
  },

  // ─── Stepan Cosmetics (3) ────────────────────────────────────────────────
  {
    id: 'doc-stepan-001',
    title: 'FEI registration · Northfield IL',
    supplierId: 'sup-stepan',
    pillarKey: 'fei',
    source: 'email',
    sourceDetail: 'p.venkatesh@stepan.example',
    ingestedAt: '2026-02-03T14:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2027-02-03T00:00:00.000Z',
  },
  {
    id: 'doc-stepan-002',
    title: 'Origin letter · CAPB supply chain',
    supplierId: 'sup-stepan',
    pillarKey: 'origin',
    source: 'email',
    sourceDetail: 'p.venkatesh@stepan.example',
    ingestedAt: '2026-03-19T08:15:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: [],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2027-03-19T00:00:00.000Z',
  },
  {
    id: 'doc-stepan-003',
    title: 'COA · CAPB lot 24-118 (out of spec)',
    supplierId: 'sup-stepan',
    pillarKey: 'purity',
    source: 'email',
    sourceDetail: 'coa@stepan.example',
    ingestedAt: '2026-04-18T13:50:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['spec floor failed', 'blocks shipment'],
    persona: 'photocopy',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/stepan-coa-capb-24-118.png',
    extractionScore: 81,
    validityEndsAt: '2026-10-28T00:00:00.000Z',
  },

  // ─── IMCD · Peter Greven (4) ─────────────────────────────────────────────
  {
    id: 'doc-imcd-001',
    title: 'FEI registration · Düsseldorf facility',
    supplierId: 'sup-imcd-greven',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/IMCD/Registrations/',
    ingestedAt: '2025-11-02T11:30:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 12,
    validityEndsAt: '2026-11-02T00:00:00.000Z',
  },
  {
    id: 'doc-imcd-002',
    title: 'Cosmetic product listing · §607 acknowledgment',
    supplierId: 'sup-imcd-greven',
    pillarKey: 'cosmeticListing',
    source: 'email',
    sourceDetail: 't.brandt@imcd-greven.example',
    ingestedAt: '2026-02-14T10:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2027-02-14T00:00:00.000Z',
  },
  {
    id: 'doc-imcd-003',
    title: 'COA · Glycerol monostearate lot 26-0318',
    supplierId: 'sup-imcd-greven',
    pillarKey: 'purity',
    source: 'sftp',
    sourceDetail: 'edi.imcd-greven.example:/coa/',
    ingestedAt: '2026-03-18T02:40:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'doc-imcd-004',
    title: 'Allergen declaration · SunLuxe Glow Booster (partial)',
    supplierId: 'sup-imcd-greven',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 't.brandt@imcd-greven.example',
    ingestedAt: '2026-04-15T17:35:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['partial declaration — 3 of 7 allergen entries incomplete'],
    persona: 'handwritten',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/imcd-allergen-partial-handwritten.png',
    extractionScore: 87,
    validityEndsAt: null,
  },

  // ─── Symrise Actives (3) ─────────────────────────────────────────────────
  {
    id: 'doc-symrise-001',
    title: 'Safety substantiation · vanilla-derived actives',
    supplierId: 'sup-symrise',
    pillarKey: 'safety',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Symrise/Safety/',
    ingestedAt: '2025-09-22T09:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 11,
    validityEndsAt: '2027-09-22T00:00:00.000Z',
  },
  {
    id: 'doc-symrise-002',
    title: 'Allergen declaration · botanical extracts',
    supplierId: 'sup-symrise',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'a.fischer@symrise-actives.example',
    ingestedAt: '2026-01-30T12:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2027-01-30T00:00:00.000Z',
  },
  {
    id: 'doc-symrise-003',
    title: 'Origin letter · Madagascar vanilla supply (pending)',
    supplierId: 'sup-symrise',
    pillarKey: 'origin',
    source: 'email',
    sourceDetail: 'a.fischer@symrise-actives.example',
    ingestedAt: '2026-04-01T10:22:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['awaiting upstream consolidation'],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: null,
  },

  // ─── DSM Cosmetic Ingredients (4) ────────────────────────────────────────
  {
    id: 'doc-dsm-001',
    title: 'FEI registration · three DSM facilities',
    supplierId: 'sup-dsm',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/DSM/Registrations/',
    ingestedAt: '2025-08-11T14:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-08-11T00:00:00.000Z',
  },
  {
    id: 'doc-dsm-002',
    title: 'Cosmetic product listing · vitamin E line',
    supplierId: 'sup-dsm',
    pillarKey: 'cosmeticListing',
    source: 'email',
    sourceDetail: 'liam.weber@dsm-ci.example',
    ingestedAt: '2025-11-18T11:20:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'doc-dsm-003',
    title: 'Safety substantiation · retinoids dossier',
    supplierId: 'sup-dsm',
    pillarKey: 'safety',
    source: 'sftp',
    sourceDetail: 'edi.dsm-ci.example:/compliance/',
    ingestedAt: '2025-10-05T03:30:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: [],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 17,
    validityEndsAt: '2027-10-05T00:00:00.000Z',
  },
  {
    id: 'doc-dsm-004',
    title: 'Allergen declaration · aggregate ingredient list',
    supplierId: 'sup-dsm',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'liam.weber@dsm-ci.example',
    ingestedAt: '2026-03-02T09:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 4,
    validityEndsAt: '2027-03-02T00:00:00.000Z',
  },

  // ─── Givaudan Actives (3) ────────────────────────────────────────────────
  {
    id: 'doc-givaudan-001',
    title: 'FEI registration · Vernier CH',
    supplierId: 'sup-givaudan',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Givaudan/Registrations/',
    ingestedAt: '2025-12-15T10:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2026-12-15T00:00:00.000Z',
  },
  {
    id: 'doc-givaudan-002',
    title: 'Allergen declaration · actives portfolio',
    supplierId: 'sup-givaudan',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'c.roux@givaudan-actives.example',
    ingestedAt: '2026-01-12T08:40:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2027-01-12T00:00:00.000Z',
  },
  {
    id: 'doc-givaudan-003',
    title: 'Safety substantiation · §609 dossier (under review)',
    supplierId: 'sup-givaudan',
    pillarKey: 'safety',
    source: 'email',
    sourceDetail: 'c.roux@givaudan-actives.example',
    ingestedAt: '2026-04-09T14:25:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['supplier-side review in progress'],
    persona: 'handwritten',
    fileType: 'pdf',
    pages: 12,
    previewImage: '/demo-documents/givaudan-safety-under-review-609.png',
    extractionScore: 78,
    validityEndsAt: null,
  },

  // ─── Evonik Essentials (3) ───────────────────────────────────────────────
  {
    id: 'doc-evonik-001',
    title: 'FEI registration · Marl DE + Hopewell VA',
    supplierId: 'sup-evonik',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Evonik/Registrations/',
    ingestedAt: '2025-07-25T13:10:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-07-25T00:00:00.000Z',
  },
  {
    id: 'doc-evonik-002',
    title: 'Cosmetic product listing · emollient line',
    supplierId: 'sup-evonik',
    pillarKey: 'cosmeticListing',
    source: 'email',
    sourceDetail: 'i.kohl@evonik-essentials.example',
    ingestedAt: '2025-11-03T09:20:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-11-03T00:00:00.000Z',
  },
  {
    id: 'doc-evonik-003',
    title: 'COA · Dicaprylyl Carbonate lot 26-0408',
    supplierId: 'sup-evonik',
    pillarKey: 'purity',
    source: 'sftp',
    sourceDetail: 'edi.evonik-essentials.example:/coa/',
    ingestedAt: '2026-04-08T01:50:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-10-08T00:00:00.000Z',
  },

  // ─── Ashland Specialty (3) ───────────────────────────────────────────────
  {
    id: 'doc-ashland-001',
    title: 'FEI registration · Bridgewater NJ',
    supplierId: 'sup-ashland',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Ashland/Registrations/',
    ingestedAt: '2025-05-14T10:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2027-05-14T00:00:00.000Z',
  },
  {
    id: 'doc-ashland-002',
    title: 'Safety substantiation · panthenol line',
    supplierId: 'sup-ashland',
    pillarKey: 'safety',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Ashland/Safety/',
    ingestedAt: '2025-09-08T14:30:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 9,
    validityEndsAt: '2027-09-08T00:00:00.000Z',
  },
  {
    id: 'doc-ashland-003',
    title: 'COA · Sodium Hyaluronate lot 26-0305',
    supplierId: 'sup-ashland',
    pillarKey: 'purity',
    source: 'email',
    sourceDetail: 'coa@ashland-specialty.example',
    ingestedAt: '2026-03-05T07:15:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-09-05T00:00:00.000Z',
  },

  // ─── Clariant Personal Care (3) ──────────────────────────────────────────
  {
    id: 'doc-clariant-001',
    title: 'FEI registration · Muttenz CH',
    supplierId: 'sup-clariant',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Clariant/Registrations/',
    ingestedAt: '2025-10-10T12:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2026-10-10T00:00:00.000Z',
  },
  {
    id: 'doc-clariant-002',
    title: 'Allergen declaration · PC ingredient book',
    supplierId: 'sup-clariant',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 'h.aoki@clariant-pc.example',
    ingestedAt: '2026-02-20T11:45:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 4,
    validityEndsAt: '2027-02-20T00:00:00.000Z',
  },
  {
    id: 'doc-clariant-003',
    title: 'COA · Cetearyl Alcohol lot 26-0226',
    supplierId: 'sup-clariant',
    pillarKey: 'purity',
    source: 'sftp',
    sourceDetail: 'edi.clariant-pc.example:/coa/',
    ingestedAt: '2026-02-26T04:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-08-26T00:00:00.000Z',
  },

  // ─── Croda Beauty (3) ────────────────────────────────────────────────────
  {
    id: 'doc-croda-001',
    title: 'FEI registration · three-facility bundle',
    supplierId: 'sup-croda',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Croda/Registrations/',
    ingestedAt: '2025-06-30T09:30:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-06-30T00:00:00.000Z',
  },
  {
    id: 'doc-croda-002',
    title: 'Safety substantiation · botanical emollients',
    supplierId: 'sup-croda',
    pillarKey: 'safety',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Croda/Safety/',
    ingestedAt: '2025-10-18T15:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 14,
    validityEndsAt: '2027-10-18T00:00:00.000Z',
  },
  {
    id: 'doc-croda-003',
    title: 'Origin letter · APAC tracking (pending)',
    supplierId: 'sup-croda',
    pillarKey: 'origin',
    source: 'email',
    sourceDetail: 'o.finch@croda-beauty.example',
    ingestedAt: '2026-04-02T13:50:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['awaiting secondary supplier consolidation'],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: null,
  },

  // ─── Lubrizol Life Sciences (3) ──────────────────────────────────────────
  {
    id: 'doc-lubrizol-001',
    title: 'FEI registration · Pedricktown NJ + Rouen FR',
    supplierId: 'sup-lubrizol',
    pillarKey: 'fei',
    source: 'sharepoint',
    sourceDetail: '/Compliance/Suppliers/Lubrizol/Registrations/',
    ingestedAt: '2025-08-03T11:15:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-08-03T00:00:00.000Z',
  },
  {
    id: 'doc-lubrizol-002',
    title: 'Cosmetic product listing · carbomer family',
    supplierId: 'sup-lubrizol',
    pillarKey: 'cosmeticListing',
    source: 'email',
    sourceDetail: 's.pollard@lubrizol-ls.example',
    ingestedAt: '2025-11-28T09:40:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-11-28T00:00:00.000Z',
  },
  {
    id: 'doc-lubrizol-003',
    title: 'COA · Carbomer lot 26-0301',
    supplierId: 'sup-lubrizol',
    pillarKey: 'purity',
    source: 'sftp',
    sourceDetail: 'edi.lubrizol-ls.example:/coa/',
    ingestedAt: '2026-03-01T03:20:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 3,
    validityEndsAt: '2026-09-01T00:00:00.000Z',
  },

  // ─── Kao Specialties (2) ─────────────────────────────────────────────────
  {
    id: 'doc-kao-001',
    title: 'FEI registration · Kashima JP (US agent filing)',
    supplierId: 'sup-kao',
    pillarKey: 'fei',
    source: 'email',
    sourceDetail: 'r.nakamura@kao-specialties.example',
    ingestedAt: '2025-09-14T08:00:00.000Z',
    extractionConfidence: 'high',
    linkStatus: 'linked',
    flags: [],
    persona: 'clean-digital',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: '2026-09-14T00:00:00.000Z',
  },
  {
    id: 'doc-kao-002',
    title: 'COA · Isononyl Isononanoate lot 25-Q4',
    supplierId: 'sup-kao',
    pillarKey: 'purity',
    source: 'email',
    sourceDetail: 'r.nakamura@kao-specialties.example',
    ingestedAt: '2025-11-22T06:30:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['aging — expires in 3w'],
    persona: 'photocopy',
    fileType: 'pdf',
    pages: 2,
    validityEndsAt: '2026-05-22T00:00:00.000Z',
  },

  // ─── Elementis Specialties (1 — onboarding) ──────────────────────────────
  {
    id: 'doc-elementis-001',
    title: 'Safety data sheet · intro packet',
    supplierId: 'sup-elementis',
    pillarKey: 'safety',
    source: 'email',
    sourceDetail: 'j.vale@elementis.example',
    ingestedAt: '2026-04-19T16:48:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['first-ingest for this supplier'],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 6,
    validityEndsAt: null,
  },

  // ─── Unlinked — needs review (3) ────────────────────────────────────────
  {
    id: 'doc-inbox-001',
    title: 'Certificate of Analysis · "LEC-SOY-70" · lot 2024-0814',
    supplierId: null,
    pillarKey: null,
    source: 'email',
    sourceDetail: 'auto-forward@acmecosmetics.example',
    ingestedAt: '2026-04-20T12:58:00.000Z',
    extractionConfidence: 'low',
    linkStatus: 'needs-review',
    flags: ['supplier not in master data', 'analysis table OCR failed'],
    persona: 'faxed',
    fileType: 'pdf',
    pages: 1,
    previewImage: '/demo-documents/faxed-coa-lec-soy-70.png',
    extractionScore: 65,
    validityEndsAt: null,
  },
  {
    id: 'doc-inbox-002',
    title: 'Allergen statement · sender unclear',
    supplierId: null,
    pillarKey: null,
    source: 'email',
    sourceDetail: 'no-reply@suppliermail.example',
    ingestedAt: '2026-04-20T10:22:00.000Z',
    extractionConfidence: 'low',
    linkStatus: 'needs-review',
    flags: ['no supplier identifier found', 'language: German'],
    persona: 'faxed',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: null,
  },
  {
    id: 'doc-inbox-003',
    title: 'Origin letter · scanned cover sheet',
    supplierId: null,
    pillarKey: null,
    source: 'manual',
    sourceDetail: 'uploaded by s.daley 2026-04-19',
    ingestedAt: '2026-04-19T19:40:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'needs-review',
    flags: ['facility name ambiguous'],
    persona: 'scan-light',
    fileType: 'pdf',
    pages: 1,
    validityEndsAt: null,
  },

  // ─── Unlinked — failed to parse (1) ─────────────────────────────────────
  {
    id: 'doc-inbox-004',
    title: 'Unknown document · parse failed',
    supplierId: null,
    pillarKey: null,
    source: 'email',
    sourceDetail: 'auto-forward@acmecosmetics.example',
    ingestedAt: '2026-04-20T09:05:00.000Z',
    extractionConfidence: 'low',
    linkStatus: 'failed',
    flags: ['OCR failed', 'possibly image-only attachment', 'manual review required'],
    persona: 'faxed',
    fileType: 'image',
    pages: 1,
    validityEndsAt: null,
  },
];

// Agentic surface #1 (docs/70-agentic-surfaces.md §Surface 1 + §Data model).
// Every document gets an additive `extraction` object. Append-only — no
// existing fields change. Derivation is deterministic (hash of doc.id) so the
// same doc always shows the same confidence across renders.
//
//   extraction: {
//     confidence: 0–100 | null,
//     extractedBy: 'valent' | 'user',
//     extractedAt: ISO,
//     fields: { supplier, pillarKey, lot?, section?, ... },
//   }
//
// Confidence bucketing maps the existing `extractionConfidence` string onto
// the numeric band the spec requires for gating:
//   high   → 92–98 (≥90 auto-link)
//   medium → 76–88 (70–89 "Needs review" + Review Queue gate)
//   low    → 63–69 (<70 unlinked + Review Queue gate)
// Manual uploads route through a user, not Valent — extractedBy flips to
// 'user' and confidence is null (no extraction happened).

const EXTRACTION_BASE_BY_BUCKET = { high: 92, medium: 76, low: 63 };

function hashDocId(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function buildExtractionFields(doc) {
  const fields = {};
  if (doc.supplierId) fields.supplierId = doc.supplierId;
  if (doc.pillarKey) fields.pillarKey = doc.pillarKey;
  // Best-effort parse from the seeded title — these are synthesized
  // extraction outputs, not live parsing. Values are plausible enough to
  // read "the agent pulled these fields" in a tooltip.
  const lotMatch = doc.title.match(/lot ([\w-]+)/i);
  if (lotMatch) fields.lot = lotMatch[1];
  const sectionMatch = doc.title.match(/§(\d{3})/);
  if (sectionMatch) fields.section = `§${sectionMatch[1]}`;
  // Ingredient is the phrase after the first middle-dot for CoA/safety/etc.
  const dotSplit = doc.title.split(' · ');
  if (dotSplit.length >= 2) {
    const second = dotSplit[1]
      .replace(/\s*\(.+\)\s*$/, '')
      .replace(/\s+lot .+$/i, '')
      .trim();
    if (second && second.length <= 48) fields.subject = second;
  }
  return fields;
}

function buildExtraction(doc) {
  if (doc.source === 'manual') {
    return {
      extractedBy: 'user',
      extractedAt: doc.ingestedAt,
      confidence: null,
      fields: {},
    };
  }
  const bucket = doc.extractionConfidence || 'medium';
  const base = EXTRACTION_BASE_BY_BUCKET[bucket] ?? 80;
  const jitter = hashDocId(doc.id) % 7;
  const confidence =
    typeof doc.extractionScore === 'number'
      ? doc.extractionScore
      : Math.min(98, base + jitter);
  return {
    extractedBy: 'valent',
    extractedAt: doc.ingestedAt,
    confidence,
    fields: buildExtractionFields(doc),
  };
}

// Decorate in place — DOCUMENTS is the single canonical array, and every
// consumer imports it after this statement has run.
for (const d of DOCUMENTS) {
  d.extraction = buildExtraction(d);
}

// Agent summary — the "Summarized by Valent" block on DocumentPreview.
// Per docs/70-agentic-surfaces.md §Document summaries and
// docs/02-screen-supplier-detail.md § Agent summary block.
//
// Shape: { contents, gap, nextStep } — three short lines, each ≤ 120 chars.
// - contents:  what the document actually establishes (plain English)
// - gap:       the compliance gap (if any). `null` when clean.
// - nextStep:  suggested operator action. Always present.
//
// Real PNG-backed documents get source-specific summaries. Every other demo
// document receives a conservative fallback summary below so every modal has a
// contents/gap/next-step readout.
const DOCUMENT_SUMMARIES = {
  // BASF — hero supplier, full walkthrough path
  'doc-basf-001': {
    contents: '§607 cosmetic product listing acknowledgment from FDA, active through Apr 2027 across 3 BASF facilities.',
    gap: null,
    nextStep: 'No action required. Renewal watchpoint set for Mar 2027.',
  },
  'doc-basf-002': {
    contents: '§609 safety dossier for Avobenzone with CAS, use level, supporting studies, and toxicologist sign-off captured.',
    gap: null,
    nextStep: 'No action required. Keep the dossier linked for safety substantiation review.',
  },
  'doc-basf-003': {
    contents: 'Allergen declaration for BASF nut-derived oils, issued Mar 9 2025 and valid through Mar 9 2026.',
    gap: 'The allergen statement is expired and stamped renewal required; it should not support a current audit packet.',
    nextStep: 'Request a current signed allergen declaration and confirm the nut-oil blend has not changed since the expired version.',
  },
  'doc-basf-004': {
    contents: 'Country-of-origin and chain-of-custody declaration for Glyceryl Stearate, with Germany and Malaysia sources listed.',
    gap: null,
    nextStep: 'No action required. Renewal watchpoint set before the May 15 2026 valid-until date.',
  },
  'doc-basf-005': {
    contents: 'COA for BASF Phenoxyethanol lot 25-114 with identity, expiry, purity, heavy metals, and microbial checks passing.',
    gap: null,
    nextStep: 'No action required. Lot evidence is ready for the next audit bundle.',
  },
  'doc-basf-006': {
    contents: 'FDA §606 facility registration confirmation for BASF Personal Care Houston Site in Pasadena, TX.',
    gap: 'The Dec 31 2025 renewal date has passed; current active registration evidence is not on file.',
    nextStep: 'Request the renewed §606 confirmation or renewal receipt before treating this FEI evidence as current.',
  },

  // Stepan — demo's "blocker" showcase
  'doc-stepan-003': {
    contents: 'COA for Cocamidopropyl Betaine lot 24-118; appearance, pH, and color pass, but active content is 28.9%.',
    gap: 'Active content is below the 29.5-31.5 specification, so the lot is out of spec and blocked.',
    nextStep: 'Place the lot on QA hold, open an OOS/NC record, and request supplier investigation plus replacement material.',
  },

  // IMCD — aging allergen refresh
  'doc-imcd-004': {
    contents: 'Handwritten allergen declaration for SunLuxe Glow Booster; four allergen rows are completed and dated 05/20/2024.',
    gap: 'Rows 5-7 are blank, leaving 3 of 7 allergen entries awaiting upstream confirmation.',
    nextStep: 'Request a completed signed declaration for rows 5-7 before using this statement for audit or label review.',
  },

  // Ashland — hero FEI, clean state
  'doc-ashland-001': {
    contents: '§606 FEI registration for Ashland\u2019s Bridgewater NJ facility, valid through May 2027.',
    gap: null,
    nextStep: 'No action required. Renewal watchpoint set for Apr 2027.',
  },

  // Univar — draft safety dossier
  'doc-univar-004': {
    contents: 'Draft §609 safety substantiation covering Univar\u2019s polyol line; study citations and sign-off section are placeholders.',
    gap: 'Document is marked draft; study citations and toxicologist sign-off missing.',
    nextStep: 'Request Devon Hart send the finalized dossier with citation appendix.',
  },

  // Symrise — pending origin letter
  'doc-symrise-003': {
    contents: 'Origin letter for Madagascar vanilla supply, pending consolidation of three upstream farm cooperatives.',
    gap: 'Chain-of-custody is incomplete pending upstream consolidation.',
    nextStep: 'Hold for supplier follow-up; re-scan expected when consolidation closes.',
  },

  // Givaudan — under-review safety dossier
  'doc-givaudan-003': {
    contents: '§609 safety dossier for Linalyl Acetate with ingredient identity, purity, IFRA context, and toxicology review notes.',
    gap: 'The dossier is marked under review and the final approving sign-off is still blank.',
    nextStep: 'Keep the safety pillar pending and chase the toxicology/regulatory approval before adding it to an audit bundle.',
  },

  // Inbox — needs-review
  'doc-inbox-001': {
    contents: 'Faxed COA for Lecithin (Soy) lot LEC-SOY-70 from EuroChem Labs, naming Global BioChem as supplier.',
    gap: 'Global BioChem is not matched to a supplier record, and the analysis table/signature require manual review.',
    nextStep: 'Verify the supplier master match or create one, then request a cleaner COA copy if QA needs the full result table.',
  },
};

const PILLAR_SUMMARY_LABELS = {
  fei: 'FEI registration',
  cosmeticListing: 'cosmetic product listing',
  safety: 'safety substantiation',
  allergen: 'allergen declaration',
  origin: 'origin and chain-of-custody',
  purity: 'purity and identity',
  freshness: 'documentation freshness',
};

function titleSubject(doc) {
  const parts = doc.title.split(' · ');
  return (parts[1] || parts[0] || 'this evidence')
    .replace(/\s*\(.+\)\s*$/, '')
    .trim();
}

function summarizeGapFromFlags(doc) {
  const flags = (doc.flags || []).join(' | ').toLowerCase();
  if (!flags) return null;
  if (flags.includes('expired') || flags.includes('renewal date passed')) {
    return 'The document is outside its stated validity or renewal window and needs current evidence.';
  }
  if (flags.includes('draft') || flags.includes('sign-off') || flags.includes('citations')) {
    return 'The file is not final enough for release or audit support.';
  }
  if (flags.includes('spec') || flags.includes('floor') || flags.includes('blocks shipment')) {
    return 'A measured result is outside the acceptance criteria, so QA disposition is required.';
  }
  if (flags.includes('partial') || flags.includes('incomplete')) {
    return 'The declaration is incomplete and cannot be relied on until the missing entries are supplied.';
  }
  if (flags.includes('awaiting') || flags.includes('consolidation')) {
    return 'Upstream chain-of-custody evidence is still pending.';
  }
  if (flags.includes('supplier') || flags.includes('facility') || flags.includes('ocr')) {
    return 'The extraction needs manual review before the document can be linked with confidence.';
  }
  if (flags.includes('aging') || flags.includes('expires')) {
    return 'The evidence is approaching the end of its validity window.';
  }
  if (flags.includes('first-ingest')) {
    return 'This is first-pass onboarding evidence and still needs the remaining supplier file assembled.';
  }
  return `Flagged for review: ${doc.flags.join('; ')}.`;
}

function summarizeNextStep(doc, gap) {
  if (!gap) {
    if (doc.validityEndsAt) {
      return `No action required. Keep on renewal watch before ${doc.validityEndsAt.slice(0, 10)}.`;
    }
    return 'No action required. Keep the evidence available for the current supplier file.';
  }
  if (doc.linkStatus === 'failed') {
    return 'Route to manual review and request a readable replacement if the source image cannot be recovered.';
  }
  if (doc.linkStatus === 'needs-review') {
    return 'Confirm the supplier and pillar assignment in Review Queue before linking this evidence.';
  }
  if (doc.pillarKey === 'purity') {
    return 'Hold affected material in QA, open a nonconformance if needed, and request supplier investigation.';
  }
  if (doc.pillarKey === 'safety') {
    return 'Request the final signed dossier with citations before marking safety substantiation complete.';
  }
  if (doc.pillarKey === 'allergen') {
    return 'Request a current, complete allergen declaration before using this evidence in an audit packet.';
  }
  if (doc.pillarKey === 'origin') {
    return 'Chase upstream documentation and keep the origin pillar pending until the chain is complete.';
  }
  if (doc.pillarKey === 'fei') {
    return 'Request current FDA registration evidence and keep the FEI pillar blocked until received.';
  }
  return 'Assign the document to operator review and chase the supplier for corrected evidence.';
}

function buildDefaultDocumentSummary(doc) {
  const pillarLabel = PILLAR_SUMMARY_LABELS[doc.pillarKey] || 'unclassified';
  const subject = titleSubject(doc);
  const gap = summarizeGapFromFlags(doc);
  return {
    contents: `${pillarLabel} evidence for ${subject} is on file from ${doc.source || 'source'} intake.`,
    gap,
    nextStep: summarizeNextStep(doc, gap),
  };
}

for (const d of DOCUMENTS) {
  d.summary = DOCUMENT_SUMMARIES[d.id] || buildDefaultDocumentSummary(d);
}

const DOCUMENT_CAPTURED_FIELDS = {
  'doc-basf-002': [
    { label: 'Chemical name', value: 'Butyl Methoxydibenzoylmethane (Avobenzone)', confidence: 'high', tone: 'ok' },
    { label: 'CAS number', value: '70356-09-1', confidence: 'high', tone: 'ok' },
    { label: 'Use level', value: '0.5-3.0%', confidence: 'high', tone: 'ok' },
    { label: 'Supporting studies', value: '4 detected', confidence: 'captured', tone: 'ok' },
    { label: 'Expert sign-off', value: 'Lauren E. Fisher, PhD, DABT', confidence: 'structural', tone: 'ok' },
    { label: 'Document date', value: 'May 16, 2025', confidence: 'captured', tone: 'info' },
  ],
  'doc-basf-003': [
    { label: 'Supplier on document', value: 'BASF Personal Care and Nutrition GmbH', confidence: 'exact', tone: 'ok' },
    { label: 'Issue date', value: 'March 9, 2025', confidence: 'captured', tone: 'info' },
    { label: 'Valid through', value: 'March 9, 2026', confidence: 'expired 42d ago', tone: 'block' },
    { label: 'Allergen data', value: '8 rows captured for almond, coconut, argan, and macadamia nut oils', confidence: 'high', tone: 'ok' },
    { label: 'Document status', value: 'Expired - renewal required', confidence: 'flagged', tone: 'block' },
    { label: 'Authorized signer', value: 'Dr. Svenja Meier', confidence: 'structural', tone: 'ok' },
  ],
  'doc-basf-004': [
    { label: 'Supplier on document', value: 'BASF SE', confidence: 'exact', tone: 'ok' },
    { label: 'Document number', value: 'COC-2025-04578', confidence: 'captured', tone: 'info' },
    { label: 'Product', value: 'Glyceryl Stearate', confidence: 'high', tone: 'ok' },
    { label: 'CAS number', value: '31566-31-1', confidence: 'captured', tone: 'info' },
    { label: 'Origin countries', value: 'Germany; Malaysia', confidence: 'high', tone: 'ok' },
    { label: 'Chain of custody', value: '2 Tier 1 raw-material sources captured', confidence: 'high', tone: 'ok' },
    { label: 'Authorized signer', value: 'Thomas Becker', confidence: 'structural', tone: 'ok' },
  ],
  'doc-basf-005': [
    { label: 'Supplier on document', value: 'BASF Corporation', confidence: 'exact', tone: 'ok' },
    { label: 'Product', value: 'Phenoxyethanol', confidence: 'high', tone: 'ok' },
    { label: 'CAS number', value: '122-99-0', confidence: 'captured', tone: 'info' },
    { label: 'Lot number', value: '25-114', confidence: 'high', tone: 'ok' },
    { label: 'Manufacturing date', value: 'Oct 2025', confidence: 'captured', tone: 'info' },
    { label: 'Expiry date', value: 'September 2026', confidence: 'high', tone: 'ok' },
    { label: 'Purity result', value: '99.4% (spec >=99.0%) - Pass', confidence: 'captured', tone: 'ok' },
    { label: 'Authorized signature', value: 'Michael T. Anderson, QA Manager', confidence: 'structural', tone: 'ok' },
  ],
  'doc-basf-006': [
    { label: 'Registrant', value: 'BASF Personal Care, Inc.', confidence: 'exact', tone: 'ok' },
    { label: 'Facility', value: 'Houston Site', confidence: 'captured', tone: 'ok' },
    { label: 'Address', value: '11500 Bay Area Blvd, Pasadena TX 77507', confidence: 'captured', tone: 'info' },
    { label: 'FEI number', value: '3012XXXXXX', confidence: 'high', tone: 'ok' },
    { label: 'Registration status', value: 'Active', confidence: 'high', tone: 'ok' },
    { label: 'Effective date', value: 'January 15, 2024', confidence: 'captured', tone: 'info' },
    { label: 'Renewal date', value: 'December 31, 2025', confidence: 'expired', tone: 'block' },
  ],
  'doc-stepan-003': [
    { label: 'Product', value: 'Cocamidopropyl Betaine (CAPB)', confidence: 'captured', tone: 'ok' },
    { label: 'CAS number', value: '61789-40-0', confidence: 'captured', tone: 'info' },
    { label: 'Lot number', value: '24-118', confidence: 'high', tone: 'ok' },
    { label: 'Manufacture date', value: 'Oct 28, 2024', confidence: 'captured', tone: 'info' },
    { label: 'Retest date', value: 'Oct 28, 2026', confidence: 'captured', tone: 'info' },
    { label: 'Active content result', value: '28.9%', confidence: 'review', tone: 'warn' },
    { label: 'Active content spec', value: '29.5-31.5%', confidence: 'flagged', tone: 'block' },
    { label: 'Disposition note', value: 'Hand-marked FAIL on active content row', confidence: 'captured', tone: 'block' },
  ],
  'doc-imcd-004': [
    { label: 'Product', value: 'SunLuxe Glow Booster', confidence: 'captured', tone: 'ok' },
    { label: 'INCI / chemical name', value: 'Caprylyl/Capryl Glucoside', confidence: 'captured', tone: 'ok' },
    { label: 'Product code', value: 'IMCD-CLG-100', confidence: 'captured', tone: 'info' },
    { label: 'Batch / lot number', value: '24A15-0726', confidence: 'captured', tone: 'info' },
    { label: 'Declaration date', value: '05/20/2024', confidence: 'high', tone: 'ok' },
    { label: 'Completed allergen rows', value: '4 of 7 completed; rows 5-7 blank', confidence: 'review', tone: 'warn' },
    { label: 'Present allergens', value: 'Benzyl Alcohol; Linalool', confidence: 'high', tone: 'ok' },
    { label: 'Operator annotation', value: '3 of 7 lines awaiting upstream confirmation', confidence: 'captured', tone: 'warn' },
  ],
  'doc-givaudan-003': [
    { label: 'Document status', value: 'Under review', confidence: 'pending review', tone: 'warn' },
    { label: 'Ingredient name', value: 'Linalyl Acetate', confidence: 'high', tone: 'ok' },
    { label: 'CAS number', value: '115-95-7', confidence: 'high', tone: 'ok' },
    { label: 'EC number', value: '204-116-4', confidence: 'high', tone: 'ok' },
    { label: 'FEMA number', value: '2636', confidence: 'high', tone: 'ok' },
    { label: 'Purity', value: '>= 98.0%', confidence: 'high', tone: 'ok' },
    { label: 'Odor profile', value: 'Floral, lavender, citrus', confidence: 'high', tone: 'ok' },
    { label: 'Expert sign-off', value: 'Prepared and reviewed; final approval blank', confidence: 'pending', tone: 'warn' },
    { label: 'Operator annotation', value: 'Sent to Tox 2026-03-15 - awaiting sign-off', confidence: 'captured', tone: 'warn' },
  ],
  'doc-inbox-001': [
    { label: 'Sender lab', value: 'EuroChem Labs GmbH', confidence: 'captured', tone: 'info' },
    { label: 'Supplier on document', value: 'Global BioChem Ingredients Co., Ltd.', confidence: 'unmatched', tone: 'block' },
    { label: 'Product', value: 'Lecithin (Soy)', confidence: '92%', tone: 'ok' },
    { label: 'CAS number', value: '8002-43-5', confidence: '95%', tone: 'ok' },
    { label: 'Lot number', value: 'LEC-SOY-70', confidence: 'low', tone: 'warn' },
    { label: 'Manufacture date', value: '07-28-2024', confidence: 'captured', tone: 'info' },
    { label: 'Retest date', value: '07-27-2026', confidence: 'captured', tone: 'info' },
    { label: 'Analysis results', value: 'Table region detected, OCR failed', confidence: 'manual review', tone: 'block' },
    { label: 'Signature', value: 'Unreadable quality-control signature', confidence: 'low', tone: 'warn' },
  ],
};

for (const d of DOCUMENTS) {
  const capturedFields = DOCUMENT_CAPTURED_FIELDS[d.id];
  if (capturedFields) d.capturedFields = capturedFields;
}

const BASF_INBOUND_OVERRIDES = {
  allergen: {
    id: 'doc-basf-003',
    title: 'Allergen declaration · nut-oil blend (refreshed)',
    flags: [],
    source: 'email',
    sourceDetail: 'm.kessler@basf-personal-care.example',
    extractionConfidence: 'high',
    extractionScore: 96,
    ingestedAt: null,
    validityEndsAt: '2027-04-20T00:00:00.000Z',
    previewImage: '/demo-documents/basf-allergen-nut-oil-renewed.png',
    capturedFields: [
      { label: 'Supplier on document', value: 'BASF Personal Care and Nutrition GmbH', confidence: 'exact', tone: 'ok' },
      { label: 'Document status', value: 'Current - supersedes expired Mar 2026 statement', confidence: 'captured', tone: 'ok' },
      { label: 'Valid through', value: 'April 20, 2027', confidence: 'high', tone: 'ok' },
      { label: 'Allergen data', value: 'Current nut-oil blend declaration captured', confidence: 'high', tone: 'ok' },
    ],
    summary: {
      contents: 'Refreshed allergen declaration covers the current nut-oil blend and supersedes the expired 2026 statement.',
      gap: null,
      nextStep: 'No action required. Updated declaration is ready for the next audit bundle.',
    },
  },
  fei: {
    id: 'doc-basf-006',
    title: 'FEI registration confirmation · Houston Site',
    flags: [],
    source: 'email',
    sourceDetail: 'm.kessler@basf-personal-care.example',
    extractionConfidence: 'high',
    extractionScore: 97,
    ingestedAt: null,
    validityEndsAt: '2027-04-20T00:00:00.000Z',
    previewImage: '/demo-documents/basf-fei-houston-606-renewed.png',
    capturedFields: [
      { label: 'Facility', value: 'Houston Site', confidence: 'captured', tone: 'ok' },
      { label: 'Registration status', value: 'Active', confidence: 'high', tone: 'ok' },
      { label: 'Renewal evidence', value: 'Renewed confirmation received', confidence: 'high', tone: 'ok' },
      { label: 'Valid through', value: 'April 20, 2027', confidence: 'high', tone: 'ok' },
    ],
    summary: {
      contents: 'Renewed §606 FEI registration confirmation for the BASF Houston Site.',
      gap: null,
      nextStep: 'No action required. Registration is current and linked to the FEI pillar.',
    },
  },
};

export function applyBasfDemoDocumentOverrides(docs, inbound) {
  if (!inbound) return docs;
  return docs.map((doc) => {
    const key =
      doc.id === BASF_INBOUND_OVERRIDES.allergen.id
        ? 'allergen'
        : doc.id === BASF_INBOUND_OVERRIDES.fei.id
          ? 'fei'
          : null;
    if (!key || !inbound[key]) return doc;
    const override = BASF_INBOUND_OVERRIDES[key];
    const ingestedAt =
      typeof inbound[key] === 'string' ? inbound[key] : doc.ingestedAt;
    const merged = { ...doc, ...override, ingestedAt };
    return {
      ...merged,
      // Keep hero preview art unless an override supplies a real path (null must
      // not wipe DOCUMENTS' previewImage after the BASF inbound demo merge).
      previewImage: merged.previewImage ?? doc.previewImage,
      extraction: buildExtraction({
        ...doc,
        ...override,
        ingestedAt,
      }),
    };
  });
}

// Indexed lookups for screens.
export const DOCUMENTS_BY_ID = Object.fromEntries(DOCUMENTS.map((d) => [d.id, d]));

export function getDocumentsForSupplier(supplierId) {
  return DOCUMENTS.filter((d) => d.supplierId === supplierId);
}

export function getDocumentsForPillar(supplierId, pillarKey) {
  return DOCUMENTS.filter((d) => d.supplierId === supplierId && d.pillarKey === pillarKey);
}

export function getUnlinkedDocuments() {
  return DOCUMENTS.filter((d) => d.linkStatus !== 'linked');
}

export function getIngestCounts() {
  const counts = { all: DOCUMENTS.length, linked: 0, 'needs-review': 0, failed: 0 };
  for (const d of DOCUMENTS) {
    counts[d.linkStatus] = (counts[d.linkStatus] || 0) + 1;
  }
  return counts;
}

// Portfolio-wide evidence freshness roll-up for the Trust Grid summary band.
// Operates on linked documents only — unlinked records are ingest-queue noise
// that hasn't been attached to any supplier yet.
export function getEvidenceFreshness(nowIso) {
  const now = nowIso ? new Date(nowIso).getTime() : Date.now();
  const linked = DOCUMENTS.filter((d) => d.linkStatus === 'linked');
  let oldestAgeDays = 0;
  let expiringSoon = 0;
  for (const d of linked) {
    const ingested = new Date(d.ingestedAt).getTime();
    const ageDays = Math.floor((now - ingested) / 86400000);
    if (ageDays > oldestAgeDays) oldestAgeDays = ageDays;
    if (d.validityEndsAt) {
      const ends = new Date(d.validityEndsAt).getTime();
      const diff = ends - now;
      if (diff >= 0 && diff <= 7 * 86400000) expiringSoon += 1;
    }
  }
  return {
    onFile: linked.length,
    oldestAgeDays,
    expiringSoon,
  };
}

// Surface #5 — forward-looking monitoring alerts for the TopBar dropdown.
// Per docs/70-agentic-surfaces.md §Forward-looking monitoring alerts.
//
// Returns three buckets the operator cares about when they click the
// "last scan" pulse:
//   - expiring:   linked docs whose validityEndsAt is within EXPIRY_WINDOW_DAYS
//   - aging:      linked docs ingested past AGING_THRESHOLD_DAYS, not expired
//   - newAwaitingReview: unlinked records (needs-review or failed)
//
// Each item is shaped for a single dropdown line — a supplier name plus a
// small sub-phrase that leads with a number. Items carry the info needed to
// route on click. Category totals are always derived from the full matching
// set; the items array is capped for display sanity.
const EXPIRY_WINDOW_DAYS = 30;
const AGING_THRESHOLD_DAYS = 180;
const ALERT_DISPLAY_CAP = 4;

export function getMonitoringAlerts(nowIso) {
  const now = nowIso ? new Date(nowIso).getTime() : Date.now();
  const day = 86400000;
  const linked = DOCUMENTS.filter((d) => d.linkStatus === 'linked');

  const expiringAll = [];
  const agingAll = [];

  for (const d of linked) {
    if (d.validityEndsAt) {
      const ends = new Date(d.validityEndsAt).getTime();
      const daysToExpiry = Math.floor((ends - now) / day);
      if (daysToExpiry >= 0 && daysToExpiry <= EXPIRY_WINDOW_DAYS) {
        expiringAll.push({ doc: d, daysToExpiry });
        continue;
      }
    }
    const ingested = new Date(d.ingestedAt).getTime();
    const ageDays = Math.floor((now - ingested) / day);
    const notExpired = !d.validityEndsAt
      || new Date(d.validityEndsAt).getTime() > now;
    if (notExpired && ageDays >= AGING_THRESHOLD_DAYS) {
      agingAll.push({ doc: d, ageDays });
    }
  }

  expiringAll.sort((a, b) => a.daysToExpiry - b.daysToExpiry);
  agingAll.sort((a, b) => b.ageDays - a.ageDays);

  const unlinked = DOCUMENTS.filter((d) => d.linkStatus !== 'linked');
  unlinked.sort((a, b) => new Date(b.ingestedAt) - new Date(a.ingestedAt));

  return {
    expiring: {
      total: expiringAll.length,
      items: expiringAll.slice(0, ALERT_DISPLAY_CAP),
      windowDays: EXPIRY_WINDOW_DAYS,
    },
    aging: {
      total: agingAll.length,
      items: agingAll.slice(0, ALERT_DISPLAY_CAP),
      thresholdDays: AGING_THRESHOLD_DAYS,
    },
    newAwaitingReview: {
      total: unlinked.length,
      items: unlinked.slice(0, ALERT_DISPLAY_CAP),
    },
  };
}

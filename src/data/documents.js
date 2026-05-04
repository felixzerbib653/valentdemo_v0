// 48 evidence documents across the 14 suppliers, plus 4 unlinked records
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
    previewImage: '/demo-documents/basf-cosmetic-product-listing-607.png',
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
    ingestedAt: '2024-10-20T11:12:00.000Z',
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
    title: 'Origin letter · German facility chain',
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
    validityEndsAt: '2026-12-11T00:00:00.000Z',
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
    title: 'FEI registration confirmation · Houston TX',
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
    validityEndsAt: '2026-10-18T00:00:00.000Z',
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
    pages: 1,
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
    title: 'Allergen declaration · refreshed 2026 Q2 (in progress)',
    supplierId: 'sup-imcd-greven',
    pillarKey: 'allergen',
    source: 'email',
    sourceDetail: 't.brandt@imcd-greven.example',
    ingestedAt: '2026-04-15T17:35:00.000Z',
    extractionConfidence: 'medium',
    linkStatus: 'linked',
    flags: ['partial refresh — 3 of 7 lines updated'],
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
    pages: 1,
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
    validityEndsAt: '2026-05-14T00:00:00.000Z',
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
    flags: ['supplier could not be matched', 'lecithin — candidate Croda'],
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
// Only a representative slice is seeded — enough to land on every walkthrough
// path without seeding all 48. Missing summaries render a graceful fallback
// ("Agent summary not yet available.") on the preview.
const DOCUMENT_SUMMARIES = {
  // BASF — hero supplier, full walkthrough path
  'doc-basf-001': {
    contents: '§607 cosmetic product listing acknowledgment from FDA, active through Apr 2027 across 3 BASF facilities.',
    gap: null,
    nextStep: 'No action required. Renewal watchpoint set for Mar 2027.',
  },
  'doc-basf-003': {
    contents: 'Allergen declaration for the nut-oil blend, last affirmed Oct 2024 and superseded by a 2026 ingredient list update.',
    gap: 'Declaration expired 42 days ago; superseded version not yet on file.',
    nextStep: 'Chase Maria Kessler for the refreshed §609-compliant allergen statement.',
  },
  'doc-basf-005': {
    contents: 'COA for Phenoxyethanol lot 25-114 — identity, expiry, purity, heavy metals, and microbial checks all pass.',
    gap: null,
    nextStep: 'No action required. Lot evidence is ready for the next audit bundle.',
  },
  'doc-basf-006': {
    contents: '§606 FEI registration confirmation for BASF Personal Care Houston, extracted cleanly from the FDA letter.',
    gap: 'The renewal date on the document has passed; a refreshed registration confirmation is needed.',
    nextStep: 'Chase Mara Kessler for the renewed §606 registration confirmation.',
  },

  // Stepan — demo's "blocker" showcase
  'doc-stepan-003': {
    contents: 'COA for CAPB lot 24-118 — identity and pH check clean, but the purity value falls below the Valent-tracked spec floor.',
    gap: 'Purity fails spec floor; lot cannot ship under current acceptance criteria.',
    nextStep: 'Block the lot. Request Priya Venkatesh re-issue from a compliant batch.',
  },

  // IMCD — aging allergen refresh
  'doc-imcd-004': {
    contents: 'Partial Q2 refresh of IMCD-Greven\u2019s allergen declaration covering 3 of 7 ingredient lines.',
    gap: 'Four lines still reference the 2025 Q3 declaration; aggregate statement is incomplete.',
    nextStep: 'Ask Tomasz Brandt to extend the refresh to the remaining 4 lines before end of month.',
  },

  // Ashland — hero FEI, clean state
  'doc-ashland-001': {
    contents: '§606 FEI registration for Ashland\u2019s Bridgewater NJ facility, valid through May 2026.',
    gap: null,
    nextStep: 'Schedule renewal outreach 30 days before expiry (Apr 14, 2026).',
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

  // Inbox — needs-review
  'doc-inbox-001': {
    contents: 'COA for a lecithin lot ("LEC-SOY-70") forwarded without a supplier header; identity and purity readings extracted.',
    gap: 'Supplier attribution unresolved — candidate match is Croda Beauty based on lot-number pattern.',
    nextStep: 'Confirm Croda as supplier in Review Queue and link to the purity pillar.',
  },
};

for (const d of DOCUMENTS) {
  const summary = DOCUMENT_SUMMARIES[d.id];
  if (summary) d.summary = summary;
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

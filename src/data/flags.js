// Flags — the unit of work in the Review Queue.
// Per docs/05-screen-review-queue.md §Data contract.
//
// Flags are derived at runtime from the current supplier pillar status set
// plus any documents whose linkStatus is not `linked`. The derivation is
// deterministic so the demo doesn't drift between renders.
//
// Shape:
//   {
//     id, supplierId, pillarKey,
//     severity: 'blocker' | 'watch' | 'informational',
//     title, body,
//     openedAt (ISO string),
//     assignee: { name } | null,
//     status: 'open' | 'resolved',
//     relatedDocuments: string[],
//     source: 'pillar' | 'document',
//   }

import { SUPPLIERS } from './suppliers.js';
import { DOCUMENTS } from './documents.js';
import { PILLAR_KEYS, PILLARS } from './trustPillars.js';

// Demo "now" is the latest scan anchor from TrustContext. Flags.openedAt must
// predate it. We synthesize days-ago offsets deterministically per supplier +
// pillar so the same flag always shows the same age across renders.
const DEMO_NOW_ISO = '2026-04-20T13:12:00.000Z';

const ASSIGNEES = [
  { name: 'Sarah Chen' },
  null, // unassigned
  { name: 'Gary Ruiz' },
  { name: 'Sarah Chen' },
];

const PILLAR_TITLE = {
  fei: {
    fail: 'FEI registration invalid',
    missing: 'FEI registration missing',
    pending: 'FEI verification pending',
  },
  cosmeticListing: {
    fail: 'Cosmetic listing out of date',
    missing: 'Cosmetic listing missing',
    pending: 'Cosmetic listing pending verification',
  },
  safety: {
    fail: 'Safety substantiation inadequate',
    missing: 'Safety substantiation missing',
    pending: 'Safety substantiation in review',
  },
  allergen: {
    fail: 'Allergen declaration invalid',
    missing: 'Allergen declaration missing',
    pending: 'Allergen declaration pending',
  },
  origin: {
    fail: 'Origin documentation incomplete',
    missing: 'Origin documentation missing',
    pending: 'Origin verification pending',
  },
  purity: {
    fail: 'Certificate of Analysis below spec',
    missing: 'Certificate of Analysis missing',
    pending: 'Purity review pending',
  },
  freshness: {
    fail: 'Documentation expired',
    missing: 'No recent evidence on file',
    pending: 'Documentation aging',
  },
};

const PILLAR_BODY = {
  fail: (pillar) =>
    `Most recent evidence for ${pillar.label} did not validate against the expected format or spec floor. Needs operator judgment — re-request or escalate.`,
  missing: (pillar) =>
    `No evidence on file for ${pillar.label}. Request from supplier or mark not-applicable after review.`,
  pending: (pillar) =>
    `Evidence for ${pillar.label} is on file but has not yet been verified. Will auto-resolve on next scan if clean.`,
};

// Suggested remediation per docs/70-agentic-surfaces.md §Surface #3.
// Copy is operator-voice — what Sarah would write to herself as a next step.
// The action key drives the CTA button in the flag detail panel.
const PILLAR_REMEDIATION = {
  missing: (pillar, supplier) => ({
    text: `Request current ${pillar.label} from ${supplier.name}.`,
    action: 'request-renewal',
  }),
  fail: (pillar, supplier) => ({
    text: `Chase ${supplier.name} for an updated ${pillar.label}.`,
    action: 'draft-email',
  }),
  pending: (pillar) => ({
    text: `${pillar.label} pending — next scan may clear this automatically.`,
    action: 'none',
  }),
};

const DOC_REMEDIATION = {
  failed: () => ({
    text: 'Re-run OCR or reattach the source file.',
    action: 'reconcile',
  }),
  'needs-review': () => ({
    text: 'Match to a supplier and pillar in Review Queue.',
    action: 'reconcile',
  }),
};

const SEVERITY_FROM_STATUS = {
  fail: 'blocker',
  missing: 'blocker',
  pending: 'watch',
};

function hashInt(str) {
  // Tiny deterministic hash — djb2 variant, enough for demo seeding.
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function ageDaysFor(severity, seed) {
  // Blockers skew recent (1–9d), watch mid (3–15d), informational broader.
  const h = hashInt(seed);
  if (severity === 'blocker') return 1 + (h % 9);
  if (severity === 'watch') return 3 + (h % 13);
  return 2 + (h % 21);
}

function openedAtIso(severity, seed) {
  const days = ageDaysFor(severity, seed);
  const base = new Date(DEMO_NOW_ISO).getTime();
  return new Date(base - days * 86400000).toISOString();
}

function assigneeFor(seed) {
  const h = hashInt(seed);
  return ASSIGNEES[h % ASSIGNEES.length];
}

function relatedDocIds(supplierId, pillarKey) {
  return DOCUMENTS
    .filter((d) => d.supplierId === supplierId && d.pillarKey === pillarKey)
    .map((d) => d.id);
}

export function deriveFlags() {
  const flags = [];

  // 1. Pillar-derived flags.
  for (const supplier of SUPPLIERS) {
    // Onboarding suppliers are intentionally quiet — their evidence is still
    // landing; they shouldn't dominate the queue. We still surface blockers,
    // just not pending/missing noise.
    const isOnboarding = supplier.status === 'onboarding';

    for (const pillarKey of PILLAR_KEYS) {
      const status = supplier.pillars?.[pillarKey] || 'missing';
      if (status === 'pass') continue;
      if (isOnboarding && status !== 'fail') continue;

      const severity = SEVERITY_FROM_STATUS[status] || 'watch';
      const pillar = PILLARS[pillarKey];
      const titleMap = PILLAR_TITLE[pillarKey] || {};
      const title = titleMap[status] || `${pillar.label} ${status}`;
      const body = (PILLAR_BODY[status] || PILLAR_BODY.pending)(pillar);
      const seed = `${supplier.id}:${pillarKey}`;

      const remediationFn =
        PILLAR_REMEDIATION[status] || PILLAR_REMEDIATION.pending;
      flags.push({
        id: `flag-${supplier.id}-${pillarKey}`,
        supplierId: supplier.id,
        pillarKey,
        severity,
        title,
        body,
        openedAt: openedAtIso(severity, seed),
        assignee: assigneeFor(seed),
        status: 'open',
        relatedDocuments: relatedDocIds(supplier.id, pillarKey),
        source: 'pillar',
        createdBy: 'valent',
        suggestedRemediation: remediationFn(pillar, supplier),
      });
    }
  }

  // 2. Document-derived informational flags.
  for (const doc of DOCUMENTS) {
    if (doc.linkStatus === 'linked') continue;
    const seed = `doc:${doc.id}`;
    const titlePrefix = doc.linkStatus === 'failed'
      ? 'Document failed to parse'
      : 'Document needs manual review';
    const body = doc.linkStatus === 'failed'
      ? `${doc.title} could not be parsed automatically. ${doc.flags?.join(' · ') || 'Manual review required.'}`
      : `${doc.title} landed from ${doc.source} but could not be auto-linked to a supplier or pillar. Review and route.`;

    const docRemediationFn =
      DOC_REMEDIATION[doc.linkStatus] || DOC_REMEDIATION['needs-review'];
    flags.push({
      id: `flag-doc-${doc.id}`,
      supplierId: doc.supplierId || null,
      pillarKey: doc.pillarKey || null,
      severity: 'informational',
      title: titlePrefix,
      body,
      openedAt: openedAtIso('informational', seed),
      assignee: assigneeFor(seed),
      status: 'open',
      relatedDocuments: [doc.id],
      source: 'document',
      createdBy: 'valent',
      suggestedRemediation: docRemediationFn(doc),
    });
  }

  return flags;
}

export const FLAGS = deriveFlags();

// Indexed lookups.
export const FLAGS_BY_ID = Object.fromEntries(FLAGS.map((f) => [f.id, f]));

export function getFlag(flagId) {
  return FLAGS_BY_ID[flagId] || null;
}

export function getFlagsForSupplier(supplierId) {
  return FLAGS.filter((f) => f.supplierId === supplierId);
}

export function getFlagCounts() {
  const counts = {
    all: FLAGS.length,
    blocker: 0,
    watch: 0,
    informational: 0,
    unassigned: 0,
    me: 0,
  };
  for (const f of FLAGS) {
    counts[f.severity] = (counts[f.severity] || 0) + 1;
    if (!f.assignee) counts.unassigned += 1;
    if (f.assignee && f.assignee.name === 'Sarah Chen') counts.me += 1;
  }
  return counts;
}

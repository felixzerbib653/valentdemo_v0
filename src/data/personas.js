// PDF personas — the visual personality of a document in the preview modal.
// Ported from valent-demo-light-v3 with minor renames. Used by <DocumentPreview>
// to render evidence rows with believable scan-world artifacts (photocopy grain,
// handwritten annotation, redaction bars, watermark bleed).
//
// The persona field on a document record keys into this map. Each persona
// carries both visual hints (CSS classes, overlay toggles) and copy hints
// (expected extraction-confidence bucket) so the preview is consistent.

export const PERSONAS = {
  'clean-digital': {
    key: 'clean-digital',
    label: 'Clean digital',
    description:
      'PDF with embedded text. Clean capture; highest confidence by default.',
    visual: {
      paperTint: 'paper-0',
      grain: 'none',
      watermark: 'none',
      annotation: 'none',
    },
    expectedConfidence: 'high',
  },
  'scan-light': {
    key: 'scan-light',
    label: 'Light scan',
    description:
      'Flatbed scan, clean paper, minimal compression artifacts. Extraction mostly reliable.',
    visual: {
      paperTint: 'paper-50',
      grain: 'soft',
      watermark: 'none',
      annotation: 'none',
    },
    expectedConfidence: 'high',
  },
  photocopy: {
    key: 'photocopy',
    label: 'Photocopy',
    description:
      'Second- or third-generation photocopy. Visible grain, slight skew, darkened edges. Extraction confidence drops on small type.',
    visual: {
      paperTint: 'paper-100',
      grain: 'heavy',
      watermark: 'streaks',
      annotation: 'none',
    },
    expectedConfidence: 'medium',
  },
  handwritten: {
    key: 'handwritten',
    label: 'Handwritten annotation',
    description:
      'Printed form with hand-filled fields or margin notes. Extraction handles machine-print but flags handwritten regions for review.',
    visual: {
      paperTint: 'paper-50',
      grain: 'soft',
      watermark: 'none',
      annotation: 'pen-blue',
    },
    expectedConfidence: 'medium',
  },
  redacted: {
    key: 'redacted',
    label: 'Redacted',
    description:
      'Document arrived with redaction bars over proprietary sections. Extraction works around masked regions; flags those regions as "redacted, not missing."',
    visual: {
      paperTint: 'paper-0',
      grain: 'none',
      watermark: 'none',
      annotation: 'redaction-bars',
    },
    expectedConfidence: 'medium',
  },
  faxed: {
    key: 'faxed',
    label: 'Faxed',
    description:
      'Arrived by fax-to-email gateway. Low resolution, banding, contrast loss. Extraction routinely drops to low confidence; manual review usually required.',
    visual: {
      paperTint: 'paper-100',
      grain: 'banded',
      watermark: 'fax-header',
      annotation: 'none',
    },
    expectedConfidence: 'low',
  },
};

export const PERSONA_KEYS = Object.keys(PERSONAS);

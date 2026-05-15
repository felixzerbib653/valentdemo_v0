import React, { useEffect, useMemo, useState } from 'react';
import { X, Mail, CornerDownLeft } from 'lucide-react';
import { useTrust } from '../../context/TrustContext.jsx';
import { getFlag } from '../../data/flags.js';
import { getSupplier } from '../../data/suppliers.js';
import { PILLARS } from '../../data/trustPillars.js';
import ProvenanceChip from '../shared/ProvenanceChip.jsx';

// ChaseDraftModal — Surface #4 per docs/70-agentic-surfaces.md.
//
// Opened via TrustContext.openChaseDraft(flagId) from a Review Queue flag's
// "Draft email" CTA. Renders a small modal with a pre-written chase email —
// recipient, subject, body — that the operator reviews and sends. Send emits
// a toast and closes; no actual mail is dispatched. There is NO
// auto-send path — every draft requires a human confirm-and-send.
//
// Body copy is plain English, three short paragraphs (opener, specific ask
// with deadline, sign-off). Pillar-specific phrasing comes from PILLAR_ASK
// below; if the flag isn't a pillar-keyed draft-email, the modal falls back
// to a generic chase template.

const OPERATOR_NAME = 'Sarah Chen';
const DRAFT_DEADLINE_DAYS = 10;

// Content map — per pillar, the "ask" noun phrase that lands in the subject
// and the specific-ask paragraph. Kept short and concrete, no §-anchor jargon
// in the ask itself (legal register lives in filenames, not in chase copy).
const PILLAR_ASK = {
  fei: {
    subjectTopic: 'FEI registration confirmation',
    askNoun: 'a copy of your current FDA Establishment Identifier registration',
  },
  cosmeticListing: {
    subjectTopic: 'cosmetic product listing',
    askNoun: 'your most recent §607 cosmetic product listing acknowledgment',
  },
  safety: {
    subjectTopic: 'safety substantiation',
    askNoun:
      'your latest safety substantiation dossier covering the active ingredients we source',
  },
  allergen: {
    subjectTopic: 'allergen declaration',
    askNoun:
      'your current allergen declaration for the materials on our active BOM',
  },
  origin: {
    subjectTopic: 'origin & chain-of-custody',
    askNoun:
      'origin and chain-of-custody documentation for the active ingredients we source from you',
  },
  purity: {
    subjectTopic: 'Certificate of Analysis',
    askNoun: 'a current Certificate of Analysis for the relevant lot',
  },
  freshness: {
    subjectTopic: 'refreshed evidence on file',
    askNoun:
      'a refresh of the evidence we have on file — the current version may be past its validity window',
  },
};

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function firstNameOf(fullName) {
  if (!fullName) return 'team';
  return fullName.trim().split(/\s+/)[0];
}

function buildDraft(flag, supplier, nowMs) {
  const baseMs = Number.isFinite(nowMs) ? nowMs : Date.now();
  const deadlineDate = new Date(baseMs + DRAFT_DEADLINE_DAYS * 86400000);
  const deadlineLabel = formatShortDate(deadlineDate);

  const to = supplier?.primaryContact?.email || '';
  const contactFirst = firstNameOf(supplier?.primaryContact?.name);

  // Stepan · CAPB lot 24-118 — supplier-quality chase for OOS COA (NC/OOS path),
  // not a routine evidence refresh.
  if (flag?.supplierId === 'sup-stepan' && flag?.pillarKey === 'purity') {
    const subject = `CAPB lot 24-118 — investigation & replacement lot — reply by ${deadlineLabel}`;
    const body =
      `Hi ${contactFirst},\n\n` +
      `We have opened a nonconformance on Cocamidopropyl Betaine (CAPB), supplier lot 24-118. ` +
      `The COA you provided shows purity/active content below our agreed acceptance criterion; ` +
      `the lot is on QA hold and blocked from production use pending disposition.\n\n` +
      `Please send a written investigation for this lot covering batch record review, the analytical method used, original data, retain-sample retest where applicable, and proposed corrective action. ` +
      `We cannot accept this lot under the current specification on the strength of a replacement COA alone unless you document a valid root cause such as a laboratory or transcription error with supporting evidence.\n\n` +
      `Separately, we need your proposal on material handling: replacement lot, credit, or return authorization — whichever aligns with your quality agreement with us. ` +
      `If anything material changed on method, specification references, grade, or releasing site for this SKU, include that in your reply. Please respond by ${deadlineLabel}.\n\n` +
      `Thanks,\n${OPERATOR_NAME}`;
    return { to, subject, body };
  }

  const pillar = flag?.pillarKey ? PILLARS[flag.pillarKey] : null;
  const ask = flag?.pillarKey ? PILLAR_ASK[flag.pillarKey] : null;

  const subjectTopic = ask?.subjectTopic || pillar?.label || 'compliance evidence';
  const subject = `Request: current ${subjectTopic} — due ${deadlineLabel}`;

  const askLine =
    ask?.askNoun ||
    `a current ${pillar ? pillar.label.toLowerCase() : 'compliance'} record`;

  const body =
    `Hi ${contactFirst},\n\n` +
    `We're refreshing our MoCRA evidence package for ${supplier?.name || 'your facility'} and need ${askLine}. ` +
    `Current record on file is either missing or out of date, and we'd like to keep the trust profile clean.\n\n` +
    `Could you send the most recent version by ${deadlineLabel}? If anything has changed recently — scope, facility, formulation — a short note on what's new would help us route it correctly on our end.\n\n` +
    `Thanks,\n${OPERATOR_NAME}`;

  return { to, subject, body };
}

export default function ChaseDraftModal() {
  const {
    chaseDraft,
    closeChaseDraft,
    emitToast,
    startChaseSend,
    now,
    completeTodaysWorkForFlag,
  } = useTrust();
  if (!chaseDraft) return null;

  // Two entry paths — from a Review Queue flag (chaseDraft.flagId) or from
  // a document-level gap that didn't derive a matching pillar flag. In the
  // second case we synthesize a flag-shaped object from the doc context so
  // the rest of the modal renders uniformly.
  const realFlag = chaseDraft.flagId ? getFlag(chaseDraft.flagId) : null;
  const flag =
    realFlag ||
    (chaseDraft.supplierId
      ? {
          id: `ephemeral-${chaseDraft.supplierId}-${
            chaseDraft.pillarKey || 'generic'
          }`,
          supplierId: chaseDraft.supplierId,
          pillarKey: chaseDraft.pillarKey || null,
          title: chaseDraft.title || 'Evidence gap',
        }
      : null);
  const supplier = flag?.supplierId ? getSupplier(flag.supplierId) : null;
  if (!flag) return null;

  return (
    <ChaseDraftModalInner
      key={flag.id}
      flag={flag}
      supplier={supplier}
      onClose={closeChaseDraft}
      emitToast={emitToast}
      startChaseSend={startChaseSend}
      now={now}
      completeTodaysWorkForFlag={completeTodaysWorkForFlag}
    />
  );
}

function ChaseDraftModalInner({
  flag,
  supplier,
  onClose,
  emitToast,
  startChaseSend,
  now,
  completeTodaysWorkForFlag,
}) {
  const initial = useMemo(() => buildDraft(flag, supplier, now), [flag, supplier, now]);
  const [to, setTo] = useState(initial.to);
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const canSend = to.trim().length > 0 && subject.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    startChaseSend(flag.id, {
      to: to.trim(),
      supplierId: supplier ? supplier.id : null,
    });
    completeTodaysWorkForFlag?.(flag.id, 'chase-send');
    emitToast({
      tone: 'info',
      title: 'Sending chase email',
      body: `To ${to.trim()} · ${supplier ? supplier.name : 'supplier'}`,
      supplierId: supplier ? supplier.id : null,
    });
    onClose();
  };

  const pillarLabel = flag.pillarKey
    ? PILLARS[flag.pillarKey]?.label
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Chase email draft for ${supplier ? supplier.name : 'supplier'}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/45 p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[86vh] w-full max-w-[620px] flex-col overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-md"
      >
        <header className="flex items-start justify-between gap-4 border-b border-paper-200 px-5 py-3">
          <div className="min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
              Chase email
            </div>
            <h2 className="mt-0.5 truncate text-base font-semibold text-ink-900">
              {supplier ? supplier.name : 'Supplier'}
              {pillarLabel ? (
                <span className="ml-2 text-sm font-normal text-ink-500">
                  · {pillarLabel}
                </span>
              ) : null}
            </h2>
            <p className="mt-0.5 text-xs text-ink-500">
              Flag{' '}
              <span className="font-medium text-ink-700">{flag.title}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chase draft"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-paper-300 bg-paper-0 text-ink-500 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </header>

        <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <Field label="To">
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              className="w-full rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:shadow-focus"
            />
          </Field>
          <Field label="Subject">
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-md border border-paper-300 bg-paper-0 px-2.5 py-1.5 text-sm text-ink-900 focus:border-accent focus:outline-none focus:shadow-focus"
            />
          </Field>
          <Field label="Body">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full resize-y rounded-md border border-paper-300 bg-paper-0 px-2.5 py-2 font-[inherit] text-sm leading-relaxed text-ink-900 focus:border-accent focus:outline-none focus:shadow-focus"
            />
          </Field>
        </div>

        <footer className="flex items-center justify-between gap-4 border-t border-paper-200 bg-paper-50 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <ProvenanceChip
              variant="drafted"
              title="Drafted by Valent from the flag context. Review before sending."
            />
            <span className="truncate text-[11px] text-ink-500">
              review before sending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-0 focus:outline-none focus-visible:shadow-focus"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="inline-flex items-center gap-1.5 rounded-md bg-ok px-3 py-1.5 text-sm font-semibold text-paper-0 shadow-sm transition-colors hover:bg-ok-700 focus:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Mail size={14} strokeWidth={2.25} />
              Send
              <span className="ml-1 hidden items-center rounded border border-paper-0/40 bg-paper-0/10 px-1 py-0.5 font-mono text-[9px] text-paper-0/80 sm:inline-flex">
                <CornerDownLeft size={8} strokeWidth={2.5} />
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
        {label}
      </span>
      {children}
    </label>
  );
}

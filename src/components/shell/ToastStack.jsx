import React from 'react';
import {
  CheckCircle,
  AlertOctagon,
  Clock,
  Info,
  X,
} from 'lucide-react';
import { useTrust } from '../../context/TrustContext.jsx';

// ToastStack — top-right queue, up to 3 visible, auto-dismiss at 8s unless
// hovered. Per docs/20-design-system.md §Toast + docs/30-state-contract.md §toasts.
//
// Pulled forward from phase 3 because phase-2 screens emit toasts off demo
// actions (Request update, Compose, Open in CRM, More menu). Rendering the
// stack completes the feedback loop.

const TONE = {
  info: {
    Icon: Info,
    border: 'border-paper-300',
    iconBg: 'bg-paper-100',
    iconText: 'text-ink-700',
  },
  ok: {
    Icon: CheckCircle,
    border: 'border-ok-100',
    iconBg: 'bg-ok-50',
    iconText: 'text-ok-700',
  },
  warn: {
    Icon: Clock,
    border: 'border-warn-100',
    iconBg: 'bg-warn-50',
    iconText: 'text-warn-700',
  },
  block: {
    Icon: AlertOctagon,
    border: 'border-block-100',
    iconBg: 'bg-block-50',
    iconText: 'text-block-700',
  },
};

export default function ToastStack() {
  const { toasts, dismissToast, pauseToast, resumeToast } = useTrust();
  if (!toasts || toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="pointer-events-none fixed right-6 top-20 z-50 flex w-[360px] flex-col gap-2"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onDismiss={() => dismissToast(toast.id)}
          onMouseEnter={() => pauseToast(toast.id)}
          onMouseLeave={() => resumeToast(toast.id)}
        />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss, onMouseEnter, onMouseLeave }) {
  const { navigate, openSupplier, openAuditBundle, openDocumentPreview } = useTrust();
  const tone = TONE[toast.tone] || TONE.info;
  const Icon = tone.Icon;

  const handleAction = () => {
    if (!toast.action) return;
    const a = toast.action;
    if (a.type === 'open-supplier' && a.supplierId) {
      openSupplier(a.supplierId);
    } else if (a.type === 'open-bundle' && a.supplierId) {
      openAuditBundle(a.supplierId, a.pillarKeys || null);
    } else if (a.type === 'open-document-preview' && a.docId) {
      if (a.supplierId) {
        navigate('supplier-detail', {
          supplierId: a.supplierId,
          pillarKey: a.pillarKey || null,
        });
      }
      openDocumentPreview(a.docId, { processing: a.processing });
    } else if (a.type === 'navigate' && a.page) {
      navigate(a.page, a.opts || {});
    }
    onDismiss();
  };

  return (
    <div
      role="status"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`pointer-events-auto flex items-start gap-3 rounded-lg border bg-paper-0 px-3 py-2.5 shadow-md ${tone.border}`}
    >
      <span
        className={`mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tone.iconBg} ${tone.iconText}`}
      >
        <Icon size={14} strokeWidth={2.25} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-ink-900">{toast.title}</div>
        {toast.body ? (
          <p className="mt-0.5 text-xs text-ink-600">{toast.body}</p>
        ) : null}
        {toast.action && toast.action.label ? (
          <button
            type="button"
            onClick={handleAction}
            className="mt-1.5 inline-flex items-center rounded-md border border-paper-300 bg-paper-0 px-2 py-1 text-xs font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
          >
            {toast.action.label}
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-paper-100 hover:text-ink-700 focus:outline-none focus-visible:shadow-focus"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

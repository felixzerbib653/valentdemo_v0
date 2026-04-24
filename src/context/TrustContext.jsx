import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Single app-wide context per docs/30-state-contract.md.
// One provider owns all cross-screen concerns: navigation, active supplier/pillar,
// toast queue, audit-bundle modal, pitch mode, and the continuous-monitoring
// last-scan clock. No URL state beyond ?mode=wedge (read once at mount).

const TrustContext = createContext(null);

// Default last-scan offset — "now minus 4 minutes."
const LAST_SCAN_OFFSET_MS = 4 * 60 * 1000;
const SCAN_TICK_MS = 60 * 1000;

// Toast config per contract.
const TOAST_TTL_MS = 8000;
const TOAST_DEDUPE_WINDOW_MS = 2000;
const TOAST_MAX_VISIBLE = 3;

function readModeFromUrl() {
  if (typeof window === 'undefined' || !window.location) return 'full';
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get('mode') === 'wedge' ? 'wedge' : 'full';
  } catch (err) {
    return 'full';
  }
}

let toastIdSeq = 1;
function nextToastId() {
  return `t-${toastIdSeq++}-${Date.now()}`;
}

export function TrustProvider({ children }) {
  const [page, setPage] = useState('trust-grid');
  const [activeSupplierId, setActiveSupplierId] = useState(null);
  const [activePillarKey, setActivePillarKey] = useState(null);
  const [lastViewedSupplierId, setLastViewedSupplierId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [auditBundle, setAuditBundle] = useState(null);
  // Chase-draft modal — surface #4 per docs/70-agentic-surfaces.md. Value
  // shape: { flagId: string } | null. The modal reads the flag + supplier
  // from the live data map, so we don't snapshot state beyond the id.
  const [chaseDraft, setChaseDraft] = useState(null);
  const [mode] = useState(() => readModeFromUrl());
  // Flag resolutions — keyed by flag id. Value shape:
  //   { resolvedAt: ISO, resolvedBy: string, note: string | null }
  // Session-only (no persistence per project constraint). Surfaces as the
  // Resolved filter in Review Queue + resolution events in Activity panel.
  const [resolutions, setResolutions] = useState(() => new Map());

  // Document reviews — keyed by doc id. Shape:
  //   { action: 'approve-link' | 'reject' | 'request-reextraction',
  //     note: string | null,
  //     reviewedAt: ISO,
  //     reviewedBy: string }
  // Feedback trio per docs/70-agentic-surfaces.md §Operator feedback.
  // Session-only. Projects into the Activity timeline as a first-class event.
  const [documentReviews, setDocumentReviews] = useState(() => new Map());

  // Last-scan clock — initialized once, ticked every 60s for live display.
  const [lastScanAt] = useState(() => new Date(Date.now() - LAST_SCAN_OFFSET_MS).toISOString());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), SCAN_TICK_MS);
    return () => clearInterval(t);
  }, []);

  // Toast timers, keyed by toast id. Hover pauses; leave resumes.
  const toastTimers = useRef(new Map());
  const recentToastKeys = useRef(new Map()); // dedupe window

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const scheduleToastDismiss = useCallback(
    (id) => {
      if (toastTimers.current.has(id)) {
        clearTimeout(toastTimers.current.get(id));
      }
      const handle = setTimeout(() => dismissToast(id), TOAST_TTL_MS);
      toastTimers.current.set(id, handle);
    },
    [dismissToast]
  );

  const pauseToast = useCallback((id) => {
    const timer = toastTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      toastTimers.current.delete(id);
    }
  }, []);

  const resumeToast = useCallback(
    (id) => {
      if (!toastTimers.current.has(id)) {
        scheduleToastDismiss(id);
      }
    },
    [scheduleToastDismiss]
  );

  const emitToast = useCallback(
    ({ tone = 'info', title, body, action, supplierId }) => {
      const dedupeKey = `${supplierId || ''}|${tone}|${title}`;
      const lastSeenAt = recentToastKeys.current.get(dedupeKey) || 0;
      const nowMs = Date.now();
      if (nowMs - lastSeenAt < TOAST_DEDUPE_WINDOW_MS) {
        return null;
      }
      recentToastKeys.current.set(dedupeKey, nowMs);

      const id = nextToastId();
      const toast = {
        id,
        tone,
        title,
        body: body || null,
        action: action || null,
        supplierId: supplierId || null,
        emittedAt: nowMs,
      };
      setToasts((prev) => {
        const next = [toast, ...prev];
        // Trim beyond visible cap — oldest drops off.
        return next.slice(0, TOAST_MAX_VISIBLE);
      });
      scheduleToastDismiss(id);
      return id;
    },
    [scheduleToastDismiss]
  );

  // Navigation. Single dispatcher; every screen writes through here.
  const navigate = useCallback((nextPage, opts = {}) => {
    setPage(nextPage);
    if (opts.supplierId !== undefined) {
      setActiveSupplierId(opts.supplierId || null);
      if (opts.supplierId) setLastViewedSupplierId(opts.supplierId);
    } else if (nextPage !== 'supplier-detail') {
      // Clear active supplier when leaving supplier-scoped contexts, except
      // the review queue which optionally stays supplier-scoped.
      if (nextPage !== 'review') {
        setActiveSupplierId(null);
      }
    }
    if (opts.pillarKey !== undefined) {
      setActivePillarKey(opts.pillarKey || null);
    } else if (nextPage !== 'supplier-detail' && nextPage !== 'review') {
      setActivePillarKey(null);
    }
  }, []);

  const openSupplier = useCallback(
    (supplierId) => navigate('supplier-detail', { supplierId }),
    [navigate]
  );

  const openAuditBundle = useCallback((supplierId, pillarKeys) => {
    if (!supplierId) return;
    setAuditBundle({ supplierId, pillarKeys: pillarKeys || null });
  }, []);

  const closeAuditBundle = useCallback(() => setAuditBundle(null), []);

  // Accepts either a flagId (string — opens from an existing Review Queue
  // flag) or a context object { supplierId, pillarKey, title? } — opens from
  // a doc-level gap that doesn't have a matching pillar-level flag derived.
  // The modal synthesizes a flag-shaped object from the context.
  const openChaseDraft = useCallback((flagIdOrContext) => {
    if (!flagIdOrContext) return;
    if (typeof flagIdOrContext === 'string') {
      setChaseDraft({ flagId: flagIdOrContext });
    } else {
      setChaseDraft({
        flagId: null,
        supplierId: flagIdOrContext.supplierId || null,
        pillarKey: flagIdOrContext.pillarKey || null,
        title: flagIdOrContext.title || null,
      });
    }
  }, []);

  const closeChaseDraft = useCallback(() => setChaseDraft(null), []);

  const resolveFlag = useCallback((flagId, note) => {
    if (!flagId) return;
    const trimmed = (note || '').trim();
    setResolutions((prev) => {
      const next = new Map(prev);
      next.set(flagId, {
        resolvedAt: new Date().toISOString(),
        resolvedBy: 'Sarah Chen',
        note: trimmed || null,
      });
      return next;
    });
  }, []);

  const reopenFlag = useCallback((flagId) => {
    if (!flagId) return;
    setResolutions((prev) => {
      if (!prev.has(flagId)) return prev;
      const next = new Map(prev);
      next.delete(flagId);
      return next;
    });
  }, []);

  const emitDocumentReview = useCallback((docId, action, note) => {
    if (!docId || !action) return;
    const trimmed = (note || '').trim();
    setDocumentReviews((prev) => {
      const next = new Map(prev);
      next.set(docId, {
        action,
        note: trimmed || null,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'Sarah Chen',
      });
      return next;
    });
  }, []);

  const clearDocumentReview = useCallback((docId) => {
    if (!docId) return;
    setDocumentReviews((prev) => {
      if (!prev.has(docId)) return prev;
      const next = new Map(prev);
      next.delete(docId);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      // active navigation
      page,
      activeSupplierId,
      activePillarKey,
      lastViewedSupplierId,

      // cross-screen state
      toasts,
      auditBundle,
      chaseDraft,
      resolutions,
      documentReviews,

      // chrome
      mode,
      lastScanAt,
      now,

      // dispatchers
      navigate,
      openSupplier,
      openAuditBundle,
      closeAuditBundle,
      openChaseDraft,
      closeChaseDraft,
      emitToast,
      dismissToast,
      pauseToast,
      resumeToast,
      resolveFlag,
      reopenFlag,
      emitDocumentReview,
      clearDocumentReview,
    }),
    [
      page,
      activeSupplierId,
      activePillarKey,
      lastViewedSupplierId,
      toasts,
      auditBundle,
      chaseDraft,
      resolutions,
      documentReviews,
      mode,
      lastScanAt,
      now,
      navigate,
      openSupplier,
      openAuditBundle,
      closeAuditBundle,
      openChaseDraft,
      closeChaseDraft,
      emitToast,
      dismissToast,
      pauseToast,
      resumeToast,
      resolveFlag,
      reopenFlag,
      emitDocumentReview,
      clearDocumentReview,
    ]
  );

  return <TrustContext.Provider value={value}>{children}</TrustContext.Provider>;
}

export function useTrust() {
  const ctx = useContext(TrustContext);
  if (!ctx) {
    throw new Error('useTrust must be used inside <TrustProvider>');
  }
  return ctx;
}

// Helper — format a "Nm ago" / "Nh ago" / "yesterday" relative timestamp
// against the current `now` value from context. Exported here so every
// screen renders timestamps from the same clock.
export function formatRelative(iso, nowMs) {
  if (!iso) return '';
  const t = new Date(iso).getTime();
  const delta = Math.max(0, nowMs - t);
  const mins = Math.floor(delta / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

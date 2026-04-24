import React from 'react';
import {
  FileText,
  Mail,
  HardDrive,
  ServerCog,
  Upload,
  CircleAlert,
} from 'lucide-react';
import { useTrust, formatRelative } from '../../context/TrustContext.jsx';
import { PILLARS } from '../../data/trustPillars.js';
import { getSupplier } from '../../data/suppliers.js';
import ProvenanceChip from '../shared/ProvenanceChip.jsx';

// DocumentRow — a single ingested-document row in the Ingest Inbox list.
// Per docs/04-screen-ingest-inbox.md §Recent arrivals.
//
// Row click opens DocumentPreview. Linked-supplier chip is a sub-target that
// navigates to Supplier Detail without opening the preview. Needs-review and
// Failed rows get a 3px colored left bar.
//
// Provenance retrofit (surface #1 per docs/70-agentic-surfaces.md):
// The right-hand confidence bucket chip is replaced by <ProvenanceChip /> for
// Valent-extracted rows. Manual uploads drop the chip — the Upload source
// icon already signals "human put this here."

const SOURCE_ICON = {
  email: Mail,
  sharepoint: HardDrive,
  sftp: ServerCog,
  manual: Upload,
};

const SOURCE_LABEL = {
  email: 'from email',
  sharepoint: 'from SharePoint',
  sftp: 'from SFTP',
  manual: 'manual upload',
};

const LINK_TONE = {
  linked: { text: 'text-ok-700', dot: 'bg-ok' },
  'needs-review': { text: 'text-warn-700', dot: 'bg-warn' },
  failed: { text: 'text-block-700', dot: 'bg-block' },
};

const LINK_LABEL = {
  linked: 'Linked',
  'needs-review': 'Needs review',
  failed: 'Failed to parse',
};

const LEFT_BAR = {
  'needs-review': 'before:bg-warn',
  failed: 'before:bg-block',
};

export default function DocumentRow({ doc, onOpen }) {
  const { openSupplier, now } = useTrust();
  const supplier = doc.supplierId ? getSupplier(doc.supplierId) : null;
  const pillar = doc.pillarKey ? PILLARS[doc.pillarKey] : null;
  const SourceIcon = SOURCE_ICON[doc.source] || FileText;
  const extraction = doc.extraction;
  const showProvenance = extraction && extraction.extractedBy === 'valent';
  const link = LINK_TONE[doc.linkStatus] || LINK_TONE.linked;
  const leftBar = LEFT_BAR[doc.linkStatus] || '';

  const handleSupplierClick = (e) => {
    e.stopPropagation();
    if (doc.supplierId) openSupplier(doc.supplierId);
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(doc)}
      className={`relative flex w-full items-center gap-3 border-b border-paper-200 px-6 py-3 text-left transition-colors last:border-b-0 hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus ${leftBar ? `before:absolute before:left-0 before:top-0 before:h-full before:w-[3px] before:content-[''] ${leftBar}` : ''}`}
    >
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-paper-100 text-ink-700">
        <FileText size={14} strokeWidth={2} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="truncate text-sm font-medium text-ink-900">
            {doc.title}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-paper-100 px-1.5 py-0.5 text-[10px] font-medium text-ink-500">
            <SourceIcon size={10} strokeWidth={2} />
            {SOURCE_LABEL[doc.source] || 'ingested'}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-500">
          {supplier ? (
            <span
              onClick={handleSupplierClick}
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSupplierClick(e);
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-1.5 py-0.5 font-medium text-ink-700 transition-colors hover:bg-paper-100 focus:outline-none focus-visible:shadow-focus"
            >
              {supplier.name}
              <span className="font-mono tabular-nums text-ink-500">
                · {supplier.trustScore}
              </span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-md border border-block-100 bg-block-50 px-1.5 py-0.5 font-medium text-block-700">
              <CircleAlert size={10} strokeWidth={2.25} />
              No supplier linked
            </span>
          )}
          <span className="text-ink-400">·</span>
          <span className="font-mono tabular-nums">
            {formatRelative(doc.ingestedAt, now)}
          </span>
        </div>
      </div>

      {showProvenance && (
        <ProvenanceChip
          variant="extracted"
          confidence={extraction.confidence}
          timestamp={extraction.extractedAt}
          nowMs={now}
        />
      )}

      <div className="hidden w-[160px] shrink-0 flex-col items-end gap-0.5 text-right md:flex">
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${link.text}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${link.dot}`} />
          {LINK_LABEL[doc.linkStatus] || 'Linked'}
        </span>
        {pillar ? (
          <span className="text-[11px] text-ink-500">{pillar.label}</span>
        ) : doc.linkStatus === 'failed' ? (
          <span className="text-[11px] text-ink-500">manual review required</span>
        ) : (
          <span className="text-[11px] text-ink-500">pillar unresolved</span>
        )}
      </div>
    </button>
  );
}

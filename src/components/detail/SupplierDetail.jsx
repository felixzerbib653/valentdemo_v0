import React, { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import SupplierHeader from './SupplierHeader.jsx';
import PillarList from './PillarList.jsx';
import EvidencePanel from './EvidencePanel.jsx';
import ActivityPanel from './ActivityPanel.jsx';
import { getSupplier, applyBasfDemoInboundEvidence } from '../../data/suppliers.js';
import { useTrust } from '../../context/TrustContext.jsx';

// SupplierDetail — three-column drill-down for one supplier.
// Per docs/02-screen-supplier-detail.md.

export default function SupplierDetail() {
  const { activeSupplierId, navigate, basfDemoInboundEvidence } = useTrust();
  const supplierRaw = activeSupplierId ? getSupplier(activeSupplierId) : null;
  const supplier = useMemo(() => {
    if (!supplierRaw) return null;
    if (supplierRaw.id !== 'sup-basf') return supplierRaw;
    return applyBasfDemoInboundEvidence(supplierRaw, basfDemoInboundEvidence);
  }, [supplierRaw, basfDemoInboundEvidence]);

  if (!supplier) {
    return (
      <section className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-4 px-12 py-14">
        <h2 className="text-xl font-semibold text-ink-900">No supplier selected</h2>
        <p className="text-sm text-ink-600">
          Pick a supplier from the Supplier Trust grid to see its pillar detail.
        </p>
        <button
          type="button"
          onClick={() => navigate('trust-grid')}
          className="inline-flex items-center gap-1 rounded-md border border-paper-300 bg-paper-0 px-3 py-1.5 text-sm font-medium text-ink-700 transition-colors hover:bg-paper-50 focus:outline-none focus-visible:shadow-focus"
        >
          <ChevronLeft size={14} strokeWidth={2} />
          Supplier Trust
        </button>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
      <SupplierHeader supplier={supplier} />
      <div className="mx-auto w-full max-w-[1280px] px-12">
        <div className="grid grid-cols-[240px_minmax(0,1fr)_320px] gap-6 items-start">
          <PillarList supplier={supplier} />
          <EvidencePanel supplier={supplier} />
          <ActivityPanel supplier={supplier} />
        </div>
      </div>
    </div>
  );
}

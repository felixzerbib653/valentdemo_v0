// Brands collection — the CMO's book of business.
// See docs/85-feature-multi-brand-cmo-view.md (Wave 1 scope).
//
// Five seeded brands mapped across the fourteen-supplier roster. Three
// suppliers are shared across multiple brands — that overlap is what makes
// the "shared pool" claim credible in the Supplier Detail sidebar card.
//
// Shared suppliers (each used by 2 brands):
//   sup-basf     → Aurelia + Nova
//   sup-croda    → Aurelia + Verdant
//   sup-symrise  → Verdant + Nova
//
// All other suppliers belong to exactly one brand. Every one of the 14
// suppliers in the roster is assigned to at least one brand.
//
// Shape notes:
// - `suppliers` is an ordered list of `{ supplierId, skuCount }` entries.
//   SKU count represents the number of this brand's SKUs that touch the
//   supplier — it drives the "Aurelia Skincare · 3 SKUs" row in the
//   sidebar card. `totalSkuCount` is the sum across suppliers.
// - `diligenceContact` is the compliance inbox Valent defaults into the
//   AuditBundleModal's EmailDialog `To` field. Not an outbound channel.
// - Wave 2 will add `retailerAccounts` and scope-filter plumbing; both
//   deferred for now.

export const BRANDS = [
  {
    id: 'brand-aurelia',
    name: 'Aurelia Skincare',
    segment: 'luxury skincare',
    totalSkuCount: 34,
    diligenceContact: 'compliance@aurelia-skincare.example',
    suppliers: [
      { supplierId: 'sup-basf', skuCount: 3 },
      { supplierId: 'sup-croda', skuCount: 5 },
      { supplierId: 'sup-imcd-greven', skuCount: 2 },
      { supplierId: 'sup-dsm', skuCount: 4 },
      { supplierId: 'sup-ashland', skuCount: 6 },
    ],
  },
  {
    id: 'brand-finca',
    name: 'Finca Beauty',
    segment: 'mass clean beauty',
    totalSkuCount: 28,
    diligenceContact: 'qa@finca-beauty.example',
    suppliers: [
      { supplierId: 'sup-stepan', skuCount: 4 },
      { supplierId: 'sup-univar', skuCount: 3 },
      { supplierId: 'sup-clariant', skuCount: 5 },
    ],
  },
  {
    id: 'brand-verdant',
    name: 'Verdant Bodycare',
    segment: 'prestige natural',
    totalSkuCount: 18,
    diligenceContact: 'compliance@verdantbodycare.example',
    suppliers: [
      { supplierId: 'sup-croda', skuCount: 2 },
      { supplierId: 'sup-evonik', skuCount: 3 },
      { supplierId: 'sup-symrise', skuCount: 4 },
    ],
  },
  {
    id: 'brand-nova',
    name: 'Nova Color Cosmetics',
    segment: 'color cosmetics',
    totalSkuCount: 52,
    diligenceContact: 'regulatory@novacolorcosmetics.example',
    suppliers: [
      { supplierId: 'sup-basf', skuCount: 4 },
      { supplierId: 'sup-symrise', skuCount: 3 },
      { supplierId: 'sup-lubrizol', skuCount: 6 },
      { supplierId: 'sup-givaudan', skuCount: 7 },
    ],
  },
  {
    id: 'brand-halcyon',
    name: 'Halcyon Haircare',
    segment: 'prestige haircare',
    totalSkuCount: 22,
    diligenceContact: 'qa@halcyonhaircare.example',
    suppliers: [
      { supplierId: 'sup-kao', skuCount: 5 },
      { supplierId: 'sup-elementis', skuCount: 2 },
    ],
  },
];

// Convenience maps computed once.
const SUPPLIER_TO_BRANDS = new Map();
for (const brand of BRANDS) {
  for (const entry of brand.suppliers) {
    const list = SUPPLIER_TO_BRANDS.get(entry.supplierId) || [];
    list.push({ brand, skuCount: entry.skuCount });
    SUPPLIER_TO_BRANDS.set(entry.supplierId, list);
  }
}

// Brands that touch this supplier. Returns an ordered list of
// { brand, skuCount } entries; empty array if the supplier is in the roster
// but hasn't been mapped (shouldn't happen in demo).
export function getBrandsForSupplier(supplierId) {
  return SUPPLIER_TO_BRANDS.get(supplierId) || [];
}

export function getBrand(id) {
  return BRANDS.find((b) => b.id === id) || null;
}

# Product and positioning

## What the product does, in one sentence

Valent Trust is the daily workflow surface for cosmetic CMO compliance operators — a continuously monitored supplier trust grid, an agentic remediation queue, and a one-click audit bundle that replaces three weeks of manual evidence gathering.

## The five functional surfaces

**Trust Grid.** The landing screen. All suppliers in the portfolio, one row each, seven pillar chips per row, a 0–100 trust score derived from weighted pillars, default-sorted by status (blocked → watch → ready). This is what Sarah opens at 9am. If a supplier dropped below the threshold overnight, it floats to the top. No dashboard-style summary cards — the information density goes into the rows where the operator actually works.

**Supplier Detail.** Click a row, drill in. Per-pillar evidence list with provenance (when it was ingested, by whom, what document it came from). Activity log showing every event on the supplier's record — uploads, renewals, flag resolutions, chase emails sent. Inline drafting of new chase emails from the missing-evidence state.

**Audit Bundle.** The hero output. Select a supplier (or a set of suppliers), pick the program format (generic MoCRA, Sephora Clean at Sephora, Ulta Conscious Beauty, custom), generate a PDF bundle with a cover page, provenance breadcrumb, and the ranked evidence for each pillar. Under 60 seconds, end-to-end. This is what gets sent to the retailer auditor.

**Ingest Inbox.** Where new evidence lands from connected sources (SharePoint, email-forward, SFTP, manual upload). Extraction is AI-first with human-in-the-loop review above the confidence floor. The operator's default is to approve what the agent pre-staged, not to hand-enter data.

**Review Queue.** Flags that need operator attention — expired certificates, missing FEI registrations, ingredient mismatches, superseded documents. Grouped by supplier, default-collapsed so the operator sees the shape of the problems before diving in. One-click draft for the remediation email.

## The "Vanta for suppliers" analogy — use it, know its limits

**Why it works.** Vanta is a five-second pattern-match for investors and buyers: continuous compliance, evidence collection, one-click audit export, operator-grade UX instead of IT-project deployment. That entire pattern transfers. Vanta did for SOC 2 what we're doing for MoCRA (and, eventually, FSMA, REACH, DSHEA). The analogy plants the category, the margin profile, and the sales motion in one phrase.

**Where it breaks and how to talk about it.**

The evidence plane is messier. Vanta pulls evidence from APIs — AWS IAM policies, Okta configurations, Slack retention settings. Clean, structured, fetchable. Our evidence comes from PDFs emailed by suppliers, SharePoint folders with naming conventions that change quarterly, scanned allergen letters, hand-typed CAS numbers on ingredient specs. AI extraction is what makes it workable, but every investor should hear that we're not pattern-matching to Vanta's "connect and go" motion. First-facility onboarding is white-glove. We own that.

The regulatory surface is fragmented. SOC 2 is one framework with one auditing body. Supplier compliance is MoCRA plus FDA 21 CFR 700s plus state cosmetic laws plus retailer-specific programs plus international (EU CPR, Health Canada) when you cross borders. The pillar model we built handles this — pillars are modular, weights are configurable per buyer — but the mental model is "compliance graph" not "compliance checklist."

Remediation is slower. A Vanta customer failing a SOC 2 control can patch it in an afternoon. A CMO failing §606 because a supplier's FEI lapsed has to chase the supplier to re-register, wait for FDA, and update the record — that's a 2–6 week loop. Our product has to be honest about that. We surface the pending state, draft the chase, track the loop. We don't pretend it's instant.

## "SOC 2 for BOMs" — the honest framing

For investor conversations that go past the five-second pattern-match, the honest framing is "SOC 2 for BOMs." We produce a continuously updated, evidence-backed statement of compliance posture for every supplier in a CMO's bill-of-materials, on an ongoing basis. When a retailer audit hits or a bid deadline closes, the state of the BOM is already knowable — no three-week archaeological dig. The BOM framing also opens the expansion story: every ingredient in a BOM has a compliance surface, and as you deepen the graph per ingredient, you move from compliance to sourcing intelligence to margin.

## What we deliberately don't do

We don't do formulation. We don't do inventory management. We don't do order management. We don't replace a QMS (though we absorb the 20% of QMS workflow that belongs to Compliance Ops). We don't do ERP. We don't do CAPA workflows beyond the per-flag resolve-with-note trail we already ship.

The discipline matters for two reasons. First, every adjacent category we enter is a category with an incumbent and a different buyer — scope creep on the wedge is a common seed-stage failure mode. Second, the expansion arc (bidding, margin) pulls us toward data intelligence, not workflow sprawl. Staying narrow on workflow and deep on evidence is the thesis.

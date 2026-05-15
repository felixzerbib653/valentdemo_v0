// Hard-coded admin metrics for the gated Admin · Adoption surface.
// Per docs/06-screen-admin-adoption.md. No computation at runtime; this is
// the "light version of the admin dashboard" that lives behind a blur.
//
// Values are internally consistent (the KPI "documents processed this week"
// matches the last bar on the weekly chart, the operator headcount matches
// the roster, etc.) so a reviewer inspecting the blur sees a coherent shape.

export const ADMIN_KPIS = [
  {
    key: 'docs-week',
    label: 'Documents processed · last week',
    value: 318,
    unit: 'docs',
    delta: '+12% vs prior week',
    deltaTone: 'ok',
  },
  {
    key: 'hours-saved',
    label: 'Hours saved · this month',
    value: 84,
    unit: 'hrs',
    delta: '≈ 2.1 FTE-weeks reclaimed',
    deltaTone: 'info',
  },
  {
    key: 'operators',
    label: 'Active operators',
    value: 6,
    unit: 'people',
    delta: 'All invited seats active',
    deltaTone: 'ok',
  },
  {
    key: 'triage-time',
    label: 'Avg triage time · per flag',
    value: '4.8',
    unit: 'min',
    delta: '−1.3 min vs last month',
    deltaTone: 'ok',
  },
];

// Eight weeks of documents-processed counts, oldest first. Labels read as
// "Wk of Feb 24", "Wk of Mar 2", ... The tail bar matches the weekly KPI (318).
export const WEEKLY_ADOPTION = [
  { week: 'Feb 24', docs: 182 },
  { week: 'Mar 02', docs: 204 },
  { week: 'Mar 09', docs: 231 },
  { week: 'Mar 16', docs: 217 },
  { week: 'Mar 23', docs: 256 },
  { week: 'Mar 30', docs: 271 },
  { week: 'Apr 06', docs: 284 },
  { week: 'Apr 13', docs: 318 },
];

// Team roster — names reused from existing events/flags seeding so the demo
// feels internally consistent. Last-active values are relative strings (the
// admin view is blurred so real-time clock binding adds no value).
export const TEAM_ROSTER = [
  {
    id: 'op-sarah',
    name: 'Sarah Chen',
    role: 'Compliance Ops Lead',
    lastActive: '2m ago',
    weeklyTriage: 94,
  },
  {
    id: 'op-gary',
    name: 'Gary Ruiz',
    role: 'Procurement Lead',
    lastActive: '18m ago',
    weeklyTriage: 61,
  },
  {
    id: 'op-rachel',
    name: 'Rachel Okafor',
    role: 'Quality Manager',
    lastActive: '1h ago',
    weeklyTriage: 47,
  },
  {
    id: 'op-marco',
    name: 'Marco Silva',
    role: 'Compliance Analyst',
    lastActive: '3h ago',
    weeklyTriage: 52,
  },
  {
    id: 'op-priya',
    name: 'Priya Sharma',
    role: 'Compliance Analyst',
    lastActive: 'yesterday',
    weeklyTriage: 38,
  },
  {
    id: 'op-james',
    name: 'James O’Connor',
    role: 'Regulatory Consultant',
    lastActive: '2d ago',
    weeklyTriage: 26,
  },
];

// Settings — placeholder groups only. No interactivity in demo.
export const SETTINGS_GROUPS = [
  {
    key: 'sources',
    title: 'Data sources',
    items: [
      'Email · compliance@elevationlabs.example',
      'SharePoint · /Compliance/Suppliers',
      'SFTP · edi.elevationlabs.example',
      'Manual upload · enabled',
    ],
  },
  {
    key: 'notifications',
    title: 'Notification preferences',
    items: [
      'Daily digest · 8:00 AM · Sarah Chen',
      'Blocker alerts · immediate · #compliance-ops',
      'Weekly adoption summary · Mondays · leadership@elevationlabs.example',
    ],
  },
  {
    key: 'roles',
    title: 'Role assignments',
    items: [
      'Compliance Ops · read / write · 3 seats',
      'Procurement · read / comment · 1 seat',
      'Quality · read / write · 1 seat',
      'External consultant · read-only · 1 seat',
    ],
  },
];

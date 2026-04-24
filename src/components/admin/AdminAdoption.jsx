import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import {
  Users,
  FileCheck,
  Timer,
  Gauge,
  Database,
  Bell,
  ShieldCheck,
} from 'lucide-react';
import {
  ADMIN_KPIS,
  WEEKLY_ADOPTION,
  TEAM_ROSTER,
  SETTINGS_GROUPS,
} from '../../data/adminMetrics.js';

// AdminAdoption — gated surface. Per docs/06-screen-admin-adoption.md.
//
// Rendered as the blurred content behind <LockedPageShell>. It is not meant
// to be interactive (the shell disables pointer events), only to show enough
// structure through the blur that a reviewer sees "adoption metrics exist."
//
// Structure:
//   - 4 KPI tiles (documents processed · hours saved · operators · triage time)
//   - 8-week weekly adoption bar chart (Recharts)
//   - Team roster table
//   - Settings section placeholder (data sources · notifications · roles)

const KPI_ICONS = {
  'docs-week': FileCheck,
  'hours-saved': Timer,
  operators: Users,
  'triage-time': Gauge,
};

const DELTA_TONE = {
  ok: 'text-ok-700',
  warn: 'text-warn-700',
  block: 'text-block-700',
  info: 'text-ink-500',
};

const SETTINGS_ICONS = {
  sources: Database,
  notifications: Bell,
  roles: ShieldCheck,
};

export default function AdminAdoption() {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-12 py-8">
      <header className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Admin · Adoption</h2>
          <p className="mt-1 text-sm text-ink-500">
            Team-level processing and adoption metrics across your compliance org.
          </p>
        </div>
        <span className="rounded-md border border-paper-300 bg-paper-0 px-2 py-1 font-mono text-[10px] text-ink-500">
          Elevation Labs · workspace
        </span>
      </header>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ADMIN_KPIS.map((kpi) => {
          const Icon = KPI_ICONS[kpi.key] || FileCheck;
          return (
            <div
              key={kpi.key}
              className="rounded-xl border border-paper-300 bg-paper-0 px-5 py-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-500">
                  {kpi.label}
                </span>
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-paper-100 text-ink-700">
                  <Icon size={12} strokeWidth={2.25} />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-semibold tabular-nums text-ink-900">
                  {kpi.value}
                </span>
                <span className="text-xs text-ink-500">{kpi.unit}</span>
              </div>
              <div
                className={`mt-1 text-[11px] ${DELTA_TONE[kpi.deltaTone] || DELTA_TONE.info}`}
              >
                {kpi.delta}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <div className="flex items-baseline justify-between border-b border-paper-200 px-5 py-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
              Weekly adoption
            </div>
            <div className="mt-0.5 text-[11px] text-ink-500">
              Documents processed per week · last 8 weeks
            </div>
          </div>
          <span className="font-mono text-[11px] tabular-nums text-ink-500">
            Total · {WEEKLY_ADOPTION.reduce((acc, w) => acc + w.docs, 0)} docs
          </span>
        </div>
        <div className="h-56 px-3 py-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={WEEKLY_ADOPTION}
              margin={{ top: 8, right: 16, bottom: 8, left: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#E6E9F0"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="week"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7388', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7388', fontSize: 11 }}
                width={32}
              />
              <Tooltip
                cursor={{ fill: '#F1F3F7' }}
                contentStyle={{
                  borderRadius: 8,
                  border: '1px solid #D5D9E2',
                  fontSize: 12,
                }}
                labelStyle={{ color: '#344055' }}
                formatter={(v) => [`${v} docs`, 'Processed']}
              />
              <Bar
                dataKey="docs"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-xl border border-paper-300 bg-paper-0 shadow-sm">
        <div className="flex items-baseline justify-between border-b border-paper-200 px-5 py-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
              Team roster
            </div>
            <div className="mt-0.5 text-[11px] text-ink-500">
              {TEAM_ROSTER.length} operators · sorted by weekly triage volume
            </div>
          </div>
          <span className="rounded-md bg-paper-100 px-2 py-0.5 font-mono text-[10px] text-ink-500">
            read-only in preview
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-paper-50 text-ink-500">
            <tr>
              <th className="px-5 py-2 font-semibold uppercase tracking-[0.08em] text-[10px]">
                Operator
              </th>
              <th className="px-5 py-2 font-semibold uppercase tracking-[0.08em] text-[10px]">
                Role
              </th>
              <th className="px-5 py-2 font-semibold uppercase tracking-[0.08em] text-[10px]">
                Last active
              </th>
              <th className="px-5 py-2 text-right font-semibold uppercase tracking-[0.08em] text-[10px]">
                Weekly triage
              </th>
            </tr>
          </thead>
          <tbody>
            {TEAM_ROSTER.map((op) => (
              <tr
                key={op.id}
                className="border-t border-paper-200 text-ink-700"
              >
                <td className="px-5 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-paper-100 font-mono text-[10px] font-semibold text-ink-700">
                      {op.name
                        .split(' ')
                        .map((part) => part[0])
                        .slice(0, 2)
                        .join('')}
                    </span>
                    <span className="text-sm font-medium text-ink-900">
                      {op.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-2.5 text-ink-500">{op.role}</td>
                <td className="px-5 py-2.5 font-mono tabular-nums text-ink-500">
                  {op.lastActive}
                </td>
                <td className="px-5 py-2.5 text-right font-mono tabular-nums text-ink-900">
                  {op.weeklyTriage}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {SETTINGS_GROUPS.map((group) => {
          const Icon = SETTINGS_ICONS[group.key] || Database;
          return (
            <div
              key={group.key}
              className="rounded-xl border border-paper-300 bg-paper-0 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-paper-200 px-4 py-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-paper-100 text-ink-700">
                  <Icon size={12} strokeWidth={2.25} />
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-ink-700">
                  {group.title}
                </span>
              </div>
              <ul className="divide-y divide-paper-200 text-xs text-ink-700">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-center justify-between gap-2 px-4 py-2.5"
                  >
                    <span className="truncate">{item}</span>
                    <span className="shrink-0 rounded-md bg-paper-100 px-1.5 py-0.5 font-mono text-[10px] text-ink-500">
                      configured
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

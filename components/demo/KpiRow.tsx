import { KPI_LABELS, UNIT_MINUTES } from "@/content/demo";
import type { DemoKpis } from "@/lib/demo-types";
import { formatCount, formatPercent } from "./format";

export function KpiRow({ kpis }: { kpis: DemoKpis }) {
  const items = [
    { label: KPI_LABELS.todayVolume, value: formatCount(kpis.todayVolume) },
    {
      label: KPI_LABELS.statWithinTarget,
      value: formatPercent(kpis.statWithinTargetPercent),
    },
    {
      label: KPI_LABELS.medianStatTurnaround,
      value: formatCount(kpis.medianStatTurnaroundMinutes),
      unit: UNIT_MINUTES,
    },
    {
      label: KPI_LABELS.volumeTrend,
      value: formatPercent(kpis.volumeTrendPercent, true),
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-7 sm:grid-cols-4 sm:gap-x-8">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 border-t border-rule pt-3">
          <dt className="min-h-8 text-[10px] uppercase leading-4 tracking-[0.14em] text-ink-faint">
            {item.label}
          </dt>
          <dd className="mt-2 font-serif text-[27px] leading-none text-ink sm:text-[32px]">
            <span className="tnum">{item.value}</span>
            {item.unit ? (
              <span className="ml-1.5 font-sans text-[12px] text-ink-faint">
                {item.unit}
              </span>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

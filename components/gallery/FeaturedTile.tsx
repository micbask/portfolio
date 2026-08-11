import Link from "next/link";
import demo from "@/data/demo.json";
import { KPI_LABELS } from "@/content/demo";
import { FEATURED_TILE_CAPTION, OPEN_DEMO, ROUTES } from "@/content/site";
import { formatCount } from "@/lib/format";
import { linePath, linearScale, spread } from "@/lib/geometry";
import type { DemoBundle } from "@/lib/demo-types";

/*
 * A real reading of the committed bundle rather than a picture of one, so the
 * tile and the page it opens can never drift apart.
 */
const bundle = demo as DemoBundle;
const view = bundle.views.all;
const recent = view.daily.slice(-bundle.windowDays);

/*
 * The trailing average rather than the raw daily count: at this size the
 * weekend sawtooth reads as noise instead of as a shape.
 */
const SPARK = { width: 320, height: 68 };
const averages = recent.map((day) => day.movingAverage);
const sparkY = linearScale(
  [Math.min(...averages) * 0.97, Math.max(...averages) * 1.03],
  [SPARK.height - 4, 6],
);
const sparkX = spread(recent.length, 1, SPARK.width - 1);
const sparkline = linePath(recent.map((day, i) => [sparkX[i], sparkY(day.movingAverage)]));
const sparkArea = `${sparkline} L${SPARK.width - 1},${SPARK.height} L1,${SPARK.height} Z`;

const KPIS = [
  { label: KPI_LABELS.todayVolume, value: formatCount(view.kpis.todayVolume) },
  {
    label: KPI_LABELS.statWithinTarget,
    value: `${view.kpis.statWithinTargetPercent.toFixed(1)}%`,
  },
  {
    label: KPI_LABELS.medianStatTurnaround,
    value: `${Math.round(view.kpis.medianStatTurnaroundMinutes)} min`,
  },
];

export function FeaturedTile() {
  return (
    <Link
      href={ROUTES.demo.path}
      className="group block border border-rule bg-surface transition-colors hover:border-ink/25"
    >
      <div className="flex flex-col gap-6 px-5 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-8 sm:py-8">
        <div className="grid grid-cols-3 gap-4 sm:w-[46%] sm:gap-6">
          {KPIS.map((kpi) => (
            <div key={kpi.label}>
              <p className="text-[10px] uppercase leading-tight tracking-[0.1em] text-ink-faint">
                {kpi.label}
              </p>
              <p className="tnum mt-1.5 font-serif text-xl text-ink sm:text-2xl">
                {kpi.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex-1">
          <svg
            viewBox={`0 0 ${SPARK.width} ${SPARK.height}`}
            focusable="false"
            aria-hidden
            preserveAspectRatio="none"
            className="h-16 w-full sm:h-20"
          >
            <path d={sparkArea} className="fill-accent-wash" />
            <path
              d={sparkline}
              fill="none"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="stroke-accent"
            />
          </svg>
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-6 border-t border-rule px-5 py-4 sm:px-8">
        <p className="text-[13px] text-ink sm:text-sm">{FEATURED_TILE_CAPTION}</p>
        <span className="shrink-0 text-[12px] text-ink-muted transition-colors group-hover:text-accent">
          {OPEN_DEMO} →
        </span>
      </div>
    </Link>
  );
}

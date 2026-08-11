import { TABLE_HEADERS, TEST_NAMES, UNIT_MINUTES } from "@/content/demo";
import type { DemoTestRow, TrendDirection } from "@/lib/demo-types";
import { CHART } from "./chart-theme";
import { formatCount, formatPercent } from "./format";

/** Direction mark. The signed figure beside it carries the meaning in text. */
function TrendMark({ direction }: { direction: TrendDirection }) {
  if (direction === "flat") {
    return (
      <svg aria-hidden viewBox="0 0 8 8" className="h-2 w-2">
        <rect x="0" y="3.5" width="8" height="1" fill={CHART.mark} />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 8 8" className="h-2 w-2">
      <path
        d={direction === "up" ? "M4 0.5 L8 7.5 L0 7.5 Z" : "M4 7.5 L0 0.5 L8 0.5 Z"}
        fill={CHART.inkMuted}
      />
    </svg>
  );
}

export function TestTable({ rows }: { rows: readonly DemoTestRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[440px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-rule text-[10px] uppercase tracking-[0.14em] text-ink-faint">
            <th scope="col" className="py-2 pr-4 text-left font-normal">
              {TABLE_HEADERS.test}
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-normal">
              {TABLE_HEADERS.volume}
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-normal">
              {TABLE_HEADERS.medianTurnaround}
            </th>
            <th scope="col" className="py-2 pl-4 text-right font-normal">
              {TABLE_HEADERS.trend}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.index} className="border-b border-rule-soft">
              <th
                scope="row"
                className="py-2.5 pr-4 text-left font-normal text-ink"
              >
                {TEST_NAMES[row.index]}
              </th>
              <td className="tnum py-2.5 pl-4 text-right text-ink">
                {formatCount(row.volume)}
              </td>
              <td className="tnum py-2.5 pl-4 text-right text-ink-muted">
                {formatCount(row.medianTurnaroundMinutes)}
                <span className="ml-1 text-[11px] text-ink-faint">
                  {UNIT_MINUTES}
                </span>
              </td>
              <td className="py-2.5 pl-4 text-right">
                <span className="inline-flex items-center gap-1.5">
                  <TrendMark direction={row.trendDirection} />
                  <span className="tnum text-ink-muted">
                    {formatPercent(row.trendPercent, true)}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

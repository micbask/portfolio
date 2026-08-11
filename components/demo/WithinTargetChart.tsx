"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PRIORITY_SERIES } from "@/content/demo";
import type { DemoDailyPoint } from "@/lib/demo-types";
import { CHART } from "./chart-theme";
import { formatDate, formatPercent } from "./format";
import { percentScale } from "./scale";

const TICK_STRIDE = 7;

export function WithinTargetChart({ days }: { days: readonly DemoDailyPoint[] }) {
  const data = days.map((day) => ({
    date: day.date,
    stat: day.statWithinTargetPercent,
    routine: day.routineWithinTargetPercent,
  }));

  const floor = data.reduce(
    (min, point) => Math.min(min, point.stat, point.routine),
    100,
  );
  const { lower, ticks } = percentScale(floor);

  // Counted back from the most recent day, so the window always ends on a tick.
  const dateTicks = data
    .filter((_, index) => (data.length - 1 - index) % TICK_STRIDE === 0)
    .map((point) => point.date);

  return (
    <div className="h-[220px] w-full overflow-hidden sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={CHART.ruleSoft} vertical={false} />
          <XAxis
            dataKey="date"
            ticks={dateTicks}
            tickFormatter={formatDate}
            tick={{ fill: CHART.inkFaint, fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: CHART.rule }}
            dy={6}
            minTickGap={8}
          />
          <YAxis
            domain={[lower, 100]}
            ticks={ticks}
            tickFormatter={(value: number) => formatPercent(value)}
            tick={{ fill: CHART.inkFaint, fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            isAnimationActive={false}
            cursor={{ stroke: CHART.rule }}
            labelFormatter={(label: unknown) => formatDate(String(label))}
            formatter={(value: unknown) => formatPercent(Number(value))}
            contentStyle={{
              backgroundColor: CHART.surface,
              border: `1px solid ${CHART.rule}`,
              borderRadius: 0,
              boxShadow: "none",
              padding: "8px 10px",
              fontSize: 12,
              fontVariantNumeric: "tabular-nums",
            }}
            labelStyle={{
              color: CHART.inkFaint,
              fontSize: 10,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 4,
            }}
            itemStyle={{ color: CHART.inkMuted, padding: 0 }}
          />
          <Line
            type="monotone"
            dataKey="stat"
            name={PRIORITY_SERIES.stat}
            stroke={CHART.accent}
            strokeWidth={1.75}
            dot={false}
            activeDot={{ r: 2.5, fill: CHART.accent, stroke: "none" }}
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="routine"
            name={PRIORITY_SERIES.routine}
            stroke={CHART.warn}
            strokeWidth={1.75}
            strokeDasharray="4 3"
            dot={false}
            activeDot={{ r: 2.5, fill: CHART.warn, stroke: "none" }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

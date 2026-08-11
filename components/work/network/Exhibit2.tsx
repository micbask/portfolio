"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { COST_CURVE, NETWORK_CAPTIONS, NETWORK_TITLES } from "@/content/network";
import { drawLine, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread, type Point } from "@/lib/geometry";

const W = 960;
const H = 540;
const PLOT = { left: 96, right: 916, top: 56, bottom: 400 };

const y = linearScale([95, 280], [PLOT.bottom, PLOT.top]);
const LEAD = COST_CURVE.series[0];
const xs = spread(LEAD.values.length, PLOT.left, PLOT.right);
const TICKS = [100, 150, 200, 250];

/*
 * The band opens around the leading line alone: nothing at the period the
 * study stops trusting the trend, the full spread by the last period.
 */
const LAST = LEAD.values.length - 1;
const bound = (sign: 1 | -1): Point[] =>
  LEAD.values.slice(COST_CURVE.fanFrom).map((value, step) => {
    const period = COST_CURVE.fanFrom + step;
    const opening = (period - COST_CURVE.fanFrom) / (LAST - COST_CURVE.fanFrom);
    return [xs[period], y(value * (1 + sign * COST_CURVE.fanSpread * opening))];
  });

const FAN = `${linePath([...bound(1), ...bound(-1).reverse()])} Z`;

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 6, duration: 0.4 });
  drawLine(tl, q('[data-el="line"]'), { duration: 1.2, stagger: 0.24, at: "-=0.15" });
  reveal(tl, q('[data-el="fan"]'), { y: 0, duration: 0.55, at: "-=0.35" });
};

export function Exhibit2({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[1]}
      caption={NETWORK_CAPTIONS[1]}
      build={build}
    >
      <div
        data-el="chrome"
        data-anim
        className="mx-auto flex max-w-[860px] flex-wrap items-center gap-x-6 gap-y-1.5 pb-4"
      >
        {COST_CURVE.series.map((series) => (
          <span key={series.label} className="flex items-center gap-2">
            <span
              className={`block h-[3px] w-5 ${series.lead ? "bg-accent" : "bg-mark"}`}
            />
            <span
              className={`text-[12px] ${series.lead ? "text-ink" : "text-ink-muted"}`}
            >
              {series.label}
            </span>
          </span>
        ))}
      </div>

      <ChartCanvas width={W} height={H}>
        <CanvasShapes>
          <g data-el="chrome" data-anim>
            {TICKS.map((tick) => (
              <line
                key={tick}
                x1={PLOT.left}
                x2={PLOT.right}
                y1={y(tick)}
                y2={y(tick)}
                strokeWidth={1}
                className="stroke-rule"
              />
            ))}
          </g>

          <path data-el="fan" data-anim d={FAN} className="fill-accent-wash" />

          {COST_CURVE.series.map((series) => (
            <LinePath
              key={series.label}
              data-el="line"
              d={linePath(series.values.map((value, i) => [xs[i], y(value)]))}
              width={series.lead ? 3 : 2.5}
              className={series.lead ? "stroke-accent" : "stroke-mark"}
            />
          ))}
        </CanvasShapes>

        {TICKS.map((tick) => (
          <CanvasLabel
            key={tick}
            x={PLOT.left - 14}
            y={y(tick)}
            anchor="end"
            dataEl="chrome"
            animate
            className="tnum text-[11px] text-ink-faint"
          >
            {tick}
          </CanvasLabel>
        ))}
      </ChartCanvas>
    </ExhibitSection>
  );
}

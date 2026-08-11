"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, SPEND_CURVE } from "@/content/billing";
import { countTo, drawLine, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread } from "@/lib/geometry";

const W = 960;
const H = 540;
const PLOT = { left: 110, right: 900, top: 60, bottom: 390 };

const y = linearScale([80, 260], [PLOT.bottom, PLOT.top]);
const xs = spread(SPEND_CURVE.periods.length, PLOT.left, PLOT.right);
const TICKS = [100, 150, 200, 250];

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 6, duration: 0.45 });
  drawLine(tl, q('[data-el="line"]'), { duration: 1.5, stagger: 0.28, at: "-=0.15" });
  reveal(tl, q('[data-el="counter"]'), { y: 8, at: "-=0.35" });
  countTo(tl, one('[data-c="fast"]'), { to: SPEND_CURVE.counter.fast, duration: 0.9, at: "<" });
  countTo(tl, one('[data-c="slow"]'), { to: SPEND_CURVE.counter.slow, duration: 0.9, at: "<" });
};

export function Exhibit1({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[0]}
      caption={BILLING_CAPTIONS[0]}
      build={build}
    >
      <div
        data-el="chrome"
        data-anim
        className="mx-auto flex max-w-[860px] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4"
      >
        <span className="text-[11px] text-ink-faint">{SPEND_CURVE.axisLabel}</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          {SPEND_CURVE.series.map((series) => (
            <span key={series.label} className="flex items-center gap-2">
              <span
                className={`block h-[3px] w-5 ${series.lead ? "bg-accent" : "bg-mark"}`}
              />
              <span className={`text-[12px] ${series.lead ? "text-ink" : "text-ink-muted"}`}>
                {series.label}
              </span>
            </span>
          ))}
        </span>
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

          {SPEND_CURVE.series.map((series) => (
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

        {SPEND_CURVE.periods.map((period, i) => (
          <CanvasLabel
            key={period}
            x={xs[i]}
            y={PLOT.bottom + 34}
            dataEl="chrome"
            animate
            className="tnum text-[11px] text-ink-faint"
          >
            {period}
          </CanvasLabel>
        ))}
      </ChartCanvas>

      <p
        data-el="counter"
        data-anim
        className="mt-6 text-center font-serif text-lg text-ink sm:text-xl"
      >
        growing ~<span data-c="fast" className="tnum">{SPEND_CURVE.counter.fast}</span>% vs ~
        <span data-c="slow" className="tnum">{SPEND_CURVE.counter.slow}</span>% a year
      </p>
    </ExhibitSection>
  );
}

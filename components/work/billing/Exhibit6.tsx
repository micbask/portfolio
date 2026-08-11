"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, IMPLEMENTED } from "@/content/billing";
import { drawLine, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread } from "@/lib/geometry";

const W = 960;
const H = 540;
const PLOT = { left: 96, right: 920, top: 60, bottom: 390 };

const y = linearScale([40, 115], [PLOT.bottom, PLOT.top]);
const ALL = [...IMPLEMENTED.before, ...IMPLEMENTED.after];
const xs = spread(ALL.length, PLOT.left, PLOT.right);
const TICKS = [50, 75, 100];
const MONTH_TICKS = [1, 6, 12, 18, 24];
const GO_LIVE_X = (xs[11] + xs[12]) / 2;

const beforePath = linePath(IMPLEMENTED.before.map((value, i) => [xs[i], y(value)]));
/* Starts on the last point before go-live so the drop reads as one series. */
const afterPath = linePath(
  [[xs[11], y(IMPLEMENTED.before[11])] as [number, number]].concat(
    IMPLEMENTED.after.map((value, i) => [xs[i + 12], y(value)] as [number, number]),
  ),
);

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 6, duration: 0.4 });
  drawLine(tl, q('[data-el="line-before"]'), { duration: 1.1, at: "-=0.1" });
  tl.fromTo(
    q('[data-el="go-live"]'),
    { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 0%" },
    { autoAlpha: 1, scaleY: 1, duration: 0.4, ease: "power2.out" },
    "-=0.1",
  );
  reveal(tl, q('[data-el="go-live-label"]'), { y: -6, duration: 0.35, at: "-=0.2" });
  drawLine(tl, q('[data-el="line-after"]'), { duration: 1.2, at: "-=0.1" });
  reveal(tl, q('[data-el="end-counter"]'), { y: 8, duration: 0.5, at: "-=0.3" });
};

export function Exhibit6({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[5]}
      caption={BILLING_CAPTIONS[5]}
      build={build}
    >
      <div
        data-el="chrome"
        data-anim
        className="mx-auto max-w-[860px] pb-3 text-[11px] text-ink-faint"
      >
        {IMPLEMENTED.axisLabel}
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

          <g data-el="go-live" data-anim>
            <line
              x1={GO_LIVE_X}
              x2={GO_LIVE_X}
              y1={PLOT.top - 10}
              y2={PLOT.bottom}
              strokeWidth={2}
              strokeDasharray="7 5"
              className="stroke-ink/35"
            />
          </g>

          <LinePath
            data-el="line-before"
            d={beforePath}
            width={3}
            className="stroke-mark"
          />
          <LinePath
            data-el="line-after"
            d={afterPath}
            width={3}
            className="stroke-accent"
          />
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

        {MONTH_TICKS.map((month) => (
          <CanvasLabel
            key={month}
            x={xs[month - 1]}
            y={PLOT.bottom + 34}
            dataEl="chrome"
            animate
            className="tnum text-[11px] text-ink-faint"
          >
            {month}
          </CanvasLabel>
        ))}

        <CanvasLabel
          x={GO_LIVE_X}
          y={PLOT.top - 30}
          dataEl="go-live-label"
          animate
          className="text-[11px] uppercase tracking-[0.12em] text-ink-muted"
        >
          {IMPLEMENTED.goLiveLabel}
        </CanvasLabel>
      </ChartCanvas>

      <p
        data-el="end-counter"
        data-anim
        className="mt-6 text-center font-serif text-lg text-ink sm:text-xl"
      >
        {IMPLEMENTED.endCounter}
      </p>
    </ExhibitSection>
  );
}

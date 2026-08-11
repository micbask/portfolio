"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { NETWORK_CAPTIONS, NETWORK_TITLES, PAYOFF } from "@/content/network";
import { countTo, drawLine, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread, type Point } from "@/lib/geometry";

const W = 960;
const H = 520;
const PLOT = { left: 76, right: 920, top: 56, bottom: 400 };
const PERIODS = 10;

const y = linearScale([0, 160], [PLOT.bottom, PLOT.top]);
const xs = spread(PERIODS + 1, PLOT.left, PLOT.right);
const TICKS = [0, 50, 100, 150];

/*
 * Only the closing values are fixed by the study. The path to them is a mild
 * accelerating curve, chosen so the scenarios stay apart as the fan widens.
 */
const curve = (final: number): Point[] =>
  Array.from({ length: PERIODS + 1 }, (_, period) => [
    xs[period],
    y(final * (period / PERIODS) ** 1.15),
  ]);

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 6, duration: 0.4 });
  drawLine(tl, q('[data-el="fan-line"]'), {
    duration: 1,
    stagger: 0.07,
    at: "-=0.15",
  });
  drawLine(tl, q('[data-el="base-line"]'), { duration: 1, at: "-=0.85" });
  reveal(tl, q('[data-el="counter"]'), { y: 8, duration: 0.45, at: "-=0.5" });
  countTo(tl, one('[data-c="payoff"]'), {
    to: PAYOFF.counter.value,
    from: 0,
    duration: 1,
    at: "<",
  });
  reveal(tl, q('[data-el="magnitude"]'), { y: 8, duration: 0.45, at: "-=0.5" });
};

export function Exhibit6({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[5]}
      caption={NETWORK_CAPTIONS[5]}
      build={build}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        <div className="min-w-0 flex-1">
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

              {PAYOFF.finals.map((final) =>
                final === PAYOFF.baseCase ? null : (
                  <LinePath
                    key={final}
                    data-el="fan-line"
                    d={linePath(curve(final))}
                    width={1.75}
                    className="stroke-accent-soft"
                  />
                ),
              )}

              <LinePath
                data-el="base-line"
                d={linePath(curve(PAYOFF.baseCase))}
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
          </ChartCanvas>
        </div>

        <div className="shrink-0 border-t border-rule pt-5 sm:w-[220px] sm:border-l sm:border-t-0 sm:pl-7 sm:pt-0">
          <p data-el="counter" data-anim className="font-serif text-lg text-ink sm:text-xl">
            {PAYOFF.counter.prefix}
            <span data-c="payoff" className="tnum text-accent">
              {PAYOFF.counter.value}
            </span>
            %
          </p>
          <p
            data-el="magnitude"
            data-anim
            className="mt-3 text-[12px] text-ink-muted sm:text-[13px]"
          >
            {PAYOFF.magnitude}
          </p>
        </div>
      </div>
    </ExhibitSection>
  );
}

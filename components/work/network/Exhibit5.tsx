"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { NETWORK_CAPTIONS, NETWORK_TITLES, RAMP } from "@/content/network";
import { drawLine, growBar, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread, type Point } from "@/lib/geometry";

const W = 960;
const H = 520;
const PLOT = { left: 86, right: 920, top: 56, bottom: 400 };

const y = linearScale([0, 100], [PLOT.bottom, PLOT.top]);
const xs = spread(RAMP.low.length, PLOT.left, PLOT.right);
const TICKS = [0, 25, 50, 75, 100];
const LAST = xs.length - 1;

const LOW: Point[] = RAMP.low.map((value, i) => [xs[i], y(value)]);
const HIGH: Point[] = RAMP.high.map((value, i) => [xs[i], y(value)]);

/* Everything under the low bound has already moved; the band above it is the
 * part the capacity triggers decide. The remainder above is left open. */
const SOLID = `${linePath([...LOW, [xs[LAST], y(0)], [xs[0], y(0)]])} Z`;
const BAND = `${linePath([...LOW, ...HIGH.slice().reverse()])} Z`;

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 6, duration: 0.4 });
  drawLine(tl, q('[data-el="edge"]'), { duration: 1, stagger: 0.18, at: "-=0.15" });
  growBar(tl, q('[data-el="solid"]'), {
    axis: "y",
    origin: "50% 100%",
    duration: 0.7,
    at: "-=0.75",
  });
  reveal(tl, q('[data-el="band"]'), { y: 0, duration: 0.55, at: "-=0.3" });
  reveal(tl, q('[data-el="band-label"]'), { y: 6, duration: 0.4, at: "-=0.3" });
};

export function Exhibit5({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[4]}
      caption={NETWORK_CAPTIONS[4]}
      build={build}
    >
      <div className="mx-auto max-w-[860px] pb-4">
        <span data-el="band-label" data-anim className="flex items-center gap-2">
          <span aria-hidden className="block h-3 w-5 shrink-0 bg-accent-soft" />
          <span className="text-[12px] text-ink-muted">{RAMP.bandLabel}</span>
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

          <g data-el="solid" data-anim>
            <path d={SOLID} className="fill-accent" />
          </g>

          <path data-el="band" data-anim d={BAND} className="fill-accent-soft" />

          <LinePath
            data-el="edge"
            d={linePath(LOW)}
            width={2.5}
            className="stroke-accent"
          />
          <LinePath
            data-el="edge"
            d={linePath(HIGH)}
            width={2}
            className="stroke-accent-mid"
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
    </ExhibitSection>
  );
}

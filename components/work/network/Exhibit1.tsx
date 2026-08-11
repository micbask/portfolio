"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { NETWORK_CAPTIONS, NETWORK_NODES, NETWORK_TITLES } from "@/content/network";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

const W = 960;
const H = 300;
const BASE = 240; // the line every node rests on
const MAX_RADIUS = 92;
const GAP = 34;

/*
 * Sized by area, not by width: the radius carries the square root of the
 * volume, so a node twice the size covers twice the ink.
 */
const LARGEST = Math.max(...NETWORK_NODES.volumes);
const RADII = NETWORK_NODES.volumes.map(
  (volume) => MAX_RADIUS * Math.sqrt(volume / LARGEST),
);
const SPAN =
  RADII.reduce((sum, radius) => sum + 2 * radius, 0) + GAP * (RADII.length - 1);
const START = (W - SPAN) / 2;

const CENTERS = RADII.map((radius, index) => {
  const before = RADII.slice(0, index).reduce(
    (sum, previous) => sum + 2 * previous + GAP,
    0,
  );
  return START + before + radius;
});

const millions = (value: number) =>
  `${value >= 1 ? value.toFixed(1) : value.toFixed(2)}M`;

/* The growth line is one sentence in the content file, split around its own
 * number so the counter can run inside it without inventing any words. */
const [GROWTH_BEFORE, GROWTH_AFTER] = NETWORK_NODES.growth.text.split(
  String(NETWORK_NODES.growth.value),
);

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="base"]'), { y: 0, duration: 0.35 });
  tl.fromTo(
    q('[data-el="node"]'),
    { autoAlpha: 1, scale: 0, transformOrigin: "50% 100%" },
    { scale: 1, duration: 0.55, stagger: 0.1, ease: "power2.out" },
    "-=0.15",
  );
  reveal(tl, q('[data-el="node-value"]'), {
    y: 6,
    stagger: 0.1,
    duration: 0.35,
    at: "<+=0.3",
  });
  reveal(tl, q('[data-el="total"]'), { y: 8, duration: 0.45, at: "-=0.2" });
  reveal(tl, q('[data-el="growth"]'), { y: 8, duration: 0.45, at: "-=0.3" });
  countTo(tl, one('[data-c="growth"]'), {
    to: NETWORK_NODES.growth.value,
    duration: 1,
    format: (value) => value.toFixed(1),
    at: "<",
  });
};

export function Exhibit1({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[0]}
      caption={NETWORK_CAPTIONS[0]}
      build={build}
    >
      <ChartCanvas width={W} height={H}>
        <CanvasShapes>
          <line
            data-el="base"
            data-anim
            x1={START - 18}
            x2={START + SPAN + 18}
            y1={BASE}
            y2={BASE}
            strokeWidth={1}
            className="stroke-rule"
          />

          {NETWORK_NODES.volumes.map((volume, node) => (
            <circle
              key={volume}
              data-el="node"
              data-anim
              cx={CENTERS[node]}
              cy={BASE - RADII[node]}
              r={RADII[node]}
              className="fill-accent-soft"
            />
          ))}
        </CanvasShapes>

        {NETWORK_NODES.volumes.map((volume, node) => (
          <CanvasLabel
            key={volume}
            x={CENTERS[node]}
            y={BASE + 30}
            dataEl="node-value"
            animate
            className="tnum text-[12px] text-ink sm:text-[13px]"
          >
            {millions(volume)}
          </CanvasLabel>
        ))}
      </ChartCanvas>

      <div className="mt-7 flex flex-wrap items-baseline justify-center gap-x-10 gap-y-2 text-center">
        <p data-el="total" data-anim className="font-serif text-lg text-ink sm:text-2xl">
          {NETWORK_NODES.total}
        </p>
        <p
          data-el="growth"
          data-anim
          className="font-serif text-lg text-ink-muted sm:text-xl"
        >
          {GROWTH_BEFORE}
          <span data-c="growth" className="tnum text-accent">
            {NETWORK_NODES.growth.value.toFixed(1)}
          </span>
          {GROWTH_AFTER}
        </p>
      </div>
    </ExhibitSection>
  );
}

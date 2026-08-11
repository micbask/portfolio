"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { Bar } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, COLLECTIONS } from "@/content/billing";
import { growBar, reveal, type BuildFn } from "@/lib/anim";
import { linearScale } from "@/lib/geometry";

const W = 960;
const H = 520;
const BASE = 400;
const y = linearScale([0, 60], [BASE, 70]);
const BAR_W = 80;
const NET_X = 776;

const GROUPS = [
  { ...COLLECTIONS.groups[0], invoicedX: 196, collectedX: 292 },
  { ...COLLECTIONS.groups[1], invoicedX: 456, collectedX: 552 },
];

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="chrome"]'), { y: 4, duration: 0.4 });
  growBar(tl, q('[data-el="bar"]'), { axis: "y", stagger: 0.1, duration: 0.75, at: "-=0.15" });
  reveal(tl, q('[data-el="bar-value"]'), { y: 8, stagger: 0.1, at: "<+=0.3" });
  reveal(tl, q('[data-el="gap"]'), { y: 0, duration: 0.6, stagger: 0.12, at: "-=0.1" });
  growBar(tl, q('[data-el="net-bar"]'), { axis: "y", duration: 0.8, at: "-=0.25" });
  reveal(tl, q('[data-el="net-value"]'), { y: 8, at: "-=0.45" });
};

export function Exhibit3({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[2]}
      caption={BILLING_CAPTIONS[2]}
      build={build}
    >
      <div
        data-el="chrome"
        data-anim
        className="mx-auto flex max-w-[860px] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-4"
      >
        <span className="text-[11px] text-ink-faint">{COLLECTIONS.axisLabel}</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
          <span className="flex items-center gap-2">
            <span className="block h-3 w-3 bg-mark-soft" />
            <span className="text-[12px] text-ink-muted">
              {COLLECTIONS.seriesLabels.invoiced}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <span className="block h-3 w-3 bg-accent" />
            <span className="text-[12px] text-ink-muted">
              {COLLECTIONS.seriesLabels.collected}
            </span>
          </span>
        </span>
      </div>

      <ChartCanvas width={W} height={H}>
        <CanvasShapes>
          <g data-el="chrome" data-anim>
            <line
              x1={150}
              x2={900}
              y1={BASE}
              y2={BASE}
              strokeWidth={1}
              className="stroke-rule"
            />
          </g>

          {GROUPS.map((group) => (
            <g key={group.label}>
              <Bar
                data-el="bar"
                x={group.invoicedX}
                y={y(group.invoiced)}
                width={BAR_W}
                height={BASE - y(group.invoiced)}
                className="fill-mark-soft"
              />
              <Bar
                data-el="bar"
                x={group.collectedX}
                y={y(group.collected)}
                width={BAR_W}
                height={BASE - y(group.collected)}
                className="fill-accent"
              />
              {/* What the invoice asked for and the collection never covered. */}
              <g data-el="gap" data-anim>
                <rect
                  x={group.collectedX}
                  y={y(group.invoiced)}
                  width={BAR_W}
                  height={y(group.collected) - y(group.invoiced)}
                  className="fill-accent-wash"
                />
                <line
                  x1={group.collectedX}
                  x2={group.collectedX + BAR_W}
                  y1={y(group.invoiced)}
                  y2={y(group.invoiced)}
                  strokeWidth={2}
                  strokeDasharray="6 4"
                  className="stroke-accent-mid"
                />
              </g>
            </g>
          ))}

          {/* The two shortfalls, carried across and added together. */}
          <Bar
            data-el="net-bar"
            x={NET_X}
            y={y(COLLECTIONS.netGap)}
            width={BAR_W}
            height={BASE - y(COLLECTIONS.netGap)}
            className="fill-accent-wash"
          />
          <line
            data-el="net-bar"
            x1={NET_X}
            x2={NET_X + BAR_W}
            y1={y(COLLECTIONS.netGap)}
            y2={y(COLLECTIONS.netGap)}
            strokeWidth={2}
            className="stroke-accent-mid"
          />
        </CanvasShapes>

        {GROUPS.map((group) => (
          <CanvasLabel
            key={`${group.label}-name`}
            x={group.invoicedX + BAR_W + 8}
            y={BASE + 30}
            dataEl="chrome"
            animate
            className="text-[12px] text-ink sm:text-[13px]"
          >
            {group.label}
          </CanvasLabel>
        ))}

        {GROUPS.flatMap((group) => [
          <CanvasLabel
            key={`${group.label}-invoiced`}
            x={group.invoicedX + BAR_W / 2}
            y={y(group.invoiced) - 20}
            dataEl="bar-value"
            animate
            className="tnum text-[12px] text-ink-muted"
          >
            {group.invoiced}
          </CanvasLabel>,
          <CanvasLabel
            key={`${group.label}-collected`}
            x={group.collectedX + BAR_W / 2}
            y={y(group.collected) - 20}
            dataEl="bar-value"
            animate
            className="tnum text-[12px] text-ink"
          >
            {group.collected}
          </CanvasLabel>,
        ])}

        <CanvasLabel
          x={NET_X + BAR_W / 2}
          y={y(COLLECTIONS.netGap) - 20}
          dataEl="net-value"
          animate
          className="tnum text-[13px] text-accent"
        >
          {COLLECTIONS.netGap}
        </CanvasLabel>
      </ChartCanvas>
    </ExhibitSection>
  );
}

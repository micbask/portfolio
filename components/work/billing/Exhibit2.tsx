"use client";

import { scaleLog } from "d3-scale";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, UNIT_ECONOMICS } from "@/content/billing";
import { growBar, reveal, type BuildFn } from "@/lib/anim";
import { formatCount } from "@/lib/format";

const SHARE_FULL = 35; // percent of spend that fills the bar track
const costScale = scaleLog().domain([35, 2300]).range([0, 100]);
const money = (value: number) => `$${formatCount(value)}`;

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="row-label"]'), { x: -6, y: 0, stagger: 0.06, duration: 0.4 });
  growBar(tl, q('[data-el="share-bar"]'), { stagger: 0.08, duration: 0.7, at: "-=0.25" });
  reveal(tl, q('[data-el="share-value"]'), { x: -6, y: 0, stagger: 0.08, at: "<+=0.25" });
  reveal(tl, q('[data-el="cost-axis"]'), { y: 4, duration: 0.4, at: "-=0.2" });
  tl.fromTo(
    q('[data-el="cost-dot"]'),
    { autoAlpha: 0, scale: 0 },
    { autoAlpha: 1, scale: 1, duration: 0.5, stagger: 0.07, ease: "back.out(2)" },
    "-=0.05",
  );
  reveal(tl, q('[data-el="cost-value"]'), { y: 0, x: -6, stagger: 0.07, at: "<+=0.15" });
};

export function Exhibit2({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[1]}
      caption={BILLING_CAPTIONS[1]}
      build={build}
    >
      <div className="grid grid-cols-[3.2rem_1fr_2.6rem] items-center gap-x-3 gap-y-2 sm:grid-cols-[3.5rem_1fr_2.8rem_1.15fr] sm:gap-x-4 sm:gap-y-3">
        <div className="col-span-3 hidden sm:block" />
        <div data-el="cost-axis" data-anim className="col-span-3 relative h-4 sm:col-span-1">
          {UNIT_ECONOMICS.costTicks.map((tick) => (
            <span
              key={tick}
              className="tnum absolute bottom-0 -translate-x-1/2 text-[10px] text-ink-faint"
              style={{ left: `${costScale(tick)}%` }}
            >
              {money(tick)}
            </span>
          ))}
        </div>

        {UNIT_ECONOMICS.rows.map((row) => {
          const position = costScale(row.costPerTest);
          const labelLeft = position > 62;
          return (
            <Row
              key={row.label}
              label={row.label}
              share={row.share}
              position={position}
              cost={money(row.costPerTest)}
              labelLeft={labelLeft}
            />
          );
        })}
      </div>
    </ExhibitSection>
  );
}

function Row({
  label,
  share,
  position,
  cost,
  labelLeft,
}: {
  label: string;
  share: number;
  position: number;
  cost: string;
  labelLeft: boolean;
}) {
  return (
    <>
      <span
        data-el="row-label"
        data-anim
        className="text-right text-[12px] text-ink sm:text-[13px]"
      >
        {label}
      </span>

      <span className="relative block h-4 bg-rule-soft">
        <span
          data-el="share-bar"
          data-anim
          className="absolute inset-y-0 left-0 block bg-accent-soft"
          style={{ width: `${(share / SHARE_FULL) * 100}%` }}
        />
      </span>

      <span
        data-el="share-value"
        data-anim
        className="tnum text-right text-[12px] text-ink-muted"
      >
        {share}%
      </span>

      <span className="col-span-3 relative block h-5 border-t border-rule/70 sm:col-span-1 sm:h-4 sm:border-t-0">
        <span
          className="absolute top-1/2 block -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${position}%` }}
        >
          <span
            data-el="cost-dot"
            data-anim
            className="block h-[11px] w-[11px] rounded-full bg-accent"
          />
        </span>
        <span
          className="absolute top-1/2 block -translate-y-1/2"
          style={{
            left: labelLeft ? undefined : `calc(${position}% + 14px)`,
            right: labelLeft ? `calc(${100 - position}% + 14px)` : undefined,
          }}
        >
          <span
            data-el="cost-value"
            data-anim
            className="tnum block text-[12px] text-ink sm:text-[13px]"
          >
            {cost}
          </span>
        </span>
      </span>
    </>
  );
}

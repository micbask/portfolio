"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  IDLE_CAPACITY,
} from "@/content/consolidation";
import { growBar, reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="site-heading"]'), { y: 6, stagger: 0.1, duration: 0.4 });
  reveal(tl, q('[data-el="line-label"]'), { x: -6, y: 0, stagger: 0.05, duration: 0.35, at: "-=0.2" });
  growBar(tl, q('[data-el="use-bar"]'), { stagger: 0.06, duration: 0.65, at: "-=0.3" });
  reveal(tl, q('[data-el="use-value"]'), { x: -5, y: 0, stagger: 0.06, duration: 0.3, at: "<+=0.25" });
};

export function Exhibit2({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[1]}
      caption={CONSOLIDATION_CAPTIONS[1]}
      build={build}
    >
      <div className="grid gap-7 sm:grid-cols-2 sm:gap-12">
        {IDLE_CAPACITY.map((group) => (
          <div key={group.site}>
            <p
              data-el="site-heading"
              data-anim
              className="border-b border-rule pb-2 text-[11px] uppercase tracking-[0.14em] text-ink"
            >
              {group.site}
            </p>

            <div className="mt-3.5 grid grid-cols-[7.2rem_1fr_2.4rem] items-center gap-x-3 gap-y-2.5 sm:gap-y-3">
              {group.lines.map((line) => (
                <Row key={line.label} label={line.label} value={line.value} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </ExhibitSection>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  const idle = value === 0;
  return (
    <>
      <span
        data-el="line-label"
        data-anim
        className="text-[12px] leading-tight text-ink-muted sm:text-[13px]"
      >
        {label}
      </span>

      <span className="relative block h-3.5 bg-rule-soft">
        <span
          data-el="use-bar"
          data-anim
          className="absolute inset-y-0 left-0 block bg-accent-soft"
          style={{ width: `${value}%` }}
        />
      </span>

      <span
        data-el="use-value"
        data-anim
        className={`tnum text-right text-[12px] ${idle ? "text-warn" : "text-ink-muted"}`}
      >
        {value}%
      </span>
    </>
  );
}

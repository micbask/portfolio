"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  UTILIZATION,
} from "@/content/consolidation";
import { growBar, reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="pair-label"]'), { y: 6, stagger: 0.12, duration: 0.4 });
  growBar(tl, q('[data-el="use-bar"]'), { axis: "y", stagger: 0.14, duration: 0.85, at: "-=0.2" });
  reveal(tl, q('[data-el="use-value"]'), { y: 8, stagger: 0.14, duration: 0.35, at: "<+=0.4" });
  tl.fromTo(
    q('[data-el="rise"]'),
    { autoAlpha: 0, x: -8 },
    { autoAlpha: 1, x: 0, duration: 0.35, stagger: 0.12, ease: "power2.out" },
    "-=0.3",
  );
};

export function Exhibit5({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[4]}
      caption={CONSOLIDATION_CAPTIONS[4]}
      build={build}
    >
      <div className="mx-auto max-w-[560px]">
        <div className="flex h-[186px] items-end justify-center gap-12 border-b border-rule sm:h-[250px] sm:gap-20">
          {UTILIZATION.map((pair) => (
            <div key={pair.label} className="flex h-full items-end gap-3 sm:gap-4">
              <Column value={pair.before} tone="bg-mark-soft" />
              <span
                data-el="rise"
                data-anim
                aria-hidden
                className="mb-8 block shrink-0 text-ink-faint sm:mb-12"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" focusable="false">
                  <path
                    d="M2 8 h9 M8 4.5 L11.5 8 L8 11.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <Column value={pair.after} tone="bg-accent" />
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-center gap-12 sm:gap-20">
          {UTILIZATION.map((pair) => (
            <span
              key={pair.label}
              data-el="pair-label"
              data-anim
              className="w-[132px] text-center text-[12px] text-ink sm:w-[168px] sm:text-[13px]"
            >
              {pair.label}
            </span>
          ))}
        </div>
      </div>
    </ExhibitSection>
  );
}

function Column({ value, tone }: { value: number; tone: string }) {
  return (
    <div className="relative flex h-full w-14 justify-center sm:w-[68px]">
      <span
        data-el="use-value"
        data-anim
        className="tnum absolute inset-x-0 text-center text-[12px] text-ink-muted"
        style={{ bottom: `calc(${value}% + 8px)` }}
      >
        {value}%
      </span>
      <span
        data-el="use-bar"
        data-anim
        className={`absolute bottom-0 block w-full ${tone}`}
        style={{ height: `${value}%` }}
      />
    </div>
  );
}

"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { INSOURCING_CAPTIONS, INSOURCING_TITLES, SCENARIOS } from "@/content/insourcing";
import { growBar, reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="zero-line"]'), { y: 0, duration: 0.35 });
  growBar(tl, q('[data-el="scenario-bar"]'), {
    axis: "y",
    stagger: 0.09,
    duration: 0.7,
    at: "-=0.15",
  });
  reveal(tl, q('[data-el="scenario-value"]'), { y: 8, stagger: 0.09, duration: 0.35, at: "<+=0.3" });
  reveal(tl, q('[data-el="scenario-note"]'), { y: 8, duration: 0.45, at: "-=0.15" });
  reveal(tl, q('[data-el="status"]'), { y: 0, duration: 0.4, at: "-=0.25" });
};

export function Exhibit6({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[5]}
      caption={INSOURCING_CAPTIONS[5]}
      build={build}
    >
      <div className="mx-auto max-w-[640px]">
        <div className="flex h-[180px] items-end justify-center gap-9 sm:h-[240px] sm:gap-14">
          {SCENARIOS.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex h-full items-end gap-2 sm:gap-3">
              {group.values.map((value, barIndex) => (
                <div
                  key={barIndex}
                  className="relative flex h-full w-9 justify-center sm:w-12"
                >
                  <span
                    data-el="scenario-value"
                    data-anim
                    className="tnum absolute inset-x-0 text-center text-[11px] text-ink-muted"
                    style={{ bottom: `calc(${value}% + 8px)` }}
                  >
                    {value}
                  </span>
                  <span
                    data-el="scenario-bar"
                    data-anim
                    className={`absolute bottom-0 block w-full ${
                      barIndex === 0 ? "bg-accent" : "bg-accent-soft"
                    }`}
                    style={{ height: `${value}%` }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div data-el="zero-line" data-anim className="h-px w-full bg-ink/30" />

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p data-el="scenario-note" data-anim className="font-serif text-lg text-ink sm:text-xl">
            {SCENARIOS.note}
          </p>
          <span
            data-el="status"
            data-anim
            className="border border-accent-mid/60 px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-accent"
          >
            {SCENARIOS.status}
          </span>
        </div>
      </div>
    </ExhibitSection>
  );
}

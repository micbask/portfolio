"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  PHASES,
} from "@/content/consolidation";
import { reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="phase"]'), { y: 8, stagger: 0.1, duration: 0.4 });

  /* A short, finite pulse marks where the work has reached. Nothing on this
   * site animates on forever. */
  tl.fromTo(
    q('[data-el="phase-active"]'),
    { autoAlpha: 1, scale: 1 },
    {
      scale: 1.025,
      duration: 0.55,
      yoyo: true,
      repeat: 3,
      ease: "sine.inOut",
      transformOrigin: "50% 50%",
    },
    "-=0.15",
  );

  reveal(tl, q('[data-el="closing-stat"]'), { y: 8, duration: 0.5, at: "-=1.4" });
};

export function Exhibit6({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[5]}
      caption={CONSOLIDATION_CAPTIONS[5]}
      build={build}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-0">
        {PHASES.steps.map((step, stepIndex) => {
          const active = stepIndex === PHASES.activeIndex;
          return (
            <div
              key={step}
              data-el="phase"
              data-anim
              className={`relative flex-1 sm:-ml-px sm:first:ml-0 ${active ? "z-10" : ""}`}
            >
              <div
                {...(active ? { "data-el": "phase-active", "data-anim": "" } : {})}
                className={`flex h-full items-center px-4 py-3.5 text-[12px] leading-snug sm:justify-center sm:py-4 sm:text-center sm:text-[13px] ${
                  active
                    ? "border border-accent bg-accent-wash text-ink"
                    : "border border-rule bg-surface text-ink-muted"
                }`}
              >
                {step}
              </div>
            </div>
          );
        })}
      </div>

      <p
        data-el="closing-stat"
        data-anim
        className="mt-8 font-serif text-base text-ink sm:text-xl"
      >
        {PHASES.closingStat}
      </p>
    </ExhibitSection>
  );
}

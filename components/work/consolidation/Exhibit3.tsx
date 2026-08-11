"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  SORTING,
} from "@/content/consolidation";
import { reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="panel"]'), { y: 10, stagger: 0.12, duration: 0.45 });

  /* The chips arrive from the middle, so the eye reads them as being sorted
   * out of one shared pile rather than as having always sat where they land. */
  tl.fromTo(
    q('[data-el="chip-left"]'),
    { autoAlpha: 0, x: 34, y: -14, scale: 0.9 },
    { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "power2.out" },
    "-=0.2",
  );
  tl.fromTo(
    q('[data-el="chip-right"]'),
    { autoAlpha: 0, x: -34, y: -14, scale: 0.9 },
    { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: "power2.out" },
    "<+=0.1",
  );

  reveal(tl, q('[data-el="courier"]'), { y: 0, duration: 0.4, at: "-=0.25" });
  tl.fromTo(
    q('[data-el="courier-dot"]'),
    { autoAlpha: 1, xPercent: 0 },
    {
      xPercent: 620,
      duration: 0.95,
      ease: "power1.inOut",
      yoyo: true,
      repeat: 1,
    },
    "-=0.15",
  );
  reveal(tl, q('[data-el="courier-tag"]'), { y: 6, duration: 0.4, at: "-=0.7" });
};

export function Exhibit3({ index }: { index: number }) {
  const [core, specialty] = SORTING.destinations;

  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[2]}
      caption={CONSOLIDATION_CAPTIONS[2]}
      build={build}
    >
      <div className="flex flex-col items-stretch gap-4 sm:flex-row sm:items-stretch sm:gap-5">
        <Panel destination={core} chipEl="chip-left" />

        <div className="flex shrink-0 flex-col items-center justify-center gap-2 sm:w-[22%]">
          <span
            data-el="courier"
            data-anim
            aria-hidden
            className="relative block h-4 w-full max-w-[140px] sm:max-w-none"
          >
            <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-rule" />
            <span
              data-el="courier-dot"
              data-anim
              className="absolute left-0 top-1/2 block h-2 w-2 -translate-y-1/2 rounded-full bg-accent"
              style={{ willChange: "transform" }}
            />
          </span>
          <span
            data-el="courier-tag"
            data-anim
            className="text-center text-[11px] leading-tight text-ink-faint"
          >
            {SORTING.courierTag}
          </span>
        </div>

        <Panel destination={specialty} chipEl="chip-right" />
      </div>
    </ExhibitSection>
  );
}

function Panel({
  destination,
  chipEl,
}: {
  destination: (typeof SORTING.destinations)[number];
  chipEl: string;
}) {
  return (
    <div
      data-el="panel"
      data-anim
      className="flex-1 border border-rule bg-surface px-4 py-4 sm:px-5 sm:py-5"
    >
      <p className="text-[11px] uppercase tracking-[0.14em] text-ink">{destination.site}</p>
      <p className="mt-1 text-[12px] text-ink-muted sm:text-[13px]">{destination.role}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {destination.chips.map((chip) => (
          <span
            key={chip}
            data-el={chipEl}
            data-anim
            className="border border-accent-soft bg-accent-wash/70 px-2.5 py-1 text-[12px] text-ink"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

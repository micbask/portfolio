"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { NETWORK_CAPTIONS, NETWORK_TITLES, SCORER } from "@/content/network";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

const TONES = ["bg-accent-mid", "bg-accent"];

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="source"]'), { y: 0, duration: 0.3 });
  reveal(tl, q('[data-el="criterion"]'), {
    y: 6,
    stagger: 0.09,
    duration: 0.32,
    at: "-=0.12",
  });

  tl.fromTo(
    q('[data-el="stem"]'),
    { autoAlpha: 1, scaleY: 0, transformOrigin: "50% 0%" },
    { scaleY: 1, duration: 0.28, ease: "power2.out" },
    "-=0.1",
  );
  reveal(tl, q('[data-el="destination"]'), {
    y: 8,
    stagger: 0.1,
    duration: 0.35,
    at: "-=0.12",
  });

  /*
   * Every test in the menu, scored and sent. Flat squares moved by transform
   * and opacity alone, so each one composites on its own.
   */
  tl.fromTo(
    q('[data-el="chip"]'),
    { autoAlpha: 0, scale: 0.5, x: -12, y: -10 },
    {
      autoAlpha: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.32,
      stagger: 0.008,
      ease: "power2.out",
    },
    "-=0.15",
  );

  reveal(tl, q('[data-el="tally"]'), {
    y: 6,
    stagger: 0.08,
    duration: 0.35,
    at: "<+=0.1",
  });
  SCORER.destinations.forEach((destination) => {
    countTo(tl, one(`[data-c="${destination.key}"]`), {
      to: destination.chips,
      duration: 0.9,
      at: "<+=0.06",
    });
  });

  reveal(tl, q('[data-el="callout"]'), { y: 6, duration: 0.4, at: "-=0.25" });
};

function ChipTray({ count, tone }: { count: number; tone: string }) {
  return (
    <div className="mt-3 flex max-w-[260px] flex-wrap gap-[3px]" aria-hidden>
      {Array.from({ length: count }, (_, chip) => (
        <span
          key={chip}
          data-el="chip"
          data-anim
          className={`block h-[6px] w-[6px] ${tone}`}
          style={{ willChange: "transform, opacity" }}
        />
      ))}
    </div>
  );
}

export function Exhibit4({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[3]}
      caption={NETWORK_CAPTIONS[3]}
      build={build}
    >
      <div className="mx-auto max-w-[720px]">
        <div
          data-el="source"
          data-anim
          className="flex h-7 w-7 items-center justify-center border border-rule bg-surface"
        >
          <span aria-hidden className="block h-[9px] w-[9px] bg-accent" />
        </div>

        <div className="mt-3 flex flex-wrap gap-2 border border-rule bg-surface px-3 py-3">
          {SCORER.criteria.map((criterion) => (
            <span
              key={criterion}
              data-el="criterion"
              data-anim
              className="inline-block border border-ink/15 bg-surface px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-ink"
            >
              {criterion}
            </span>
          ))}
        </div>

        <span
          data-el="stem"
          data-anim
          aria-hidden
          className="ml-4 block h-6 w-px bg-rule"
        />

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SCORER.destinations.map((destination, destinationIndex) => (
            <div
              key={destination.key}
              data-el="destination"
              data-anim
              className="flex flex-col border border-rule bg-surface px-3 py-3"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-[12px] leading-snug text-ink sm:text-[13px]">
                  {destination.label}
                </p>
                <span
                  data-el="tally"
                  data-anim
                  className="tnum shrink-0 font-serif text-lg leading-none text-accent"
                >
                  <span data-c={destination.key}>{destination.chips}</span>
                </span>
              </div>

              <ChipTray count={destination.chips} tone={TONES[destinationIndex]} />

              {"callout" in destination ? (
                <p
                  data-el="callout"
                  data-anim
                  className="mt-auto border-t border-rule pt-3 font-serif text-base text-ink sm:text-lg"
                >
                  {destination.callout}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </ExhibitSection>
  );
}

"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { INSOURCING_CAPTIONS, INSOURCING_TITLES, REVENUE_UNLOCKED } from "@/content/insourcing";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

const START_FRACTION = REVENUE_UNLOCKED.from / REVENUE_UNLOCKED.to;

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="track"]'), { y: 0, duration: 0.4 });
  reveal(tl, q('[data-el="start-mark"]'), { y: 0, duration: 0.35, at: "-=0.2" });

  tl.fromTo(
    q('[data-el="revenue-bar"]'),
    { autoAlpha: 1, scaleX: START_FRACTION, transformOrigin: "0% 50%" },
    { scaleX: 1, duration: 1.5, ease: "power2.inOut" },
    "-=0.05",
  );
  reveal(tl, q('[data-el="multiple"]'), { y: 8, duration: 0.4, at: "<" });
  countTo(tl, one('[data-c="multiple"]'), {
    to: REVENUE_UNLOCKED.to,
    from: REVENUE_UNLOCKED.from,
    duration: 1.5,
    ease: "power2.inOut",
    at: "<",
  });

  /* The split is laid over the finished bar, never inside the scaled one. */
  reveal(tl, q('[data-el="split"]'), { y: 0, duration: 0.6, at: "-=0.15" });
  reveal(tl, q('[data-el="split-label"]'), { y: 6, stagger: 0.12, duration: 0.4, at: "-=0.3" });
};

export function Exhibit4({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[3]}
      caption={INSOURCING_CAPTIONS[3]}
      build={build}
    >
      <div className="mx-auto max-w-[760px]">
        <p
          data-el="multiple"
          data-anim
          className="mb-5 text-center font-serif text-4xl text-accent sm:text-5xl"
        >
          <span data-c="multiple" className="tnum">
            {REVENUE_UNLOCKED.to}
          </span>
          x
        </p>

        <div data-el="track" data-anim className="relative h-16 w-full bg-rule-soft sm:h-20">
          <span
            data-el="revenue-bar"
            data-anim
            className="absolute inset-y-0 left-0 block w-full bg-accent"
          />

          {/* Where the same tests sat before, at the same scale. */}
          <span
            data-el="start-mark"
            data-anim
            className="absolute inset-y-[-14px] block w-[2px] bg-ink"
            style={{ left: `${START_FRACTION * 100}%` }}
          >
            <span className="tnum absolute -top-7 left-1/2 -translate-x-1/2 text-[12px] text-ink">
              {REVENUE_UNLOCKED.from}x
            </span>
          </span>

          <span data-el="split" data-anim className="absolute inset-0 flex">
            {REVENUE_UNLOCKED.split.map((part, partIndex) => (
              <span
                key={part.label}
                className={`block h-full ${partIndex === 0 ? "bg-accent" : "bg-accent-mid"}`}
                style={{ width: `${part.share}%` }}
              />
            ))}
          </span>
        </div>

        <div className="mt-3 flex">
          {REVENUE_UNLOCKED.split.map((part) => (
            <span
              key={part.label}
              className="block text-[12px] sm:text-[13px]"
              style={{ width: `${part.share}%` }}
            >
              <span data-el="split-label" data-anim className="block text-ink-muted">
                {part.label}
              </span>
            </span>
          ))}
        </div>
      </div>
    </ExhibitSection>
  );
}

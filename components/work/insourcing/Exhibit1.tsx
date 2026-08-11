"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { FOUR_TESTS, INSOURCING_CAPTIONS, INSOURCING_TITLES } from "@/content/insourcing";
import { countTo, reveal, type BuildFn } from "@/lib/anim";
import { formatCount } from "@/lib/format";

const DOT_UNIT = 100; // one dot per hundred a year
const MAX_DOTS = Math.max(...FOUR_TESTS.tests.map((test) => test.volume)) / DOT_UNIT;

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="chip"]'), { y: 12, stagger: 0.11, duration: 0.5 });
  tl.fromTo(
    q('[data-el="volume-dot"]'),
    { autoAlpha: 0, scale: 0 },
    { autoAlpha: 1, scale: 1, duration: 0.28, stagger: 0.008, ease: "power2.out" },
    "-=0.25",
  );
  reveal(tl, q('[data-el="volume-value"]'), { y: 6, stagger: 0.11, duration: 0.4, at: "-=0.5" });
  FOUR_TESTS.tests.forEach((test, index) => {
    countTo(tl, one(`[data-c="volume-${index}"]`), {
      to: test.volume,
      duration: 0.9,
      format: (value) => formatCount(value),
      at: index === 0 ? "<" : "<+=0.06",
    });
  });
  tl.fromTo(
    q('[data-el="coin"]'),
    { autoAlpha: 0, y: -8, scale: 0.6 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.3, stagger: 0.06, ease: "back.out(2)" },
    "-=0.5",
  );
  reveal(tl, q('[data-el="total"]'), { y: 10, duration: 0.5, at: "-=0.1" });
  countTo(tl, one('[data-c="total"]'), {
    to: FOUR_TESTS.total,
    duration: 1.1,
    format: (value) => formatCount(value),
    at: "<",
  });
};

export function Exhibit1({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[0]}
      caption={INSOURCING_CAPTIONS[0]}
      build={build}
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {FOUR_TESTS.tests.map((test, testIndex) => (
          <div
            key={test.label}
            data-el="chip"
            data-anim
            className="flex flex-col gap-3 border border-rule bg-surface px-3 py-3.5 sm:px-4"
          >
            <span className="text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {test.label}
            </span>

            <span
              data-el="volume-value"
              data-anim
              className="tnum font-serif text-xl text-ink sm:text-2xl"
            >
              <span data-c={`volume-${testIndex}`}>
                {formatCount(test.volume)}
              </span>
            </span>

            <span className="flex flex-wrap gap-[3px]" aria-hidden>
              {Array.from({ length: test.volume / DOT_UNIT }, (_, dot) => (
                <span
                  key={dot}
                  data-el="volume-dot"
                  data-anim
                  className="block h-[5px] w-[5px] rounded-full bg-accent-soft"
                />
              ))}
              {Array.from({ length: MAX_DOTS - test.volume / DOT_UNIT }, (_, dot) => (
                <span key={`pad-${dot}`} className="block h-[5px] w-[5px]" />
              ))}
            </span>

            <span className="mt-auto flex gap-1 pt-1" aria-hidden>
              {Array.from({ length: test.coins }, (_, coin) => (
                <span
                  key={coin}
                  data-el="coin"
                  data-anim
                  className="block h-[13px] w-[13px] rounded-full border border-accent-mid bg-accent-wash"
                />
              ))}
            </span>
          </div>
        ))}
      </div>

      <p
        data-el="total"
        data-anim
        className="mt-7 text-center font-serif text-lg text-ink sm:text-xl"
      >
        ~<span data-c="total" className="tnum">
          {formatCount(FOUR_TESTS.total)}
        </span>{" "}
        {FOUR_TESTS.totalSuffix}
      </p>
    </ExhibitSection>
  );
}

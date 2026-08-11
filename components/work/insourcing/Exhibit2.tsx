"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { INSOURCING_CAPTIONS, INSOURCING_TITLES, SAVINGS_MIRAGE } from "@/content/insourcing";
import { countTo, growBar, reveal, type BuildFn } from "@/lib/anim";

const [OUTSOURCED] = SAVINGS_MIRAGE.bars;

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="bar-label"]'), { y: 6, stagger: 0.1, duration: 0.4 });
  growBar(tl, q('[data-el="cost-bar"]'), { axis: "y", stagger: 0.12, duration: 0.8, at: "-=0.25" });
  reveal(tl, q('[data-el="bar-value"]'), { y: 8, stagger: 0.12, duration: 0.4, at: "<+=0.35" });
  reveal(tl, q('[data-el="sliver"]'), { y: 0, duration: 0.5, at: "-=0.1" });
  reveal(tl, q('[data-el="mirage-counter"]'), { y: 8, duration: 0.5, at: "-=0.2" });
  countTo(tl, one('[data-c="savings"]'), {
    to: SAVINGS_MIRAGE.counterPercent,
    duration: 0.8,
    at: "<",
  });
};

export function Exhibit2({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[1]}
      caption={INSOURCING_CAPTIONS[1]}
      build={build}
    >
      <div className="mx-auto flex h-[190px] max-w-[520px] items-end justify-center gap-12 border-b border-rule sm:h-[260px] sm:gap-20">
        {SAVINGS_MIRAGE.bars.map((bar) => {
          const isOutsourced = bar.label === OUTSOURCED.label;
          return (
            <div key={bar.label} className="relative flex h-full w-24 justify-center sm:w-32">
              <span
                data-el="bar-value"
                data-anim
                className="tnum absolute inset-x-0 text-center text-[12px] text-ink-muted"
                style={{ bottom: `calc(${bar.value}% + 8px)` }}
              >
                {bar.value}
              </span>

              <span
                data-el="cost-bar"
                data-anim
                className={`absolute bottom-0 block w-full ${isOutsourced ? "bg-mark" : "bg-accent"}`}
                style={{ height: `${bar.value}%` }}
              />

              {/* The entire prize, drawn to the same scale as the cost it sits on. */}
              {!isOutsourced ? (
                <span
                  data-el="sliver"
                  data-anim
                  className="absolute inset-x-0 block border-t-2 border-dashed border-accent-mid bg-accent-wash"
                  style={{
                    bottom: `${bar.value}%`,
                    height: `${OUTSOURCED.value - bar.value}%`,
                  }}
                >
                  <span className="tnum absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full pl-2 text-[12px] text-accent">
                    {SAVINGS_MIRAGE.sliver}
                  </span>
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-3 flex max-w-[520px] justify-center gap-12 sm:gap-20">
        {SAVINGS_MIRAGE.bars.map((bar) => (
          <span
            key={bar.label}
            data-el="bar-label"
            data-anim
            className="w-24 text-center text-[12px] text-ink sm:w-32 sm:text-[13px]"
          >
            {bar.label}
          </span>
        ))}
      </div>

      <p
        data-el="mirage-counter"
        data-anim
        className="mt-7 text-center font-serif text-lg text-ink sm:text-xl"
      >
        savings: ~<span data-c="savings" className="tnum">{SAVINGS_MIRAGE.counterPercent}</span>%
        of project value
      </p>
    </ExhibitSection>
  );
}

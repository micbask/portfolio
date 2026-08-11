"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, CATALOG } from "@/content/billing";
import { countTo, reveal, type BuildFn } from "@/lib/anim";
import { formatCount } from "@/lib/format";

const MASTER_ROWS = [0, 1, 2, 3, 4];
const FIELD_WIDTHS = ["34%", "22%", "18%"];

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="source"]'), { x: -10, y: 0, stagger: 0.1, duration: 0.45 });
  tl.fromTo(
    q('[data-el="flow"]'),
    { autoAlpha: 0, scale: 0.4 },
    { autoAlpha: 1, scale: 1, duration: 0.35, stagger: 0.12, ease: "power2.out" },
    "-=0.2",
  );
  reveal(tl, q('[data-el="matcher"]'), { y: 0, duration: 0.4, at: "-=0.2" });
  tl.to(q('[data-el="matcher"]'), {
    scale: 1.035,
    duration: 0.28,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut",
  });
  reveal(tl, q('[data-el="master-row"]'), { x: -12, y: 0, stagger: 0.09, duration: 0.4, at: "-=0.2" });
  reveal(tl, q('[data-el="qc"]'), { y: 0, stagger: 0.09, duration: 0.3, at: "<+=0.2" });
  reveal(tl, q('[data-el="catalog-counter"]'), { y: 8, stagger: 0.12, duration: 0.45, at: "-=0.2" });
  countTo(tl, one('[data-c="tests"]'), {
    to: CATALOG.testCount,
    duration: 1.2,
    format: (value) => formatCount(value),
    at: "<",
  });
  countTo(tl, one('[data-c="matched"]'), { to: CATALOG.matchedPercent, duration: 1.2, at: "<" });
};

function Chevron() {
  return (
    <span
      data-el="flow"
      data-anim
      className="mx-auto block rotate-90 text-ink-faint sm:mx-0 sm:rotate-0"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" focusable="false" aria-hidden>
        <path
          d="M4 9 h9 M9.5 5 L13.5 9 L9.5 13"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

export function Exhibit7({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[6]}
      caption={BILLING_CAPTIONS[6]}
      build={build}
    >
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex flex-col gap-2 sm:w-[27%]">
          {CATALOG.sources.map((source) => (
            <span
              key={source}
              data-el="source"
              data-anim
              className="flex items-center gap-2.5 border border-rule bg-surface px-3 py-2"
            >
              <span aria-hidden className="block h-4 w-3 shrink-0 border border-ink-faint/60 bg-ground" />
              <span className="text-[12px] text-ink sm:text-[13px]">{source}</span>
            </span>
          ))}
        </div>

        <Chevron />

        <span
          data-el="matcher"
          data-anim
          className="flex items-center justify-center border border-ink/20 bg-surface px-5 py-6 sm:w-[17%]"
        >
          <svg width="46" height="42" viewBox="0 0 46 42" focusable="false" aria-hidden>
            <path
              d="M4 8 C22 8 20 21 42 21 M4 21 H42 M4 34 C22 34 20 21 42 21"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-accent-mid"
            />
            <circle cx="42" cy="21" r="3.5" className="fill-accent" />
          </svg>
        </span>

        <Chevron />

        <div className="flex flex-1 flex-col gap-1.5">
          {MASTER_ROWS.map((row) => (
            <span
              key={row}
              data-el="master-row"
              data-anim
              className="flex items-center gap-2 border-b border-rule pb-1.5"
            >
              {FIELD_WIDTHS.map((width, field) => (
                <span
                  key={field}
                  aria-hidden
                  className="block h-2 bg-mark-soft"
                  style={{ width }}
                />
              ))}
              <span
                data-el="qc"
                data-anim
                aria-hidden
                className={`ml-auto block h-2 w-2 rounded-full ${
                  row === 3 ? "bg-warn/70" : "bg-accent-mid"
                }`}
              />
            </span>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-x-10 gap-y-3">
        <p
          data-el="catalog-counter"
          data-anim
          className="font-serif text-lg text-ink sm:text-xl"
        >
          ~<span data-c="tests" className="tnum">
            {formatCount(CATALOG.testCount)}
          </span>{" "}
          tests
        </p>
        <p
          data-el="catalog-counter"
          data-anim
          className="font-serif text-lg text-ink sm:text-xl"
        >
          &gt;<span data-c="matched" className="tnum">{CATALOG.matchedPercent}</span>%
          auto-matched
        </p>
      </div>
    </ExhibitSection>
  );
}

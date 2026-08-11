"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { INSOURCING_CAPTIONS, INSOURCING_TITLES, PIPELINE } from "@/content/insourcing";
import { reveal, type BuildFn } from "@/lib/anim";

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="pipe-node"]'), { x: -10, y: 0, stagger: 0.13, duration: 0.4 });
  tl.fromTo(
    q('[data-el="pipe-arrow"]'),
    { autoAlpha: 0, scale: 0.4 },
    { autoAlpha: 1, scale: 1, duration: 0.28, stagger: 0.13, ease: "power2.out" },
    0.18,
  );
  tl.fromTo(
    q('[data-el="pipe-output"]'),
    { autoAlpha: 0, y: 10, scale: 0.94 },
    { autoAlpha: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.12, ease: "back.out(1.6)" },
    "-=0.1",
  );
  reveal(tl, q('[data-el="tagline"]'), { y: 8, duration: 0.45, at: "-=0.1" });
};

function Arrow() {
  return (
    <span
      data-el="pipe-arrow"
      data-anim
      aria-hidden
      className="mx-auto block shrink-0 rotate-90 text-ink-faint sm:mx-0 sm:rotate-0"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" focusable="false">
        <path
          d="M3 9 h10 M9.5 5 L13.5 9 L9.5 13"
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

function DocGlyph() {
  return (
    <svg width="17" height="21" viewBox="0 0 17 21" focusable="false" aria-hidden className="shrink-0">
      <path
        d="M1 1 h10 l5 5 v14 h-15 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M11 1 v5 h5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

export function Exhibit7({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[6]}
      caption={INSOURCING_CAPTIONS[6]}
      build={build}
    >
      <div className="flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center sm:gap-3">
        <span
          data-el="pipe-node"
          data-anim
          className="flex items-center justify-center border border-rule bg-surface px-4 py-4 text-ink-faint sm:px-5"
        >
          <DocGlyph />
        </span>

        {PIPELINE.stages.map((stage) => (
          <span key={stage} className="contents">
            <Arrow />
            <span
              data-el="pipe-node"
              data-anim
              className="flex flex-1 items-center justify-center border border-rule bg-surface px-3 py-3 text-center text-[12px] leading-snug text-ink sm:text-[13px]"
            >
              {stage}
            </span>
          </span>
        ))}

        <Arrow />

        <span className="flex flex-col gap-2 sm:w-[26%]">
          {PIPELINE.outputs.map((output) => (
            <span
              key={output}
              data-el="pipe-output"
              data-anim
              className="flex items-center gap-2.5 border border-accent-mid/50 bg-accent-wash/60 px-3 py-2.5"
            >
              <span className="text-accent">
                <DocGlyph />
              </span>
              <span className="text-[12px] leading-snug text-ink sm:text-[13px]">{output}</span>
            </span>
          ))}
        </span>
      </div>

      <p
        data-el="tagline"
        data-anim
        className="mt-7 text-center font-serif text-lg text-ink sm:text-xl"
      >
        {PIPELINE.tagline}
      </p>
    </ExhibitSection>
  );
}

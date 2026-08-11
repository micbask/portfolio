"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  STAFFING,
} from "@/content/consolidation";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

/*
 * The spec allows no counts on this exhibit, only blocks and the percentage,
 * so the numbers behind it never reach the page.
 *
 * The finished state is the smaller roster: the posts that go are drawn as
 * empty outlines. To show them being given up, each of those outlines holds a
 * filled overlay that starts at opacity 0 in the markup — deliberately not a
 * data-anim element, since data-anim is forced visible under reduced motion and
 * would then strand the exhibit permanently showing the larger roster.
 */
const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="shift-label"]'), { x: -6, y: 0, stagger: 0.08, duration: 0.35 });
  reveal(tl, q('[data-el="post"]'), { y: 8, stagger: 0.008, duration: 0.28, at: "-=0.15" });

  tl.to(q('[data-el="leaving"]'), { opacity: 1, duration: 0.2 }, "<+=0.15");
  tl.to(
    q('[data-el="leaving"]'),
    { opacity: 0, y: -12, duration: 0.45, stagger: 0.07, ease: "power2.in" },
    "+=0.3",
  );

  reveal(tl, q('[data-el="staff-counter"]'), { y: 8, duration: 0.45, at: "-=0.25" });
  countTo(tl, one('[data-c="leaner"]'), {
    to: STAFFING.counterPercent,
    duration: 0.8,
    at: "<",
  });
};

export function Exhibit4({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[3]}
      caption={CONSOLIDATION_CAPTIONS[3]}
      build={build}
    >
      <div className="grid grid-cols-[4.6rem_1fr] items-center gap-x-3 gap-y-3.5 sm:grid-cols-[6rem_1fr] sm:gap-x-5 sm:gap-y-4">
        {STAFFING.shifts.map((shift) => (
          <Shift key={shift.label} label={shift.label} before={shift.before} after={shift.after} />
        ))}
      </div>

      <p
        data-el="staff-counter"
        data-anim
        className="mt-8 font-serif text-lg text-ink sm:text-xl"
      >
        about <span data-c="leaner" className="tnum">{STAFFING.counterPercent}</span>% leaner
      </p>
    </ExhibitSection>
  );
}

function Shift({
  label,
  before,
  after,
}: {
  label: string;
  before: number;
  after: number;
}) {
  return (
    <>
      <span
        data-el="shift-label"
        data-anim
        className="text-[12px] text-ink-muted sm:text-[13px]"
      >
        {label}
      </span>

      <span className="flex flex-wrap gap-[3px] sm:gap-1" aria-hidden>
        {Array.from({ length: before }, (_, post) =>
          post < after ? (
            <span
              key={post}
              data-el="post"
              data-anim
              className="block h-[19px] w-[9px] bg-accent sm:h-[22px] sm:w-[10px]"
            />
          ) : (
            <span
              key={post}
              data-el="post"
              data-anim
              className="relative block h-[19px] w-[9px] border border-dashed border-ink/35 bg-rule-soft/70 sm:h-[22px] sm:w-[10px]"
            >
              <span
                data-el="leaving"
                className="absolute inset-[-1px] block bg-mark"
                style={{ opacity: 0, willChange: "transform, opacity" }}
              />
            </span>
          ),
        )}
      </span>
    </>
  );
}

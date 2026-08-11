"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { CAP_RULE, INSOURCING_CAPTIONS, INSOURCING_TITLES } from "@/content/insourcing";
import { growBar, reveal, type BuildFn } from "@/lib/anim";

/*
 * The only words allowed on this exhibit are the two lane names. The
 * difference between the lanes is carried entirely by the drawing: one lane
 * runs into a wall, the other runs the full width of the track.
 */
const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="lane-label"]'), { x: -8, y: 0, stagger: 0.14, duration: 0.45 });
  reveal(tl, q('[data-el="lane-track"]'), { y: 0, stagger: 0.14, duration: 0.4, at: "-=0.3" });

  growBar(tl, q('[data-el="lane-fill-outside"]'), { duration: 0.55, ease: "power3.out" });
  tl.fromTo(
    q('[data-el="cap"]'),
    { autoAlpha: 0, scaleY: 0.4, transformOrigin: "50% 50%" },
    { autoAlpha: 1, scaleY: 1, duration: 0.32, ease: "back.out(3)" },
    "-=0.12",
  );
  tl.fromTo(
    q('[data-el="lane-fill-outside"]'),
    { x: 0 },
    { x: -5, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.inOut" },
    "<",
  );

  growBar(tl, q('[data-el="lane-fill-inHouse"]'), { duration: 1.1, ease: "power2.out", at: "-=0.05" });
  reveal(tl, q('[data-el="open-end"]'), { x: -10, y: 0, duration: 0.4, at: "-=0.35" });
};

export function Exhibit3({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[2]}
      caption={INSOURCING_CAPTIONS[2]}
      build={build}
    >
      <div className="mx-auto flex max-w-[720px] flex-col gap-8 sm:gap-10">
        {CAP_RULE.lanes.map((lane) => (
          <div key={lane.key}>
            <p
              data-el="lane-label"
              data-anim
              className="mb-3 text-[12px] uppercase tracking-[0.12em] text-ink sm:text-[13px]"
            >
              {lane.label}
            </p>

            <div
              data-el="lane-track"
              data-anim
              className="relative h-11 w-full bg-rule-soft sm:h-12"
            >
              <span
                data-el={`lane-fill-${lane.key}`}
                data-anim
                className={`absolute inset-y-0 left-0 block ${
                  lane.capped ? "bg-mark" : "bg-accent"
                }`}
                style={{ width: `${lane.reach}%` }}
              />

              {lane.capped ? (
                <span
                  data-el="cap"
                  data-anim
                  aria-hidden
                  className="absolute inset-y-[-8px] block w-[6px] bg-ink"
                  style={{ left: `${lane.reach}%` }}
                />
              ) : (
                <span
                  data-el="open-end"
                  data-anim
                  aria-hidden
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" focusable="false">
                    <path
                      d="M3 10 h12 M10.5 5.5 L15 10 L10.5 14.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </ExhibitSection>
  );
}

"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { NETWORK_CAPTIONS, NETWORK_TITLES, SPACE } from "@/content/network";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

const COLUMNS = 10;
const ROWS = SPACE.cells / COLUMNS;

/*
 * The freed cells are taken column by column from the far edge, so what comes
 * back reads as one contiguous wing rather than scattered holes.
 */
function freedCells(share: number): Set<number> {
  const freed = new Set<number>();
  let remaining = Math.round((SPACE.cells * share) / 100);
  for (let column = COLUMNS - 1; column >= 0 && remaining > 0; column -= 1) {
    for (let row = 0; row < ROWS && remaining > 0; row += 1) {
      freed.add(row * COLUMNS + column);
      remaining -= 1;
    }
  }
  return freed;
}

const BLOCKS = SPACE.blocks.map((block) => ({
  ...block,
  freedCells: freedCells(block.freed),
}));

const build: BuildFn = ({ tl, q, one }) => {
  reveal(tl, q('[data-el="block"]'), { y: 10, stagger: 0.12, duration: 0.4 });
  reveal(tl, q('[data-el="cell"]'), {
    y: 0,
    duration: 0.3,
    stagger: 0.003,
    at: "-=0.2",
  });

  /*
   * The overlay is the space as it stands today. It fills in, then lifts, and
   * what it leaves behind is the outline the markup was authored in — so a
   * visitor without motion is served the freed state and never the old one.
   */
  tl.fromTo(
    q('[data-el="cell-fill"]'),
    { opacity: 0 },
    { opacity: 1, duration: 0.25, stagger: 0.004, ease: "power2.out" },
    "-=0.15",
  );
  tl.to(
    q('[data-el="cell-fill"]'),
    { opacity: 0, duration: 0.4, stagger: 0.008, ease: "power2.inOut" },
    "+=0.1",
  );

  reveal(tl, q('[data-el="block-value"]'), {
    y: 6,
    stagger: 0.1,
    duration: 0.4,
    at: "-=0.5",
  });
  BLOCKS.forEach((block, blockIndex) => {
    countTo(tl, one(`[data-c="freed-${blockIndex}"]`), {
      to: block.freed,
      duration: 0.8,
      at: "<+=0.05",
    });
  });

  reveal(tl, q('[data-el="callout"]'), { y: 8, duration: 0.45, at: "-=0.25" });
};

export function Exhibit7({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[6]}
      caption={NETWORK_CAPTIONS[6]}
      build={build}
    >
      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        {BLOCKS.map((block, blockIndex) => (
          <div key={blockIndex}>
            <div
              data-el="block"
              data-anim
              className="border border-rule bg-surface p-3"
            >
              <div className="grid grid-cols-10 gap-[3px]" aria-hidden>
                {Array.from({ length: SPACE.cells }, (_, cell) => {
                  const isFreed = block.freedCells.has(cell);
                  return (
                    <span
                      key={cell}
                      data-el="cell"
                      data-anim
                      className={`relative block aspect-square border ${
                        isFreed
                          ? "border-accent-soft/50 bg-accent-wash"
                          : "border-accent-soft bg-accent-soft"
                      }`}
                    >
                      {isFreed ? (
                        <span
                          data-el="cell-fill"
                          className="absolute -inset-px block bg-accent-soft"
                          style={{ opacity: 0, willChange: "opacity" }}
                        />
                      ) : null}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right-aligned so the figure sits under the freed side of the
             * block it is describing, rather than under the part still in use. */}
            <p className="mt-3 text-right">
              <span
                data-el="block-value"
                data-anim
                className="tnum font-serif text-lg text-accent sm:text-xl"
              >
                <span data-c={`freed-${blockIndex}`}>{block.freed}</span>%
              </span>
            </p>
          </div>
        ))}
      </div>

      <p
        data-el="callout"
        data-anim
        className="mt-7 text-center font-serif text-lg text-ink sm:text-xl"
      >
        {SPACE.callout}
      </p>
    </ExhibitSection>
  );
}

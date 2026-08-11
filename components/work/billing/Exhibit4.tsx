"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_RULES, BILLING_TITLES } from "@/content/billing";
import { countTo, reveal, type BuildFn } from "@/lib/anim";
import { gsap } from "@/lib/gsap";

const [BUNDLED, LAB_BILLS, HOSPITAL_CAPPED] = BILLING_RULES.outcomes;

/**
 * Carries the travelling chip onto a node. The offsets are function-based, so
 * they are measured when the tween actually starts rather than when the
 * timeline is assembled — the layout has settled by then, fonts included.
 */
function hopTo(
  tl: gsap.core.Timeline,
  chip: HTMLElement | null,
  target: HTMLElement | null,
  at?: gsap.Position,
) {
  if (!chip || !target) return;
  const delta = (axis: "x" | "y") => () => {
    const from = chip.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const current = gsap.getProperty(chip, axis) as number;
    return axis === "x"
      ? current + (to.left + to.width / 2 - (from.left + from.width / 2))
      : current + (to.top + to.height / 2 - (from.top + from.height / 2));
  };
  tl.to(chip, { x: delta("x"), y: delta("y"), duration: 0.32, ease: "power2.inOut" }, at);
}

const build: BuildFn = ({ tl, q, one }) => {
  const chip = one('[data-el="travel-chip"]');

  reveal(tl, q('[data-el="start"]'), { y: 0, duration: 0.28 });

  const step = (keys: string[]) => {
    tl.fromTo(
      keys.flatMap((key) => q(`[data-el="conn-${key}"]`)),
      { autoAlpha: 1, scaleX: 0, transformOrigin: "0% 50%" },
      { scaleX: 1, duration: 0.2, stagger: 0.1, ease: "power2.out" },
    );
    reveal(tl, keys.flatMap((key) => q(`[data-el="node-${key}"]`)), {
      x: -6,
      y: 0,
      duration: 0.26,
      stagger: 0.1,
      at: "-=0.14",
    });
  };

  step(["inpatient"]);
  hopTo(tl, chip, one('[data-el="node-inpatient"]'), "-=0.18");
  step(["bundled"]);

  step(["outpatient"]);
  hopTo(tl, chip, one('[data-el="node-outpatient"]'), "-=0.18");

  step(["question"]);
  hopTo(tl, chip, one('[data-el="node-question"]'), "-=0.18");

  step(["labBills", "hospitalCapped"]);

  /* The chip and the box it came from leave together; an empty box left
   * standing at the top of the tree reads as a mistake. */
  tl.to(q('[data-el="start"]'), { autoAlpha: 0, duration: 0.25 }, "-=0.1");

  /*
   * The whole test list, sorted by the same rules. Flat squares moved by
   * transform and opacity only, so each one composites on its own instead of
   * repainting the exhibit every frame.
   */
  tl.fromTo(
    q('[data-el="chip"]'),
    { autoAlpha: 0, scale: 0.5, x: -14, y: -10 },
    {
      autoAlpha: 1,
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.32,
      stagger: 0.008,
      ease: "power2.out",
    },
    "-=0.1",
  );

  reveal(tl, q('[data-el="tally"]'), { y: 6, duration: 0.35, stagger: 0.07, at: "<" });
  for (const outcome of BILLING_RULES.outcomes) {
    countTo(tl, one(`[data-c="${outcome.key}"]`), {
      to: outcome.chips,
      duration: 0.85,
      at: "<+=0.08",
    });
  }
};

function ChipTray({ count, tone }: { count: number; tone: string }) {
  return (
    <div className="mt-2.5 flex max-w-[260px] flex-wrap gap-[3px]">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          data-el="chip"
          data-anim
          className={`block h-[6px] w-[6px] ${tone}`}
          style={{ willChange: "transform, opacity" }}
        />
      ))}
    </div>
  );
}

function Outcome({
  id,
  text,
  count,
  tone,
  tally,
}: {
  id: string;
  text: string;
  count: number;
  tone: string;
  tally: string;
}) {
  return (
    <div className="relative pl-5 sm:pl-7">
      <span
        data-el={`conn-${id}`}
        data-anim
        className="absolute left-0 top-[13px] block h-px w-5 bg-rule sm:w-7"
      />
      <div
        data-el={`node-${id}`}
        data-anim
        className="border border-rule bg-surface px-3 py-2.5"
      >
        <div className="flex items-start justify-between gap-4">
          <p className="max-w-md text-[12px] leading-snug text-ink sm:text-[13px]">{text}</p>
          <span
            data-el="tally"
            data-anim
            className="tnum shrink-0 font-serif text-lg leading-none text-accent"
          >
            <span data-c={tally}>{count}</span>
          </span>
        </div>
        <ChipTray count={count} tone={tone} />
      </div>
    </div>
  );
}

function Branch({ id, label }: { id: string; label: string }) {
  return (
    <div className="relative pl-5 sm:pl-7">
      <span
        data-el={`conn-${id}`}
        data-anim
        className="absolute left-0 top-[11px] block h-px w-5 bg-rule sm:w-7"
      />
      <span
        data-el={`node-${id}`}
        data-anim
        className="inline-block border border-ink/15 bg-surface px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] text-ink"
      >
        {label}
      </span>
    </div>
  );
}

function Rail({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-2.5 pl-2 sm:pl-3">
      <span aria-hidden className="absolute bottom-3 left-2 top-0 w-px bg-rule sm:left-3" />
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

export function Exhibit4({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[3]}
      caption={BILLING_CAPTIONS[3]}
      footnote={BILLING_RULES.footnote}
      build={build}
    >
      <div className="relative max-w-[640px]">
        <div
          data-el="start"
          data-anim
          data-exit
          className="flex h-7 w-7 items-center justify-center border border-rule bg-surface"
        >
          <span
            data-el="travel-chip"
            className="relative z-20 block h-[9px] w-[9px] bg-accent"
            style={{ willChange: "transform, opacity" }}
          />
        </div>

        <Rail>
          <Branch id="inpatient" label={BILLING_RULES.branches.inpatient} />
          <Rail>
            <Outcome
              id={BUNDLED.key}
              text={BUNDLED.text}
              count={BUNDLED.chips}
              tally={BUNDLED.key}
              tone="bg-mark"
            />
          </Rail>

          <Branch id="outpatient" label={BILLING_RULES.branches.outpatient} />
          <Rail>
            <div className="relative pl-5 sm:pl-7">
              <span
                data-el="conn-question"
                data-anim
                className="absolute left-0 top-[13px] block h-px w-5 bg-rule sm:w-7"
              />
              <span
                data-el="node-question"
                data-anim
                className="inline-block border border-rule bg-surface px-3 py-1.5 text-[12px] leading-snug text-ink sm:text-[13px]"
              >
                {BILLING_RULES.question}
              </span>
            </div>

            <Rail>
              <div className="flex items-start gap-2">
                <span className="mt-[9px] w-7 shrink-0 text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {BILLING_RULES.answers.yes}
                </span>
                <div className="min-w-0 flex-1">
                  <Outcome
                    id={LAB_BILLS.key}
                    text={LAB_BILLS.text}
                    count={LAB_BILLS.chips}
                    tally={LAB_BILLS.key}
                    tone="bg-accent"
                  />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="mt-[9px] w-7 shrink-0 text-[10px] uppercase tracking-[0.12em] text-ink-faint">
                  {BILLING_RULES.answers.no}
                </span>
                <div className="min-w-0 flex-1">
                  <Outcome
                    id={HOSPITAL_CAPPED.key}
                    text={HOSPITAL_CAPPED.text}
                    count={HOSPITAL_CAPPED.chips}
                    tally={HOSPITAL_CAPPED.key}
                    tone="bg-accent-soft"
                  />
                </div>
              </div>
            </Rail>
          </Rail>
        </Rail>
      </div>
    </ExhibitSection>
  );
}

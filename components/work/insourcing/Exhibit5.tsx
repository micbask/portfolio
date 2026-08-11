"use client";

import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { INSOURCING_CAPTIONS, INSOURCING_TITLES, UNIT_COST } from "@/content/insourcing";
import { reveal, type BuildFn } from "@/lib/anim";

const TONES = ["bg-accent", "bg-warn/60", "bg-accent-soft", "bg-accent-mid"];

/* Each layer sits at its own offset so it can grow in place without shifting
 * the layers already stacked beneath it. */
const LAYERS = UNIT_COST.layers.map((layer, index) => ({
  ...layer,
  offset: UNIT_COST.layers.slice(0, index).reduce((sum, l) => sum + l.value, 0),
  tone: TONES[index],
}));

const build: BuildFn = ({ tl, q }) => {
  LAYERS.forEach((layer, index) => {
    tl.fromTo(
      q(`[data-el="layer"][data-layer="${index}"]`),
      { autoAlpha: 1, scaleY: 0, transformOrigin: "50% 100%" },
      { scaleY: 1, duration: 0.5, ease: "power2.out" },
      index === 0 ? undefined : "-=0.2",
    );
    reveal(tl, q(`[data-el="layer-row"][data-layer="${index}"]`), {
      x: -8,
      y: 0,
      duration: 0.35,
      at: "-=0.35",
    });
  });

  reveal(tl, q('[data-el="kit"]'), { y: 8, duration: 0.4, at: "-=0.15" });
  tl.fromTo(
    q('[data-el="kit-unit"]'),
    { autoAlpha: 0, scale: 0.4 },
    { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.012, ease: "power2.out" },
    "-=0.2",
  );

  /* A shift's worth of time passes and the unused portion is written off. */
  tl.fromTo(
    q('[data-el="clock-hand"]'),
    { rotation: 0, transformOrigin: "50% 100%", autoAlpha: 1 },
    { rotation: 360, duration: 1.5, ease: "power1.inOut" },
    "-=0.1",
  );
  tl.to(
    q('[data-el="kit-unit"][data-expiring="true"]'),
    { autoAlpha: 0.22, duration: 0.5, stagger: 0.05, ease: "power2.out" },
    "<+=0.5",
  );
};

export function Exhibit5({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={INSOURCING_TITLES[4]}
      caption={INSOURCING_CAPTIONS[4]}
      build={build}
    >
      <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:gap-10">
        <div className="flex gap-5 sm:w-[54%] sm:gap-7">
          <div className="relative h-[210px] w-14 shrink-0 sm:h-[280px] sm:w-16">
            {LAYERS.map((layer, layerIndex) => (
              <span
                key={layer.label}
                data-el="layer"
                data-layer={layerIndex}
                data-anim
                className={`absolute inset-x-0 block ${layer.tone}`}
                style={{ bottom: `${layer.offset}%`, height: `${layer.value}%` }}
              />
            ))}
          </div>

          {/* Each label sits beside the layer it names, not in a legend. */}
          <div className="relative h-[210px] flex-1 sm:h-[280px]">
            {LAYERS.map((layer, layerIndex) => (
              <span
                key={layer.label}
                className="absolute left-0 block translate-y-1/2"
                style={{ bottom: `${layer.offset + layer.value / 2}%` }}
              >
                <span
                  data-el="layer-row"
                  data-layer={layerIndex}
                  data-anim
                  className="flex items-baseline gap-3 whitespace-nowrap"
                >
                  <span className="tnum w-6 shrink-0 font-serif text-base text-ink">
                    {layer.value}
                  </span>
                  <span className="text-[12px] text-ink-muted sm:text-[13px]">
                    {layer.label}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>

        <div
          data-el="kit"
          data-anim
          className="flex items-center gap-5 border-t border-rule pt-6 sm:border-l sm:border-t-0 sm:pl-10 sm:pt-0"
        >
          <span className="flex max-w-[132px] flex-wrap gap-[5px]" aria-hidden>
            {Array.from({ length: UNIT_COST.unitGrid.total }, (_, unit) => (
              <span
                key={unit}
                data-el="kit-unit"
                data-expiring={
                  unit >= UNIT_COST.unitGrid.total - UNIT_COST.unitGrid.expiring
                    ? "true"
                    : "false"
                }
                data-anim
                className="block h-[9px] w-[9px] bg-accent-soft"
              />
            ))}
          </span>

          <span aria-hidden className="shrink-0 text-ink-faint">
            <svg width="42" height="42" viewBox="0 0 42 42" focusable="false">
              <circle cx="21" cy="21" r="17" fill="none" stroke="currentColor" strokeWidth="1.25" />
              <line
                data-el="clock-hand"
                data-anim
                x1="21"
                y1="21"
                x2="21"
                y2="9"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </div>
      </div>
    </ExhibitSection>
  );
}

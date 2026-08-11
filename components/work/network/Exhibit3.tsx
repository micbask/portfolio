"use client";

import { CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { CAPACITY_GAUGES, NETWORK_CAPTIONS, NETWORK_TITLES } from "@/content/network";
import { countTo, reveal, type BuildFn } from "@/lib/anim";

const W = 220;
const H = 128;
const CX = 110;
const CY = 112;
const R = 92;
const STROKE = 11;

/* A half turn, left to right. pathLength normalises it, so the dash offset is
 * simply the share of capacity still unused. */
const ARC = `M${CX - R},${CY} A${R},${R} 0 0 1 ${CX + R},${CY}`;

/** The share of the arc still unused, which is the dash the reading leaves. */
const unused = (value: number) => Number((1 - value / 100).toFixed(4));

const build: BuildFn = ({ tl, q, one }) => {
  CAPACITY_GAUGES.forEach((gauge, gaugeIndex) => {
    const at = gaugeIndex * 0.42;
    const pick = (name: string) => q(`[data-el="${name}"][data-gauge="${gaugeIndex}"]`);

    reveal(tl, pick("gauge-label"), { y: 8, duration: 0.35, at });
    reveal(tl, pick("gauge-track"), { y: 0, duration: 0.3, at: at + 0.15 });
    tl.fromTo(
      pick("gauge-arc"),
      { autoAlpha: 1, strokeDasharray: 1, strokeDashoffset: 1 },
      { strokeDashoffset: unused(gauge.value), duration: 0.8, ease: "power2.out" },
      at + 0.3,
    );
    reveal(tl, pick("gauge-value"), { y: 6, duration: 0.35, at: at + 0.35 });
    countTo(tl, one(`[data-c="gauge-${gaugeIndex}"]`), {
      to: gauge.value,
      duration: 0.8,
      at: at + 0.35,
    });
    reveal(tl, pick("gauge-tag"), { y: 6, duration: 0.35, at: at + 0.65 });
  });
};

export function Exhibit3({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={NETWORK_TITLES[2]}
      caption={NETWORK_CAPTIONS[2]}
      build={build}
    >
      <div className="grid gap-8 sm:grid-cols-3 sm:gap-6">
        {CAPACITY_GAUGES.map((gauge, gaugeIndex) => {
          const atLimit = gauge.value >= 100;
          return (
            <div key={gauge.label}>
              <p
                data-el="gauge-label"
                data-gauge={gaugeIndex}
                data-anim
                className="text-[12px] text-ink sm:text-[13px]"
              >
                {gauge.label}
              </p>

              <div className="mt-3 max-w-[260px]">
                <ChartCanvas width={W} height={H} maxWidth={260}>
                  <CanvasShapes>
                    <LinePath
                      data-el="gauge-track"
                      data-gauge={gaugeIndex}
                      d={ARC}
                      width={STROKE}
                      strokeLinecap="butt"
                      className="stroke-mark-soft"
                    />
                    {/* Authored at its reading: the dash is the share of the
                        arc still unused, which is where the tween lands. */}
                    <LinePath
                      data-el="gauge-arc"
                      data-gauge={gaugeIndex}
                      d={ARC}
                      width={STROKE}
                      strokeLinecap="butt"
                      strokeDasharray={1}
                      strokeDashoffset={unused(gauge.value)}
                      className={atLimit ? "stroke-warn" : "stroke-accent"}
                    />
                  </CanvasShapes>
                </ChartCanvas>
              </div>

              <p
                data-el="gauge-value"
                data-gauge={gaugeIndex}
                data-anim
                className={`tnum font-serif text-2xl sm:text-3xl ${
                  atLimit ? "text-warn" : "text-accent"
                }`}
              >
                <span data-c={`gauge-${gaugeIndex}`}>{gauge.value}</span>%
              </p>

              <p
                data-el="gauge-tag"
                data-gauge={gaugeIndex}
                data-anim
                className="mt-1.5 border-t border-rule pt-2 text-[12px] text-ink-muted"
              >
                {gauge.tag}
              </p>
            </div>
          );
        })}
      </div>
    </ExhibitSection>
  );
}

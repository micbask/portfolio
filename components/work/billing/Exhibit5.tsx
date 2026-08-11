"use client";

import { CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { LinePath } from "@/components/charts/parts";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import { BILLING_CAPTIONS, BILLING_TITLES, FUTURES } from "@/content/billing";
import { drawLine, reveal, type BuildFn } from "@/lib/anim";
import { linePath, linearScale, spread } from "@/lib/geometry";

const W = 300;
const H = 180;
const y = linearScale([-25, 130], [160, 20]);
const xs = spread(10, 20, 285);
const ZERO = y(0);

const build: BuildFn = ({ tl, q }) => {
  FUTURES.panels.forEach((_, panel) => {
    reveal(tl, q(`[data-el="panel-head"][data-panel="${panel}"]`), {
      y: 8,
      duration: 0.4,
      at: panel === 0 ? undefined : "-=0.35",
    });
    reveal(tl, q(`[data-el="panel-frame"][data-panel="${panel}"]`), {
      y: 0,
      duration: 0.35,
      at: "-=0.25",
    });
    drawLine(tl, q(`[data-el="panel-line"][data-panel="${panel}"]`), {
      duration: 0.9,
      at: "-=0.15",
    });
    reveal(tl, q(`[data-el="panel-npv"][data-panel="${panel}"]`), {
      y: 6,
      duration: 0.35,
      at: "-=0.35",
    });
  });
};

export function Exhibit5({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={BILLING_TITLES[4]}
      caption={BILLING_CAPTIONS[4]}
      build={build}
    >
      <div className="grid gap-6 sm:grid-cols-3 sm:gap-5">
        {FUTURES.panels.map((panel, panelIndex) => (
          <div key={panel.label}>
            <p
              data-el="panel-head"
              data-panel={panelIndex}
              data-anim
              className="text-[12px] text-ink sm:text-[13px]"
            >
              {panel.label}
            </p>

            <div className="mt-2">
              <ChartCanvas width={W} height={H} maxWidth={340}>
                <CanvasShapes>
                  <g data-el="panel-frame" data-panel={panelIndex} data-anim>
                    <line
                      x1={20}
                      x2={285}
                      y1={ZERO}
                      y2={ZERO}
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      className="stroke-rule"
                    />
                  </g>
                  <LinePath
                    data-el="panel-line"
                    data-panel={panelIndex}
                    d={linePath(panel.values.map((value, i) => [xs[i], y(value)]))}
                    width={2.5}
                    className="stroke-accent"
                  />
                </CanvasShapes>
              </ChartCanvas>
            </div>

            <p
              data-el="panel-npv"
              data-panel={panelIndex}
              data-anim
              className="mt-2 border-t border-rule pt-2 text-[12px] text-ink-muted"
            >
              {panel.npv}
            </p>
          </div>
        ))}
      </div>
    </ExhibitSection>
  );
}

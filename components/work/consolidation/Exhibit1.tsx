"use client";

import { CanvasLabel, CanvasShapes, ChartCanvas } from "@/components/charts/ChartCanvas";
import { ExhibitSection } from "@/components/exhibit/ExhibitSection";
import {
  CONSOLIDATION_CAPTIONS,
  CONSOLIDATION_TITLES,
  SITES,
} from "@/content/consolidation";
import { reveal, type BuildFn } from "@/lib/anim";

const W = 800;
const H = 430;

const BUILDINGS = [
  { key: "a", label: SITES.a, x: 132 },
  { key: "b", label: SITES.b, x: 468 },
];
const BUILDING = { y: 34, width: 200, height: 116 };

/* The circles start well apart and close to a heavy overlap. No counts: the
 * exhibit is only claiming that the two menus were largely the same one. */
const CIRCLE = { radius: 108, cy: 292, restLeft: 316, restRight: 484, travel: 118 };

const build: BuildFn = ({ tl, q }) => {
  reveal(tl, q('[data-el="building"]'), { y: 12, stagger: 0.12, duration: 0.45 });
  reveal(tl, q('[data-el="site-label"]'), { y: 8, stagger: 0.12, duration: 0.35, at: "-=0.3" });

  tl.fromTo(
    q('[data-el="menu-left"]'),
    { autoAlpha: 0, x: -CIRCLE.travel },
    { autoAlpha: 1, x: 0, duration: 1.1, ease: "power2.inOut" },
    "-=0.15",
  );
  tl.fromTo(
    q('[data-el="menu-right"]'),
    { autoAlpha: 0, x: CIRCLE.travel },
    { autoAlpha: 1, x: 0, duration: 1.1, ease: "power2.inOut" },
    "<",
  );
  reveal(tl, q('[data-el="overlap"]'), { y: 0, duration: 0.5, at: "-=0.35" });
};

function Building({ x }: { x: number }) {
  const windowColumns = [0, 1, 2, 3];
  const windowRows = [0, 1];
  return (
    <g data-el="building" data-anim>
      <rect
        x={x}
        y={BUILDING.y}
        width={BUILDING.width}
        height={BUILDING.height}
        className="fill-surface stroke-ink/25"
        strokeWidth={1.5}
      />
      {windowRows.map((row) =>
        windowColumns.map((column) => (
          <rect
            key={`${row}-${column}`}
            x={x + 24 + column * 42}
            y={BUILDING.y + 26 + row * 42}
            width={26}
            height={24}
            className="fill-mark-soft"
          />
        )),
      )}
    </g>
  );
}

export function Exhibit1({ index }: { index: number }) {
  return (
    <ExhibitSection
      index={index}
      title={CONSOLIDATION_TITLES[0]}
      caption={CONSOLIDATION_CAPTIONS[0]}
      build={build}
    >
      <ChartCanvas width={W} height={H} maxWidth={740}>
        <CanvasShapes>
          {BUILDINGS.map((building) => (
            <Building key={building.key} x={building.x} />
          ))}

          {/* The short walk between them. */}
          <line
            x1={BUILDINGS[0].x + BUILDING.width}
            x2={BUILDINGS[1].x}
            y1={BUILDING.y + BUILDING.height / 2}
            y2={BUILDING.y + BUILDING.height / 2}
            strokeWidth={1.5}
            strokeDasharray="5 6"
            className="stroke-rule"
          />

          <g data-el="menu-left" data-anim>
            <circle
              cx={CIRCLE.restLeft}
              cy={CIRCLE.cy}
              r={CIRCLE.radius}
              className="fill-accent/30 stroke-accent"
              strokeWidth={1.5}
            />
          </g>
          <g data-el="menu-right" data-anim>
            <circle
              cx={CIRCLE.restRight}
              cy={CIRCLE.cy}
              r={CIRCLE.radius}
              className="fill-accent/30 stroke-accent"
              strokeWidth={1.5}
            />
          </g>

          {/* The shared middle, drawn as the lens the two circles cut out. */}
          <g data-el="overlap" data-anim>
            <path
              d={`M ${(CIRCLE.restLeft + CIRCLE.restRight) / 2} ${CIRCLE.cy - Math.sqrt(CIRCLE.radius ** 2 - ((CIRCLE.restRight - CIRCLE.restLeft) / 2) ** 2)}
                  A ${CIRCLE.radius} ${CIRCLE.radius} 0 0 1 ${(CIRCLE.restLeft + CIRCLE.restRight) / 2} ${CIRCLE.cy + Math.sqrt(CIRCLE.radius ** 2 - ((CIRCLE.restRight - CIRCLE.restLeft) / 2) ** 2)}
                  A ${CIRCLE.radius} ${CIRCLE.radius} 0 0 1 ${(CIRCLE.restLeft + CIRCLE.restRight) / 2} ${CIRCLE.cy - Math.sqrt(CIRCLE.radius ** 2 - ((CIRCLE.restRight - CIRCLE.restLeft) / 2) ** 2)} Z`}
              className="fill-accent/45"
            />
          </g>
        </CanvasShapes>

        {BUILDINGS.map((building) => (
          <CanvasLabel
            key={building.key}
            x={building.x + BUILDING.width / 2}
            y={BUILDING.y + BUILDING.height + 22}
            dataEl="site-label"
            animate
            className="text-[12px] uppercase tracking-[0.12em] text-ink sm:text-[13px]"
          >
            {building.label}
          </CanvasLabel>
        ))}
      </ChartCanvas>
    </ExhibitSection>
  );
}

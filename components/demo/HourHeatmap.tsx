import { DAY_LABELS } from "@/content/demo";
import { CHART, heatColor } from "./chart-theme";

const LABEL_WIDTH = 32;
const CELL_WIDTH = 24;
const CELL_HEIGHT = 20;
const HEADER_HEIGHT = 15;
const WIDTH = LABEL_WIDTH + CELL_WIDTH * 24;
const HEIGHT = HEADER_HEIGHT + CELL_HEIGHT * 7;

const HOUR_TICKS = [0, 3, 6, 9, 12, 15, 18, 21];

function twoDigits(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

export function HourHeatmap({ matrix }: { matrix: readonly number[][] }) {
  let peak = 0;
  for (const row of matrix) for (const value of row) peak = Math.max(peak, value);
  const safePeak = peak || 1;

  return (
    <div className="overflow-x-auto">
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="h-auto w-full min-w-[560px] max-w-[860px]"
        role="presentation"
      >
        {HOUR_TICKS.map((hour) => (
          <text
            key={hour}
            x={LABEL_WIDTH + hour * CELL_WIDTH + CELL_WIDTH / 2}
            y={HEADER_HEIGHT - 6}
            textAnchor="middle"
            fontSize="10"
            fill={CHART.inkFaint}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {twoDigits(hour)}
          </text>
        ))}

        {matrix.map((row, dayIndex) => (
          <g key={DAY_LABELS[dayIndex]}>
            <text
              x={0}
              y={HEADER_HEIGHT + dayIndex * CELL_HEIGHT + CELL_HEIGHT / 2 + 3.5}
              fontSize="10"
              fill={CHART.inkFaint}
            >
              {DAY_LABELS[dayIndex]}
            </text>
            {row.map((value, hour) => (
              <rect
                key={hour}
                x={LABEL_WIDTH + hour * CELL_WIDTH + 1}
                y={HEADER_HEIGHT + dayIndex * CELL_HEIGHT + 1}
                width={CELL_WIDTH - 2}
                height={CELL_HEIGHT - 2}
                fill={heatColor(value / safePeak)}
              >
                <title>{`${twoDigits(hour)}:00 · ${Math.round(value)}`}</title>
              </rect>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}

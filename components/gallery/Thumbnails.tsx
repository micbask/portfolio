/*
 * Stills of four exhibits, drawn from the same figures those exhibits use.
 * Wordless on purpose: the caption under each tile carries the meaning, and a
 * thumbnail that tried to hold labels would render them unreadably small.
 */

import {
  BILLING_FLOW_CHIPS,
  CONSOLIDATION_UTILIZATION,
  INSOURCING_MULTIPLE,
  NETWORK_RAMP,
} from "@/content/thumbnails";
import { linePath, spread } from "@/lib/geometry";

const W = 320;
const H = 200;

function Board({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      focusable="false"
      aria-hidden
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      {children}
    </svg>
  );
}

/** Billing strategy, exhibit 4: the decision flow. */
export function BillingFlowThumb() {
  const chipTotal = BILLING_FLOW_CHIPS.reduce((sum, value) => sum + value, 0);
  const outcomes = [
    { y: 44, chips: BILLING_FLOW_CHIPS[0], tone: "fill-mark" },
    { y: 108, chips: BILLING_FLOW_CHIPS[1], tone: "fill-accent" },
    { y: 152, chips: BILLING_FLOW_CHIPS[2], tone: "fill-accent-soft" },
  ];

  return (
    <Board>
      <g className="stroke-rule" strokeWidth={1.25} fill="none">
        <path d="M40 100 H58 M58 100 V52 H74 M58 100 V124 H74" />
        <path d="M126 52 H148" />
        <path d="M126 124 H146 M146 124 V116 H176 M146 124 V160 H176" />
      </g>

      <rect x={24} y={93} width={14} height={14} className="fill-accent" />
      <rect x={74} y={44} width={52} height={16} className="fill-surface stroke-ink/20" strokeWidth={1} />
      <rect x={74} y={116} width={52} height={16} className="fill-surface stroke-ink/20" strokeWidth={1} />
      <rect x={146} y={100} width={30} height={16} className="fill-surface stroke-rule" strokeWidth={1} />

      {outcomes.map((outcome) => (
        <g key={outcome.y}>
          <rect
            x={176}
            y={outcome.y}
            width={120}
            height={26}
            className="fill-surface stroke-rule"
            strokeWidth={1}
          />
          <rect
            x={182}
            y={outcome.y + 16}
            width={(outcome.chips / chipTotal) * 108}
            height={5}
            className={outcome.tone}
          />
          <rect x={182} y={outcome.y + 7} width={62} height={3} className="fill-mark-soft" />
        </g>
      ))}
    </Board>
  );
}

/** Consolidation, exhibit 5: utilization before and after. */
export function ConsolidationThumb() {
  const base = 168;
  const scale = 1.28;
  const columns = CONSOLIDATION_UTILIZATION.flatMap((pair, index) => {
    const left = 66 + index * 116;
    return [
      { x: left, value: pair.before, tone: "fill-mark-soft" },
      { x: left + 44, value: pair.after, tone: "fill-accent" },
    ];
  });

  return (
    <Board>
      <line x1={40} x2={288} y1={base} y2={base} strokeWidth={1} className="stroke-rule" />
      {columns.map((column) => (
        <rect
          key={`${column.x}`}
          x={column.x}
          y={base - column.value * scale}
          width={32}
          height={column.value * scale}
          className={column.tone}
        />
      ))}
    </Board>
  );
}

/** Insourcing, exhibit 4: the revenue multiple and its payer split. */
export function InsourcingThumb() {
  const left = 34;
  const right = 288;
  const width = right - left;
  const startX = left + width * (INSOURCING_MULTIPLE.from / INSOURCING_MULTIPLE.to);
  const [government, commercial] = INSOURCING_MULTIPLE.split;

  return (
    <Board>
      <rect x={left} y={78} width={width} height={46} className="fill-accent" />
      <rect
        x={left + width * (government / 100)}
        y={78}
        width={width * (commercial / 100)}
        height={46}
        className="fill-accent-mid"
      />
      <line x1={startX} x2={startX} y1={64} y2={138} strokeWidth={2.5} className="stroke-ink" />
    </Board>
  );
}

/** Network study, exhibit 5: the hub-share band across ten periods. */
export function NetworkRampThumb() {
  const xs = spread(NETWORK_RAMP.low.length, 30, 292);
  const y = (value: number) => 172 - (value / NETWORK_RAMP.ceiling) * 132;
  const lowPoints = NETWORK_RAMP.low.map((value, i) => [xs[i], y(value)] as [number, number]);
  const highPoints = NETWORK_RAMP.high.map((value, i) => [xs[i], y(value)] as [number, number]);
  const band = `${linePath(highPoints)} ${linePath([...lowPoints].reverse()).replace("M", "L")} Z`;

  return (
    <Board>
      <line x1={30} x2={292} y1={172} y2={172} strokeWidth={1} className="stroke-rule" />
      <path d={band} className="fill-accent-soft/45" />
      <path d={linePath(highPoints)} fill="none" strokeWidth={2} className="stroke-accent" />
      <path d={linePath(lowPoints)} fill="none" strokeWidth={2} className="stroke-accent-mid" />
    </Board>
  );
}

export const THUMBNAILS = [
  BillingFlowThumb,
  ConsolidationThumb,
  InsourcingThumb,
  NetworkRampThumb,
];

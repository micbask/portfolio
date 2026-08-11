/*
 * Shared SVG building blocks. Every exhibit is authored in its finished state;
 * the animation layer only ever changes transform, opacity, or a dash offset,
 * so these components describe the end result and nothing else.
 */

export function Frame({
  width,
  height,
  className = "",
  children,
}: {
  width: number;
  height: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      focusable="false"
      preserveAspectRatio="xMidYMid meet"
      className={`h-auto w-full ${className}`}
    >
      {children}
    </svg>
  );
}

/** A drawn series. pathLength normalises the dash so no measuring is needed. */
export function LinePath({
  d,
  className = "stroke-accent",
  width = 2,
  dataAnim = true,
  ...rest
}: {
  d: string;
  className?: string;
  width?: number;
  dataAnim?: boolean;
} & React.SVGProps<SVGPathElement>) {
  return (
    <path
      d={d}
      pathLength={1}
      fill="none"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(dataAnim ? { "data-anim": "" } : {})}
      {...rest}
    />
  );
}

export function Gridline({
  x1,
  x2,
  y,
  className = "stroke-rule",
}: {
  x1: number;
  x2: number;
  y: number;
  className?: string;
}) {
  return <line x1={x1} x2={x2} y1={y} y2={y} strokeWidth={1} className={className} />;
}

export function TickLabel({
  x,
  y,
  children,
  anchor = "middle",
  className = "fill-ink-faint",
  size = 12,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  className?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      className={`${className} tnum`}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
    </text>
  );
}

export function SeriesLabel({
  x,
  y,
  children,
  anchor = "start",
  className = "fill-ink-muted",
  size = 13,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  anchor?: "start" | "middle" | "end";
  className?: string;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      className={className}
      style={{ fontFamily: "var(--font-sans)" }}
    >
      {children}
    </text>
  );
}

/**
 * A bar that will be grown by a scale tween. Flat fill, square corners and no
 * stroke, because everything inside a scaled group distorts with it.
 */
export function Bar({
  x,
  y,
  width,
  height,
  className = "fill-mark",
  dataAnim = true,
  ...rest
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  className?: string;
  dataAnim?: boolean;
} & React.SVGProps<SVGRectElement>) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      shapeRendering="crispEdges"
      className={className}
      {...(dataAnim ? { "data-anim": "" } : {})}
      {...rest}
    />
  );
}

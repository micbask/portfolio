/*
 * Shape of data/demo.json. The bundle is written once at build time by
 * scripts/generate-demo-data.ts and read statically by the demo page, so these
 * types are the only contract between the generator and the views.
 */

/** Which of the two sites a view covers. */
export type SiteFilterKey = "all" | "riverside" | "hillcrest";

export type TrendDirection = "up" | "down" | "flat";

export type DemoKpis = {
  /** Volume on the final day of the window. */
  todayVolume: number;
  statWithinTargetPercent: number;
  medianStatTurnaroundMinutes: number;
  /** Last seven days against the seven before them. */
  volumeTrendPercent: number;
};

export type DemoDailyPoint = {
  /** ISO calendar date, YYYY-MM-DD. */
  date: string;
  volume: number;
  /** Trailing seven-day mean of volume. */
  movingAverage: number;
  statWithinTargetPercent: number;
  routineWithinTargetPercent: number;
};

export type DemoTestRow = {
  /** Position in the name list held in content/demo.ts. */
  index: number;
  volume: number;
  medianTurnaroundMinutes: number;
  trendDirection: TrendDirection;
  trendPercent: number;
};

export type DemoView = {
  kpis: DemoKpis;
  /** Oldest day first, one entry per day of the window. */
  daily: DemoDailyPoint[];
  /** Seven rows, Monday first, of twenty-four hourly values. */
  heatmap: number[][];
  /** Ordered by volume, highest first. */
  tests: DemoTestRow[];
};

export type DemoBundle = {
  seed: number;
  /** Final day of the window, pinned so the bundle stays reproducible. */
  endDate: string;
  dayCount: number;
  /** How many of the trailing days the charts and the table cover. */
  windowDays: number;
  views: Record<SiteFilterKey, DemoView>;
};

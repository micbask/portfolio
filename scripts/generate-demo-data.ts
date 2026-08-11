/*
 * Build-time generator for the demo dashboard.
 *
 * Run with `npm run generate:demo`. It writes data/demo.json, which is
 * committed with the site: the page reads that file and nothing else, so there
 * is no randomness, no clock and no network at runtime. Every figure below is
 * invented for the demo.
 *
 * Determinism: each day draws from its own stream, seeded by a hash of the
 * fixed seed and that day's calendar date. Days therefore do not depend on one
 * another, and re-running this on any machine, on any date, reproduces the same
 * history byte for byte.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { TEST_NAMES } from "../content/demo";
import type {
  DemoBundle,
  DemoDailyPoint,
  DemoKpis,
  DemoTestRow,
  DemoView,
  SiteFilterKey,
  TrendDirection,
} from "../lib/demo-types";

// ---------------------------------------------------------------- parameters

const SEED = 20260806;

/** Final day of the window. Pinned, so the committed bundle never drifts. */
const END_DATE = "2026-08-11";
const DAY_COUNT = 90;

/** Trailing days covered by the two line charts and the table. */
const WINDOW_DAYS = 30;
const TREND_DAYS = 7;

/** Compounding daily drift applied to the mean, oldest day at index 0. */
const DRIFT_PER_DAY = 1.0005;

const STAT_SHARE = 0.28;

const SITES = [
  {
    key: "riverside",
    weekdayMean: 1450,
    weekdaySd: 90,
    weekendFactor: 0.62,
    /** Tilt of this site's hourly shape, morning window then afternoon. */
    morningTilt: 1.08,
    afternoonTilt: 0.95,
  },
  {
    key: "hillcrest",
    weekdayMean: 640,
    weekdaySd: 55,
    weekendFactor: 0.7,
    morningTilt: 0.94,
    afternoonTilt: 1.12,
  },
] as const satisfies readonly {
  key: Exclude<SiteFilterKey, "all">;
  weekdayMean: number;
  weekdaySd: number;
  weekendFactor: number;
  morningTilt: number;
  afternoonTilt: number;
}[];

/*
 * Turnaround shapes. sigma is solved in closed form from the pair of points the
 * spec fixes -- the median and the share landing inside the target -- so
 * sigma = ln(target / median) / z(p), with mu = ln(median). No search, no
 * tuning: the shape follows from the two stated numbers.
 */
const PRIORITIES = {
  stat: { medianMinutes: 42, targetMinutes: 60, z: 1.34076 },
  routine: { medianMinutes: 186, targetMinutes: 240, z: 1.17499 },
} as const;

type PriorityKey = keyof typeof PRIORITIES;
const PRIORITY_KEYS = ["stat", "routine"] as const;

/*
 * Share of total volume per test, in the order the table renders. Each carries
 * a small turnaround multiplier; the multipliers are re-centred below so their
 * volume-weighted geometric mean is exactly 1, which leaves the overall medians
 * on their targets while the table still has texture.
 */
const TEST_PARAMS = [
  { share: 0.13, rawMultiplier: 0.88 },
  { share: 0.105, rawMultiplier: 0.95 },
  { share: 0.085, rawMultiplier: 1.06 },
  { share: 0.07, rawMultiplier: 0.9 },
  { share: 0.055, rawMultiplier: 1.18 },
  { share: 0.05, rawMultiplier: 1.2 },
  { share: 0.045, rawMultiplier: 0.86 },
  { share: 0.042, rawMultiplier: 0.87 },
  { share: 0.038, rawMultiplier: 1.12 },
  { share: 0.032, rawMultiplier: 0.93 },
];

/**
 * Day-to-day wobble in each test's share of the day, so the ten trend arrows
 * are not ten copies of the site-wide trend. Volume not covered by the ten
 * absorbs the difference, so the daily total is untouched.
 */
const TEST_MIX_SD = 0.07;

/** Relative hourly weight on a weekday, before per-site tilt. */
const WEEKDAY_HOURS = [
  0.8, 0.6, 0.5, 0.5, 0.7, 1.2, 2.2, 4.6, 5.8, 5.4, 4.4, 3.4, 2.9, 3.1, 4.2,
  4.4, 3.6, 2.8, 2.3, 2.0, 1.8, 1.5, 1.2, 1.0,
];

/** How far a weekend flattens the weekday shape towards even. */
const WEEKEND_FLATTENING = 0.45;

const MORNING_PEAK = [7, 8, 9, 10];
const AFTERNOON_PEAK = [14, 15, 16];

const FILTERS: SiteFilterKey[] = ["all", "riverside", "hillcrest"];

/** Below this, a trend reads as flat rather than as a direction. */
const FLAT_THRESHOLD_PERCENT = 0.5;

// --------------------------------------------------------------------- random

/** mulberry32. Small, fast, and good enough for synthetic history. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a over the seed and the date, so each day owns an independent stream. */
function dayStream(seed: number, isoDate: string): () => number {
  const input = `${seed}:${isoDate}`;
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return mulberry32(hash >>> 0);
}

/** Box-Muller. Two uniforms per draw, one kept, so the order stays fixed. */
function standardNormal(rng: () => number): number {
  const u1 = Math.max(rng(), Number.MIN_VALUE);
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function lognormal(rng: () => number, mu: number, sigma: number): number {
  return Math.exp(mu + sigma * standardNormal(rng));
}

// ----------------------------------------------------------------- utilities

function isoDateAt(endDate: string, daysBefore: number): string {
  const end = new Date(`${endDate}T00:00:00Z`);
  end.setUTCDate(end.getUTCDate() - daysBefore);
  return end.toISOString().slice(0, 10);
}

/** Monday first, matching the heatmap row order. */
function mondayFirstDay(isoDate: string): number {
  return (new Date(`${isoDate}T00:00:00Z`).getUTCDay() + 6) % 7;
}

function isWeekend(isoDate: string): boolean {
  return mondayFirstDay(isoDate) >= 5;
}

function sum(values: number[]): number {
  let total = 0;
  for (const value of values) total += value;
  return total;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = sorted.length >> 1;
  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function percentAtOrBelow(values: number[], threshold: number): number {
  if (values.length === 0) return 0;
  let within = 0;
  for (const value of values) if (value <= threshold) within += 1;
  return (within / values.length) * 100;
}

function round(value: number, places = 0): number {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

// ------------------------------------------------------- derived parameters

/*
 * Re-centre the turnaround multipliers. Only these ten tests carry a
 * multiplier; everything else runs at 1, so zeroing the share-weighted mean of
 * their logs leaves the pooled median exactly where the shape put it.
 */
const weightedLogSum = sum(
  TEST_PARAMS.map((test) => test.share * Math.log(test.rawMultiplier)),
);
const shareSum = sum(TEST_PARAMS.map((test) => test.share));
const logShift = weightedLogSum / shareSum;
const TEST_MULTIPLIERS = TEST_PARAMS.map((test) =>
  Math.exp(Math.log(test.rawMultiplier) - logShift),
);

const SHAPES = Object.fromEntries(
  PRIORITY_KEYS.map((key) => {
    const { medianMinutes, targetMinutes, z } = PRIORITIES[key];
    return [
      key,
      {
        mu: Math.log(medianMinutes),
        sigma: Math.log(targetMinutes / medianMinutes) / z,
        targetMinutes,
        z,
      },
    ];
  }),
) as Record<
  PriorityKey,
  { mu: number; sigma: number; targetMinutes: number; z: number }
>;

/** Hourly weights per site and day type, each row summing to 1. */
function hourWeights(
  site: (typeof SITES)[number],
  weekend: boolean,
): number[] {
  const flat = sum(WEEKDAY_HOURS) / WEEKDAY_HOURS.length;
  const shaped = WEEKDAY_HOURS.map((weight) => {
    const base = weekend
      ? weight * (1 - WEEKEND_FLATTENING) + flat * WEEKEND_FLATTENING
      : weight;
    return base;
  });
  for (const hour of MORNING_PEAK) shaped[hour] *= site.morningTilt;
  for (const hour of AFTERNOON_PEAK) shaped[hour] *= site.afternoonTilt;
  const total = sum(shaped);
  return shaped.map((weight) => weight / total);
}

const HOUR_WEIGHTS = SITES.map((site) => ({
  weekday: hourWeights(site, false),
  weekend: hourWeights(site, true),
}));

// -------------------------------------------------------------- the history

type SiteDay = {
  volume: number;
  samples: Record<PriorityKey, number[]>;
  /** Per-test samples, kept only for days inside the table window. */
  testSamples: number[][] | null;
  testVolumes: number[];
};

function simulateSiteDay(
  rng: () => number,
  site: (typeof SITES)[number],
  isoDate: string,
  dayIndex: number,
  keepTestSamples: boolean,
): SiteDay {
  const weekend = isWeekend(isoDate);
  const factor = weekend ? site.weekendFactor : 1;
  const drift = DRIFT_PER_DAY ** dayIndex;
  const volume = Math.max(
    0,
    Math.round(
      site.weekdayMean * factor * drift +
        site.weekdaySd * factor * standardNormal(rng),
    ),
  );

  const testVolumes = TEST_PARAMS.map((test) => {
    const wobble = Math.exp(TEST_MIX_SD * standardNormal(rng));
    return Math.max(0, Math.round(volume * test.share * wobble));
  });
  const remainder = Math.max(0, volume - sum(testVolumes));

  const samples: Record<PriorityKey, number[]> = { stat: [], routine: [] };
  const testSamples: number[][] | null = keepTestSamples
    ? TEST_PARAMS.map(() => [])
    : null;

  const buckets: { count: number; multiplier: number; test: number }[] = [
    ...testVolumes.map((count, test) => ({
      count,
      multiplier: TEST_MULTIPLIERS[test],
      test,
    })),
    { count: remainder, multiplier: 1, test: -1 },
  ];

  for (const bucket of buckets) {
    const statCount = Math.round(bucket.count * STAT_SHARE);
    const counts: Record<PriorityKey, number> = {
      stat: statCount,
      routine: bucket.count - statCount,
    };
    for (const priority of PRIORITY_KEYS) {
      const shape = SHAPES[priority];
      /*
       * Solve sigma against this test's own median rather than reusing the
       * pooled one. P(X <= target) is concave in the median, so a shared sigma
       * would let the spread of multipliers pull the share landing inside the
       * target below the figure the spec fixes.
       */
      const mu = shape.mu + Math.log(bucket.multiplier);
      const sigma = (Math.log(shape.targetMinutes) - mu) / shape.z;
      for (let i = 0; i < counts[priority]; i += 1) {
        const value = lognormal(rng, mu, sigma);
        samples[priority].push(value);
        if (testSamples && bucket.test >= 0) {
          testSamples[bucket.test].push(value);
        }
      }
    }
  }

  return { volume, samples, testSamples, testVolumes };
}

type FilterAccumulator = {
  daily: DemoDailyPoint[];
  statMedians: number[];
  heatmap: number[][];
  testVolumes: number[][];
  testSamples: number[][];
};

function emptyAccumulator(): FilterAccumulator {
  return {
    daily: [],
    statMedians: [],
    heatmap: Array.from({ length: 7 }, () => new Array<number>(24).fill(0)),
    testVolumes: TEST_PARAMS.map(() => new Array<number>(DAY_COUNT).fill(0)),
    testSamples: TEST_PARAMS.map(() => []),
  };
}

const accumulators: Record<SiteFilterKey, FilterAccumulator> = {
  all: emptyAccumulator(),
  riverside: emptyAccumulator(),
  hillcrest: emptyAccumulator(),
};

/** How many times each weekday appears in the window, for the heatmap mean. */
const dayOfWeekCounts = new Array<number>(7).fill(0);

const dates = Array.from({ length: DAY_COUNT }, (_, index) =>
  isoDateAt(END_DATE, DAY_COUNT - 1 - index),
);

for (let dayIndex = 0; dayIndex < DAY_COUNT; dayIndex += 1) {
  const isoDate = dates[dayIndex];
  const rng = dayStream(SEED, isoDate);
  const inWindow = dayIndex >= DAY_COUNT - WINDOW_DAYS;
  const dayOfWeek = mondayFirstDay(isoDate);
  const weekend = isWeekend(isoDate);
  dayOfWeekCounts[dayOfWeek] += 1;

  const siteDays = SITES.map((site, siteIndex) => {
    const day = simulateSiteDay(rng, site, isoDate, dayIndex, inWindow);
    const weights = weekend
      ? HOUR_WEIGHTS[siteIndex].weekend
      : HOUR_WEIGHTS[siteIndex].weekday;
    return { site, day, weights };
  });

  for (const filter of FILTERS) {
    const parts = siteDays.filter(
      (entry) => filter === "all" || entry.site.key === filter,
    );
    const accumulator = accumulators[filter];

    const volume = sum(parts.map((entry) => entry.day.volume));
    const statSamples = parts.flatMap((entry) => entry.day.samples.stat);
    const routineSamples = parts.flatMap((entry) => entry.day.samples.routine);

    accumulator.daily.push({
      date: isoDate,
      volume,
      movingAverage: 0,
      statWithinTargetPercent: round(
        percentAtOrBelow(statSamples, SHAPES.stat.targetMinutes),
        1,
      ),
      routineWithinTargetPercent: round(
        percentAtOrBelow(routineSamples, SHAPES.routine.targetMinutes),
        1,
      ),
    });
    accumulator.statMedians.push(median(statSamples));

    for (const entry of parts) {
      for (let hour = 0; hour < 24; hour += 1) {
        accumulator.heatmap[dayOfWeek][hour] +=
          entry.day.volume * entry.weights[hour];
      }
      entry.day.testVolumes.forEach((testVolume, testIndex) => {
        accumulator.testVolumes[testIndex][dayIndex] += testVolume;
      });
      if (inWindow && entry.day.testSamples) {
        entry.day.testSamples.forEach((values, testIndex) => {
          accumulator.testSamples[testIndex].push(...values);
        });
      }
    }
  }
}

// ------------------------------------------------------------------- rollups

function trailingMean(values: number[], index: number, span: number): number {
  const start = Math.max(0, index - span + 1);
  const slice = values.slice(start, index + 1);
  return sum(slice) / slice.length;
}

function trendPercent(values: number[]): number {
  const recent = sum(values.slice(-TREND_DAYS));
  const previous = sum(values.slice(-TREND_DAYS * 2, -TREND_DAYS));
  if (previous === 0) return 0;
  return ((recent - previous) / previous) * 100;
}

function directionOf(percent: number): TrendDirection {
  if (percent > FLAT_THRESHOLD_PERCENT) return "up";
  if (percent < -FLAT_THRESHOLD_PERCENT) return "down";
  return "flat";
}

function buildView(filter: SiteFilterKey): DemoView {
  const accumulator = accumulators[filter];
  const volumes = accumulator.daily.map((point) => point.volume);

  const daily = accumulator.daily.map((point, index) => ({
    ...point,
    movingAverage: round(trailingMean(volumes, index, TREND_DAYS), 1),
  }));

  const kpis: DemoKpis = {
    todayVolume: volumes[volumes.length - 1],
    statWithinTargetPercent:
      daily[daily.length - 1].statWithinTargetPercent,
    medianStatTurnaroundMinutes: round(
      accumulator.statMedians[accumulator.statMedians.length - 1],
      1,
    ),
    volumeTrendPercent: round(trendPercent(volumes), 1),
  };

  const heatmap = accumulator.heatmap.map((row, dayOfWeek) =>
    row.map((value) => round(value / dayOfWeekCounts[dayOfWeek], 1)),
  );

  const tests: DemoTestRow[] = TEST_PARAMS.map((_, index) => {
    const dailyVolumes = accumulator.testVolumes[index];
    const percent = round(trendPercent(dailyVolumes), 1);
    return {
      index,
      volume: sum(dailyVolumes.slice(-WINDOW_DAYS)),
      medianTurnaroundMinutes: round(
        median(accumulator.testSamples[index]),
        1,
      ),
      trendDirection: directionOf(percent),
      trendPercent: percent,
    };
  }).sort((a, b) => b.volume - a.volume);

  const order = tests.map((row) => row.index).join(",");
  const expected = TEST_PARAMS.map((_, index) => index).join(",");
  if (order !== expected) {
    throw new Error(
      `Table order for "${filter}" is ${order}, expected ${expected}`,
    );
  }

  return { kpis, daily, heatmap, tests };
}

if (TEST_PARAMS.length !== TEST_NAMES.length) {
  throw new Error("Test parameter count does not match the name list");
}

const bundle: DemoBundle = {
  seed: SEED,
  endDate: END_DATE,
  dayCount: DAY_COUNT,
  windowDays: WINDOW_DAYS,
  views: {
    all: buildView("all"),
    riverside: buildView("riverside"),
    hillcrest: buildView("hillcrest"),
  },
};

const here = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(here, "..", "data");
const outputFile = path.join(outputDir, "demo.json");
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, `${JSON.stringify(bundle)}\n`, "utf8");

// ------------------------------------------------------------------ report

const { kpis } = bundle.views.all;
const rows: [string, string, string][] = [
  ["today's volume", kpis.todayVolume.toLocaleString("en-US"), "2,113"],
  [
    "STAT within target",
    `${kpis.statWithinTargetPercent.toFixed(1)}%`,
    "91.2%",
  ],
  [
    "median STAT turnaround",
    `${kpis.medianStatTurnaroundMinutes.toFixed(1)} min`,
    "42 min",
  ],
  [
    "7-day volume trend",
    `${kpis.volumeTrendPercent > 0 ? "+" : ""}${kpis.volumeTrendPercent.toFixed(1)}%`,
    "+3.4%",
  ],
];

process.stdout.write(`wrote ${outputFile}\n`);
process.stdout.write(`seed ${SEED}, ${DAY_COUNT} days ending ${END_DATE}\n\n`);
process.stdout.write(
  `${"KPI".padEnd(24)}${"computed".padEnd(14)}spec target\n`,
);
for (const [label, computed, target] of rows) {
  process.stdout.write(`${label.padEnd(24)}${computed.padEnd(14)}${target}\n`);
}
process.stdout.write("\n");
for (const filter of FILTERS) {
  const view = bundle.views[filter];
  process.stdout.write(
    `${filter.padEnd(11)}today ${view.kpis.todayVolume
      .toString()
      .padStart(5)}   within target ${view.kpis.statWithinTargetPercent.toFixed(
      1,
    )}%   median ${view.kpis.medianStatTurnaroundMinutes.toFixed(
      1,
    )} min   trend ${view.kpis.volumeTrendPercent.toFixed(1)}%\n`,
  );
}

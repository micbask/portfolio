/*
 * Every value and every visible string for the insourcing page, in exhibit
 * order, so this file can be read straight against the build spec.
 */

export const INSOURCING_TITLES = [
  "Four small tests",
  "The savings mirage",
  "The rule that caps revenue",
  "Revenue, unlocked",
  "Cost per test, honestly",
  "Positive in every scenario",
  "The tool that scales it",
] as const;

export const INSOURCING_CAPTIONS = [
  "Four everyday tests, a few dollars each to outsource",
  "Cost savings alone would never justify the project",
  "Outsourced tests cannot earn. In-house tests can.",
  "Same tests performed in-house: eleven times the revenue",
  "Unit cost modeled down to supplies that expire unused",
  "Six-figure value under every assumption tested",
  "An AI-assisted pipeline turns datasheets into cost models",
] as const;

/* 1 — Four small tests */
export const FOUR_TESTS = {
  tests: [
    { label: "Test 1", volume: 1300, coins: 2 },
    { label: "Test 2", volume: 1000, coins: 1 },
    { label: "Test 3", volume: 1900, coins: 2 },
    { label: "Test 4", volume: 1500, coins: 3 },
  ],
  total: 5700,
  totalSuffix: "a year",
} as const;

/* 2 — The savings mirage */
export const SAVINGS_MIRAGE = {
  bars: [
    { label: "outsourced", value: 100 },
    { label: "in-house", value: 94 },
  ],
  sliver: 6,
  counterPercent: 2,
} as const;

/*
 * 3 — The rule that caps revenue. The lane labels are the only words this
 * exhibit is allowed: the cap and the open lane are carried by the drawing.
 */
export const CAP_RULE = {
  lanes: [
    { key: "outside", label: "Purchased outside", reach: 26, capped: true },
    { key: "inHouse", label: "Performed in-house", reach: 100, capped: false },
  ],
} as const;

/* 4 — Revenue, unlocked */
export const REVENUE_UNLOCKED = {
  from: 1,
  to: 11,
  split: [
    { label: "government", share: 45 },
    { label: "commercial", share: 55 },
  ],
} as const;

/* 5 — Cost per test, honestly */
export const UNIT_COST = {
  layers: [
    { label: "base supplies", value: 60 },
    { label: "expiry waste", value: 14, expiring: true },
    { label: "calibration", value: 4 },
    { label: "quality checks", value: 22 },
  ],
  unitGrid: { total: 50, expiring: 7 },
} as const;

/* 6 — Positive in every scenario */
export const SCENARIOS = {
  /* Three payer cases, each carrying both billing baselines. */
  groups: [
    { values: [100, 95] },
    { values: [70, 65] },
    { values: [40, 35] },
  ],
  note: "startup recovered in month one",
  status: "In validation",
} as const;

/* 7 — The tool that scales it */
export const PIPELINE = {
  stages: ["parsing agent", "structured parameters", "deterministic cost engine"],
  outputs: ["cost model", "verification plan"],
  tagline: "per-test analysis in minutes",
} as const;

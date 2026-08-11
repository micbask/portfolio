/*
 * Every value and every visible string for the network study page, in exhibit
 * order, so this file can be read straight against the build spec. The network
 * is anonymous throughout: no facility names, no geography, no calendar years,
 * no floor areas, no service lines.
 */

export const NETWORK_TITLES = [
  "Four labs, four million tests",
  "The cost curve problem",
  "Three years from the wall",
  "Stay for speed, move for scale",
  "A decade-long ramp",
  "The payoff range",
  "Space becomes care",
] as const;

export const NETWORK_CAPTIONS = [
  "Four hospital labs, about four million tests a year",
  "Staffing costs compounding three times faster than everything else",
  "Core sections were three years from their limits",
  "Every test scored: stay for speed, or move for scale",
  "Volume shifts on capacity triggers, not calendar dates",
  "Tens of millions in ten-year savings across every scenario",
  "Two fifths of hospital lab space freed for patient care",
] as const;

/* 1 — Four labs, four million tests */
export const NETWORK_NODES = {
  /* Millions of tests a year. The nodes carry no names, only their size. */
  volumes: [1.6, 1.0, 0.85, 0.55],
  total: "about 4 million",
  growth: { text: "about 5.5% a year", value: 5.5 },
} as const;

/* 2 — The cost curve problem */
export const COST_CURVE = {
  series: [
    {
      label: "Staffing",
      values: [100, 109, 119, 130, 141, 154, 168, 183, 199, 217, 237],
      lead: true,
    },
    {
      label: "Everything else",
      values: [100, 103, 106, 109, 113, 116, 119, 123, 127, 130, 134],
      lead: false,
    },
  ],
  /** The fan opens around the staffing line from this period onward. */
  fanFrom: 5,
  fanSpread: 0.15,
} as const;

/* 3 — Three years from the wall */
export const CAPACITY_GAUGES = [
  { label: "blood counts", value: 88, tag: "limit: people, ~3 years" },
  { label: "chemistry panels", value: 91, tag: "limit: people, ~3 years" },
  { label: "cultures", value: 100, tag: "limit: space, now" },
] as const;

/* 4 — Stay for speed, move for scale */
export const SCORER = {
  criteria: ["urgency", "volume", "platform"],
  totalChips: 100,
  destinations: [
    { key: "rapid", label: "rapid-response labs", chips: 30, callout: "urgent work stays" },
    { key: "hub", label: "central hub", chips: 70 },
  ],
} as const;

/* 5 — A decade-long ramp */
export const RAMP = {
  low: [0, 15, 19, 23, 27, 30, 34, 37, 40, 43, 45],
  high: [0, 35, 40, 44, 48, 55, 58, 62, 65, 68, 70],
  bandLabel: "range reflects capacity triggers",
} as const;

/* 6 — The payoff range */
export const PAYOFF = {
  /** Indexed cumulative savings at the end of the tenth period. */
  finals: [20, 45, 60, 75, 100, 120, 135, 150],
  baseCase: 100,
  counter: { value: -19, prefix: "expense per test: about " },
  magnitude: "tens of millions over ten years",
} as const;

/* 7 — Space becomes care */
export const SPACE = {
  blocks: [{ freed: 42 }, { freed: 38 }],
  cells: 50,
  callout: "about two fifths",
} as const;

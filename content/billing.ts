/*
 * Every value and every visible string for the billing strategy page, laid out
 * in the order the exhibits appear so this file can be read straight against
 * the build spec.
 */

export const BILLING_TITLES = [
  "The spend curve",
  "Six labs, wild unit economics",
  "Billed is not collected",
  "Who is allowed to bill?",
  "Three futures per test",
  "Implemented",
  "The catalog behind it",
] as const;

export const BILLING_CAPTIONS = [
  "Outside-lab spend grew five times faster than the lab itself",
  "Six outside labs. Cost per test varied forty-fold.",
  "On these tests, collections covered barely half the invoices",
  "Public Medicare rules decide who may bill for each test",
  "Every strategy projected over ten years, per test line",
  "Live: outside-lab invoices down a seven-figure sum yearly",
  "One reproducible catalog now prices every outside test",
] as const;

/* 1 — The spend curve */
export const SPEND_CURVE = {
  periods: ["Y1", "Y2", "Y3", "Y4", "Y5"],
  axisLabel: "indexed, Y1 = 100",
  series: [
    { label: "Outside-lab spend", values: [100, 125, 156, 195, 244], lead: true },
    { label: "Total lab expense", values: [100, 105, 110, 116, 122], lead: false },
  ],
  counter: { fast: 25, slow: 5 },
} as const;

/* 2 — Six labs, wild unit economics */
export const UNIT_ECONOMICS = {
  /* Ordered by spend share, as the exhibit requires. */
  rows: [
    { label: "Lab C", share: 31, costPerTest: 700 },
    { label: "Lab B", share: 27, costPerTest: 55 },
    { label: "Lab A", share: 24, costPerTest: 45 },
    { label: "Lab F", share: 8, costPerTest: 1800 },
    { label: "Lab D", share: 7, costPerTest: 150 },
    { label: "Lab E", share: 3, costPerTest: 1600 },
  ],
  costTicks: [50, 100, 500, 1000],
} as const;

/* 3 — Billed is not collected */
export const COLLECTIONS = {
  axisLabel: "indexed",
  groups: [
    { label: "Inpatient", invoiced: 45, collected: 15 },
    { label: "Outpatient", invoiced: 55, collected: 33 },
  ],
  seriesLabels: { invoiced: "invoiced", collected: "collected" },
  netGap: 52,
} as const;

/* 4 — Who is allowed to bill? (centerpiece) */
export const BILLING_RULES = {
  branches: { inpatient: "Inpatient", outpatient: "Outpatient" },
  question: "On Medicare's exception list for advanced tests?",
  answers: { yes: "Yes", no: "No" },
  outcomes: [
    { key: "bundled", text: "Bundled into the hospital stay. No separate payment.", chips: 30 },
    { key: "labBills", text: "The performing lab may bill Medicare directly.", chips: 55 },
    { key: "hospitalCapped", text: "The hospital bills, capped at the lower of cost or fee schedule.", chips: 15 },
  ],
  totalChips: 100,
  footnote:
    "Simplified view of the CMS laboratory date-of-service rules for hospital outpatients.",
} as const;

/* 5 — Three futures per test */
export const FUTURES = {
  panels: [
    {
      label: "Keep outsourcing",
      values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      npv: "baseline",
    },
    {
      label: "Shift billing to the lab",
      values: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      npv: "positive, seven figures",
    },
    {
      label: "Bring tests in-house",
      values: [-15, 5, 25, 45, 62, 77, 90, 101, 111, 120],
      npv: "positive, seven figures",
    },
  ],
} as const;

/* 6 — Implemented */
export const IMPLEMENTED = {
  axisLabel: "indexed",
  before: [101, 99, 103, 98, 102, 100, 104, 97, 101, 99, 102, 100],
  after: [78, 64, 55, 53, 51, 54, 52, 50, 53, 51, 52, 52],
  goLiveLabel: "Go-live",
  endCounter: "annualized reduction: seven figures",
} as const;

/* 7 — The catalog behind it */
export const CATALOG = {
  sources: ["Lab A pricing", "Lab B pricing", "Lab C pricing"],
  counters: { tests: "~1,700 tests", matched: ">90% auto-matched" },
  testCount: 1700,
  matchedPercent: 90,
} as const;

/*
 * Every value and every visible string for the consolidation page, in exhibit
 * order, so this file can be read straight against the build spec. The two
 * sites are "Site A" and "Site B" throughout, and no percentage appears here
 * that the spec does not fix.
 */

export const CONSOLIDATION_TITLES = [
  "Two labs, a short walk apart",
  "Machines standing idle",
  "One core, one specialty",
  "Fewer hands, same coverage",
  "Utilization doubles",
  "In motion",
] as const;

export const CONSOLIDATION_CAPTIONS = [
  "Two hospital labs ran the same tests, a short walk apart",
  "Capacity ran far below its potential at both sites",
  "Routine volume to one site, specialty focus at the other",
  "Staffing redeployed, about ten percent leaner, coverage unchanged",
  "Consolidated equipment runs near capacity instead of idling",
  "Underway: four phases, validated at every step",
] as const;

export const SITES = { a: "Site A", b: "Site B" } as const;

/* 2 — Machines standing idle */
export const IDLE_CAPACITY = [
  {
    site: SITES.a,
    lines: [
      { label: "chemistry line", value: 34 },
      { label: "hematology line", value: 45 },
      { label: "coagulation", value: 9 },
      { label: "urinalysis", value: 12 },
    ],
  },
  {
    site: SITES.b,
    lines: [
      { label: "chemistry line", value: 38 },
      { label: "hematology line", value: 48 },
      { label: "coagulation", value: 15 },
      { label: "urinalysis", value: 8 },
      { label: "legacy testing line", value: 0 },
    ],
  },
] as const;

/* 3 — One core, one specialty */
export const SORTING = {
  destinations: [
    {
      site: SITES.a,
      role: "around-the-clock core",
      chips: ["chemistry", "blood counts", "coagulation", "urinalysis"],
    },
    {
      site: SITES.b,
      role: "specialty testing",
      chips: ["special chemistry", "cultures"],
    },
  ],
  courierTag: "pickups every 15 minutes",
} as const;

/*
 * 4 — Fewer hands, same coverage. Blocks only: the spec forbids showing any
 * of these counts as numbers, so they size the rows and never get printed.
 */
export const STAFFING = {
  shifts: [
    { label: "Day", before: 18, after: 16 },
    { label: "Evening", before: 10, after: 9 },
    { label: "Overnight", before: 7, after: 6 },
    { label: "Weekend", before: 5, after: 5 },
  ],
  counter: "about 10% leaner",
  counterPercent: 10,
} as const;

/* 5 — Utilization doubles */
export const UTILIZATION = [
  { label: "chemistry", before: 26, after: 82 },
  { label: "hematology", before: 23, after: 79 },
] as const;

/* 6 — In motion */
export const PHASES = {
  steps: [
    "Prepare backup capacity",
    "Validate",
    "Move equipment",
    "Reallocate volume",
  ],
  activeIndex: 1,
  closingStat: "six-figure annual savings · seven-figure five-year value",
} as const;

/*
 * Values behind the four gallery thumbnails. Each one is a still of a specific
 * exhibit, so the figures here are the same figures that exhibit uses — the
 * two drawn from pages that arrive next phase included.
 */

/** Consolidation, exhibit 5: utilization before and after. */
export const CONSOLIDATION_UTILIZATION = [
  { before: 26, after: 82 },
  { before: 23, after: 79 },
] as const;

/** Insourcing, exhibit 4: the revenue multiple and its payer split. */
export const INSOURCING_MULTIPLE = { from: 1, to: 11, split: [45, 55] } as const;

/** Network study, exhibit 5: the hub-share band across ten periods. */
export const NETWORK_RAMP = {
  low: [0, 15, 19, 23, 27, 30, 34, 37, 40, 43, 45],
  high: [0, 35, 40, 44, 48, 55, 58, 62, 65, 68, 70],
  ceiling: 70,
} as const;

/** Billing strategy, exhibit 4: how the test list splits across the outcomes. */
export const BILLING_FLOW_CHIPS = [30, 55, 15] as const;

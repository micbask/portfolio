/*
 * Every visitor-facing string on the site is declared here or in the per-page
 * content modules beside this file, so the full text of the site can be read
 * against the build spec in one place. Nothing user-visible is written inline
 * in a component.
 */

export const NAME = "Michael Bask";

export const HEADER_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/mbask/" },
  { label: "Email", href: "mailto:micbask@gmail.com" },
] as const;

export const FOOTER_TEXT =
  "All artifacts on this site are recreations of real work with disguised figures. No confidential data appears here. The dashboard demo runs entirely on synthetic data.";

export const DISGUISED_MARKER = "figures disguised";

export const BACK_TO_GALLERY = "← Gallery";

export const NOT_FOUND_TITLE = "Not found";

export const OG_ALT = "Michael Bask — Selected work";
export const OG_KICKER = "Selected work";

export const ROUTES = {
  home: {
    path: "/",
    title: "Michael Bask",
    description:
      "Selected healthcare operations, finance, and strategy work, shown as recreated exhibits with disguised figures.",
  },
  demo: {
    path: "/demo",
    label: "Demo",
    title: "Dashboard demo · Michael Bask",
    description:
      "A hospital lab operations dashboard demo, running entirely on synthetic data.",
  },
  billingStrategy: {
    path: "/work/billing-strategy",
    label: "Billing strategy",
    title: "Billing strategy · Michael Bask",
    description:
      "Who gets to bill for outsourced testing under public Medicare rules, and the seven-figure result.",
  },
  consolidation: {
    path: "/work/consolidation",
    label: "Consolidation",
    title: "Consolidation · Michael Bask",
    description:
      "Two duplicate hospital labs consolidated into one near-capacity core, about ten percent leaner.",
  },
  insourcing: {
    path: "/work/insourcing",
    label: "Insourcing",
    title: "Insourcing · Michael Bask",
    description:
      "A make-or-buy decision carried by revenue: the same tests, eleven times the earning potential in-house.",
  },
  networkStudy: {
    path: "/work/network-study",
    label: "Network study",
    title: "Network study · Michael Bask",
    description:
      "A ten-year centralization study for a four-lab hospital network, paced by capacity triggers.",
  },
} as const;

export const FEATURED_TILE_CAPTION =
  "A hospital lab operations dashboard. Synthetic data, live.";

export const OPEN_DEMO = "Open demo";

export const GALLERY_TILES = [
  {
    href: ROUTES.billingStrategy.path,
    caption: "Outside-lab spend, re-decided under public billing rules",
  },
  {
    href: ROUTES.consolidation.path,
    caption: "Two duplicate labs consolidated into one core",
  },
  {
    href: ROUTES.insourcing.path,
    caption: "A make-or-buy case won on revenue, not cost",
  },
  {
    href: ROUTES.networkStudy.path,
    caption: "A ten-year centralization study for a lab network",
  },
] as const;

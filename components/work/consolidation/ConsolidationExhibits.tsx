"use client";

import { WorkPage } from "@/components/exhibit/WorkPage";
import { CONSOLIDATION_TITLES } from "@/content/consolidation";
import { ROUTES } from "@/content/site";
import { Exhibit1 } from "./Exhibit1";
import { Exhibit2 } from "./Exhibit2";
import { Exhibit3 } from "./Exhibit3";
import { Exhibit4 } from "./Exhibit4";
import { Exhibit5 } from "./Exhibit5";
import { Exhibit6 } from "./Exhibit6";

export function ConsolidationExhibits() {
  return (
    <WorkPage label={ROUTES.consolidation.label} titles={CONSOLIDATION_TITLES}>
      <Exhibit1 index={0} />
      <Exhibit2 index={1} />
      <Exhibit3 index={2} />
      <Exhibit4 index={3} />
      <Exhibit5 index={4} />
      <Exhibit6 index={5} />
    </WorkPage>
  );
}

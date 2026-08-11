"use client";

import { WorkPage } from "@/components/exhibit/WorkPage";
import { INSOURCING_TITLES } from "@/content/insourcing";
import { ROUTES } from "@/content/site";
import { Exhibit1 } from "./Exhibit1";
import { Exhibit2 } from "./Exhibit2";
import { Exhibit3 } from "./Exhibit3";
import { Exhibit4 } from "./Exhibit4";
import { Exhibit5 } from "./Exhibit5";
import { Exhibit6 } from "./Exhibit6";
import { Exhibit7 } from "./Exhibit7";

export function InsourcingExhibits() {
  return (
    <WorkPage label={ROUTES.insourcing.label} titles={INSOURCING_TITLES}>
      <Exhibit1 index={0} />
      <Exhibit2 index={1} />
      <Exhibit3 index={2} />
      <Exhibit4 index={3} />
      <Exhibit5 index={4} />
      <Exhibit6 index={5} />
      <Exhibit7 index={6} />
    </WorkPage>
  );
}

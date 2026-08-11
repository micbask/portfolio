import type { Metadata } from "next";
import { ConsolidationExhibits } from "@/components/work/consolidation/ConsolidationExhibits";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.consolidation.title,
  description: ROUTES.consolidation.description,
  openGraph: {
    title: ROUTES.consolidation.title,
    description: ROUTES.consolidation.description,
  },
};

export default function Page() {
  return <ConsolidationExhibits />;
}

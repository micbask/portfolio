import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";
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
  return <PlaceholderPage label={ROUTES.consolidation.label} />;
}

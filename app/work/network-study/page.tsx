import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.networkStudy.title,
  description: ROUTES.networkStudy.description,
  openGraph: {
    title: ROUTES.networkStudy.title,
    description: ROUTES.networkStudy.description,
  },
};

export default function Page() {
  return <PlaceholderPage label={ROUTES.networkStudy.label} />;
}

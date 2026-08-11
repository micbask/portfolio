import type { Metadata } from "next";
import { InsourcingExhibits } from "@/components/work/insourcing/InsourcingExhibits";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.insourcing.title,
  description: ROUTES.insourcing.description,
  openGraph: {
    title: ROUTES.insourcing.title,
    description: ROUTES.insourcing.description,
  },
};

export default function Page() {
  return <InsourcingExhibits />;
}

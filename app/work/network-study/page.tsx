import type { Metadata } from "next";
import { NetworkStudyExhibits } from "@/components/work/network/NetworkStudyExhibits";
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
  return <NetworkStudyExhibits />;
}

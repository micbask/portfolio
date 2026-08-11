import type { Metadata } from "next";
import { BillingStrategyExhibits } from "@/components/work/billing/BillingStrategyExhibits";
import { ROUTES } from "@/content/site";

export const metadata: Metadata = {
  title: ROUTES.billingStrategy.title,
  description: ROUTES.billingStrategy.description,
  openGraph: {
    title: ROUTES.billingStrategy.title,
    description: ROUTES.billingStrategy.description,
  },
};

export default function Page() {
  return <BillingStrategyExhibits />;
}

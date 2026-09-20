import type { Metadata } from "next";

import { AboutDiscover } from "@/components/client/about-discover";
import { AboutHero } from "@/components/client/about-hero";
import { AboutMission } from "@/components/client/about-mission";
import { AboutStandards } from "@/components/client/about-standards";
import { AboutStory } from "@/components/client/about-story";
import { Navbar } from "@/components/client/navbar";
import { COMPANY_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `About · ${COMPANY_NAME}`,
  description: `${COMPANY_NAME} is a guide to Botswana's digital world, helping people discover the country's most useful, reliable and trustworthy websites.`,
};

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col bg-cream-50 dark:bg-ink-950">
      <main className="w-full flex-1">
        <Navbar />
        <AboutHero />
        <AboutStory />
        <AboutStandards />
        <AboutDiscover />
        <AboutMission />
      </main>
    </div>
  );
}

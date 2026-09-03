import { Navbar } from "@/components/client/navbar";
import { Hero } from "@/components/client/hero";
import { Test } from "./test";
import { CategoryLinks } from "@/components/client/category-links";
import { SearchBanner } from "@/components/client/search-banner";
import { CollectionsContainer } from "@/components/collections-container";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className=" w-full flex-1">
        <Navbar />
        <Hero />
        <CollectionsContainer collections={[1, 2, 3]} />
        <CategoryLinks />
        <a href="/search/media">PLAIN HTML TEST</a>
        <Test />
        <CollectionsContainer collections={[4, 5, 6]} />
        <SearchBanner />
        <CollectionsContainer collections={[7, 8, 9]} />
      </main>
    </div>
  );
}

import { Navbar } from "@/components/client/navbar";
import { Hero } from "@/components/client/hero";
import { SitesGrid } from "@/components/sites-grid";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <main className=" w-full flex-1">
        <Navbar />
        <Hero />

        <SitesGrid collection="Top Sites" />
      </main>
    </div>
  );
}

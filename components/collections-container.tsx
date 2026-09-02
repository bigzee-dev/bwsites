import { SitesGrid } from "@/components/sites-grid";

/**
 * Renders the homepage collections, in the order the ranks are listed.
 * `collections={[1, 2, 3]}` outputs the collections ranked 1, 2 and 3.
 */
export function CollectionsContainer({ collections }: { collections: number[] }) {
  return (
    <>
      {collections.map((rank) => (
        <SitesGrid key={rank} rank={rank} />
      ))}
    </>
  );
}

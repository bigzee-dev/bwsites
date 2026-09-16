import { getCategories } from "@/lib/client/categories";
import { categoryHref } from "@/lib/slug";

import { NavbarClient } from "./navbar-client";

export async function Navbar() {
  const categories = await getCategories();

  return (
    <NavbarClient
      categories={categories.map((category) => ({
        id: category.id,
        name: category.name,
        href: categoryHref(category.name),
      }))}
    />
  );
}

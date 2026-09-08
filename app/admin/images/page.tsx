import { redirect } from "next/navigation";

import { ImagesTable } from "@/components/admin/images-table";
import { getAdminSession } from "@/lib/admin/auth";
import { getR2Images, type R2Image } from "@/lib/admin/images";

export default async function AdminImagesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  let images: R2Image[] = [];
  let error: string | null = null;

  try {
    images = await getR2Images();
  } catch {
    // A bad key or bucket name should read as a message, not a crashed page.
    error = "Listing the R2 bucket failed. Check the R2 credentials and bucket name.";
  }

  return <ImagesTable images={images} error={error} />;
}

-- Replace the site <-> category many-to-many with an explicit, required primary
-- category and an optional secondary category.

-- Refuse to run rather than silently lose data.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "site" s
    WHERE NOT EXISTS (SELECT 1 FROM "_CategoryToSite" cs WHERE cs."B" = s."id")
  ) THEN
    RAISE EXCEPTION 'Some sites have no category; assign one before migrating.';
  END IF;

  IF EXISTS (
    SELECT 1 FROM "_CategoryToSite" GROUP BY "B" HAVING COUNT(*) > 2
  ) THEN
    RAISE EXCEPTION 'Some sites have more than 2 categories; reduce them before migrating.';
  END IF;
END $$;

-- AlterTable
ALTER TABLE "site" ADD COLUMN "primaryCategoryId" TEXT,
ADD COLUMN "secondaryCategoryId" TEXT;

-- Backfill: the earliest-created category becomes primary. This matches what
-- site.categories[0] returned before this migration.
WITH ranked AS (
  SELECT cs."B" AS site_id,
         cs."A" AS category_id,
         ROW_NUMBER() OVER (PARTITION BY cs."B" ORDER BY c."createdAt", c."id") AS position
  FROM "_CategoryToSite" cs
  JOIN "category" c ON c."id" = cs."A"
)
UPDATE "site" s
SET "primaryCategoryId"   = (SELECT category_id FROM ranked WHERE site_id = s."id" AND position = 1),
    "secondaryCategoryId" = (SELECT category_id FROM ranked WHERE site_id = s."id" AND position = 2);

ALTER TABLE "site" ALTER COLUMN "primaryCategoryId" SET NOT NULL;

-- Not expressible in the Prisma schema; also enforced in lib/admin/validation.ts.
ALTER TABLE "site" ADD CONSTRAINT "site_distinct_categories_check"
  CHECK ("secondaryCategoryId" IS NULL OR "secondaryCategoryId" <> "primaryCategoryId");

-- DropForeignKey
ALTER TABLE "_CategoryToSite" DROP CONSTRAINT "_CategoryToSite_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToSite" DROP CONSTRAINT "_CategoryToSite_B_fkey";

-- DropTable
DROP TABLE "_CategoryToSite";

-- CreateIndex
CREATE INDEX "site_primaryCategoryId_idx" ON "site"("primaryCategoryId");

-- CreateIndex
CREATE INDEX "site_secondaryCategoryId_idx" ON "site"("secondaryCategoryId");

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_primaryCategoryId_fkey" FOREIGN KEY ("primaryCategoryId") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site" ADD CONSTRAINT "site_secondaryCategoryId_fkey" FOREIGN KEY ("secondaryCategoryId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

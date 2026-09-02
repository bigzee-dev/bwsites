-- AlterTable
ALTER TABLE "collection" ADD COLUMN     "categoriesLinkId" TEXT;

-- CreateIndex
CREATE INDEX "collection_categoriesLinkId_idx" ON "collection"("categoriesLinkId");

-- AddForeignKey
ALTER TABLE "collection" ADD CONSTRAINT "collection_categoriesLinkId_fkey" FOREIGN KEY ("categoriesLinkId") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "site" ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE INDEX "site_isOnline_idx" ON "site"("isOnline");

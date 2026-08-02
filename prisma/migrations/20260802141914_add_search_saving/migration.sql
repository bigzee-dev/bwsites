-- CreateTable
CREATE TABLE "search_query" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_query_pkey" PRIMARY KEY ("id")
);

/*
  Warnings:

  - The `photo` column on the `Posts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."Posts" DROP CONSTRAINT "Posts_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."Posts" ALTER COLUMN "categoryId" DROP NOT NULL,
DROP COLUMN "photo",
ADD COLUMN     "photo" TEXT[];

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."Posts" ADD COLUMN     "cityId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Posts" ADD CONSTRAINT "Posts_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

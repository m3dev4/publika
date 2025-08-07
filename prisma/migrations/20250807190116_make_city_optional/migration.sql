-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_cityId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "cityId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Transaction_userId_date_idx";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId";

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

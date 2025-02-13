/*
  Warnings:

  - The `emailVerified` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[verifyToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT,
ADD COLUMN     "verifyToken" TEXT,
ADD COLUMN     "verifyTokenExp" TIMESTAMP(3),
ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL,
DROP COLUMN "emailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_verifyToken_key" ON "User"("verifyToken");

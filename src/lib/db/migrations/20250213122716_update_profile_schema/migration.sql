/*
  Warnings:

  - Added the required column `dateOfBirth` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Made the column `bio` on table `profiles` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "dateOfBirth" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ALTER COLUMN "bio" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "image" TEXT;

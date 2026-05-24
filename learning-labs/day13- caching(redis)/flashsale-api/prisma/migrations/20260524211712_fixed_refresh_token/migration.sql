/*
  Warnings:

  - You are about to drop the column `hashedRefreshTOken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "hashedRefreshTOken",
ADD COLUMN     "hashedRefreshToken" TEXT;

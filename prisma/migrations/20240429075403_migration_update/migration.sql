/*
  Warnings:

  - Added the required column `articleId` to the `articleComment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `comment` to the `articleComment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articleComment" ADD COLUMN     "articleId" INTEGER NOT NULL,
ADD COLUMN     "comment" VARCHAR(500) NOT NULL;

-- AddForeignKey
ALTER TABLE "articleComment" ADD CONSTRAINT "articleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

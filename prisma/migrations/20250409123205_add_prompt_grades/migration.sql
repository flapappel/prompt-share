/*
  Warnings:

  - You are about to drop the column `grade` on the `Prompt` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "PromptGrade" (
    "id" TEXT NOT NULL,
    "promptId" TEXT NOT NULL,
    "grade" "Grade" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PromptGrade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PromptGrade_promptId_grade_key" ON "PromptGrade"("promptId", "grade");

-- AddForeignKey
ALTER TABLE "PromptGrade" ADD CONSTRAINT "PromptGrade_promptId_fkey" FOREIGN KEY ("promptId") REFERENCES "Prompt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Migrate data
INSERT INTO "PromptGrade" ("id", "promptId", "grade", "createdAt", "updatedAt")
SELECT gen_random_uuid()::text, id, grade, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM "Prompt"
WHERE grade IS NOT NULL;

-- Drop the old column
ALTER TABLE "Prompt" DROP COLUMN "grade";

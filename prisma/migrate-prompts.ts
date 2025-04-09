import { PrismaClient, Grade } from '@prisma/client';

const prisma = new PrismaClient();

interface PromptWithGrade {
  id: string;
  grade: Grade;
}

async function main() {
  // Haal alle prompts op met hun oude grade
  const prompts = await prisma.$queryRaw<PromptWithGrade[]>`
    SELECT p.id, p.grade
    FROM "Prompt" p
    WHERE p.grade IS NOT NULL
  `;

  // Voor elke prompt, maak een nieuwe PromptGrade aan
  for (const prompt of prompts) {
    await prisma.promptGrade.create({
      data: {
        promptId: prompt.id,
        grade: prompt.grade
      }
    });
  }

  console.log('Migratie voltooid!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
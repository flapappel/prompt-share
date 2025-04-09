import { PrismaClient, Grade } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Haal alle prompts op
  const prompts = await prisma.prompt.findMany();

  // Voor elke prompt, maak een nieuwe PromptGrade aan
  for (const prompt of prompts) {
    // Verwijder de oude grade kolom
    await prisma.prompt.update({
      where: { id: prompt.id },
      data: {
        grades: {
          create: {
            grade: prompt.grade as Grade
          }
        }
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
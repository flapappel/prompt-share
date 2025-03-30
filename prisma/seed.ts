import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Verwijder bestaande data
  await prisma.like.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contact.deleteMany();

  // Maak een admin gebruiker
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@promptshare.nl',
      name: 'Admin',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Maak categorieën
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: 'Taal' },
    }),
    prisma.category.create({
      data: { name: 'Rekenen' },
    }),
    prisma.category.create({
      data: { name: 'Wereldoriëntatie' },
    }),
    prisma.category.create({
      data: { name: 'Kunst en Cultuur' },
    }),
    prisma.category.create({
      data: { name: 'Sociaal-emotioneel' },
    }),
  ]);

  // Maak voorbeeldprompts
  const schrijfPrompt = await prisma.prompt.create({
    data: {
      title: 'Creatief schrijven verhaal',
      content: 'Kun je een kort verhaal schrijven over een dappere ridder die een draak moet verslaan? Het verhaal moet geschikt zijn voor kinderen uit groep 5 en moet een duidelijke moraal bevatten.',
      grade: 'GROEP_5',
      authorId: admin.id,
      authorName: admin.name || 'Admin',
      categoryId: categories[0].id, // Taal categorie
      isApproved: true,
    },
  });

  const rekenPrompt = await prisma.prompt.create({
    data: {
      title: 'Tafels oefenen spelletje',
      content: 'Bedenk een leuk en interactief spel om de tafels van vermenigvuldiging te oefenen met kinderen uit groep 4. Het spel moet zowel educatief als vermakelijk zijn.',
      grade: 'GROEP_4',
      authorId: admin.id,
      authorName: admin.name || 'Admin',
      categoryId: categories[1].id, // Rekenen categorie
      isApproved: true,
    },
  });

  // Voeg likes toe
  await Promise.all([
    prisma.like.create({
      data: {
        userId: admin.id,
        promptId: schrijfPrompt.id,
      },
    }),
    prisma.like.create({
      data: {
        userId: admin.id,
        promptId: rekenPrompt.id,
      },
    }),
  ]);

  // Maak voorbeeld contact bericht
  await prisma.contact.create({
    data: {
      name: 'Test Contact',
      email: 'contact@example.com',
      subject: 'Vraag over prompts',
      message: 'Ik heb een vraag over het gebruik van prompts in de klas.',
      isRead: false,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
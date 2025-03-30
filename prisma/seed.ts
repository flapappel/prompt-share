import { PrismaClient, Role, Grade } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Maak eerst de database leeg
  await prisma.user.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.category.deleteMany();
  await prisma.like.deleteMany();
  await prisma.contactMessage.deleteMany();

  // Maak een admin gebruiker
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Maak een normale gebruiker
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Test User',
      password: userPassword,
      role: Role.USER,
    },
  });

  // Maak categorieën
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Taal',
        description: 'Prompts voor taalonderwijs',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Rekenen',
        description: 'Prompts voor rekenonderwijs',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Wereldoriëntatie',
        description: 'Prompts voor wereldoriëntatie',
      },
    }),
  ]);

  // Maak voorbeeld prompts
  const prompts = await Promise.all([
    prisma.prompt.create({
      data: {
        title: 'Wiskunde: Breuken optellen',
        content: 'Maak een les over het optellen van breuken voor groep 6. Gebruik visuele voorbeelden en praktische oefeningen.',
        grade: Grade.GRADE_5_6,
        isApproved: true,
        authorName: 'Test User',
        authorId: user.id,
        categoryId: categories[1].id,
      },
    }),
    prisma.prompt.create({
      data: {
        title: 'Taal: Werkwoordspelling',
        content: 'Ontwikkel een les over werkwoordspelling voor groep 4. Focus op de basisregels en veel voorkomende fouten.',
        grade: Grade.GRADE_3_4,
        isApproved: true,
        authorName: 'Test User',
        authorId: user.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.prompt.create({
      data: {
        title: 'Geschiedenis: Romeinen',
        content: 'Maak een les over het Romeinse Rijk voor groep 7. Behandel de belangrijkste gebeurtenissen en het dagelijks leven.',
        grade: Grade.GRADE_7_8,
        isApproved: false,
        authorName: 'Test User',
        authorId: user.id,
        categoryId: categories[2].id,
      },
    }),
  ]);

  // Voeg likes toe
  await Promise.all([
    prisma.like.create({
      data: {
        userId: user.id,
        promptId: prompts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: user.id,
        promptId: prompts[1].id,
      },
    }),
  ]);

  // Maak voorbeeld contact bericht
  await prisma.contactMessage.create({
    data: {
      name: 'Test Contact',
      email: 'contact@example.com',
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
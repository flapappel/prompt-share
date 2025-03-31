import { PrismaClient, Grade } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Verwijder bestaande data
  await prisma.like.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.contact.deleteMany();

  // Maak een admin gebruiker
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Maak categorieën
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Taal' },
      update: {},
      create: { name: 'Taal' },
    }),
    prisma.category.upsert({
      where: { name: 'Rekenen' },
      update: {},
      create: { name: 'Rekenen' },
    }),
    prisma.category.upsert({
      where: { name: 'Geschiedenis' },
      update: {},
      create: { name: 'Geschiedenis' },
    }),
  ]);

  // Maak voorbeeld prompts
  const prompts = await Promise.all([
    prisma.prompt.create({
      data: {
        title: 'Creatief schrijven verhaal',
        content: 'Kun je een kort verhaal schrijven over een dappere ridder die een draak moet verslaan? Het verhaal moet geschikt zijn voor kinderen uit groep 5 en moet een duidelijke moraal bevatten.',
        grade: 'GROEP_5' as any,
        authorId: admin.id,
        categoryId: categories[0].id, // Taal categorie
      },
    }),
    prisma.prompt.create({
      data: {
        title: 'Wiskunde probleem',
        content: 'Los het volgende wiskunde probleem op: Een rechthoek heeft een omtrek van 24 cm en een oppervlakte van 35 cm². Wat zijn de afmetingen van de rechthoek?',
        grade: 'GROEP_8' as any,
        authorId: admin.id,
        categoryId: categories[1].id, // Rekenen categorie
      },
    }),
    prisma.prompt.create({
      data: {
        title: 'Geschiedenis essay',
        content: 'Schrijf een essay over de invloed van de industriële revolutie op de samenleving. Focus op de sociale en economische veranderingen.',
        grade: 'GROEP_8' as any,
        authorId: admin.id,
        categoryId: categories[2].id, // Geschiedenis categorie
      },
    }),
  ]);

  // Voeg likes toe
  await Promise.all([
    prisma.like.create({
      data: {
        userId: admin.id,
        promptId: prompts[0].id,
      },
    }),
    prisma.like.create({
      data: {
        userId: admin.id,
        promptId: prompts[1].id,
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
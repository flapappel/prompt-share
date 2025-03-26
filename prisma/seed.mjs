import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Verwijder bestaande data
  await prisma.like.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.user.deleteMany();

  // Maak admin gebruiker
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  // Maak test gebruiker
  const testUser = await prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'Test Gebruiker',
      password: await bcrypt.hash('user123', 10),
      role: 'USER',
    },
  });

  // Maak wat voorbeeld prompts
  const prompt1 = await prisma.prompt.create({
    data: {
      title: 'Rekenen met breuken',
      content: 'Leg uit hoe je breuken optelt en aftrekt. Gebruik eenvoudige voorbeelden en visualisaties.',
      grade: 6,
      authorId: adminUser.id,
      isApproved: true,
    },
  });

  const prompt2 = await prisma.prompt.create({
    data: {
      title: 'Werkwoordspelling',
      content: 'Leg uit wanneer je -d, -t of -dt gebruikt bij werkwoorden in de tegenwoordige tijd.',
      grade: 7,
      authorId: testUser.id,
      isApproved: true,
    },
  });

  // Voeg wat likes toe
  await prisma.like.create({
    data: {
      promptId: prompt1.id,
      userId: testUser.id,
    },
  });

  await prisma.like.create({
    data: {
      promptId: prompt2.id,
      userId: adminUser.id,
    },
  });

  console.log('Database is gevuld met voorbeelddata!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
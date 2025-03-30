const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Verwijder alle bestaande data
  await prisma.like.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Maak admin gebruiker aan
  const hashedPassword = await bcrypt.hash("Prompt-share1!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "prompt-share@hotmail.com" },
    update: {},
    create: {
      email: "prompt-share@hotmail.com",
      name: "Admin",
      role: "ADMIN",
      password: hashedPassword,
    },
  });

  // Maak anonieme gebruiker voor likes
  const anonymous = await prisma.user.upsert({
    where: { email: 'anonymous@example.com' },
    update: {
      password: 'anonymous',
      role: 'USER',
    },
    create: {
      email: 'anonymous@example.com',
      password: 'anonymous',
      role: 'USER',
    },
  });

  // Maak categorieën aan
  const categories = [
    "Rekenen",
    "Taal",
    "Lezen",
    "Schrijven",
    "Engels",
    "Wereldoriëntatie",
    "Kunstenzinnige oriëntatie",
    "Bewegingsonderwijs",
    "Sociaal-emotionele ontwikkeling",
    "Digitale geletterdheid",
    "Overig",
  ];

  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: {
        name: categoryName,
      },
    });
  }

  console.log("Database is geïnitialiseerd met admin gebruiker, anonieme gebruiker en categorieën");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
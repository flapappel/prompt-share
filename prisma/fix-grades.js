// Dit script update alle prompts met ongeldige grade waarden (HAVO en VWO)
// naar geldige waarden (GROEP_8)
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixGrades() {
  try {
    console.log('Bijwerken van ongeldige grade waarden...');
    
    // Update prompts met HAVO naar GROEP_5
    const updatedHavo = await prisma.$executeRaw`
      UPDATE "Prompt" SET grade = 'GROEP_5' WHERE grade = 'HAVO';
    `;
    
    // Update prompts met VWO naar GROEP_8
    const updatedVwo = await prisma.$executeRaw`
      UPDATE "Prompt" SET grade = 'GROEP_8' WHERE grade = 'VWO';
    `;
    
    console.log(`Bijgewerkt: ${updatedHavo} prompts van HAVO naar GROEP_5`);
    console.log(`Bijgewerkt: ${updatedVwo} prompts van VWO naar GROEP_8`);
    
    console.log('Controle van de resterende ongeldige waarden...');
    
    // Controleer of er nog ongeldige waarden zijn
    const invalidCount = await prisma.$executeRaw`
      SELECT COUNT(*) FROM "Prompt" 
      WHERE grade NOT IN ('GROEP_1', 'GROEP_2', 'GROEP_3', 'GROEP_4', 'GROEP_5', 'GROEP_6', 'GROEP_7', 'GROEP_8');
    `;
    
    if (invalidCount > 0) {
      console.log(`Waarschuwing: Er zijn nog ${invalidCount} prompts met ongeldige grade waarden`);
    } else {
      console.log('Alle prompts hebben nu geldige grade waarden!');
    }
  } catch (error) {
    console.error('Fout bij het bijwerken van grade waarden:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixGrades()
  .then(() => {
    console.log('Script voltooid');
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 
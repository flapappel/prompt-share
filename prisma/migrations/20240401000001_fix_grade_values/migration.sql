-- Fix ongeldige grade waarden in de Prompt tabel
UPDATE "Prompt" SET grade = 'GROEP_5' WHERE grade = 'HAVO';
UPDATE "Prompt" SET grade = 'GROEP_8' WHERE grade = 'VWO'; 
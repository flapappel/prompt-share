"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Grade } from "@prisma/client";

export async function submitPrompt(formData: FormData) {
  try {
    console.log("Start submitPrompt functie");
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const grade = formData.get("grade") as string;
    const categoryId = formData.get("categoryId") as string;
    const authorName = formData.get("authorName") as string;

    console.log("Form data:", { title, content, grade, categoryId, authorName });

    if (!title || !content || !grade || !categoryId || !authorName) {
      throw new Error("Alle velden zijn verplicht");
    }

    // Map de grade waarde naar de juiste enum waarde
    const gradeMap: Record<string, Grade> = {
      "1": Grade.GROEP_1,
      "2": Grade.GROEP_2,
      "3": Grade.GROEP_3,
      "4": Grade.GROEP_4,
      "5": Grade.GROEP_5,
      "6": Grade.GROEP_6,
      "7": Grade.GROEP_7,
      "8": Grade.GROEP_8,
    };

    // Zoek of maak een gebruiker aan voor de auteur
    let user = await prisma.user.findFirst({
      where: { name: authorName }
    });

    if (!user) {
      // Maak een nieuwe gebruiker aan met een unieke email
      const timestamp = Date.now();
      const email = `${authorName.toLowerCase().replace(/\s+/g, '.')}.${timestamp}@anonymous.com`;
      
      user = await prisma.user.create({
        data: {
          name: authorName,
          email: email,
          role: "USER",
        }
      });
    }

    console.log("Gebruiker voor prompt:", user);

    console.log("Creating prompt with data:", {
      title,
      content,
      grade: gradeMap[grade],
      categoryId,
      authorId: user.id
    });

    const prompt = await prisma.prompt.create({
      data: {
        title,
        content,
        grade: gradeMap[grade] || Grade.GROEP_1,
        categoryId,
        authorId: user.id,
        isApproved: false,
      },
    });

    console.log("Prompt succesvol aangemaakt:", prompt);

    revalidatePath("/");
    return { success: true, prompt };
  } catch (error) {
    console.error("Fout bij het indienen van de prompt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het indienen van de prompt" 
    };
  }
} 
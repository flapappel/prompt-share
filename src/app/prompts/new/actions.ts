"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Grade } from "@prisma/client";

export async function submitPrompt(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const grade = formData.get("grade") as string;
    const categoryId = formData.get("categoryId") as string;
    const authorName = formData.get("authorName") as string;

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

    // Zoek de auteur op basis van de naam
    const author = await prisma.user.findFirst({
      where: { name: authorName }
    });

    if (!author) {
      throw new Error("Auteur niet gevonden");
    }

    const prompt = await prisma.prompt.create({
      data: {
        title,
        content,
        grade: gradeMap[grade] || Grade.GROEP_1,
        categoryId,
        authorId: author.id,
        isApproved: false,
      },
    });

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
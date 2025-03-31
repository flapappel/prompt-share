"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Grade } from "@prisma/client";

export async function approvePrompt(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Prompt ID is verplicht");
    }

    await prisma.prompt.update({
      where: { id },
      data: { isApproved: true },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het goedkeuren van de prompt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het goedkeuren van de prompt" 
    };
  }
}

export async function updatePrompt(formData: FormData) {
  try {
    const id = formData.get("id") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const grade = formData.get("grade") as string;
    const categoryId = formData.get("categoryId") as string;
    const authorName = formData.get("authorName") as string;
    const isApproved = formData.get("isApproved") === "true";
    const likesCount = parseInt(formData.get("likesCount") as string) || 0;

    if (!id || !title || !content || !grade || !categoryId || !authorName) {
      throw new Error("Alle velden zijn verplicht");
    }

    // Map de grade waarde naar de juiste enum waarde
    const gradeMap: Record<string, Grade> = {
      "HAVO": Grade.HAVO,
      "VWO": Grade.VWO,
    };

    // Zoek de auteur op basis van de naam
    const author = await prisma.user.findFirst({
      where: { name: authorName }
    });

    if (!author) {
      throw new Error("Auteur niet gevonden");
    }

    // Update de prompt
    await prisma.prompt.update({
      where: { id },
      data: {
        title,
        content,
        grade: gradeMap[grade] || Grade.HAVO,
        categoryId,
        authorId: author.id,
        isApproved,
      },
    });

    // Verwijder alle bestaande likes
    await prisma.like.deleteMany({
      where: { promptId: id },
    });

    // Maak nieuwe anonieme gebruikers aan voor elke like
    for (let i = 0; i < likesCount; i++) {
      // Genereer een unieke e-mail met timestamp
      const timestamp = Date.now();
      const uniqueEmail = `anonymous${timestamp}${i}@example.com`;

      // Maak een unieke anonieme gebruiker aan
      const anonymousUser = await prisma.user.create({
        data: {
          email: uniqueEmail,
          password: 'anonymous',
          role: 'USER',
        },
      });

      // Maak een like aan voor deze gebruiker
      await prisma.like.create({
        data: {
          promptId: id,
          userId: anonymousUser.id,
        },
      });
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het bijwerken van de prompt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het bijwerken van de prompt" 
    };
  }
}

export async function deletePrompt(formData: FormData) {
  try {
    const id = formData.get("id") as string;

    if (!id) {
      throw new Error("Prompt ID is verplicht");
    }

    // Verwijder eerst alle likes
    await prisma.like.deleteMany({
      where: { promptId: id },
    });

    // Verwijder de prompt
    await prisma.prompt.delete({
      where: { id },
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het verwijderen van de prompt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het verwijderen van de prompt" 
    };
  }
} 
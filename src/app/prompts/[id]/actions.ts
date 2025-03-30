"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

export async function toggleLike(promptId: string) {
  try {
    // Maak een anonieme gebruiker aan of gebruik een bestaande
    const anonymousUser = await prisma.user.upsert({
      where: { email: "anonymous@example.com" },
      update: {},
      create: {
        email: "anonymous@example.com",
        name: "Anonieme Gebruiker",
        password: await hash("anonymous-password", 12),
      },
    });

    // Controleer of de like al bestaat
    const existingLike = await prisma.like.findFirst({
      where: {
        promptId: promptId,
        userId: anonymousUser.id,
      },
    });

    // Als de like al bestaat, verwijder deze
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Maak de like aan gekoppeld aan de anonieme gebruiker
      await prisma.like.create({
        data: {
          promptId: promptId,
          userId: anonymousUser.id,
        },
      });
    }

    // Ververs de pagina om de nieuwe like te tonen
    revalidatePath(`/prompts/${promptId}`);
    return { success: true };
  } catch (error) {
    console.error("Fout bij het liken van de prompt:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Er is een fout opgetreden bij het liken van de prompt" 
    };
  }
} 
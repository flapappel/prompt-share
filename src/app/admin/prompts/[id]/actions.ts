"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Grade } from "@prisma/client";

type ApprovePromptState = {
  error?: string;
};

export async function approvePrompt(prevState: ApprovePromptState | null, formData: FormData): Promise<ApprovePromptState | null> {
  try {
    const id = formData.get("id");

    if (!id) {
      return { error: "ID is verplicht" };
    }

    await prisma.prompt.update({
      where: {
        id: id as string,
      },
      data: {
        isApproved: true,
      },
    });

    revalidatePath("/admin/prompts");
    revalidatePath("/");
    return null;
  } catch (error) {
    console.error("Error approving prompt:", error);
    return { error: "Er is een fout opgetreden bij het goedkeuren van de prompt" };
  }
}

type UpdatePromptState = {
  error?: string;
};

export async function updatePrompt(prevState: UpdatePromptState | null, formData: FormData): Promise<UpdatePromptState | null> {
  try {
    const id = formData.get("id");
    const title = formData.get("title");
    const content = formData.get("content");
    const categoryId = formData.get("categoryId");
    const grades = JSON.parse(formData.get("grades") as string) as Grade[];

    if (!id || !title || !content || !categoryId) {
      return { error: "Alle velden zijn verplicht" };
    }

    // Begin een transactie
    await prisma.$transaction(async (tx) => {
      // Update de prompt
      await tx.prompt.update({
        where: { id: id as string },
        data: {
          title: title as string,
          content: content as string,
          categoryId: categoryId as string,
        },
      });

      // Verwijder alle bestaande grades
      await tx.promptGrade.deleteMany({
        where: { promptId: id as string },
      });

      // Voeg de nieuwe grades toe
      await tx.promptGrade.createMany({
        data: grades.map(grade => ({
          promptId: id as string,
          grade,
        })),
      });
    });

    revalidatePath("/admin/prompts");
    revalidatePath("/");
    return null;
  } catch (error) {
    console.error("Error updating prompt:", error);
    return { error: "Er is een fout opgetreden bij het bijwerken van de prompt" };
  }
}

type DeletePromptState = {
  error?: string;
};

export async function deletePrompt(prevState: DeletePromptState | null, formData: FormData): Promise<DeletePromptState | null> {
  try {
    const id = formData.get("id");

    if (!id) {
      return { error: "ID is verplicht" };
    }

    await prisma.prompt.delete({
      where: {
        id: id as string,
      },
    });

    revalidatePath("/admin/prompts");
    revalidatePath("/");
    return null;
  } catch (error) {
    console.error("Error deleting prompt:", error);
    return { error: "Er is een fout opgetreden bij het verwijderen van de prompt" };
  }
} 
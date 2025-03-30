"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type DeleteContactState = {
  error?: string;
};

export async function deleteContact(prevState: DeleteContactState | null, formData: FormData): Promise<DeleteContactState | null> {
  try {
    const id = formData.get("id");

    if (!id) {
      return { error: "ID is verplicht" };
    }

    await prisma.contact.delete({
      where: {
        id: parseInt(id as string),
      },
    });

    revalidatePath("/admin/contact");
    return null;
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { error: "Er is een fout opgetreden bij het verwijderen van het bericht" };
  }
} 
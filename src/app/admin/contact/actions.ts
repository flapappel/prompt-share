"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteContact(formData: FormData) {
  try {
    const id = formData.get("id");
    
    if (!id) {
      return { error: "ID ontbreekt" };
    }

    await prisma.contact.delete({
      where: {
        id: parseInt(id as string),
      },
    });

    revalidatePath("/admin/contact");
    return { success: true };
  } catch (error) {
    console.error("Fout bij het verwijderen van contact bericht:", error);
    return { error: "Er is een fout opgetreden bij het verwijderen van het bericht" };
  }
} 
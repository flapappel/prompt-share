"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    if (!data.name || !data.email || !data.subject || !data.message) {
      return { error: "Alle velden zijn verplicht" };
    }

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
      },
    });

    revalidatePath("/contact");
    return { success: true, contact };
  } catch (error) {
    console.error("Fout bij het opslaan van contact bericht:", error);
    return { error: "Er is een fout opgetreden bij het opslaan van je bericht" };
  }
} 
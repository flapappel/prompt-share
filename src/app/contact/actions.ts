"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitContactMessage(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !subject || !message) {
    return {
      message: "Alle velden zijn verplicht",
      type: "error"
    };
  }

  try {
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    revalidatePath("/contact");
    return {
      message: "Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op.",
      type: "success"
    };
  } catch (error) {
    console.error("Error saving contact message:", error);
    return {
      message: "Er is iets misgegaan bij het versturen van je bericht",
      type: "error"
    };
  }
} 
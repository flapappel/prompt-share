import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Like request received for prompt:", params.id);

    // Voeg een nieuwe like toe zonder gebruiker
    await prisma.like.create({
      data: {
        promptId: params.id,
      },
    });

    return NextResponse.json({ success: true, action: "liked" });
  } catch (error) {
    console.error("Error in like route:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het liken van de prompt" },
      { status: 500 }
    );
  }
} 
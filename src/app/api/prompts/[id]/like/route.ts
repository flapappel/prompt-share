import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Like request received for prompt:", params.id);
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log("No session found");
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om een prompt te liken" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      console.log("User not found:", session.user.email);
      return NextResponse.json(
        { error: "Gebruiker niet gevonden" },
        { status: 404 }
      );
    }

    console.log("Checking for existing like");
    // Check of de like al bestaat
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_promptId: {
          userId: user.id,
          promptId: params.id,
        },
      },
    });

    if (existingLike) {
      console.log("Removing existing like");
      // Verwijder de like als deze al bestaat
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ success: true, action: "unliked" });
    } else {
      console.log("Adding new like");
      // Voeg een nieuwe like toe
      await prisma.like.create({
        data: {
          userId: user.id,
          promptId: params.id,
        },
      });
      return NextResponse.json({ success: true, action: "liked" });
    }
  } catch (error) {
    console.error("Error in like route:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het liken van de prompt" },
      { status: 500 }
    );
  }
} 
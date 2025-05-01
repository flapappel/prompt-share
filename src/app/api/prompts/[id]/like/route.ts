import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Je moet ingelogd zijn om een prompt te liken" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Gebruiker niet gevonden" },
        { status: 404 }
      );
    }

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
      // Verwijder de like als deze al bestaat
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      // Voeg een nieuwe like toe
      await prisma.like.create({
        data: {
          userId: user.id,
          promptId: params.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error liking prompt:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het liken van de prompt" },
      { status: 500 }
    );
  }
} 
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Fout bij het ophalen van categorieën:", error);
    return NextResponse.json(
      { error: "Er is een fout opgetreden bij het ophalen van categorieën" },
      { status: 500 }
    );
  }
} 
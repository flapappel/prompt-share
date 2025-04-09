import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Grade } from "@prisma/client";
import { EditForm } from "./edit-form";

export default async function EditPromptPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  try {
    const prompt = await prisma.prompt.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: true,
        likes: {
          select: {
            id: true,
            userId: true,
            promptId: true,
            createdAt: true,
          }
        },
        grades: true,
      },
    });

    if (!prompt) {
      redirect("/admin");
    }

    // Controleer of de grade waarde geldig is
    const validGrades = Object.values(Grade);
    if (!validGrades.includes(prompt.grades[0]?.grade as Grade)) {
      // Als de grade ongeldig is, redirect naar admin
      redirect("/admin");
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });

    // Transformeer de prompt data om authorName toe te voegen
    const promptWithAuthorName = {
      ...prompt,
      authorName: prompt.author.name || "Onbekend",
      isApproved: prompt.isApproved || false,
      grade: prompt.grades[0]?.grade || Grade.GROEP_1,
    };

    return (
      <div className="container py-8">
        <EditForm prompt={promptWithAuthorName} categories={categories} />
      </div>
    );
  } catch (error) {
    console.error("Error loading prompt:", error);
    redirect("/admin");
  }
} 
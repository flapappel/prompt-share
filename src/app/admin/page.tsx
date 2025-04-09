import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Grade, Prompt, Category, User, Like, PromptGrade } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { revalidatePath } from "next/cache";

type PromptWithRelations = Prompt & {
  category: Category;
  likes: Like[];
  author: User;
  grades: PromptGrade[];
};

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  // Vangt alle mogelijke Grade waarden op
  const validGrades = Object.values(Grade);
  
  let prompts: PromptWithRelations[] = [];

  try {
    // Haal alle prompts op zonder grade filter
    prompts = await prisma.prompt.findMany({
      where: {
        OR: [
          { isApproved: true },
          { isApproved: false }
        ]
      },
      include: {
        category: true,
        likes: {
          select: {
            id: true,
            userId: true,
            promptId: true,
            createdAt: true,
            updatedAt: true,
          }
        },
        author: true,
        grades: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    console.error("Fout bij ophalen prompts in admin:", error);
    prompts = [];
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <Link href="/admin/contact">
            <Button variant="outline">Contact Berichten</Button>
          </Link>
          <Link href="/prompts/new">
            <Button>Nieuwe Prompt</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {prompts.length > 0 ? (
          prompts.map((prompt) => (
            <div
              key={prompt.id}
              className="border rounded-lg p-6 space-y-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{prompt.title}</h2>
                  <p className="text-sm text-gray-500">
                    Door: {prompt.author?.name || 'Anoniem'} | {prompt.grades[0]?.grade || 'Geen groep'} |{" "}
                    {prompt.category?.name || 'Algemeen'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(prompt.createdAt).toLocaleDateString("nl-NL", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="space-x-2">
                  <Link href={`/admin/prompts/${prompt.id}`}>
                    <Button variant="outline" size="sm">
                      Bewerken
                    </Button>
                  </Link>
                  <form action={`/admin/prompts/${prompt.id}/actions`}>
                    <input type="hidden" name="action" value="delete" />
                    <Button type="submit" variant="destructive" size="sm">
                      Verwijderen
                    </Button>
                  </form>
                </div>
              </div>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap">{prompt.content}</p>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>{prompt.likes?.length || 0} likes</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Geen prompts gevonden.</p>
        )}
      </div>
    </div>
  );
} 
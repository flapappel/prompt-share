import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/prompt-card";
import { SearchPrompt } from "@/components/search-prompt";

export default async function Home() {
  const [prompts, categories] = await Promise.all([
    prisma.prompt.findMany({
      where: {
        isApproved: true,
      },
      include: {
        category: true,
        grades: true,
        likes: {
          select: {
            id: true,
          },
        },
        comments: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
    prisma.category.findMany(),
  ]);

  return (
    <main className="container mx-auto py-8">
      <div className="mb-8">
        <SearchPrompt categories={categories} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </main>
  );
} 
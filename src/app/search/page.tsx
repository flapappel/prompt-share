import { prisma } from "@/lib/prisma";
import { SearchPrompt } from "@/components/search-prompt";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SearchPageProps {
  searchParams: {
    q?: string;
    grade?: string;
    category?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query, grade, category } = searchParams;

  const prompts = await prisma.prompt.findMany({
    where: {
      AND: [
        { isApproved: true },
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        } : {},
        grade ? { grades: { some: { grade: grade as any } } } : {},
        category ? { categoryId: category } : {},
      ],
    },
    include: {
      category: true,
      author: {
        select: {
          name: true,
        },
      },
      likes: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="container mx-auto py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#1E3A8A]">Zoek Prompts</h1>
        
        <SearchPrompt categories={await prisma.category.findMany()} />
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-[#1E3A8A]">
            {prompts.length} {prompts.length === 1 ? "resultaat" : "resultaten"} gevonden
          </h2>
          
          {prompts.length > 0 ? (
            <div className="grid gap-6">
              {prompts.map((prompt) => (
                <Link
                  key={prompt.id}
                  href={`/prompts/${prompt.id}`}
                  className="block p-6 bg-[#EBF8FF] border-2 border-[#1E3A8A] rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2 text-[#1E3A8A]">{prompt.title}</h3>
                  <div className="flex gap-2 text-sm text-gray-600 mb-4">
                    <span>Categorie: {prompt.category?.name || 'Algemeen'}</span>
                    <span>•</span>
                    <span className="text-[#7C3AED]">{prompt.likes?.length || 0} likes</span>
                  </div>
                  <p className="text-gray-700 line-clamp-3">{prompt.content}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Geen prompts gevonden die voldoen aan je zoekcriteria.</p>
              <Link href="/prompts/new">
                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
                  Deel je eigen prompt
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
import { prisma } from "@/lib/prisma";
import { PromptCard } from "@/components/prompt-card";
import { SearchPrompt } from "@/components/search-prompt";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
      <div className="max-w-3xl mx-auto mb-12">
        <div className="flex items-center gap-4 mb-6">
          <Image
            src="/promptshare-logo.png"
            alt="PromptShare Logo"
            width={80}
            height={80}
            priority
          />
          <div>
            <h1 className="text-4xl font-bold mb-2 text-[#1E3A8A]">Welkom bij Prompt Share</h1>
            <p className="text-lg text-gray-600">
              Ontdek en deel handige prompts voor het basisonderwijs. Hier vind je een verzameling van goedgekeurde prompts die je direct kunt gebruiken in je les.
            </p>
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/prompts/new">
            <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Deel je eigen prompt</Button>
          </Link>
          <Link href="/help">
            <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Leer hoe je een goede prompt maakt</Button>
          </Link>
          <Link href="/help/ai-tools">
            <Button variant="outline" className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10">Hoe gebruik je prompts in AI-tools?</Button>
          </Link>
        </div>
      </div>

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
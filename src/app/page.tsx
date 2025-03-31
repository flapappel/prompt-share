import { prisma } from "@/lib/prisma";
import { Grade } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  // Vangt alle mogelijke Grade waarden op (inclusief ongeldige waarden door try-catch)
  const validGrades = Object.values(Grade);
  
  const [newestPrompts, popularPrompts] = await Promise.all([
    prisma.prompt.findMany({
      where: {
        grade: {
          in: validGrades
        }
      },
      include: {
        category: true,
        likes: {
          select: {
            id: true,
            userId: true,
            promptId: true,
            createdAt: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
    prisma.prompt.findMany({
      where: {
        grade: {
          in: validGrades
        }
      },
      include: {
        category: true,
        likes: {
          select: {
            id: true,
            userId: true,
            promptId: true,
            createdAt: true,
          }
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return (
    <main className="container mx-auto py-10">
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

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6 text-[#1E3A8A]">Nieuwste Prompts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {newestPrompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="block p-6 bg-[#EBF8FF] border-2 border-[#1E3A8A] rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#1E3A8A]">{prompt.title}</h3>
              <div className="flex gap-2 text-sm text-gray-600 mb-4">
                <span>Leerjaar: {prompt.grade}</span>
                <span>•</span>
                <span>Categorie: {prompt.category.name}</span>
                <span>•</span>
                <span className="text-[#7C3AED]">{prompt.likes.length} likes</span>
              </div>
              <p className="text-gray-700 line-clamp-3">{prompt.content}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[#1E3A8A]">Populaire Prompts</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {popularPrompts.map((prompt) => (
            <Link
              key={prompt.id}
              href={`/prompts/${prompt.id}`}
              className="block p-6 bg-[#EBF8FF] border-2 border-[#1E3A8A] rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2 text-[#1E3A8A]">{prompt.title}</h3>
              <div className="flex gap-2 text-sm text-gray-600 mb-4">
                <span>Leerjaar: {prompt.grade}</span>
                <span>•</span>
                <span>Categorie: {prompt.category.name}</span>
                <span>•</span>
                <span className="text-[#7C3AED]">{prompt.likes.length} likes</span>
              </div>
              <p className="text-gray-700 line-clamp-3">{prompt.content}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
} 
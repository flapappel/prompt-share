import { prisma } from "@/lib/prisma";
import { Grade, Prompt, Category, Like } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

type RawPrompt = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  categoryId: string;
  authorId: string;
  isApproved: boolean;
  likes: { id: string }[];
  category: { id: string; name: string };
  author: { name: string | null };
};

export default async function Home() {
  // Vangt alle mogelijke Grade waarden op (inclusief ongeldige waarden door try-catch)
  const validGrades = Object.values(Grade);
  
  let newestPrompts: RawPrompt[] = [];
  let popularPrompts: RawPrompt[] = [];
  
  try {
    // Probeer eerst de normale query met filtering op geldige grades
    const [prismaNewestPrompts, prismaPopularPrompts] = await Promise.all([
      prisma.prompt.findMany({
        where: {
          isApproved: true
        },
        include: {
          category: true,
          author: {
            select: {
              name: true
            }
          },
          likes: {
            select: {
              id: true,
              userId: true,
              promptId: true,
              createdAt: true,
            }
          }
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      }),
      prisma.prompt.findMany({
        where: {
          isApproved: true,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
          category: true,
          likes: true,
        },
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
        take: 6,
      }),
    ]);

    // Converteer de Prisma resultaten naar RawPrompt type
    newestPrompts = prismaNewestPrompts as RawPrompt[];
    popularPrompts = prismaPopularPrompts as RawPrompt[];
  } catch (error) {
    console.error("Fout bij ophalen prompts:", error);
    
    // Fallback: gebruik een volledig veilige SQL query
    try {
      const rawNewestPrompts = await prisma.$queryRaw<RawPrompt[]>`
        SELECT p.*, 
          jsonb_agg(
            jsonb_build_object(
              'id', l.id,
              'userId', l.\"userId\",
              'promptId', l.\"promptId\",
              'createdAt', l.\"createdAt\"
            )
          ) as likes,
          jsonb_build_object(
            'id', c.id,
            'name', c.name,
            'createdAt', c.\"createdAt\",
            'updatedAt', c.\"updatedAt\"
          ) as category,
          jsonb_build_object(
            'name', u.name
          ) as author
        FROM "Prompt" p
        LEFT JOIN "Category" c ON p.\"categoryId\" = c.id
        LEFT JOIN "Like" l ON p.id = l.\"promptId\"
        LEFT JOIN "User" u ON p.\"authorId\" = u.id
        WHERE p.\"isApproved\" = true
        GROUP BY p.id, c.id, u.name
        ORDER BY p.\"createdAt\" DESC
        LIMIT 6
      `;
      
      newestPrompts = rawNewestPrompts || [];
      popularPrompts = rawNewestPrompts || [];
      
      // Formatteer de results zodat ze dezelfde structuur hebben als wat Prisma normaliter teruggeeft
      newestPrompts = newestPrompts.map(p => ({
        ...p,
        likes: Array.isArray(p.likes) ? p.likes : (p.likes ? [p.likes] : [])
      }));
      
      popularPrompts = popularPrompts.map(p => ({
        ...p,
        likes: Array.isArray(p.likes) ? p.likes : (p.likes ? [p.likes] : [])
      }));
    } catch (fallbackError) {
      console.error("Fallback query ook mislukt:", fallbackError);
      // Laatste vangnet: lege arrays
      newestPrompts = [];
      popularPrompts = [];
    }
  }

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
        {newestPrompts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newestPrompts.map((prompt) => (
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
          <p className="text-center text-gray-500">Geen prompts gevonden. Wees de eerste die een prompt deelt!</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6 text-[#1E3A8A]">Populaire Prompts</h2>
        {popularPrompts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {popularPrompts.map((prompt) => (
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
          <p className="text-center text-gray-500">Nog geen populaire prompts beschikbaar.</p>
        )}
      </section>
    </main>
  );
} 
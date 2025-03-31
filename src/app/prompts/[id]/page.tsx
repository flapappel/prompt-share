import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PromptActions } from "./prompt-actions";
import { toggleLike } from "./actions";

export default async function PromptPage({
  params,
}: {
  params: { id: string };
}) {
  const prompt = await prisma.prompt.findUnique({
    where: { id: params.id },
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
  });

  if (!prompt) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
          <span>Leerjaar: {prompt.grade}</span>
          <span>•</span>
          <span>Categorie: {prompt.category.name}</span>
          <span>•</span>
          <span>Auteur: {prompt.authorName}</span>
        </div>
        <div className="prose max-w-none mb-8">
          <p className="whitespace-pre-wrap">{prompt.content}</p>
        </div>
        <PromptActions
          promptId={params.id}
          content={prompt.content}
          likesCount={prompt.likes.length}
          hasLiked={prompt.likes.length > 0}
          onLike={toggleLike}
        />
      </div>
    </div>
  );
} 
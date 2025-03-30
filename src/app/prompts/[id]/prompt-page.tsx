"use client";

import { Button } from "@/components/ui/button";
import { Copy, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { likePrompt } from "./actions";

interface PromptPageProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    grade: string;
    authorName: string;
    category: {
      name: string;
    };
    likes: {
      id: string;
    }[];
  };
}

export default function PromptPage({ prompt }: PromptPageProps) {
  const { toast } = useToast();

  async function handleLike() {
    try {
      const result = await likePrompt(prompt.id);
      if (!result.success) {
        toast({
          title: "Fout",
          description: result.error || "Er is een fout opgetreden bij het liken van de prompt",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het liken van de prompt",
        variant: "destructive",
      });
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Gekopieerd",
      description: "De prompt is gekopieerd naar je klembord",
    });
  }

  return (
    <main className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-4">{prompt.title}</h1>
          <div className="flex gap-2 text-sm text-gray-600 mb-6">
            <span>Leerjaar: {prompt.grade}</span>
            <span>•</span>
            <span>Categorie: {prompt.category.name}</span>
            <span>•</span>
            <span>Auteur: {prompt.authorName}</span>
          </div>

          <div className="prose max-w-none mb-8">
            <p className="whitespace-pre-wrap">{prompt.content}</p>
          </div>

          <div className="flex gap-4">
            <Button onClick={handleCopy} variant="outline">
              <Copy className="w-4 h-4 mr-2" />
              Kopieer prompt
            </Button>
            <Button onClick={handleLike} variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              {prompt.likes.length} {prompt.likes.length === 1 ? "Like" : "Likes"}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
} 
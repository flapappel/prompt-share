"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toggleLike } from "./actions";

interface PromptPageProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    grade: string;
    category: {
      name: string;
    };
    authorName: string;
    likes: { id: string }[];
  };
}

export function PromptPage({ prompt }: PromptPageProps) {
  const { toast } = useToast();
  const isLiked = prompt.likes.length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast({
        title: "Gekopieerd!",
        description: "De prompt is gekopieerd naar je klembord.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er is een fout opgetreden bij het kopiëren van de prompt.",
      });
    }
  };

  const handleLike = async () => {
    try {
      const result = await toggleLike(prompt.id);
      if (result.success) {
        toast({
          title: isLiked ? "Unlike" : "Geliked",
          description: isLiked 
            ? "Je hebt de prompt unliked." 
            : "Je hebt de prompt geliked.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Fout",
          description: result.error || "Er is een fout opgetreden bij het liken van de prompt.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er is een fout opgetreden bij het liken van de prompt.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{prompt.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Groep: {prompt.grade}</span>
              <span>•</span>
              <span>Categorie: {prompt.category.name}</span>
              <span>•</span>
              <span>Auteur: {prompt.authorName}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="h-10 w-10"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant={isLiked ? "default" : "outline"}
              size="icon"
              onClick={handleLike}
              className="h-10 w-10"
            >
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{prompt.content}</p>
        </div>
      </Card>
    </div>
  );
} 
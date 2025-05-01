"use client";

import { Prompt } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: Prompt & {
    category: {
      name: string;
    };
    grades: {
      grade: string;
    }[];
    likes: {
      id: string;
    }[];
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isPending, startTransition] = useTransition();
  const [hasLiked, setHasLiked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check of deze prompt al geliked is door deze gebruiker
    const likedPrompts = JSON.parse(localStorage.getItem("likedPrompts") || "[]");
    setHasLiked(likedPrompts.includes(prompt.id));
  }, [prompt.id]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasLiked) {
      toast.error("Je hebt deze prompt al geliked");
      return;
    }

    startTransition(async () => {
      try {
        console.log("Liking prompt:", prompt.id);
        const response = await fetch(`/api/prompts/${prompt.id}/like`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Er is een fout opgetreden bij het liken van de prompt");
        }

        // Sla de gelikete prompt op in localStorage
        const likedPrompts = JSON.parse(localStorage.getItem("likedPrompts") || "[]");
        likedPrompts.push(prompt.id);
        localStorage.setItem("likedPrompts", JSON.stringify(likedPrompts));
        setHasLiked(true);

        console.log("Like successful:", data);
        toast.success("Prompt geliked!");
        router.refresh();
      } catch (error) {
        console.error("Error liking prompt:", error);
        toast.error(error instanceof Error ? error.message : "Er is een fout opgetreden");
      }
    });
  };

  return (
    <Link href={`/prompts/${prompt.id}`}>
      <Card className="h-full hover:bg-accent/50 transition-colors">
        <CardHeader>
          <CardTitle className="line-clamp-2">{prompt.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">{prompt.content}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="secondary">{prompt.category.name}</Badge>
            {prompt.grades.map((grade, index) => (
              <Badge key={index} variant="outline">
                {grade.grade}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={isPending || hasLiked}
              className={`flex items-center gap-1 transition-colors disabled:opacity-50 ${
                hasLiked ? "text-primary" : "hover:text-primary"
              }`}
              title={hasLiked ? "Je hebt deze prompt al geliked" : "Klik om te liken"}
            >
              <Heart className={`h-4 w-4 ${isPending ? "animate-pulse" : ""} ${hasLiked ? "fill-current" : ""}`} />
              <span>{prompt.likes.length}</span>
            </button>
          </div>
          <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true, locale: nl })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
} 
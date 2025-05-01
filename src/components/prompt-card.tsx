"use client";

import { Prompt } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

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
  const router = useRouter();
  const { data: session } = useSession();

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      toast.error("Je moet ingelogd zijn om een prompt te liken");
      router.push("/login");
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

        console.log("Like successful:", data);
        toast.success(data.action === "liked" ? "Prompt geliked!" : "Like verwijderd");
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
              disabled={isPending}
              className="flex items-center gap-1 hover:text-primary transition-colors disabled:opacity-50"
              title={session ? "Klik om te liken" : "Log in om te liken"}
            >
              <Heart className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
              <span>{prompt.likes.length}</span>
            </button>
          </div>
          <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true, locale: nl })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
} 
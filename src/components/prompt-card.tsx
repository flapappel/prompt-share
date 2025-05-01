import { Prompt } from "@prisma/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { nl } from "date-fns/locale";
import { likePrompt } from "@/app/prompts/[id]/actions";
import { useTransition } from "react";
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
  const router = useRouter();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      const formData = new FormData();
      formData.append("promptId", prompt.id);

      const result = await likePrompt(null, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        router.refresh();
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
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <Heart className="h-4 w-4" />
              <span>{prompt.likes.length}</span>
            </button>
          </div>
          <span>{formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true, locale: nl })}</span>
        </CardFooter>
      </Card>
    </Link>
  );
} 
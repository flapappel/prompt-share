"use client";

import { Button } from "@/components/ui/button";
import { Heart, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PromptActionsProps {
  promptId: string;
  content: string;
  likesCount: number;
  hasLiked: boolean;
  onLike: (promptId: string) => Promise<{ success: boolean; error?: string }>;
}

export function PromptActions({ promptId, content, likesCount, hasLiked, onLike }: PromptActionsProps) {
  const { toast } = useToast();

  return (
    <div className="flex gap-4">
      <form action={async () => {
        await onLike(promptId);
      }}>
        <Button
          type="submit"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Heart
            className={`w-4 h-4 ${
              hasLiked ? "fill-current text-red-500" : ""
            }`}
          />
          <span>{likesCount} likes</span>
        </Button>
      </form>
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => {
          navigator.clipboard.writeText(content);
          toast({
            title: "Prompt gekopieerd",
            description: "De prompt is gekopieerd naar je klembord",
          });
        }}
      >
        <Copy className="w-4 h-4" />
        <span>Kopieer prompt</span>
      </Button>
    </div>
  );
} 
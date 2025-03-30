"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { submitPrompt } from "./actions";

interface Category {
  id: string;
  name: string;
}

export default function NewPromptPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        console.log("Opgehaalde categorieën:", data);
        setCategories(data);
      } catch (error) {
        console.error("Fout bij het ophalen van categorieën:", error);
      }
    }

    fetchCategories();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.currentTarget);
      const result = await submitPrompt(formData);

      if (result.success) {
        toast({
          title: "Prompt ingediend",
          description: "Je prompt is succesvol ingediend en wacht op goedkeuring.",
        });
        router.push("/");
      } else {
        toast({
          title: "Fout",
          description: result.error || "Er is een fout opgetreden bij het indienen van de prompt",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het indienen van de prompt",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Nieuwe Prompt Indienen</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Titel
            </label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Geef je prompt een duidelijke titel"
            />
          </div>

          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-2">
              Jouw naam
            </label>
            <Input
              id="authorName"
              name="authorName"
              required
              placeholder="Hoe mogen we je noemen?"
            />
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium mb-2">
              Leerjaar
            </label>
            <Select name="grade" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een leerjaar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Groep 1</SelectItem>
                <SelectItem value="2">Groep 2</SelectItem>
                <SelectItem value="3">Groep 3</SelectItem>
                <SelectItem value="4">Groep 4</SelectItem>
                <SelectItem value="5">Groep 5</SelectItem>
                <SelectItem value="6">Groep 6</SelectItem>
                <SelectItem value="7">Groep 7</SelectItem>
                <SelectItem value="8">Groep 8</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium mb-2">
              Categorie
            </label>
            <Select name="categoryId" required>
              <SelectTrigger>
                <SelectValue placeholder="Selecteer een categorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-2">
              Prompt
            </label>
            <Textarea
              id="content"
              name="content"
              required
              rows={10}
              placeholder="Beschrijf je prompt hier..."
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Bezig met indienen..." : "Prompt indienen"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
} 
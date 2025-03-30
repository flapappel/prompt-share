"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { updatePrompt, deletePrompt, approvePrompt } from "./actions";
import { Category } from "@prisma/client";
import Link from "next/link";

interface EditFormProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    grade: string;
    categoryId: string;
    authorName: string;
    isApproved: boolean;
    likes: { id: string }[];
  };
  categories: Category[];
}

export function EditForm({ prompt, categories }: EditFormProps) {
  async function handleUpdate(formData: FormData) {
    const result = await updatePrompt(formData);
    if (result.success) {
      window.location.href = "/admin";
    } else {
      alert(result.error);
    }
  }

  async function handleDelete(formData: FormData) {
    if (confirm("Weet je zeker dat je deze prompt wilt verwijderen?")) {
      const result = await deletePrompt(formData);
      if (result.success) {
        window.location.href = "/admin";
      } else {
        alert(result.error);
      }
    }
  }

  async function handleApprove(formData: FormData) {
    const result = await approvePrompt(formData);
    if (result.success) {
      window.location.href = "/admin";
    } else {
      alert(result.error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prompt Bewerken</h1>
        <Link href="/admin">
          <Button variant="outline">Terug naar Admin</Button>
        </Link>
      </div>

      <form action={handleUpdate} className="space-y-6">
        <input type="hidden" name="id" value={prompt.id} />
        
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            Titel
          </label>
          <Input
            id="title"
            name="title"
            defaultValue={prompt.title}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="authorName" className="text-sm font-medium">
            Auteur
          </label>
          <Input
            id="authorName"
            name="authorName"
            defaultValue={prompt.authorName}
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="grade" className="text-sm font-medium">
            Groep
          </label>
          <Select name="grade" defaultValue={prompt.grade}>
            <SelectTrigger>
              <SelectValue placeholder="Selecteer een groep" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((grade) => (
                <SelectItem key={grade} value={grade.toString()}>
                  Groep {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Categorie
          </label>
          <Select name="categoryId" defaultValue={prompt.categoryId}>
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

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            Inhoud
          </label>
          <Textarea
            id="content"
            name="content"
            defaultValue={prompt.content}
            required
            className="min-h-[200px]"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="likesCount" className="text-sm font-medium">
            Aantal Likes
          </label>
          <Input
            id="likesCount"
            name="likesCount"
            type="number"
            defaultValue={prompt.likes.length}
            min="0"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isApproved"
            name="isApproved"
            defaultChecked={prompt.isApproved}
          />
          <label htmlFor="isApproved" className="text-sm font-medium">
            Goedgekeurd
          </label>
        </div>

        <Button type="submit">Opslaan</Button>
      </form>

      <div className="flex justify-end gap-2">
        <form action={handleApprove}>
          <input type="hidden" name="id" value={prompt.id} />
          <Button type="submit" variant="secondary">
            Goedkeuren
          </Button>
        </form>
        <form action={handleDelete}>
          <input type="hidden" name="id" value={prompt.id} />
          <Button type="submit" variant="destructive">
            Verwijderen
          </Button>
        </form>
      </div>
    </div>
  );
} 
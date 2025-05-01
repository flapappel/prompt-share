"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { useFormStatus } from "react-dom";
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
import { Grade } from "@prisma/client";
import { updatePrompt, deletePrompt, approvePrompt } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface EditFormProps {
  prompt: {
    id: string;
    title: string;
    content: string;
    categoryId: string;
    grades: { grade: Grade }[];
  };
  categories: { id: string; name: string }[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
      {pending ? "Opslaan..." : "Opslaan"}
    </Button>
  );
}

export function EditForm({ prompt, categories }: EditFormProps) {
  const router = useRouter();
  const [selectedGrades, setSelectedGrades] = useState<Grade[]>(
    prompt.grades.map(g => g.grade)
  );

  const handleGradeChange = (grade: Grade) => {
    setSelectedGrades(prev => {
      if (prev.includes(grade)) {
        return prev.filter(g => g !== grade);
      } else {
        return [...prev, grade];
      }
    });
  };

  const handleSubmit = async (formData: FormData) => {
    formData.append("grades", JSON.stringify(selectedGrades));
    const result = await updatePrompt(null, formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Prompt succesvol bijgewerkt");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Weet je zeker dat je deze prompt wilt verwijderen?")) {
      const formData = new FormData();
      formData.append("id", prompt.id);
      const result = await deletePrompt(null, formData);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Prompt succesvol verwijderd");
        router.push("/admin/prompts");
      }
    }
  };

  const handleApprove = async () => {
    const formData = new FormData();
    formData.append("id", prompt.id);
    const result = await approvePrompt(null, formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Prompt succesvol goedgekeurd");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={prompt.id} />
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Titel
          </label>
          <Input
            id="title"
            name="title"
            defaultValue={prompt.title}
            required
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Inhoud
          </label>
          <Textarea
            id="content"
            name="content"
            defaultValue={prompt.content}
            required
            className="mt-1"
            rows={10}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categorie
          </label>
          <Select name="categoryId" defaultValue={prompt.categoryId}>
            <SelectTrigger className="mt-1">
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Groepen
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.values(Grade).map((grade) => (
              <div key={grade} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={grade}
                  checked={selectedGrades.includes(grade)}
                  onChange={() => handleGradeChange(grade)}
                  className="h-4 w-4 text-[#1E3A8A] border-gray-300 rounded"
                />
                <label htmlFor={grade} className="text-sm text-gray-700">
                  {grade.replace("_", " ")}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <SubmitButton />
          <Button
            type="button"
            variant="outline"
            onClick={handleApprove}
            className="border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A]/10"
          >
            Goedkeuren
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Verwijderen
          </Button>
        </div>
      </form>
    </div>
  );
} 
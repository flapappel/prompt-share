"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grade, Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchPromptProps {
  categories: Category[];
}

const ALL_GRADES = "all_grades";
const ALL_CATEGORIES = "all_categories";

export function SearchPrompt({ categories }: SearchPromptProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedGrade, setSelectedGrade] = useState<string>(searchParams.get("grade") || ALL_GRADES);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || ALL_CATEGORIES);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedGrade && selectedGrade !== ALL_GRADES) params.set("grade", selectedGrade);
    if (selectedCategory && selectedCategory !== ALL_CATEGORIES) params.set("category", selectedCategory);
    
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex gap-4">
        <Input
          placeholder="Zoek naar prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleSearch} className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">
          Zoeken
        </Button>
      </div>
      
      <div className="flex gap-4">
        <Select value={selectedGrade} onValueChange={setSelectedGrade}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecteer groep" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_GRADES}>Alle groepen</SelectItem>
            {Object.values(Grade).map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecteer categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_CATEGORIES}>Alle categorieën</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
} 
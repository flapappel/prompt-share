import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SubmitPromptPage() {
  return (
    <main className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Hoe dien je een prompt in?</h1>
          <Link href="/">
            <Button variant="outline">Terug naar Home</Button>
          </Link>
        </div>

        <div className="prose max-w-none">
          <h2>Stap voor stap: Een prompt indienen</h2>
          <p>
            Hier vind je een handleiding voor het indienen van je prompt bij verschillende I-diensten:
          </p>

          <h3>1. ChatGPT</h3>
          <ol>
            <li>Ga naar <a href="https://chat.openai.com" className="text-blue-600 hover:underline">chat.openai.com</a></li>
            <li>Log in met je account</li>
            <li>Klik op "New Chat"</li>
            <li>Plak je prompt in het tekstveld</li>
            <li>Klik op het pijltje of druk op Enter</li>
          </ol>

          <h3>2. Claude</h3>
          <ol>
            <li>Ga naar <a href="https://claude.ai" className="text-blue-600 hover:underline">claude.ai</a></li>
            <li>Log in met je account</li>
            <li>Klik op "New Chat"</li>
            <li>Plak je prompt in het tekstveld</li>
            <li>Klik op "Send"</li>
          </ol>

          <h3>3. Gemini</h3>
          <ol>
            <li>Ga naar <a href="https://gemini.google.com" className="text-blue-600 hover:underline">gemini.google.com</a></li>
            <li>Log in met je Google account</li>
            <li>Klik op "Start Chat"</li>
            <li>Plak je prompt in het tekstveld</li>
            <li>Klik op het pijltje of druk op Enter</li>
          </ol>

          <div className="bg-yellow-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-2">Tips voor het indienen</h3>
            <ul className="list-disc pl-6">
              <li>Kopieer je prompt van tevoren</li>
              <li>Controleer of alle tekst correct is geplakt</li>
              <li>Wacht op de volledige reactie</li>
              <li>Sla de conversatie op als je tevreden bent</li>
            </ul>
          </div>

          <div className="bg-green-50 p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-2">Na het indienen</h3>
            <p>
              Als je tevreden bent met het resultaat, kun je de prompt delen met andere leerkrachten via Prompt Share. 
              Dit helpt anderen om ook effectief gebruik te maken van I-diensten in hun onderwijs.
            </p>
          </div>

          <div className="mt-8">
            <Link href="/prompts/new">
              <Button>Deel je prompt</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 
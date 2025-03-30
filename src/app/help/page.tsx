import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hoe maak je een goede prompt?",
  description: "Leer hoe je een goede AI-prompt schrijft voor het basisonderwijs",
};

export default function HelpPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">🧠 Hoe schrijf je een goede AI-prompt voor het basisonderwijs?</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">
          Een goede prompt is een duidelijke opdracht aan de AI. Hoe beter je prompt, hoe bruikbaarder de uitkomst. 
          Hieronder zie je een handige structuur die je kunt gebruiken, met voorbeelden die gericht zijn op het basisonderwijs.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">✅ Stap-voor-stap opbouw van een goede prompt</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">1. Beschrijf de taak</h3>
            <p>Begin je prompt met wat je wil dat de AI doet.</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Voorbeeld:</p>
              <p>"Schrijf een begrijpend lezen tekst."</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">2. Simuleer een persona</h3>
            <p>Laat de AI in de huid kruipen van een expert die past bij je opdracht.</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Voorbeeld:</p>
              <p>"Je bent een taalexpert met ervaring in lesmateriaal voor basisscholen."</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">3. Geef de werkwijze in stappen</h3>
            <p>Leg uit hoe de AI de taak moet aanpakken.</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Voorbeeld:</p>
              <p>"Vraag eerst om een onderwerp en tekstsoort. Schrijf vervolgens de tekst. Voeg daarna vijf open vragen en vijf meerkeuzevragen toe, inclusief de antwoorden."</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">4. Specificeer doel en doelgroep</h3>
            <p>Geef duidelijk aan voor wie de tekst is en met welk doel.</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Voorbeeld:</p>
              <p>"De tekst is bedoeld voor leerlingen in groep 5 van het basisonderwijs (8-9 jaar), met als doel hun leesvaardigheid en leesplezier te vergroten."</p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2">5. Formatteer de output</h3>
            <p>Vertel hoe je de tekst eruit wilt laten zien.</p>
            <div className="bg-muted p-4 rounded-lg mt-2">
              <p className="font-medium">Voorbeeld:</p>
              <p>"De tekst bestaat uit vier alinea's met maximaal 400 woorden. Maak de belangrijkste begrippen vetgedrukt."</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">📝 Voorbeeld van een complete prompt</h2>
        <div className="bg-muted p-6 rounded-lg">
          <p>
            Je bent een taalexpert met ervaring in educatief schrijven. Schrijf een begrijpend lezen tekst voor leerlingen in groep 5 van de basisschool (8-9 jaar). 
            Vraag eerst om een onderwerp en tekstsoort. Schrijf een tekst van maximaal 400 woorden, verdeeld over vier alinea's. 
            Maak de belangrijkste begrippen vetgedrukt. Voeg daarna vijf meerkeuzevragen met antwoorden en vijf open vragen toe die passen bij het tekstniveau. 
            Het doel is om leesvaardigheid en leesplezier te stimuleren.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-semibold">Meer informatie</h2>
          <div className="flex gap-4">
            <Link href="/help/ai-tools">
              <Button variant="outline">Hoe gebruik je prompts in AI-tools?</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
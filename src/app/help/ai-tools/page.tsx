import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoe gebruik je prompts in AI-tools? | PromptShare",
  description:
    "Leer hoe je prompts kunt gebruiken in verschillende AI-tools zoals ChatGPT, Microsoft Copilot en Google Gemini.",
};

export default function AIToolsPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">🤖 Hoe gebruik je prompts in AI-tools?</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg mb-6">
          Hier vind je een overzicht van hoe je de prompts kunt gebruiken in verschillende AI-tools. 
          Elke tool heeft zijn eigen manier van werken, maar het principe is hetzelfde.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">ChatGPT</h2>
        <div className="space-y-4">
          <p>
            1. Ga naar <a href="https://chat.openai.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">chat.openai.com</a>
          </p>
          <p>
            2. Start een nieuwe chat
          </p>
          <p>
            3. Kopieer de prompt en plak deze in het chatvenster
          </p>
          <p>
            4. Druk op Enter of klik op het vliegtuigje om de prompt te versturen
          </p>
          <div className="bg-muted p-4 rounded-lg mt-2">
            <p className="font-medium">Tip:</p>
            <p>Je kunt de prompt aanpassen voordat je deze verstuurt. Bijvoorbeeld door specifieke details toe te voegen of aan te passen aan jouw situatie.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Microsoft Copilot</h2>
        <div className="space-y-4">
          <p>
            1. Ga naar <a href="https://copilot.microsoft.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">copilot.microsoft.com</a>
          </p>
          <p>
            2. Kies of je een chat wilt starten of een afbeelding wilt genereren
          </p>
          <p>
            3. Kopieer de prompt en plak deze in het chatvenster
          </p>
          <p>
            4. Druk op Enter of klik op het vliegtuigje om de prompt te versturen
          </p>
          <div className="bg-muted p-4 rounded-lg mt-2">
            <p className="font-medium">Tip:</p>
            <p>Copilot heeft toegang tot het internet, dus je kunt de prompt combineren met actuele informatie of specifieke bronnen.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Google Gemini</h2>
        <div className="space-y-4">
          <p>
            1. Ga naar <a href="https://gemini.google.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">gemini.google.com</a>
          </p>
          <p>
            2. Start een nieuwe chat
          </p>
          <p>
            3. Kopieer de prompt en plak deze in het chatvenster
          </p>
          <p>
            4. Druk op Enter of klik op het vliegtuigje om de prompt te versturen
          </p>
          <div className="bg-muted p-4 rounded-lg mt-2">
            <p className="font-medium">Tip:</p>
            <p>Gemini kan ook afbeeldingen analyseren. Je kunt de prompt combineren met een afbeelding voor meer context.</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Algemene tips</h2>
        <div className="space-y-4">
          <ul>
            <li>Begin met een duidelijke context over wat je wilt bereiken</li>
            <li>Specificeer het gewenste formaat van het antwoord</li>
            <li>Geef aan voor welke doelgroep de content is</li>
            <li>Vermeld eventuele beperkingen of vereisten</li>
            <li>Gebruik duidelijke taal en vermijd ambiguïteit</li>
          </ul>
          <div className="bg-muted p-4 rounded-lg mt-2">
            <p className="font-medium">Belangrijk:</p>
            <p>AI-tools zijn hulpmiddelen en geen vervanging voor professionele expertise. Gebruik de output altijd kritisch en pas deze aan waar nodig.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { Button } from "@/components/ui/button";
import { submitContactMessage } from "./actions";
import { useFormStatus } from "react-dom";
import { useFormState } from "react-dom";

const initialState = {
  message: "",
  type: "",
};

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactMessage, initialState);
  const { pending } = useFormStatus();

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#1E3A8A]">Contact</h1>
        <p className="text-gray-600 mb-8">
          Heb je een vraag of opmerking? Vul het onderstaande formulier in en we nemen zo snel mogelijk contact met je op.
        </p>

        <form action={formAction} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Naam
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-mailadres
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Onderwerp
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Bericht
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            ></textarea>
          </div>

          {state?.message && (
            <div
              className={`p-4 rounded-md ${
                state.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
            disabled={pending}
          >
            {pending ? "Bericht versturen..." : "Verstuur bericht"}
          </Button>
        </form>
      </div>
    </div>
  );
} 
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "./actions";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const result = await submitContact(data);

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage("Bedankt voor je bericht! We nemen zo spoedig mogelijk contact met je op.");
        if (formRef.current) {
          formRef.current.reset();
        }
      }
    } catch (error) {
      console.error("Fout bij het versturen van het bericht:", error);
      setMessage("Er is iets misgegaan. Probeer het later opnieuw.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact</h1>
      <form ref={formRef} onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Naam
          </label>
          <Input
            id="name"
            name="name"
            required
            placeholder="Je naam"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="je@email.nl"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium">
            Onderwerp
          </label>
          <Input
            id="subject"
            name="subject"
            required
            placeholder="Onderwerp van je bericht"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium">
            Bericht
          </label>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Je bericht"
            className="min-h-[150px]"
          />
        </div>
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes("Bedankt") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Verzenden..." : "Verstuur"}
        </Button>
      </form>
    </div>
  );
} 
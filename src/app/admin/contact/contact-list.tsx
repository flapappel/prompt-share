"use client";

import { Button } from "@/components/ui/button";
import { deleteContact } from "./actions";
import { useFormState } from "react-dom";
import { useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { Contact } from "@prisma/client";

type ContactListProps = {
  contacts: Contact[];
};

type DeleteContactState = {
  error?: string;
};

export function AdminContactList({ contacts }: ContactListProps) {
  const [state, formAction] = useFormState<DeleteContactState | null, FormData>(deleteContact, null);

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Fout",
        description: state.error,
      });
    }
  }, [state]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Berichten</h1>
      <div className="space-y-6">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="border rounded-lg p-6 space-y-4 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold">{contact.subject}</h2>
                <p className="text-sm text-gray-500">
                  Van: {contact.name} ({contact.email})
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(contact.createdAt).toLocaleDateString("nl-NL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <form action={formAction}>
                <input type="hidden" name="id" value={contact.id} />
                <Button
                  type="submit"
                  variant="destructive"
                  size="sm"
                >
                  Verwijderen
                </Button>
              </form>
            </div>
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{contact.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { deleteContact } from "./actions";

export default async function AdminContactPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const contacts = await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

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
              <form action={deleteContact}>
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
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminContactList } from "./contact-list";

async function getContacts() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return await prisma.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
}

export default async function AdminContactPage() {
  const contacts = await getContacts();
  
  return <AdminContactList contacts={contacts} />;
} 
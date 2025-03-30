"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export function Nav() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            PromptShare
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/help" className="text-sm hover:underline">
              Leer hoe je een goede prompt maakt
            </Link>
            <Link href="/prompts/new" className="text-sm hover:underline">
              Deel je prompt
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
            {session?.user?.role === "ADMIN" && (
              <Link href="/admin">
                <Button variant="outline">Admin</Button>
              </Link>
            )}
            {session ? (
              <form action="/api/auth/signout" method="post">
                <Button variant="ghost">Uitloggen</Button>
              </form>
            ) : (
              <Link href="/login">
                <Button>Inloggen</Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
} 
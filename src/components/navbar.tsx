import Link from "next/link";
import { Button } from "./ui/button";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import { UserNav } from "./user-nav";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b bg-[#EBF8FF] border-[#1E3A8A]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/promptshare-logo.png"
              alt="PromptShare Logo"
              width={40}
              height={40}
              priority
            />
            <span className="text-xl font-bold text-[#1E3A8A]">PromptShare</span>
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/prompts" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
            Prompts
          </Link>
          <Link href="/help" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
            Leer hoe je een goede prompt maakt
          </Link>
          <Link href="/help/ai-tools" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
            Hoe gebruik je prompts in AI-tools?
          </Link>
          <Link href="/contact" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
            Contact
          </Link>
          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="text-[#7C3AED] hover:text-[#7C3AED]/80">
                  Admin
                </Link>
              )}
              <Link href="/prompts/new">
                <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Deel je prompt</Button>
              </Link>
              <Link href="/api/auth/signout" className="text-[#1E3A8A] hover:text-[#1E3A8A]/80">
                Uitloggen
              </Link>
            </>
          ) : (
            <Link href="/api/auth/signin">
              <Button className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/90">Inloggen</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
} 
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { RegisterButton } from "@/components/auth/register-button";

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Registreren</h2>
          <p className="mt-2 text-gray-600">
            Maak een account aan om te beginnen
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <RegisterButton />
        </div>
      </div>
    </div>
  );
} 
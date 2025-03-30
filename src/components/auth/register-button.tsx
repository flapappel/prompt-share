'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function RegisterButton() {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full"
    >
      Registreren met Google
    </Button>
  );
} 
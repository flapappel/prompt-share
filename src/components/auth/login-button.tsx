'use client';

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full"
    >
      Inloggen met Google
    </Button>
  );
} 
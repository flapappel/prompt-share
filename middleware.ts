import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Deze functie wordt uitgevoerd voor elke request
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Als de gebruiker niet is ingelogd en probeert de admin pagina te bezoeken
  if (!token && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/api/auth/signin", request.url));
  }

  // Als de gebruiker wel is ingelogd maar geen admin is
  if (token && request.nextUrl.pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configureer op welke paden de middleware moet worden uitgevoerd
export const config = {
  matcher: ["/admin/:path*"],
}; 
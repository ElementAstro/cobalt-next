import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/config/languages";

export function middleware(request: NextRequest) {
  const isRedirectEnabled = false;
  if (!isRedirectEnabled) return;
  const pathname = request.nextUrl.pathname;

  // Check if the pathname already includes a supported language
  const pathnameHasLang = SUPPORTED_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLang) return;

  // Detect language from Accept-Language header
  const acceptLanguage = request.headers.get("Accept-Language") || "";
  const detectedLang =
    acceptLanguage
      .split(",")
      .map((lang) => lang.split(";")[0].trim().substring(0, 2))
      .find((lang) => SUPPORTED_LANGUAGES.includes(lang)) || DEFAULT_LANGUAGE;

  // Redirect to the appropriate language path
  return NextResponse.redirect(
    new URL(`/${detectedLang}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next).*)",
    // Optional: only run on root (/) URL
    // '/'
  ],
};

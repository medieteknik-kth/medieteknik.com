import { NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLanguage, supportedLanguages } from "./app/i18n/settings";
import { NextRequest } from "next/server";

acceptLanguage.languages(supportedLanguages);

export const Config = {
  matcher: ['/:language*']
}

export function middleware(request: NextRequest ) {
  let language;
  language = request.headers.get('Accept-Language');
  if(!language) { language = fallbackLanguage; }

  if (language) {
    const primaryLanguage = language.split(',')[0].split('-')[0];
    language = primaryLanguage;
  }

  if(!supportedLanguages.some((locale) => request.nextUrl.pathname.startsWith(`/${locale}`)) 
    && !request.nextUrl.pathname.startsWith('/_next')) {
    return NextResponse.redirect(new URL(`/${language}${request.nextUrl.pathname}`, request.nextUrl));
  }

  return NextResponse.next();
}

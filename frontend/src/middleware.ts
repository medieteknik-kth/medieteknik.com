import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLanguage, supportedLanguages, cookieName } from './app/i18n/settings';
import { NextRequest } from 'next/server';
import { getCookies } from 'next-client-cookies/server';
import { CookieConsent, ServerCookieConsent  } from './utility/CookieManager';

acceptLanguage.languages(supportedLanguages);

export const Config = {
  matcher: ['/:language*']
}

export function middleware(request: NextRequest) {
  const cookies = getCookies();
  const serverConsent = new ServerCookieConsent(request);
  let language;

  language = cookies.get(cookieName)
  if(!language && typeof window !== 'undefined') { language = localStorage.getItem('i18nextLng') }
  if(!language) { language = request.headers.get('Accept-Language')?.split(',')[0].split('-')[0] }
  if(!language) { language = fallbackLanguage }

  // Non-specified language or language not supported
  if(!supportedLanguages.some((locale) => request.nextUrl.pathname.startsWith(`/${locale}`)) 
    && !request.nextUrl.pathname.startsWith('/_next')) {
    const response = NextResponse.redirect(new URL(`/${language}${request.nextUrl.pathname}`, request.nextUrl))
    if(serverConsent.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
      response.cookies.set(cookieName, language, { path: '/' })
    }

    return response;
  }
  
  // Specified language
  if(request.headers.has('Referer')) {
    const refererUrl = new URL(request.headers.get('Referer') as string)
    const language = supportedLanguages.find((locale) => refererUrl.pathname.startsWith(`/${locale}`))
    const response = NextResponse.next()
    if(language) {
      if(serverConsent.isCategoryAllowed(CookieConsent.FUNCTIONAL)) {
        response.cookies.set(cookieName, language, { path: '/' })
      }
    }
    return response;
  }

  return NextResponse.next();
}

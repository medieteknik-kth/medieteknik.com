import { NextResponse } from 'next/server';
import acceptLanguage from 'accept-language';
import { fallbackLanguage, supportedLanguages, cookieName } from './app/i18n/settings';
import { NextRequest } from 'next/server';
import { getCookies } from 'next-client-cookies/server';
import { Cookies } from 'next-client-cookies';
import { CookieConsent, ServerCookieConsent  } from './utility/CookieManager';

acceptLanguage.languages(supportedLanguages);

export const Config = {
  matcher: ['/:language*']
}

function handleLanguage(request: NextRequest, cookies: Cookies, serverConsent: ServerCookieConsent): NextResponse {
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

/**
 * Handle analytics and performance tracking
 * @param request The request object
 * @param cookies The cookies present in the request 
 * @param serverConsent The server cookie consent object
 * @returns The next response object
 */
function handleAnalytics(request: NextRequest, cookies: Cookies, serverConsent: ServerCookieConsent): NextResponse {
  if(window === undefined) return NextResponse.next();

  if(serverConsent.isCategoryAllowed(CookieConsent.ANALYTICS)) {
    try {
      fetch('https://.../analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

      })
    })
    } catch (error) {
      console.error(error)
    }
  }

  if(serverConsent.isCategoryAllowed(CookieConsent.PERFORMANCE)) {
    try {
      fetch('https://.../performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({

      })
    })
    } catch (error) {
      console.error(error)
    }
  }

  return NextResponse.next();
}

export function middleware(request: NextRequest) {
  const cookies = getCookies();
  const serverConsent = new ServerCookieConsent(request);

  let response = handleLanguage(request, cookies, serverConsent);
  // response = handleAnalytics(request, cookies, serverConsent);

  return response;
}

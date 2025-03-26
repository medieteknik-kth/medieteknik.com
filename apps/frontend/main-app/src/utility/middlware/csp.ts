/**
 * @name generateCSP
 * @description Generates a Content Security Policy (CSP) string based on the provided nonce and environment.
 *
 * @param {string} nonce - The nonce to be used in the CSP.
 * @returns {string} - The generated CSP string.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 */
export function generateCSP(nonce: string): string {
  return `default-src 'self'; 
   script-src 'self' 'nonce-${nonce}' 'unsafe-inline' ${process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''};
   connect-src 'self' ${process.env.NODE_ENV === 'development' ? 'http://localhost:80 http://localhost:* ws://localhost:3000' : 'ws://medieteknik.com https://api.medieteknik.com'} https://vercel.live https://www.kth.se wss://ws-us3.pusher.com blob: https://storage.googleapis.com https://va.vercel-scripts.com;
   media-src blob:; 
   img-src 'self' https://storage.googleapis.com https://vercel.live https://vercel.com https://i.ytimg.com data: blob:; 
   style-src 'self' https://vercel.live 'unsafe-inline'; 
   font-src 'self' https://vercel.live https://assets.vercel.com;
   frame-src 'self' https://www.youtube.com/ https://www.instagram.com https://vercel.live; 
   object-src 'none'; 
   base-uri 'none'; 
   form-action 'self'; 
   frame-ancestors 'none'; 
   manifest-src 'self'; 
   worker-src 'self'; 
   script-src-elem 'self' https://vercel.live https://va.vercel-scripts.com 'nonce-${nonce}';`.replace(
    /\s+/g,
    ' '
  )
}

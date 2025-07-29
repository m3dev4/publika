import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes publiques qui ne nécessitent pas d'authentification
  const publicRoutes = [
    '/auth/login',
    '/auth/register', 
    '/auth/verify-email',
    '/auth/verify-success',
    '/api',
    '/_next',
    '/favicon.ico'
  ];

  // Routes protégées qui nécessitent une authentification complète
  const protectedRoutes = [
    '/home',
    '/profiles',
    '/dashboard'
  ];

  // Routes qui nécessitent seulement une vérification d'email
  const emailVerifiedRoutes = [
    '/onboarding'
  ];

  // Vérifier si la route est publique
  const isPublicRoute = publicRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Si c'est une route publique, laisser passer
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Récupérer les données d'authentification depuis les cookies ou headers
  // Note: Dans un vrai projet, vous devriez utiliser JWT ou session cookies
  const authCookie = request.cookies.get('auth-storage');
  let authData = null;

  if (authCookie) {
    try {
      const parsedData = JSON.parse(authCookie.value);
      authData = parsedData.state;
    } catch (error) {
      console.error('Erreur parsing auth cookie:', error);
    }
  }

  const isAuthenticated = authData?.isAuthenticated || false;
  const user = authData?.user;
  const hasCompletedOnboarding = user?.onboarding || false;

  // Vérifier les routes protégées
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  const isEmailVerifiedRoute = emailVerifiedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Si l'utilisateur essaie d'accéder à une route protégée
  if (isProtectedRoute) {
    if (!isAuthenticated) {
      // Pas authentifié -> rediriger vers login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    
    if (!hasCompletedOnboarding) {
      // Authentifié mais pas d'onboarding -> rediriger vers onboarding
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Si l'utilisateur essaie d'accéder à l'onboarding
  if (isEmailVerifiedRoute) {
    // Permettre l'accès à onboarding même sans cookie
    // La page onboarding elle-même gérera la redirection si nécessaire
    if (authData && hasCompletedOnboarding) {
      // Onboarding déjà terminé -> rediriger vers home
      return NextResponse.redirect(new URL('/home', request.url));
    }
    // Laisser passer pour que la page onboarding gère l'authentification côté client
  }

  // Empêcher les utilisateurs authentifiés d'accéder aux pages d'auth
  if (isAuthenticated && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
    if (hasCompletedOnboarding) {
      return NextResponse.redirect(new URL('/home', request.url));
    } else {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Redirection de la page racine
  if (pathname === '/') {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    } else if (!hasCompletedOnboarding) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    } else {
      return NextResponse.redirect(new URL('/home', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

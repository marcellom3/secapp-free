import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware para proteger rotas da aplicação
 */
export function middleware(request: NextRequest) {
  // Verifica se é uma rota protegida
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('secapp_session')?.value
    const timestamp = request.cookies.get('secapp_timestamp')?.value

    // Se não tem sessão, redireciona para home
    if (!session || session !== 'true') {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Verifica expiração da sessão (30 minutos)
    if (timestamp) {
      const elapsed = Date.now() - parseInt(timestamp)
      const thirtyMinutes = 30 * 60 * 1000

      if (elapsed > thirtyMinutes) {
        const response = NextResponse.redirect(new URL('/', request.url))
        response.cookies.delete('secapp_session')
        response.cookies.delete('secapp_timestamp')
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

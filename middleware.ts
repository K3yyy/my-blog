// middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
    const response = NextResponse.next()

    console.log('[Middleware] Incoming cookies:', request.headers.get('cookie'))

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    const cookie = request.cookies.get(name)
                    console.log(`[Cookie read] ${name}:`, cookie ? cookie.value.substring(0, 20) + '...' : 'missing')
                    return cookie?.value
                },
                set(name, value, options) {
                    response.cookies.set(name, value, options)
                },
                remove(name, options) {
                    response.cookies.delete(name)
                },
            },
        }
    )

    const { data: { session } } = await supabase.auth.getSession()

    console.log('[Middleware session]', {
        path: request.nextUrl.pathname,
        hasSession: !!session,
        user: session?.user?.email || 'no-user',
    })

    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!session?.user) {
            console.log('[Middleware] Redirecting to login - no session')
            const url = new URL('/login', request.url)
            url.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
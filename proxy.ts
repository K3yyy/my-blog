// proxy.ts
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
    // Create a response object we can modify (cookies, etc.)
    const response = NextResponse.next()

    console.log('[Proxy] Incoming cookies:', request.headers.get('cookie'))

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name) {
                    const cookie = request.cookies.get(name)
                    console.log(
                        `[Cookie read] ${name}:`,
                        cookie ? cookie.value.substring(0, 20) + '...' : 'missing'
                    )
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

    console.log('[Proxy session]', {
        path: request.nextUrl.pathname,
        hasSession: !!session,
        user: session?.user?.email || 'no-user',
    })

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        if (!session?.user) {
            console.log('[Proxy] Redirecting to login - no session')
            const url = new URL('/login', request.url)
            url.searchParams.set('redirect', request.nextUrl.pathname)
            return NextResponse.redirect(url)
        }
    }

    // Always return the (possibly modified) response
    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
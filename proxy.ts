// proxy.ts
// Required file name for Next.js 16+ (replaces the old middleware.ts)

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Define which paths should be protected
    const protectedPaths = [
        '/edit-article',
        '/new-article',
        '/set-article',
    ]

    // Check if current request matches any protected path
    const isProtectedRoute = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    // Allow public access to everything else
    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // ── Basic Authentication (browser popup) ───────────────────────────────
    const authHeader = request.headers.get('authorization')

    // No credentials provided → show login popup
    if (!authHeader) {
        return new NextResponse('if you are not Keyy, This route is not for you!!', {
            status: 401,
            headers: {
                'WWW-Authenticate': 'Basic realm="Admin Area"',
            },
        })
    }

    // Parse the Authorization header
    const [scheme, encodedCredentials] = authHeader.split(' ')

    if (scheme?.toLowerCase() !== 'basic' || !encodedCredentials) {
        return new NextResponse('Invalid authentication format', { status: 401 })
    }

    // Decode base64 → username:password
    const decoded = Buffer.from(encodedCredentials, 'base64').toString()
    const [providedUsername, providedPassword] = decoded.split(':', 2)

    // Load expected credentials from environment variables
    const expectedUsername = process.env.ADMIN_USERNAME || 'adminKeyy'
    const expectedPassword = process.env.ADMIN_PASSWORD

    // Safety check: prevent running without password set
    if (!expectedPassword) {
        console.error('Missing ADMIN_PASSWORD environment variable')
        return new NextResponse('Server configuration error', { status: 500 })
    }

    // Validate credentials
    if (
        providedUsername === expectedUsername &&
        providedPassword === expectedPassword
    ) {
        return NextResponse.next()
    }

    // Wrong credentials → custom message + ask again
    return new NextResponse('if you are not Keyy, This route is not for you!!', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
    })
}

// Only apply this proxy to the specified routes
// Use :path* for dynamic segments like [slug]
export const config = {
    matcher: [
        '/edit-article/:path*',
        '/new-article',
        '/set-article',
    ],
}
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    // Protected paths (now with /admin/ prefix)
    const protectedPaths = [
        '/admin/edit-article',
        '/admin/new-article',
        '/admin/set-article',
    ]

    const isProtected = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    )

    if (!isProtected) {
        return NextResponse.next()
    }

    // Basic Auth popup
    const authHeader = request.headers.get('authorization')

    if (!authHeader) {
        return new NextResponse('if you are not Keyy, This route is not for you!!', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
        })
    }

    const [scheme, encoded] = authHeader.split(' ')
    if (scheme?.toLowerCase() !== 'basic' || !encoded) {
        return new NextResponse('Invalid authentication format', { status: 401 })
    }

    const decoded = Buffer.from(encoded, 'base64').toString()
    const [username, password] = decoded.split(':', 2)

    const expectedUsername = process.env.ADMIN_USERNAME || 'keyy'
    const expectedPassword = process.env.ADMIN_PASSWORD

    if (!expectedPassword) {
        console.error('ADMIN_PASSWORD is not set!')
        return new NextResponse('Server error', { status: 500 })
    }

    if (username === expectedUsername && password === expectedPassword) {
        return NextResponse.next()
    }

    return new NextResponse('if you are not Keyy, This route is not for you!!', {
        status: 401,
        headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' },
    })
}

export const config = {
    matcher: [
        '/admin/edit-article/:path*',
        '/admin/new-article',
        '/admin/set-article',
    ],
}
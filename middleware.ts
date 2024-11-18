import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
// import { decodeCookie } from './lib/utils/TokenDecoder'
// import jwt from 'jsonwebtoken'

// interface JwtPayload {
//   id: string;
//   email: string;
//   position: string;
// }
 
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path.startsWith('/auth')

    const token = request.cookies.get('token')?.value || ''

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/', request.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/auth/sign-in', request.nextUrl))
    }
}
 
export const config = {
  matcher: [
    '/',
    '/driver/:path*',
    '/admin/:path*',
    '/mechanic/:path*',
    '/auth/:path*',
  ],
}
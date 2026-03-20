import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // TEMPORARILY DISABLE ALL MIDDLEWARE FOR DEBUGGING
  // This will allow all routes without any checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

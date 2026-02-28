'use client'

import { createClient } from '@supabase/supabase-js'
import { useMemo } from 'react'
import {createBrowserClient} from "@supabase/ssr";

// Singleton pattern – only create once
let cachedClient: ReturnType<typeof createClient> | null = null

export function getSupabaseClient() {
    if (cachedClient) return cachedClient

    cachedClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    return cachedClient
}

export const createClients = () =>
    createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

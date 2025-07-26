// src/lib/supabase.ts
// Supabase client configuration for Helixar Blueprint Insight. Handles database connections and queries securely.
// Designed for reliability and ease of use.

import { createClient } from '@supabase/supabase-js'; // Supabase JavaScript client library

// Retrieve Supabase URL and Anon Key from environment variables.
// The `!` (non-null assertion operator) is used here assuming these variables are always defined at runtime.
// In a production environment, ensure these are robustly set.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * The Supabase client instance.
 * This client is used to interact with your Supabase database, authentication, and storage services.
 * @see https://supabase.com/docs/reference/javascript/initializing for more details.
 * Potential Vulnerability: Exposing `NEXT_PUBLIC_SUPABASE_ANON_KEY` is generally safe for client-side usage
 * (as it's read-only access for non-authenticated users), but the `service_role` key must NEVER be exposed client-side.
 * Always use server-side API routes for operations requiring elevated privileges.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 
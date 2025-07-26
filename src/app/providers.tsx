// src/app/providers.tsx
// Providers component for Helixar Blueprint Insight. Wraps the app with React Context providers (TanStack Query, NextAuth Session, etc.).
// Ensures global state and context are available throughout the app.

'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // TanStack Query client and provider for data fetching and caching
import { SessionProvider } from 'next-auth/react'; // NextAuth provider to make session available to client components
import React from 'react'; // Explicitly import React for JSX transform
import { Session } from 'next-auth'; // Type definition for NextAuth session

// Initialize a new QueryClient instance outside the component to prevent re-creation on re-renders.
const queryClient = new QueryClient();

/**
 * Providers component wraps the application with client-side contexts.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to be rendered within the providers.
 * @param {Session | null} props.session - The NextAuth session object, passed from the server (RootLayout).
 */
export function Providers({ children, session }: { children: React.ReactNode, session: Session | null }) {
  return (
    // SessionProvider makes the NextAuth session object available to all nested client components.
    // This is crucial for authentication state across the application.
    <SessionProvider session={session}>
      {/* QueryClientProvider makes TanStack Query hooks (e.g., useQuery, useMutation) available. */}
      {/* It manages data caching, revalidation, and background fetching. */}
      <QueryClientProvider client={queryClient}>
        {/* Render all child components passed to the Providers. */}
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
} 
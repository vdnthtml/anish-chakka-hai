// src/app/page.tsx
// Root page for Helixar Blueprint Insight. Renders the main Dashboard and serves as the entry point for the root route (/).
// Designed as a client component to leverage client-side hooks and interactivity.

'use client';

import Dashboard from '@/components/Dashboard';

/**
 * Home component renders the main Dashboard for the application.
 * This component serves as the entry point for the root route (/).
 * It's a client component because the Dashboard relies on client-side hooks like `useState` and `useRouter`.
 */
export default function Home() {
  return <Dashboard />;
}

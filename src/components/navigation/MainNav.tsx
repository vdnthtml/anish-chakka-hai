// src/components/navigation/MainNav.tsx
// Main navigation bar for Helixar Blueprint Insight. Provides links to key app sections and integrates authentication showcase.
// Designed for accessibility and responsive navigation.

'use client';

import Link from 'next/link'; // Next.js Link component for client-side navigation
import AuthShowcase from '@/components/AuthShowcase'; // Component to display auth status and actions
import React from 'react'; // Explicitly import React for JSX transform

/**
 * MainNav component.
 * Renders the primary navigation bar with links to key application pages and the authentication status.
 */
export default function MainNav() {
  return (
    // Navigation container with basic styling for a top bar.
    <nav className="p-4 bg-gray-800 text-white flex space-x-4">
      {/* Link to the Zustand example page. */}
      <Link href="/zustand-example" className="hover:underline">
        Zustand Example
      </Link>
      {/* Link to the TanStack Query example page. */}
      <Link href="/tanstack-example" className="hover:underline">
        TanStack Query Example
      </Link>
      {/* AuthShowcase component displays sign-in/sign-out buttons. */}
      <AuthShowcase />
    </nav>
  );
} 
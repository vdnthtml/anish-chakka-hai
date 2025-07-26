// src/app/layout.tsx
// Root layout for the Next.js application. Sets up global styles, fonts, providers, and error boundaries.
// Ensures consistent look and feel across the app and handles server-side session fetching for authentication.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google"; // Import Google Fonts for optimal performance
import "./globals.css"; // Import global Tailwind CSS and custom styles
import { Providers } from './providers'; // Client component that provides React Contexts (TanStack Query, NextAuth Session)
import { getServerSession } from "next-auth"; // Server-side function to get session data
import { authOptions } from "./api/auth/[...nextauth]/route"; // Authentication options for NextAuth
import MainNav from '@/components/navigation/MainNav'; // Client component for main navigation
import ErrorBoundary from '@/components/ErrorBoundary'; // Client component to catch and display UI errors
import React from "react"; // Explicitly import React for JSX transform

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Metadata for the application.
 * This object is automatically used by Next.js to populate <head> tags.
 */
export const metadata: Metadata = {
  title: "Helixar Blueprint Insight", // Comprehensive and descriptive title
  description: "AI-powered video content analysis platform.", // Clear description for SEO and social sharing
};

/**
 * RootLayout component is a Server Component that wraps the entire application.
 * It sets up the HTML structure, global styling, and provides data (like session) to client components.
 * @param {Readonly<{ children: React.ReactNode }>} { children } The child components/pages to be rendered.
 */
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session data on the server-side before rendering the layout.
  // This ensures session information is available early for client components that need it.
  const session = await getServerSession(authOptions);

  return (
    <html lang="en"> {/* Set language for accessibility */}
      <body
        // Apply global font styles using CSS variables defined by next/font and Tailwind CSS.
        // The `antialiased` class improves font rendering on some operating systems.
        className={`${geistSans.variable} ${geistMono.variable.split(" ")[0]} antialiased`}
      >
        {/* ErrorBoundary catches errors in the rendering tree and displays a fallback UI. */}
        <ErrorBoundary>
          {/* Providers is a client component that wraps the application with various contexts
              like TanStack Query and NextAuth Session. The 'session' prop is passed from the server. */}
          <Providers session={session}>
            {/* MainNav is a client component for navigation links and authentication UI. */}
            <MainNav />
            {/* Render the actual page content or child layout. */}
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

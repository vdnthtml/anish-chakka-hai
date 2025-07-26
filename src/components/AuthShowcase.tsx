// src/components/AuthShowcase.tsx
// This client component displays user authentication status and provides sign-in/sign-out functionalities.
// It uses NextAuth.js client-side hooks to interact with the authentication session.

'use client';

import { useSession, signIn, signOut } from 'next-auth/react'; // NextAuth hooks for session management and authentication actions
import { Button } from '@/components/ui/button'; // Reusable Button component from shadcn/ui
import React from 'react'; // Explicitly import React for JSX transform

/**
 * AuthShowcase component.
 * Renders a personalized greeting and a sign-out button if the user is authenticated,
 * otherwise, it renders a sign-in button.
 * This component must be a Client Component because it uses `useSession` and `signIn`/`signOut` hooks.
 */
export default function AuthShowcase() {
  const { data: session } = useSession(); // Fetch the client-side session data.

  // If a session exists, the user is signed in.
  if (session) {
    return (
      <div className="flex items-center space-x-2"> {/* Flex container for alignment */}
        {/* Display the user's email or a default message if not available. */}
        <p className="text-white text-sm">Signed in as {session.user?.email || 'User'}</p>
        {/* Sign out button: calls NextAuth's signOut function on click. */}
        <Button
          onClick={() => signOut()} // Triggers the sign-out process
          variant="secondary" // Use a secondary button style for sign-out
          size="sm" // Small size button for navigation bar
        >
          Sign out
        </Button>
      </div>
    );
  }

  // If no session exists, the user is not signed in.
  return (
    <Button
      onClick={() => signIn()} // Triggers the sign-in process
      variant="default" // Use a default button style for sign-in
      size="sm" // Small size button for navigation bar
    >
      Sign in
    </Button>
  );
} 
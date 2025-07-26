// src/app/api/auth/[...nextauth]/route.ts
// NextAuth authentication API route for Helixar Blueprint Insight. Handles user authentication, session management, and provider configuration.
// Designed for security and seamless integration with the app.

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"; // Provider for email/password authentication
import { JWT } from "next-auth/jwt"; // Type for JSON Web Token
import { Session } from "next-auth"; // Type for NextAuth session
import { supabase } from "@/lib/supabase"; // Import the Supabase client for authentication

/**
 * `authOptions` defines the authentication configuration for NextAuth.js.
 * This object is passed to `NextAuth` to set up providers, callbacks, and pages.
 * It's explicitly exported to be used by `getServerSession` in server components (e.g., `layout.tsx`).
 */
export const authOptions = {
  // Define authentication providers. Here, we use CredentialsProvider for email/password.
  providers: [
    CredentialsProvider({
      name: "Credentials", // Display name on the sign-in form
      // Define the credentials expected for sign-in (e.g., email and password).
      credentials: {
        username: { label: "Email", type: "email" }, // Changed to email for Supabase authentication
        password: { label: "Password", type: "password" }
      },
      /**
       * The `authorize` function handles the user authentication logic.
       * It receives user-provided credentials and should return a User object on success, or null on failure.
       * @param {Record<string, string> | undefined} credentials - User-provided credentials (email, password).
       * @returns {Promise<User | null>}
       * @throws {Error} If there's an issue with authentication (e.g., network error with Supabase).
       * Potential Vulnerability: Basic credentials validation. In a real application, implement rate limiting
       * and stricter password policies to prevent brute-force attacks.
       */
      async authorize(credentials) {
        // Basic validation: Ensure email and password are provided.
        if (!credentials?.username || !credentials.password) {
          console.warn("Authorization attempt: Missing email or password.");
          return null;
        }

        // Authenticate with Supabase using email and password.
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.username,
          password: credentials.password,
        });

        // Handle Supabase authentication errors.
        if (error) {
          console.error("Supabase sign-in error:", error.message);
          // For security, avoid returning specific error messages to the client.
          return null;
        }

        // If authentication is successful and a user object is returned by Supabase.
        if (data.user) {
          // Return a minimal user object. Only expose necessary public information.
          // The `id` is crucial for linking sessions to users.
          return { id: data.user.id, name: data.user.email, email: data.user.email };
        } else {
          console.warn("Authorization attempt: No user data returned from Supabase.");
          return null;
        }
      }
    })
  ],
  // Define custom pages for authentication flow (e.g., sign-in page).
  // By default, NextAuth provides built-in pages, but custom ones offer better UX.
  pages: {
    signIn: '/', // Redirect to the home page for sign in attempts
  },
  // Callbacks allow control over the session and JWT lifecycle.
  callbacks: {
    /**
     * The `session` callback is called whenever a session is checked.
     * It's a good place to add custom data to the session object that will be available client-side.
     * @param {object} params - Parameters including session and token.
     * @param {Session} params.session - The current session object.
     * @param {JWT} params.token - The JWT token containing user info.
     * @returns {Promise<Session>}
     */
    async session({ session, token }: { session: Session, token: JWT }) {
      // Add the user's ID from the JWT token to the session object.
      // This ID is often used to link frontend actions to a specific user in the database.
      session.user.id = token.sub as string; // Asserting type as 'sub' (subject) from JWT is typically a string
      return session;
    },
  },
  // Potential Vulnerability: Production secret. NEXTAUTH_SECRET should be a long, random string (e.g., 32+ characters).
  // Generate using `openssl rand -base64 32` or similar. Store securely in environment variables.
  // This secret is used to sign and encrypt JWTs and sessions.
  // It should never be hardcoded and vary between development and production.
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is set securely in .env.local or production environment
};

// Create the NextAuth handler with the defined authentication options.
const handler = NextAuth(authOptions);

// Export the handler for GET and POST requests.
// Next.js API routes catch all requests to this path and route them to NextAuth.js.
export { handler as GET, handler as POST }; 
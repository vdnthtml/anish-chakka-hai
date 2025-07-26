// src/components/ErrorBoundary.tsx
// This is a React Error Boundary component used to catch JavaScript errors
// anywhere in its child component tree, log those errors, and display a fallback UI.
// It is marked as a client component because it uses React lifecycle methods for error handling.

'use client';

import React from 'react'; // Explicitly import React

/**
 * Props for the ErrorBoundary component.
 * @interface ErrorBoundaryProps
 * @property {React.ReactNode} children - The child components that the ErrorBoundary will protect.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

/**
 * State for the ErrorBoundary component.
 * @interface ErrorBoundaryState
 * @property {boolean} hasError - Indicates if an error has been caught.
 * @property {Error | null} error - The error object that was caught.
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary React Class Component.
 * Implements `componentDidCatch` and `static getDerivedStateFromError` to handle errors.
 * When an error occurs in its children, it updates its state to display a fallback UI.
 * Best Practice: In a production application, integrate with an error reporting service (e.g., Sentry, Bugsnag).
 * Potential Vulnerability: Avoid exposing sensitive error details (e.g., database queries, API keys) directly to the user
 * in production. Customize the fallback UI to show only generic messages.
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * `getDerivedStateFromError` is called after an error has been thrown by a descendant component.
   * It receives the error as an argument and should return a value to update state.
   * @param {Error} error - The error that was thrown.
   * @returns {ErrorBoundaryState} Updated state to reflect the error.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  /**
   * `componentDidCatch` is called after an error has been thrown by a descendant component.
   * It receives the error and an object with `componentStack` information.
   * This is a good place to log error information to an external error reporting service.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} errorInfo - An object with `componentStack` information.
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service (e.g., Sentry, LogRocket).
  }

  /**
   * Renders the children components, or a fallback UI if an error has been caught.
   * The fallback UI provides basic error information for debugging in development.
   */
  render() {
    if (this.state.hasError) {
      // Fallback UI displayed when an error occurs.
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
          <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong.</h1>
          <p className="text-lg mb-2">We apologize for the inconvenience. Please try again later.</p>
          {/* Display error message and stack in development for easier debugging. */}
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <div className="w-full max-w-lg mt-4 p-4 bg-red-200 rounded-md shadow-inner">
              <p className="font-semibold text-red-900 mb-2">Error Details:</p>
              <p className="text-sm mb-2">Message: {this.state.error.message}</p>
              <pre className="bg-red-300 p-3 rounded-sm text-xs whitespace-pre-wrap overflow-auto max-h-60">
                Stack: {this.state.error.stack}
              </pre>
            </div>
          )}
        </div>
      );
    }

    // Render the normal children if no error has occurred.
    return this.props.children;
  }
}

export default ErrorBoundary; 
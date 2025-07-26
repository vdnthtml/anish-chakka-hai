// src/components/Sidebar.tsx
// Sidebar navigation for Helixar Blueprint Insight. Provides quick access to main app sections and is styled for clarity and usability.

'use client';

import React from 'react'; // Explicitly import React
import Link from 'next/link'; // Next.js Link component for navigation
import { Home, PlusSquare, Settings, Terminal } from 'lucide-react'; // Icons for navigation items
import { Button } from '@/components/ui/button'; // Reusable Button component from shadcn/ui
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'; // Tooltip components for interactive hints

/**
 * Sidebar component.
 * Renders a responsive sidebar with navigation links.
 * In a full implementation, this might include state for collapse/expand functionality.
 */
export default function Sidebar() {
  return (
    // Main sidebar container. Fixed width and styling for a consistent look.
    <aside className="group flex flex-col items-center justify-between gap-4 py-4 md:py-8 bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-16 md:w-20 lg:w-24 xl:w-28 flex-shrink-0 transition-all duration-300">
      {/* Top section with Logo/App Name (placeholder for now) */}
      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center justify-center h-10 w-10 text-xl font-bold rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
          H
        </Link>
        {/* Navigation Links */}
        <nav className="grid gap-2">
          {/* Home Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground"
                asChild
              >
                <Link href="/">
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          {/* New Blueprint Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="New Blueprint"
                asChild
              >
                <Link href="/new">
                  <PlusSquare className="h-5 w-5" />
                  <span className="sr-only">New Blueprint</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Blueprint</TooltipContent>
          </Tooltip>
          {/* Blueprint Terminal Link (Example for ID 1) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Blueprint Terminal"
                asChild
              >
                <Link href="/blueprint/1">
                  <Terminal className="h-5 w-5" />
                  <span className="sr-only">Terminal</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Blueprint Terminal</TooltipContent>
          </Tooltip>
          {/* Settings Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
                asChild
              >
                <Link href="/settings">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </div>

      {/* Bottom section (can be used for user profile, theme toggle, etc.) */}
      <div className="mt-auto flex flex-col items-center gap-4">
        {/* Placeholder for future bottom-aligned elements, e.g., user avatar, theme toggle */}
      </div>
    </aside>
  );
}
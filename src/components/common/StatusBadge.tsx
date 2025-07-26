// src/components/common/StatusBadge.tsx
// This reusable client component renders a styled badge indicating a status (completed, processing, failed).
// The badge's appearance (background and text color) dynamically changes based on the status provided.

import { Badge } from '@/components/ui/badge'; // Shadcn/ui Badge component
import { cn } from '@/lib/utils'; // Utility function for conditionally joining Tailwind CSS classes
import React from 'react'; // Explicitly import React for JSX transform

/**
 * Props for the StatusBadge component.
 * @interface StatusBadgeProps
 * @property {'completed' | 'processing' | 'failed'} status - The status to display.
 *   This dictates the color of the badge based on predefined Tailwind classes in `tailwind.config.ts`.
 */
interface StatusBadgeProps {
  status: 'completed' | 'processing' | 'failed';
}

/**
 * `getStatusColor` utility function.
 * Returns the appropriate Tailwind CSS classes for the badge's background and text color
 * based on the provided status. These colors are defined in `tailwind.config.ts`.
 * @param {StatusBadgeProps['status']} status - The status of the item.
 * @returns {string} Tailwind CSS classes for coloring the badge.
 */
const getStatusColor = (status: StatusBadgeProps['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-audio text-white'; // Using custom color from tailwind.config.ts
    case 'processing':
      return 'bg-clarity text-black'; // Using custom color from tailwind.config.ts
    case 'failed':
      return 'bg-visuals text-white'; // Using custom color from tailwind.config.ts
    default:
      return 'bg-secondary text-foreground'; // Default fallback colors
  }
};

/**
 * StatusBadge component.
 * Renders a badge with dynamic styling based on the provided status.
 * Useful for indicating the state of items (e.g., blueprint processing status).
 * @param {StatusBadgeProps} props - The component props.
 */
export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    // The Badge component from shadcn/ui is used for consistent styling.
    // `cn` utility combines base classes with dynamically determined status colors.
    <Badge className={cn("absolute top-2 right-2", getStatusColor(status))}> {/* Positioning and dynamic styling */}
      {status} {/* Display the status text */}
    </Badge>
  );
} 
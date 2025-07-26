// src/components/dashboard/BlueprintCard.tsx
// This client component displays an individual blueprint item as a clickable card.
// It includes a thumbnail, title, duration, status, clarity score, and an 'Analyze' button.
// It utilizes Next.js's useRouter for navigation and next/image for optimized image display.

'use client';

import { Play } from 'lucide-react'; // Icon for the 'Analyze' button
import { Button } from '@/components/ui/button'; // Reusable Button component from shadcn/ui
import StatusBadge from '@/components/common/StatusBadge'; // Reusable component for displaying status with dynamic colors
import { useRouter } from 'next/navigation'; // Next.js hook for client-side navigation
import Image from 'next/image'; // Next.js Image component for optimized image loading
import React from 'react'; // Explicitly import React for JSX transform

/**
 * Props for the BlueprintCard component.
 * @interface BlueprintCardProps
 * @property {string} id - Unique identifier for the blueprint, used for navigation.
 * @property {string} title - The title of the blueprint.
 * @property {string} thumbnail - URL or path to the blueprint's thumbnail image.
 * @property {string} duration - Formatted duration of the blueprint content (e.g., "05:30").
 * @property {'completed' | 'processing' | 'failed'} status - The current processing status of the blueprint.
 * @property {number} clarityScore - The AI-generated clarity score (0-100), relevant if status is 'completed'.
 * @property {string} createdAt - Formatted string indicating when the blueprint was created (e.g., "2 hours ago").
 */
interface BlueprintCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  status: 'completed' | 'processing' | 'failed';
  clarityScore: number;
  createdAt: string;
}

/**
 * BlueprintCard component.
 * Displays a single blueprint's details in a card format.
 * Clicking the card or the 'Analyze' button navigates to the blueprint's terminal page.
 * @param {BlueprintCardProps} props - The component props.
 */
export default function BlueprintCard({
  id,
  title,
  thumbnail,
  duration,
  status,
  clarityScore,
  createdAt,
}: BlueprintCardProps) {
  const router = useRouter(); // Initialize Next.js router for navigation

  /**
   * Handles the click event on the 'Analyze' button.
   * Prevents event propagation to avoid triggering the parent card's click handler.
   * Navigates to the specific blueprint terminal page.
   * @param {React.MouseEvent} event - The mouse event object.
   */
  const handleAnalyzeClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event bubbling to prevent card click
    router.push(`/blueprint/${id}`); // Navigate to the blueprint's detailed view
  };

  /**
   * Handles the click event on the entire blueprint card.
   * Navigates to the specific blueprint terminal page.
   */
  const handleCardClick = () => {
    router.push(`/blueprint/${id}`); // Navigate to the blueprint's detailed view
  };

  return (
    // Main container for the blueprint card. Utilizes group-hover for interactive effects.
    <div
      key={id} // Unique key for list rendering optimization
      className="blueprint-card group cursor-pointer border border-border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-primary"
      onClick={handleCardClick} // Handle click on the entire card
    >
      {/* Thumbnail Section: Displays the blueprint's image with overlay for actions. */}
      <div className="relative aspect-video bg-secondary/20 overflow-hidden"> {/* Aspect ratio container */}
        {/* Next.js Image component for optimized image loading. layout="fill" and objectFit="cover" ensure responsiveness. */}
        <Image 
          src={thumbnail} // Image source URL/path
          alt={title} // Alt text for accessibility
          layout="fill" // Fills the parent container
          objectFit="cover" // Covers the area, cropping if necessary
          className="transition-transform duration-300 group-hover:scale-105" // Scale effect on hover
        />
        {/* Overlay for 'Analyze' button, visible on hover. */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            size="sm" // Small size button
            className="bg-primary hover:bg-primary/90 text-primary-foreground" // Primary button styling
            onClick={handleAnalyzeClick} // Click handler for analyze button
          >
            <Play className="h-4 w-4 mr-2" /> {/* Play icon */}
            Analyze
          </Button>
        </div>
        {/* Status Badge: Displays the blueprint's processing status. */}
        <StatusBadge status={status} /> {/* Reusable StatusBadge component */}
      </div>

      {/* Content Section: Displays blueprint details. */}
      <div className="p-4"> {/* Padding for content within the card */}
        <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3> {/* Blueprint title, limited to 2 lines */}

        {/* Duration and Creation Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3"> {/* Flex for alignment */}
          <span>{duration}</span> {/* Display blueprint duration */}
          <span>{createdAt}</span> {/* Display blueprint creation date */}
        </div>

        {/* Clarity Score: Only displayed if the blueprint is completed. */}
        {status === 'completed' && (
          <div className="flex items-center justify-between"> {/* Flex for alignment */}
            <span className="text-sm text-muted-foreground">Clarity Score</span> {/* Label for clarity score */}
            <div className="flex items-center space-x-2"> {/* Flex for score bar and percentage */}
              <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden"> {/* Background for the progress bar */}
                <div
                  className="h-full bg-primary transition-all duration-300" // Primary color for the progress
                  style={{ width: `${clarityScore}%` }} // Dynamic width based on clarity score
                />
              </div>
              <span className="text-sm font-medium">{clarityScore}%</span> {/* Display clarity score percentage */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
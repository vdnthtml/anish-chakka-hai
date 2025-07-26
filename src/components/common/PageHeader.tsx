// src/components/common/PageHeader.tsx
// This reusable client component provides a consistent heading and optional description for pages or sections.

import React from 'react'; // Explicitly import React for JSX transform

/**
 * Props for the PageHeader component.
 * @interface PageHeaderProps
 * @property {string} title - The main title to be displayed.
 * @property {string} [description] - An optional descriptive text to accompany the title.
 */
interface PageHeaderProps {
  title: string;
  description?: string;
}

/**
 * PageHeader component.
 * Displays a prominent title and an optional descriptive paragraph.
 * Ideal for the top section of dashboards or content areas.
 * @param {PageHeaderProps} props - The component props.
 */
export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="mb-8"> {/* Margin-bottom for spacing below the header */}
      <h1 className="text-3xl font-bold tracking-tight mb-2">{title}</h1> {/* Large, bold title */}
      {/* Render description only if provided */}
      {description && <p className="text-muted-foreground">{description}</p>} {/* Muted text for description */}
    </div>
  );
} 
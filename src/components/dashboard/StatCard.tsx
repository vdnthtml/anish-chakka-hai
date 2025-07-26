// src/components/dashboard/StatCard.tsx
// This reusable client component displays a single statistic with a title, value, and an accompanying icon.
// It is designed to be flexible with customizable icon background and text colors.

import React from 'react'; // Explicitly import React for JSX transform

/**
 * Props for the StatCard component.
 * @interface StatCardProps
 * @property {string} title - The title of the statistic (e.g., "Total Users").
 * @property {string | number} value - The numerical or string value of the statistic.
 * @property {React.ReactNode} icon - A React node (e.g., Lucide icon component, text span) to be displayed as the icon.
 * @property {string} [iconBgColor='bg-primary/20'] - Optional Tailwind CSS class for the icon's background color.
 * @property {string} [iconTextColor='text-primary'] - Optional Tailwind CSS class for the icon's text color.
 */
interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  iconTextColor?: string;
}

/**
 * StatCard component.
 * Renders a card displaying a single key performance indicator (KPI).
 * @param {StatCardProps} props - The component props.
 */
export default function StatCard({
  title,
  value,
  icon,
  iconBgColor = 'bg-primary/20',
  iconTextColor = 'text-primary',
}: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6"> {/* Card container with border, background, padding, and rounded corners */}
      <div className="flex items-center justify-between"> {/* Flex container for title/value and icon */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p> {/* Statistic title */}
          <p className="text-2xl font-bold">{value}</p> {/* Statistic value */}
        </div>
        {/* Icon container with customizable background and text colors */}
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center ${iconBgColor} ${iconTextColor}`}
        >
          {icon} {/* Render the passed icon */}
        </div>
      </div>
    </div>
  );
} 